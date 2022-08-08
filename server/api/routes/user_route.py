from flask import Blueprint, jsonify, request
from api.database.user import User, user_schema, users_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed
from flask_cors import cross_origin


bp = Blueprint('user', __name__)




@bp.route('/api/user', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user():
    """
    example: GET: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    print('get')
    all = request.args.get('all', default=False, type=bool)

    if all:
        all_user = User.get_all()
        result = users_schema.dump(all_user)
        response = jsonify(result.data)
          
        return response,200

    if not all:

        user = User.query.filter_by(username=username).first()
        if not user: 
            response = jsonify(message='User wurde nicht gefunden, get')
               
            return response, 400

        response = user_schema.jsonify(user)
          
        return response , 200


@bp.route('/api/user', methods=['POST'])
@cross_origin(supports_credentials=True)
def register_user():
    """
    example: POST: host/api/user
    """

    if not request.is_json:
        response = jsonify(message='Anfrage enthielt kein gültiges JSON')
          
        return response, 400

    user, errors = user_schema.load(request.get_json())
    if errors: 
        response = jsonify(errors)
          
        return response, 400

    user.save()
    response = jsonify(message='Account wurde erfolgreich angelegt')
 
    return response, 200


@bp.route('/api/user', methods=['PUT'])
@cross_origin(supports_credentials=True)
@permission_needed
def user_update():
    """
    example: PUT: host/api/user?username=test
    """

    username = request.args.get('username', default='', type=str)
    access_token = request.headers.get('Authorization')

    user = User.query.filter_by(username=username).first()

    if not user: 
        response = jsonify('User wurde nicht gefunden,put')
          
        return response, 400

    data = request.get_json()
    data.pop('id', None)
    data.pop('username', None)

    errors = user_schema.validate(data, partial=True)

    if errors: 
        response = jsonify(errors)
          
        return response, 400

    decoded_token = decode_token(access_token)

    author_id = decoded_token['sub']

    if author_id != user.username: 
        response = jsonify(message='Keine Berechtigung')
          
        return response, 401

    user.update(**data)

    response = jsonify('Account wurde erfolgreich aktualisiert')
 
    return response, 200


@bp.route('/api/user', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def user_delete():
    """
    example: DELETE: host/api/user?username=test
    """

    access_token = request.headers.get('Authorization')
    username = request.args.get('username', default='', type=str)

    user = User.query.filter_by(username=username).first()

    if not user: 
        response = jsonify(message='User wurde nicht gefunden,delete')
          
        return response, 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != user.username: 
        response = jsonify(message='Keine Berechtigung')
          
        return response, 401

    user.delete()

    response = jsonify(message='User wurde erfolgreicht entfernt')
 
    return response, 200



# @bp.after_request
# def add_cors_headers(response):
#     #r = request.referrer[:-1]
#     #if r in white:
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     response.headers.add('Access-Control-Allow-Credentials', 'true')
#     response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
#     response.headers.add('Access-Control-Allow-Headers', 'Cache-Control')
#     response.headers.add('Access-Control-Allow-Headers', 'X-Requested-With')
#     response.headers.add('Access-Control-Allow-Headers', 'Authorization')
#     response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
#     print("after_request done.m.m.m.m.")
#     return response
