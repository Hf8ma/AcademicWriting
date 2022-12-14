from api import db, ma
from marshmallow import post_load
from sqlalchemy import func

class Paper(db.Model):
    __tablename__ = 'papers'
    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    category_id = db.Column(db.Integer(), db.ForeignKey('categories.id'), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text(), nullable=True)
    last_modified = db.Column(db.DateTime(timezone=True), nullable=False)
    created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)


    def __init__(self, category_id, title, content, last_modified):
        self.category_id = category_id
        self.content = content
        self.title = title
        self.last_modified = last_modified

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
    def get_all(category_id):
        return Paper.query.filter_by(category_id=category_id).all()

    def __repr__(self):
        return 'Paper: {}'.format(self.title)


class PaperSchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    category_id = ma.Integer(required=True)
    title = ma.String(required=True)
    content = ma.String(required=True)
    last_modified = ma.String(required=True)
    created = ma.DateTime(required=False, dump_only=True)

    @post_load
    def load_paper(self, data, **kwargs):
        return Paper(**data)


paper_schema = PaperSchema(many=False)
papers_schema = PaperSchema(many=True)
