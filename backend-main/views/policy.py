from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
from models import Users, Payment, Claim, Policy
from sqlalchemy import or_
from datetime import datetime, date, timedelta
from app import db

policy_blueprint = Blueprint("policy", __name__)

POLICY_DATA = {
    "LIFE": {"premium": 5000, "policy": 5000, "claims_allowed_per_year": 5},
    "HEALTH": {"premium": 5000, "policy": 5000, "claims_allowed_per_year": 5},
    "ASSET": {"premium": 5000, "policy": 5000, "claims_allowed_per_year": 5},
    "VEHICLE": {"premium": 5000, "policy": 5000, "claims_allowed_per_year": 5},
}


class PolicyAPI(MethodView):
    def get(self):
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
                policies = Policy.query.filter(
                    or_(Policy.customer_id == resp, Policy.agent_id == resp)
                ).all()
                policies = [i.serialize for i in policies]
                result = []
                for p in policies:
                    user = Users.query.filter(Users.id == p["customer_id"]).first()
                    p["customer_name"] = user.username
                    if p["agent_id"]:
                        agent = Users.query.filter(Users.id == p["agent_id"]).first()
                        p["agent_name"] = agent.username
                    else:
                        p["agent_name"] = "Self"
                    claims_count = (
                        db.session.query(Claim)
                        .join(Policy, p["id"] == Claim.policy_id)
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

    def post(self):
        # get the post data
        post_data = request.get_json()
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
                user = Users.query.filter_by(id=resp).first()
                if user.role == "ROLE_AGENT":
                    customer_id = post_data.get("customer_id")
                    agent_id = user.id
                else:
                    customer_id = user.id
                    agent_id = None
                premium = post_data.get("premium")
                period = post_data.get("period")
                policy = Policy(
                    policy_type=post_data.get("type"),
                    premium_amount=premium,
                    policy_amount=post_data.get("policy"),
                    customer_id=customer_id,
                    agent_id=agent_id,
                    payment_frequency_type=period,
                    claims_allowed_per_year=post_data.get("claims_allowed_per_year"),
                )
                policy.save()
                if period == "QUARTERLY":
                    n = 4
                elif period == "MONTHLY":
                    n = 2
                else:
                    n = 1
                today = datetime.today()
                for i in range(n):
                    today = today + timedelta(days=365 / 4)
                    payment = Payment(
                        policy_id=policy.id,
                        customer_id=customer_id,
                        agent_id=agent_id,
                        payment_date=today,
                        payment_amount=premium,
                    )
                    payment.save()
                responseObject = {
                    "status": "success",
                    "message": "Successfully took",
                }
                return make_response(jsonify(responseObject)), 201
            responseObject = {"status": "fail", "message": resp}
            return make_response(jsonify(responseObject)), 401
        else:
            responseObject = {
                "status": "fail",
                "message": "Provide a valid auth token.",
            }
            return make_response(jsonify(responseObject)), 401


class PolicyTypes(MethodView):
    def get(self):
        responseObject = [
            {
                "key": "LIFE",
                "value": "Life",
                "quarter_premium": 10000 / 4,
                "month_premium": 10000 / 2,
                "yearly_premium": 10000,
                "claims_allowed_per_year": 5,
            },
            {
                "key": "HEALTH",
                "value": "Health",
                "quarter_premium": 20000 / 4,
                "month_premium": 20000 / 2,
                "yearly_premium": 20000,
                "claims_allowed_per_year": 4,
            },
            {
                "key": "ASSET",
                "value": "Asset",
                "quarter_premium": 5000 / 4,
                "month_premium": 5000 / 2,
                "yearly_premium": 5000,
                "claims_allowed_per_year": 3,
            },
            {
                "key": "VEHICLE",
                "value": "Vehicle",
                "quarter_premium": 15000 / 4,
                "month_premium": 15000 / 2,
                "yearly_premium": 15000,
                "claims_allowed_per_year": 6,
            },
        ]
        return make_response(jsonify(responseObject)), 200


policy_types_view = PolicyTypes.as_view("policy_types_api")
policy_view = PolicyAPI.as_view("policy_api")

policy_blueprint.add_url_rule(
    "/policy/policyTypes", view_func=policy_types_view, methods=["GET"]
)
policy_blueprint.add_url_rule("/policy", view_func=policy_view, methods=["GET", "POST"])
