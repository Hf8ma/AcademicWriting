from flask import Blueprint, jsonify, request
from api.database.user import User
from api.database.token import Token
from flask_jwt_extended import create_access_token, decode_token
from api import bcrypt, db
from functools import wraps
from datetime import timedelta


bp = Blueprint('auth_api', __name__, url_prefix='/api/auth')


def permission_needed(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        try:
            access_token = request.headers.get('Authorization')

            if not access_token:
                return jsonify(message='access_token fehlt'), 401

            decoded_token = decode_token(access_token)

            username = decoded_token['sub']

            user = User.query.filter_by(username=username).first()

            token = Token.query.filter_by(token=access_token,
                                          username=user.username).first()

            if not user:
                return jsonify(message='User wurde nicht gefunden'), 400

            if not token:
                return jsonify(message='Token ist nicht gültig'), 401

        except Exception as e:
            print(e)
            return jsonify(message='Der Server konnte die Anfrage nicht verarbeiten'), 401
        return function(*args, **kwargs)
    return wrapper


@bp.route('/login', methods=['POST'])
def login():
    """
    example: POST: host/api/auth/login
    """

    if not request.is_json:
        return jsonify(message='Die Anfrage enthielt kein gültiges JSON'), 400

    username = request.json.get('username')
    password = request.json.get('password')

    if not username:
        return jsonify(message='Username fehlt'), 400

    if not password:
        return jsonify(message='Passwort fehlt'), 400

    user = User.query.filter_by(username=username).first()

    try:
        if bcrypt.check_password_hash(user.password, password):
            expires = timedelta(days=30)
            access_token = create_access_token(identity=username,
                                               expires_delta=expires)
            Token(access_token, user.username).save()
            return jsonify(access_token=access_token), 200
        else:
            return jsonify(message='Etwas ist schief gelaufen'), 400
    except Exception as e:
        print(e)
        return jsonify(message='Der Server konnte die Anfrage nicht verarbeiten'), 500


@bp.route('/logout', methods=['POST'])
@permission_needed
def logout():
    """
    example: POST: host/api/auth/logout
    """

    access_token = request.headers.get('Authorization')

    decoded_token = decode_token(access_token)

    username = decoded_token['sub']

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify(message='User wurde nicht gefunden'), 400

    token = Token.query.get(access_token)

    if token.username != user.username:
        return jsonify(message='Token oder User nicht korrekt'), 400

    token.delete()

    db.session.commit()

    return jsonify(message='User wurde erfolgreich ausgeloggt'), 200
