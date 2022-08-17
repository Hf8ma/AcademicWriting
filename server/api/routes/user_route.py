from flask import Blueprint, jsonify, request
from api.database.user import User, user_schema, users_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed
from flask_cors import CORS, cross_origin

bp = Blueprint('user', __name__, url_prefix='/api')


@bp.route('/user', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user():
    """
    example: GET: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    all = request.args.get('all', default=False, type=bool)

    if all:
        all_user = User.get_all()
        result = users_schema.dump(all_user)
        response = jsonify(result.data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response,200

    if not all:

        user = User.query.filter_by(username=username).first()
        if not user: 
            response = jsonify(message='User wurde nicht gefunden')
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response, 400

        response = user_schema.jsonify(user)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response , 200


@bp.route('/user', methods=['POST'])
# @cross_origin(supports_credentials=True)
def register_user():
    """
    example: POST: host/api/user
    """

    if not request.is_json:
        response = jsonify(message='Anfrage enthielt kein gültiges JSON')
        return response, 400

    user, errors = user_schema.load(request.get_json())
    print(errors)
    if errors: 
        response = jsonify(errors)
        return response, 400

    user.save()
    response = jsonify(message='Account wurde erfolgreich angelegt')
    return response, 200


@bp.route('/user', methods=['PUT'])
@permission_needed
@cross_origin(supports_credentials=True)
def user_update():
    """
    example: PUT: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    access_token = request.headers.get('Authorization')

    user = User.query.filter_by(username=username).first()

    if not user: 
        response = jsonify('User wurde nicht gefunden')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    data = request.get_json()
    data.pop('id', None)
    data.pop('username', None)

    errors = user_schema.validate(data, partial=True)

    if errors: 
        response = jsonify(errors)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    decoded_token = decode_token(access_token)

    author_id = decoded_token['sub']

    if author_id != user.id: 
        response = jsonify(message='Keine Berechtigung')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 401

    user.update(**data)

    response = jsonify('Account wurde erfolgreich aktualisiert')
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response, 200


@bp.route('/user', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def user_delete():
    """
    example: DELETE: host/api/user?user_id=username
    """

    access_token = request.headers.get('Authorization')
    user_id = request.args.get('user_id', default='', type=str)
    user = User.query.filter_by(id =user_id).first()
    print(user.id)
    if not user: 
        response = jsonify(message='User wurde nicht gefunden')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != user.id: 
        response = jsonify(message='Keine Berechtigung')
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 401

    user.delete()

    response = jsonify(message='User wurde erfolgreicht entfernt')
    return response, 200
