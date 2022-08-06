from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_bcrypt import Bcrypt
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
import os


db = SQLAlchemy()
ma = Marshmallow()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app(config_filename=None, static_folder=None, static_url_path=None):

    app = Flask(__name__,
                static_folder=static_folder,
                static_url_path=static_url_path)

    if not config_filename:
        config_filename = os.environ['APP_SETTINGS']

    app.config.from_object(config_filename)

    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from .routes import auth
    app.register_blueprint(auth.bp)

    from .routes import user_route
    app.register_blueprint(user_route.bp)

    from .routes import paper_route
    app.register_blueprint(paper_route.bp)

    from .routes import convert_route
    app.register_blueprint(convert_route.bp)

    @app.route('/')
    def index():
        return app.send_static_file('index.html'), 200

    return app


def create_manager():

    app = create_app()

    Migrate(app, db)

    manager = Manager(app)

    manager.add_command('db', MigrateCommand)

    from .database import paper, user

    return manager
