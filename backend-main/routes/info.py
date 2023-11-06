import flask
from flask import request, make_response, jsonify
from models.claim import Claim
from models.users import Users
from models.policy import Policy
from flask import Blueprint
from app import db
from utils.constants import ROLES
from sqlalchemy import join, desc, func
from models.agent import Agent
from models.payment import Payment

stats = Blueprint('stats', __name__)

@stats.route('/stats',methods=['GET'])
def getadmindata():
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
            role = db.session.query(Users.role).filter( 
                Users.id == resp
            ).first()
            if(role and role[0].code == 'ROLE_ADMIN'):
                active_user_count = db.session.query(func.count(Users.id)).filter(Users.is_deleted == False).scalar()
                dormant_user_count = db.session.query(func.count(Users.id)).filter(Users.is_deleted == True).scalar()
                pending_claim = db.session.query(func.count(Claim.id)).filter(Claim.claim_status == 'PENDING').scalar()
                approved_claim = db.session.query(func.count(Claim.id)).filter(Claim.claim_status == 'APPROVED').scalar()
                rejected_claim = db.session.query(func.count(Claim.id)).filter(Claim.claim_status == 'REJECTED').scalar()
                policy_count = db.session.query(func.count(Policy.id)).scalar()
                agents_count = db.session.query(func.count(Agent.id)).scalar()
                payments_count = db.session.query(func.count(Payment.id)).scalar()
                total_user_count = active_user_count - 1 if active_user_count else 0 + dormant_user_count if dormant_user_count else 0
                json_obj = {
                    'active_user_count': active_user_count - 1 if active_user_count else 0, 
                    'dormant_user_count': dormant_user_count if dormant_user_count else 0,
                    'pending_claim': pending_claim if pending_claim else 0,
                    'approved_claim': approved_claim if approved_claim else 0,
                    'rejected_claim': rejected_claim if rejected_claim else 0,
                    'policy_count': policy_count if policy_count else 0,
                    'payments_count': payments_count if payments_count else 0,
                    'total_users': total_user_count
                }
                return make_response(jsonify((json_obj))), 200

            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401

            return make_response(jsonify([i.serialize for i in user])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401