from app import db
from .abc import BaseModel


class Agent(db.Model, BaseModel):
    __tablename__ = "agents"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    email_address = db.Column(db.String(256))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.String(256))

    def __init__(
        self,
        first_name: str,
        last_name: str,
        email_address: str,
        phone_number: str,
        address: str,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = email_address
        self.phone_number = phone_number
        self.address = address
