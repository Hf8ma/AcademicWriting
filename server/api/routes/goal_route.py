from flask import Blueprint, jsonify, request
from api.database.goal import Goal, goal_schema, goals_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('goal', __name__, url_prefix='/api')


@bp.route('/goal', methods=['GET'])
@permission_needed
def get_goal():
    """
    example: GET: host/api/goal?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']
    if id:

        goal = Goal.query.get(id)
        if not goal:
            return jsonify(message='Goal could not be found'), 400


        return goal_schema.jsonify(goal), 200


    all_goals = Goal.get_all(user_id=author_id)
    result = goals_schema.dump(all_goals)
    return jsonify(result.data), 200




@bp.route('/goal', methods=['POST'])
@permission_needed
def add_goal():
    """
    example: POST: host/api/goal
    """

    access_token = request.headers.get('Authorization')

    if not request.is_json:
        return jsonify(message='Request did not contain valid JSON'), 400

    goal, errors = goal_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != goal.author_id:
        return jsonify(message='No authorization'), 401

    goal.save()

    return goal_schema.jsonify(goal), 200


@bp.route('/goal', methods=['PUT'])
def goal_update():
    """
    example: PUT: host/api/goal?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')
    goal = Goal.query.get(id)


    if not goal:
        return jsonify(message='Goal was not found'), 400

    data = request.get_json()
    data.pop('id', None)
    errors = goal_schema.validate(data, partial=True)

    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != goal.author_id:
         return jsonify(message='No authorization'), 401

    goal.update(**data)

    return goal_schema.jsonify(goal), 200


@bp.route('/goal', methods=['DELETE'])
def goal_delete():
    """
    example: DELETE: host/api/goal?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    goal = Goal.query.get(id)

    if not goal:
        return jsonify(message='Goal was not found'), 400

    decoded_token = decode_token(access_token)
    print(" decoded_token .. delete" , (decoded_token))
    author_id = decoded_token['sub']

    if author_id != goal.author_id:
        return jsonify(message='No authorization'), 401

    goal.delete()

    return jsonify(message='Goal has been successfully removed'), 200
