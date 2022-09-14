from api import db, ma
from marshmallow import post_load
from sqlalchemy import func

class PdfFile(db.Model):
    __tablename__ = 'files'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    author_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.Text(), nullable=False)
    created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, author_id, name):
        self.author_id = author_id
        self.name = name


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

    @staticmethod
    def get_all(user_id):
        return PdfFile.query.filter_by(author_id=user_id).all()

    def __repr__(self):
        return 'PdfFile: {}'.format(self.name)


class FileSchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    author_id = ma.Integer(required=True)
    name = ma.String(required=True)
    created = ma.DateTime(required=False, dump_only=True)

    @post_load
    def load_file(self, data, **kwargs):
        return PdfFile(**data)


file_schema = FileSchema(many=False)
files_schema = FileSchema(many=True)
