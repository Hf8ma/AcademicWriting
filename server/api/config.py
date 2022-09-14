import os


class BaseConfig:
    DEBUG = False
    TESTING = False
    HOST = '0.0.0.0'
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = './api/files'
    ALLOWED_EXTENSIONS = {'pdf'}


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    DEVELOPMENT = True


class TestingConfig(BaseConfig):
    TESTING = True


class ProductionConfig(BaseConfig):
    pass
