from flask import Blueprint, jsonify, request
from api.database.paper import Paper, papers_schema, paper_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('paper', __name__, url_prefix='/api')


@bp.route('/paper', methods=['GET'])
@permission_needed
def get_paper():
    """
    example: GET: host/api/paper?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if id:

        paper = Paper.query.get(id)
        if not paper:
            return jsonify(message='Paper konnte nicht gefunden werden'), 400

        if author_id != paper.author_id:
            return jsonify(message='Keine Berechtigung'), 401

        return paper_schema.jsonify(paper), 200

    all_paper = Paper.get_all(username=author_id)
    result = papers_schema.dump(all_paper)

    return jsonify(result.data), 200


@bp.route('/paper', methods=['POST'])
@permission_needed
def add_paper():
    """
    example: POST: host/api/paper
    """

    access_token = request.headers.get('Authorization')

    if not request.is_json:
        return jsonify(message='Anfrage enthielt kein gültiges JSON'), 400

    paper, errors = paper_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != paper.author_id:
        return jsonify(message='Keine Berechtigung'), 401

    paper.save()

    return jsonify(message='Paper wurde erfolgreich erstellt.'), 200


@bp.route('/paper', methods=['PUT'])
def user_update():
    """
    example: PUT: host/api/paper?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    paper = Paper.query.get(id)

    if not paper:
        return jsonify(message='Paper wurde nicht gefunden'), 400

    data = request.get_json()
    data.pop('id', None)

    errors = paper_schema.validate(data, partial=True)

    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['identity']

    if author_id != paper.author_id:
        return jsonify(message='Keine Berechtigung'), 401

    paper.update(**data)

    return jsonify(message='Paper wurde erfolgreich aktualisiert'), 200


@bp.route('/paper', methods=['DELETE'])
def user_delete():
    """
    example: DELETE: host/api/paper?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    paper = Paper.query.get(id)

    if not paper:
        return jsonify(message='Paper wurde nicht gefunden'), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['identity']

    if author_id != paper.author_id:
        return jsonify(message='Keine Berechtigung'), 401

    paper.delete()

    return jsonify(message='Paper wurde erfolgreich entfernt'), 200
