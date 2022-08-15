from api import db, ma
from marshmallow import post_load
from sqlalchemy import func
from api.database.paper import Paper


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    author_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.Text(), nullable=False)
    color = db.Column(db.Text(), nullable=False)
    created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    papers = db.relationship(Paper, backref='category', cascade='all,delete', lazy=True)


    def __init__(self, author_id, name, color):
        self.author_id = author_id
        self.name = name
        self.color = color


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
        return Category.query.filter_by(author_id=user_id).all()

    def __repr__(self):
        return 'Category: {}'.format(self.name)


class CategorySchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    author_id = ma.Integer(required=True)
    name = ma.String(required=True)
    color = ma.String(required=True)
    created = ma.DateTime(required=False, dump_only=True)

    @post_load
    def load_category(self, data, **kwargs):
        return Category(**data)


category_schema = CategorySchema(many=False)
categories_schema = CategorySchema(many=True)
