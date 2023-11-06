from app import db
from .abc import BaseModel
import datetime


class Payment(db.Model, BaseModel):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    policy_id = db.Column(db.Integer, db.ForeignKey("policies.id"), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    paid = db.Column(db.Boolean, nullable=False, default=False)

    payment_date = db.Column(
        db.DateTime, default=datetime.datetime.utcnow, nullable=False
    )
    payment_amount = db.Column(db.Float, nullable=False)

    def __init__(
        self,
        policy_id: int,
        customer_id: int,
        agent_id: int,
        payment_date: datetime.datetime,
        payment_amount: float,
    ):
        self.policy_id = policy_id
        self.customer_id = customer_id
        self.agent_id = agent_id
        self.payment_date = payment_date
        self.payment_amount = payment_amount

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            "id": self.id,
            "policy_id": self.policy_id,
            "payment_date": self.payment_date.strftime("%b %d, %Y"),
            "payment_amount": self.payment_amount,
            "agent_id": self.agent_id,
            "customer_id": self.customer_id,
            "paid": self.paid,
        }
