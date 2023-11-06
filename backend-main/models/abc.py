from app import db
import datetime


class BaseModel:
    created_at = db.Column(
        db.DateTime, default=datetime.datetime.utcnow, nullable=False
    )
    modified_at = db.Column(
        db.DateTime, default=datetime.datetime.utcnow, nullable=False
    )

    # soft delete
    is_deleted = db.Column(db.Boolean, index=True, default=False)
    deleted_at = db.Column(db.DateTime())

    def save(self):
        db.session.add(self)
        db.session.commit()
        return self

    @staticmethod
    def rollback():
        db.session.rollback()

    @staticmethod
    def commit():
        db.session.commit()
