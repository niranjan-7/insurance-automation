from app import db
from .abc import BaseModel
import datetime


class Penality(db.Model, BaseModel):
    __tablename__ = "penalities"

    id = db.Column(db.Integer, primary_key=True)
    policy_id = db.Column(db.Integer, db.ForeignKey("policies.id"), nullable=False)

    penality_amount = db.Column(db.Float, nullable=False)
    penality_date = db.Column(
        db.DateTime, default=datetime.datetime.utcnow, nullable=False
    )

    def __init__(
        self,
        policy_id: int,
        customer_id: int,
        penality_date: datetime.datetime,
        penality_amount: float,
    ):
        self.policy_id = policy_id
        self.penality_date = penality_date
        self.penality_amount = penality_amount
