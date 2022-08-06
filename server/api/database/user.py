from api import db, ma, bcrypt
from api.database.paper import Paper
from marshmallow import post_load, pre_load, validates, ValidationError


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    username = db.Column(db.String(32), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=False, nullable=False)
    password = db.Column(db.String(), nullable=False)
    token = db.relationship('Token', backref='access_token', cascade='all,delete', lazy=True)
    papers = db.relationship(Paper, backref='author', cascade='all,delete', lazy=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        db.session.commit()

    def __repr__(self):
        return '{}'.format(self.username)

    @staticmethod
    def get_all():
        return User.query.all()

    @staticmethod
    def username_exists(username):
        if User.query.filter_by(username=username).first():
            return True
        else:
            return False


class UserSchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    username = ma.String(required=True)
    email = ma.String(required=True)
    password = ma.String(required=True, load_only=True)

    @pre_load
    def process_input(self, data, **kwargs):
        if data.get('password'):
            password = data['password']
            data['password'] = bcrypt.generate_password_hash(password).decode('utf-8')
        return data

    @post_load
    def load_user(self, data, **kwargs):
        return User(**data)

    @validates('username')
    def validate_username(self, username):
        if User.username_exists(username):
            raise ValidationError('Benutzername existiert bereits.')


user_schema = UserSchema(many=False)
users_schema = UserSchema(many=True)
