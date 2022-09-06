from api import db, ma
from marshmallow import post_load
from sqlalchemy import func

class Deadline(db.Model):
    __tablename__ = 'deadlines'

    id = db.Column(db.Integer(), primary_key=True, nullable=False)
    author_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text(), nullable=False)
    submission_date = db.Column(db.DateTime(timezone=True), nullable=False)
    created = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __init__(self, author_id, content, submission_date):
        self.author_id = author_id
        self.content = content
        self.submission_date = submission_date


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
        return Deadline.query.filter_by(author_id=user_id).all()

    @staticmethod
    def get_by_date():
        import datetime
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        week = (datetime.datetime.now() + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        return Deadline.query.filter(Deadline.submission_date>=today).filter(Deadline.submission_date<=week).all()

    def __repr__(self):
        return 'Deadline: {}'.format(self.content)


class DeadlineSchema(ma.Schema):
    id = ma.Integer(required=False, dump_only=True)
    author_id = ma.Integer(required=True)
    content = ma.String(required=True)
    submission_date = ma.DateTime(required=True)
    created = ma.DateTime(required=False, dump_only=True)

    @post_load
    def load_deadline(self, data, **kwargs):
        return Deadline(**data)


deadline_schema = DeadlineSchema(many=False)
deadlines_schema = DeadlineSchema(many=True)
