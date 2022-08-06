from flask import Blueprint, jsonify, request
from api.database.user import User, user_schema, users_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('user', __name__, url_prefix='/api')


@bp.route('/user', methods=['GET'])
def get_user():
    """
    example: GET: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    all = request.args.get('all', default=False, type=bool)

    if all:
        all_user = User.get_all()
        result = users_schema.dump(all_user)

        return jsonify(result.data), 200

    if not all:

        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify(message='User wurde nicht gefunden'), 400

        return user_schema.jsonify(user), 200


@bp.route('/user', methods=['POST'])
def register_user():
    """
    example: POST: host/api/user
    """

    if not request.is_json:
        return jsonify(message='Anfrage enthielt kein gültiges JSON'), 400

    user, errors = user_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    user.save()

    return jsonify(message='Account wurde erfolgreich angelegt'), 200


@bp.route('/user', methods=['PUT'])
@permission_needed
def user_update():
    """
    example: PUT: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    access_token = request.headers.get('Authorization')

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify('User wurde nicht gefunden'), 400

    data = request.get_json()
    data.pop('id', None)
    data.pop('username', None)

    errors = user_schema.validate(data, partial=True)

    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)

    author_id = decoded_token['sub']

    if author_id != user.username:
        return jsonify(message='Keine Berechtigung'), 401

    user.update(**data)

    return jsonify('Account wurde erfolgreich aktualisiert'), 200


@bp.route('/user', methods=['DELETE'])
def user_delete():
    """
    example: DELETE: host/api/user?username=test
    """

    access_token = request.headers.get('Authorization')
    username = request.args.get('username', default='', type=str)

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify(message='User wurde nicht gefunden'), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != user.username:
        return jsonify(message='Keine Berechtigung'), 401

    user.delete()

    return jsonify(message='User wurde erfolgreicht entfernt'), 200
