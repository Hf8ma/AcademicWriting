from api import db, ma
from marshmallow import post_load
from sqlalchemy import func
from api.database.paper import Paper
from api.database.category import Category
from sqlalchemy import extract


class Duration(db.Model):
    __tablename__ = 'durations'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    paper_id = db.Column(db.Integer(), db.ForeignKey('papers.id'), nullable=False)
    duration_time = db.Column(db.Float(), nullable=False)
    created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, paper_id, duration_time):
        self.paper_id = paper_id
        self.duration_time = duration_time


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
    def get_all(paper_id):
        return Duration.query.filter_by(paper_id=paper_id).all()
    @staticmethod
    def get_statistics(user_id, date):
        return db.session.query(
                   extract('month',Duration.created).label('name'),
                   func.sum(Duration.duration_time).label('value')
               ).join(Paper).join(Category).filter(Category.author_id==user_id).filter(extract('year', Duration.created) == date).group_by(extract('month', Duration.created)).all()

    def __repr__(self):
        return 'Duration: {}'.format(self.duration_time)


class DurationSchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    paper_id = ma.Integer(required=True)
    duration_time = ma.Float(required=True)
    created = ma.DateTime(required=False, dump_only=True)

    @post_load
    def load_duration(self, data, **kwargs):
        return Duration(**data)


duration_schema = DurationSchema(many=False)
durations_schema = DurationSchema(many=True)

class StatisticSchema(ma.Schema):
    name = ma.String(required=True)
    value = ma.Float(required=True)

statistics_schema = StatisticSchema(many=True)
