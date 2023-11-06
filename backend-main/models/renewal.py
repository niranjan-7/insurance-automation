from app import db
from .abc import BaseModel
import datetime


class Renewal(db.Model, BaseModel):
    __tablename__ = "renewals"

    id = db.Column(db.Integer, primary_key=True)
    policy_id = db.Column(db.Integer, db.ForeignKey("policies.id"), nullable=False)

    renewal_date = db.Column(
        db.DateTime, default=datetime.datetime.utcnow, nullable=False
    )
    premium_amount = db.Column(db.Float, nullable=False)
    is_claim_discount = db.Column(db.Boolean, nullable=False)

    def __init__(
        self,
        policy_id: int,
        renewal_date: str,
        payment_amount: float,
        is_claim_discount: bool,
    ):
        self.policy_id = policy_id
        self.renewal_date = renewal_date
        self.premium_amount = premium_amount
        self.is_claim_discount = is_claim_discount
