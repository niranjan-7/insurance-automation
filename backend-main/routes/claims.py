import datetime
import flask
from flask import request, make_response, jsonify
from models.claim import Claim
from models.users import Users
from models.policy import Policy
from flask import Blueprint
from app import db
from utils.constants import ROLES
from sqlalchemy import join

claim = Blueprint('claims', __name__)

@claim.route('/claim/postclaims',methods=['POST'])
def postdata():
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
        auth_token =""
    if auth_token:
        resp = Users.decode_auth_token(auth_token)

        if isinstance(resp, str):
            responseObject = {"status": "fail", "message": resp}
            return make_response(jsonify(responseObject)), 401
        
        claim_form = dict(request.form)
        claim = Claim()
        claim_form['customer_id'] = resp
        claim_form['claim_status'] = 'PENDING'
        claim_form['claim_date'] = datetime.datetime.now()
        policy = db.session.query(Policy).filter(Policy.customer_id == claim_form['customer_id'], Policy.id == claim_form['policy_id']).first()
        if(policy):
            claim_form['agent_id'] = policy.agent_id
        else:
            claim_form['agent_id'] = None


        claim_form['claim_status'] = 'PENDING'
        claim.map(claim_form)
        if(claim.claim_validate()):
            claims_count = db.session.query(Policy.claims_allowed_per_year).filter(Policy.id == claim.policy_id, Policy.customer_id == claim.customer_id).first()
            if(claims_count and claims_count[0] > 0):
                claim.save()
                responseObject = {
                    "status": "Success",
                }
                return make_response(jsonify(responseObject)), 200
            else:
                responseObject = {
                    "status": "fail",
                    "message": "Exceeding number of claims"
                }
                return make_response(jsonify(responseObject)), 404
            
        responseObject = {
                "status": "fail",
                "message": "Invalid args"
        }
        return make_response(claim_form),400
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401

@claim.route('/claim/getallclaims',methods=['GET'])
def getdata():
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
            claims = db.session.query(Claim).filter(
                Claim.customer_id == resp
            ).all()
            return make_response(jsonify([i.serialize for i in claims])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401

@claim.route('/claim/getalladminclaims',methods=['GET'])
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
                claims = db.session.query(Claim).all()
            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401

            return make_response(jsonify([i.serialize for i in claims])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401

@claim.route('/claim/approveclaim',methods=['POST'])
def getadminapprove():
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
        approve = dict(request.form)
        claim_id = approve.get('id')
        amount_settled = approve.get('amount_settled')
        status = approve.get('claim_status')
        resp = Users.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            role = db.session.query(Users.role).filter(
                Users.id == resp
            ).first()
            if(role and role[0].code == 'ROLE_ADMIN'):
                if status == 'APPROVED':
                    claim = db.session.query(Claim).filter(
                        Claim.id == claim_id,
                        Claim.claim_status == 'PENDING'
                    ).first()

                    if(claim):
                        if(claim.amount_claimed < (amount_settled and float(amount_settled))):
                            responseObject = {"status": "fail", "message": "Amount settled should not exceed amount claimed"}
                            return make_response(jsonify(responseObject)), 400 
                        else:
                            claim.amount_settled = amount_settled
                            claim.claim_status = 'APPROVED'
                       
                        policy = db.session.query(Policy).filter(
                            Policy.id == claim.policy_id
                        ).first()

                        if(policy):
                            policy.claims_allowed_per_year = policy.claims_allowed_per_year - 1
                            policy.claims_made_per_year = policy.claims_made_per_year + 1
                        else:
                            responseObject = {"status": "fail", "message": "policy not found"}
                            return make_response(jsonify(responseObject)), 401 
                        db.session.commit()
                    else:
                        responseObject = {"status": "fail", "message": "claim not found"}
                        return make_response(jsonify(responseObject)), 401 
                else:
                    claim = db.session.query(Claim).filter(
                        Claim.id == claim_id,
                        Claim.claim_status == 'PENDING'
                    ).first()
                    claim.claim_status = 'REJECTED'
                    db.session.commit()
            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401

            return make_response(jsonify(claim.serialize)), 200

        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
        
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401
