from flask import Blueprint, jsonify, request
from api.database.file import PdfFile, file_schema, files_schema
from flask_jwt_extended import decode_token
from api.routes.auth import permission_needed
from flask import current_app
import os
from werkzeug.utils import secure_filename

bp = Blueprint('file', __name__, url_prefix='/api')


@bp.route('/file', methods=['GET'])
@permission_needed
def get_file():
    """
    example: GET: host/api/file?text=text_to_be_tested
    """

    text_to_be_tested = request.args.get('text', default='', type=str)
    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)
    author_id = decoded_token['sub']



    all_files = PdfFile.get_all(user_id=author_id)
    #for each file from all files
    #get full path for the file using below
    #full path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.name)
    # read file content
    # detect plagiarism code here
    # after detecting return the result like below
    # jsonify(plagiarism = result), 200
    # result is true or false or message
    return 'done', 200




@bp.route('/file', methods=['POST'])
@permission_needed
def add_file():
    """
    example: POST: host/api/file
    """


    access_token = request.headers.get('Authorization')



    if 'file' not in request.files:
            return jsonify(message='No file part'), 400
    file = request.files['file']
    if file.filename == '':
            return jsonify(message='No selected file'), 400


    if file and allowed_file(file.filename):
                decoded_token = decode_token(access_token)
                author_id = decoded_token['sub']
                filename = secure_filename(file.filename)
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))

                file, errors = file_schema.load({'author_id':str(author_id), 'name': str(filename)})
                if errors:
                    return jsonify(errors), 400



                if author_id != file.author_id:
                    return jsonify(message='No authorization'), 401

                file.save()

                return jsonify(message='File has been uploaded successfully'), 200

    return jsonify(message='No file detected'), 400


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
