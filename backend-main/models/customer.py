from app import db
from .abc import BaseModel


class Customer(db.Model, BaseModel):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email_address = db.Column(db.String(50), nullable=False)

    phone_number = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(50), nullable=False)

    is_approved = db.Column(db.Boolean, nullable=False)

    def __init__(
        self,
        first_name: str,
        last_name: str,
        email_address: str,
        phone_number: str,
        address: str,
        is_approved: bool,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = email_address
        self.phone_number = phone_number
        self.address = address
        self.is_approved = is_approved
