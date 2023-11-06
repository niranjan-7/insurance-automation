from app import db
from .abc import BaseModel

import datetime
import sqlalchemy_utils
from utils.constants import PAYMENT_FREQUENCY
from utils.constants import CURRENCY_TYPE


class Policy(db.Model, BaseModel):
    __tablename__ = "policies"

    id = db.Column(db.Integer, primary_key=True)
    policy_type = db.Column(db.String(50), nullable=False)
    premium_amount = db.Column(db.Float, nullable=False)
    policy_amount = db.Column(db.Float, nullable=False)

    policy_start_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    policy_end_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    payment_frequency_type = db.Column(
        sqlalchemy_utils.types.ChoiceType(PAYMENT_FREQUENCY), nullable=False
    )
    discount_amount = db.Column(db.Float, nullable=False, default=0)
    claims_allowed_per_year = db.Column(db.Integer, nullable=False)

    currency_type = db.Column(
        sqlalchemy_utils.types.ChoiceType(CURRENCY_TYPE),
        nullable=False,
        default="INR_RUPEES",
    )
    claims_made_per_year = db.Column(db.Integer, nullable=False, default=0)

    def __init__(
        self,
        policy_type: str,
        premium_amount: float,
        policy_amount: float,
        customer_id: int,
        agent_id: int,
        payment_frequency_type: str,
        claims_allowed_per_year: int,
    ):
        self.policy_type = policy_type
        self.premium_amount = premium_amount
        self.policy_amount = policy_amount
        self.customer_id = customer_id
        self.agent_id = agent_id
        self.payment_frequency_type = payment_frequency_type
        self.claims_allowed_per_year = claims_allowed_per_year

    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "agent_id": self.agent_id,
            "policy_type": self.policy_type,
            "premium_amount": self.premium_amount,
            "policy_amount": self.policy_amount,
            "policy_start_date": self.policy_start_date.strftime("%b %d, %Y"),
            "policy_end_date": self.policy_end_date.strftime("%b %d, %Y"),
            "payment_frequency_type": self.payment_frequency_type.value,
        }
