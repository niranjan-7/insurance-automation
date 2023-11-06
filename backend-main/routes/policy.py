import flask
from flask import request, make_response, jsonify
from models.claim import Claim
from models.users import Users
from models.policy import Policy
from flask import Blueprint
from app import db
from utils.constants import ROLES
from sqlalchemy import join, desc
from collections import Counter
import numpy as np

adminpolicy = Blueprint('adminpolicy', __name__)

@adminpolicy.route('/policy/getalladminpolicy',methods=['GET'])
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
                policy = db.session.query(Policy).order_by(desc(Policy.modified_at)).all()
            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401

            return make_response(jsonify([i.serialize for i in policy])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401

@adminpolicy.route('/policy/getRecommendations',methods=['GET'])
def getRecommendations():
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
            if(role and role[0].code == 'ROLE_USER'):
                policy = db.session.query(Policy).order_by(desc(Policy.modified_at)).all()
            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401
            
            count = {}
            types = []
            frequencies = []
            for i in policy:
                if (i.policy_type,i.payment_frequency_type.value,i.policy_amount,i.premium_amount) not in frequencies:
                    count[(i.policy_type,i.payment_frequency_type.value,i.policy_amount,i.premium_amount)]=1
                else:
                    count[(i.policy_type,i.payment_frequency_type.value,i.policy_amount,i.premium_amount)] = count[(i.policy_type,i.payment_frequency_type.value,i.policy_amount,i.premium_amount)]+1

            keys = list(count.keys())
            values = list(count.values())
            sorted_value_index = np.argsort(values)[::-1]
            
            sorted_dict = {keys[i]: values[i] for i in sorted_value_index}
 
            print(sorted_dict.keys())

            return make_response(jsonify([list(i) for i in sorted_dict.keys()])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 401
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401