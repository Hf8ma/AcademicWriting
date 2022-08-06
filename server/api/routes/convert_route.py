from flask import Blueprint, request, send_file
import pypandoc
import os

bp = Blueprint('convert', __name__, url_prefix='/api')


@bp.route('/convert', methods=['POST'])
def convert():

    file = request.files['file']

    file.save(os.path.join(os.getcwd(), file.filename))

    output_file = file.filename.split('.')[0]
    output_file = output_file + '.pdf'

    pypandoc.convert_file(file.filename,
                          to='pdf',
                          format='md',
                          outputfile=os.path.join(os.getcwd(), output_file))

    return send_file(os.path.join(os.getcwd(), output_file),
                     as_attachment=True), 200
