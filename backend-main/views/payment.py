from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
from models import Users, Claim
from models import Payment, Policy
from sqlalchemy import or_
from app import db

payment_blueprint = Blueprint("payment", __name__)


class PaymentAPI(MethodView):
    def get(self):
        # get the auth token
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[1]
            except IndexError:
                responseObject = {
                    "status": "fail",
                    "message": "Bearer token malformed.",
                }
                return make_response(jsonify(responseObject)), 401
        else:
            auth_token = ""
        if auth_token:
            resp = Users.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                payments = Payment.query.filter(
                    or_(Payment.customer_id == resp, Payment.agent_id == resp)
                ).all()
                payments = [i.serialize for i in payments]
                result = []
                for p in payments:
                    user = Users.query.filter(Users.id == p["customer_id"]).first()
                    p["customer_name"] = user.username
                    if p["agent_id"]:
                        agent = Users.query.filter(Users.id == p["agent_id"]).first()
                        p["agent_name"] = agent.username
                    else:
                        p["agent_name"] = "Self"
                    policy = Policy.query.filter(Policy.id == p["policy_id"]).first()
                    p["policy_type"] = policy.policy_type
                    claims_count = (
                        db.session.query(Claim)
                        .join(Policy, p["policy_id"] == Claim.policy_id)
                        .all()
                    )
                    p["claims_count"] = len(claims_count)
                    result.append(p)
                return make_response(jsonify(result)), 200
            responseObject = {"status": "fail", "message": resp}
            return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                "status": "fail",
                "message": "Provide a valid auth token.",
            }
            return make_response(jsonify(responseObject)), 401

    def put(self):
        post_data = request.get_json()
        claim = (
            db.session.query(Payment)
            .filter(
                Payment.id == post_data.get("id"),
            )
            .first()
        )
        claim.paid = True
        db.session.commit()
        responseObject = {
            "status": "success",
            "message": "Paid",
        }
        return make_response(jsonify(responseObject)), 200


payment_view = PaymentAPI.as_view("payment_api")

payment_blueprint.add_url_rule(
    "/payment", view_func=payment_view, methods=["GET", "PUT"]
)
