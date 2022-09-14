from flask import Blueprint, jsonify, request
from api.database.duration import Duration, duration_schema, durations_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('duration', __name__, url_prefix='/api')


@bp.route('/duration', methods=['GET'])
@permission_needed
def get_duration():
    """
    example: GET: host/api/duration
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']


    all_durations = Duration.get_all(user_id=author_id)
    result = durations_schema.dump(all_durations)
    return jsonify(result.data), 200




@bp.route('/duration', methods=['POST'])
@permission_needed
def add_duration():
    """
    example: POST: host/api/duration
    """

    access_token = request.headers.get('Authorization')

    if not request.is_json:
        return jsonify(message='Request did not contain valid JSON'), 400

    duration, errors = duration_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    duration.save()

    return duration_schema.jsonify(duration), 200
