from app import db
from models.policy import Policy
from models.customer import Customer
from .abc import BaseModel
import sqlalchemy_utils
from utils.constants import CLAIM_STATUS
import datetime


class Claim(db.Model, BaseModel):
    __tablename__ = "claims"

    id = db.Column(db.Integer, primary_key=True)

    policy_id = db.Column(db.Integer, db.ForeignKey("policies.id"), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    claim_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    claim_status = db.Column(
        sqlalchemy_utils.types.ChoiceType(CLAIM_STATUS), nullable=False
    )

    amount_claimed = db.Column(db.Float, nullable=False)
    amount_settled = db.Column(db.Float)

    # def __init__(
    #     self,
    #     policy_id: int,
    #     customer_id: int,
    #     claim_date: datetime.datetime,
    #     claim_status: str,
    #     amount_claimed: float,
    #     amount_settled: float,
    # ):
    #     self.policy_id = policy_id
    #     self.customer_id = customer_id
    #     self.claim_date = claim_date
    #     self.claim_status = claim_status
    #     self.amount_claimed = amount_claimed
    #     self.amount_settled = amount_settled

    def map(self, claim_object):
        self.policy_id = (
            int(claim_object.get("policy_id"))
            if claim_object.get("policy_id")
            else None
        )
        self.customer_id = (
            int(claim_object.get("customer_id"))
            if claim_object.get("customer_id")
            else None
        )
        self.agent_id = (
            int(claim_object.get("agent_id"))
            if claim_object.get("agent_id")
            else None
        )
        self.claim_date = claim_object.get("claim_date")
        self.claim_status = claim_object.get("claim_status")
        self.amount_claimed = float(claim_object.get("amount_claimed")) if claim_object.get("amount_claimed") else None
        self.amount_settled = float(claim_object.get("amount_settled")) if claim_object.get("amount_settled") else None
    
    def claim_validate(self):
        if not self.policy_id:
            return False
        if not self.customer_id:
            return False

        if not self.claim_date:
            return False

        if self.amount_claimed < 0:
            return False

        return True
    
    @property
    def serialize(self):
        """Return object data in easily serializable format"""
        return {
            "id": self.policy_id,
            "claim_date" : self.claim_date,
            "claim_status" : self.claim_status.code,
            "amount_claimed" : self.amount_claimed,
            "amount_settled" : self.amount_settled
        }
