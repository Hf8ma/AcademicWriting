from flask import Blueprint, jsonify, request
from api.database.note import Note, note_schema, notes_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed


bp = Blueprint('note', __name__, url_prefix='/api')


@bp.route('/note', methods=['GET'])
@permission_needed
def get_note():
    """
    example: GET: host/api/note?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']
    if id:

        note = Note.query.get(id)
        if not note:
            return jsonify(message='Note could not be found'), 400


        return note_schema.jsonify(note), 200


    all_notes = Note.get_all(user_id=author_id)
    result = notes_schema.dump(all_notes)
    return jsonify(result.data), 200




@bp.route('/note', methods=['POST'])
@permission_needed
def add_note():
    """
    example: POST: host/api/note
    """

    access_token = request.headers.get('Authorization')

    if not request.is_json:
        return jsonify(message='Request did not contain valid JSON'), 400

    note, errors = note_schema.load(request.get_json())
    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != note.author_id:
        return jsonify(message='No authorization'), 401

    note.save()

    return note_schema.jsonify(note), 200


@bp.route('/note', methods=['PUT'])
def note_update():
    """
    example: PUT: host/api/note?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')
    note = Note.query.get(id)


    if not note:
        return jsonify(message='note was not found'), 400

    data = request.get_json()
    data.pop('id', None)
    errors = note_schema.validate(data, partial=True)

    if errors:
        return jsonify(errors), 400

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']

    if author_id != note.author_id:
         return jsonify(message='No authorization'), 401

    note.update(**data)

    return note_schema.jsonify(note), 200


@bp.route('/note', methods=['DELETE'])
def note_delete():
    """
    example: DELETE: host/api/note?id=1
    """

    id = request.args.get('id', default=None, type=int)
    access_token = request.headers.get('Authorization')

    note = Note.query.get(id)

    if not note:
        return jsonify(message='Note was not found'), 400

    decoded_token = decode_token(access_token)
    print(" decoded_token .. delete" , (decoded_token))
    author_id = decoded_token['sub']

    if author_id != note.author_id:
        return jsonify(message='No authorization'), 401

    note.delete()

    return jsonify(message='Note has been successfully removed'), 200
