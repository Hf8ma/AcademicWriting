from flask import Blueprint, jsonify, request
from api.database.category import Category, category_schema, categories_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('category', __name__, url_prefix='/api')


@bp.route('/category', methods=['GET'])
@permission_needed
def get_category():
    """
    example: GET: host/api/category?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']
    if id:

        category = Category.query.get(id)
        if not category:
            return jsonify(message='Category could not be found'), 400


        return category_schema.jsonify(category), 200


    all_category = Category.get_all(user_id=author_id)
    result = categories_schema.dump(all_category)
    return jsonify(result.data), 200




@bp.route('/category', methods=['POST'])
@permission_needed
def add_category():
    """
    example: POST: host/api/category
    """

    access_token = request.headers.get('Authorization')

    if not request.is_json:
        return jsonify(message='Request did not contain valid JSON'), 400

    category, errors = category_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != category.author_id:
        return jsonify(message='No authorization'), 401

    category.save()

    return jsonify(message='Category was created successfully.'), 200


@bp.route('/category', methods=['PUT'])
def category_update():
    """
    example: PUT: host/api/category?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')
    category = Category.query.get(id)


    if not category:
        return jsonify(message='category was not found'), 400

    data = request.get_json()
    data.pop('id', None)
    errors = category_schema.validate(data, partial=True)

    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != category.author_id:
         return jsonify(message='No authorization'), 401

    category.update(**data)

    return jsonify(message='category was successfully updated'), 200


@bp.route('/category', methods=['DELETE'])
def category_delete():
    """
    example: DELETE: host/api/category?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    category = Category.query.get(id)

    if not category:
        return jsonify(message='Category was not found'), 400

    decoded_token = decode_token(access_token)
    print(" decoded_token .. delete" , (decoded_token))
    author_id = decoded_token['sub']

    if author_id != category.author_id:
        return jsonify(message='No authorization'), 401

    category.delete()

    return jsonify(message='Category has been successfully removed'), 200
