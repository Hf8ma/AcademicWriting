from flask import Blueprint, jsonify, request
from api.database.duration import Duration, duration_schema, durations_schema, statistics_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed
from sqlalchemy import extract
import calendar

bp = Blueprint('duration', __name__, url_prefix='/api')


@bp.route('/duration', methods=['GET'])
@permission_needed
def get_statistics():
    """
    example: GET: host/api/statistics?date=2022
    """

    date = request.args.get('date', default=None, type=int)
    print(date)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']


    all_durations = Duration.get_statistics(user_id=author_id, date= date)
    all_months = []
    for month in range(1, 13):
        index = [i for i, v in enumerate(all_durations) if v[0] == month]
        if(len(index)):
           all_months.append({'name': calendar.month_name[month], 'value': all_durations[index[0]][1]})
        else:
           all_months.append({'name': calendar.month_name[month], 'value': 0})


    result = statistics_schema.dump(all_months)
    return jsonify(result.data), 200


#     all_durations = Duration.filter_by_user(user_id=author_id).all()
#     result = durations_schema.dump(all_durations)
#     return jsonify(result.data), 200





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
