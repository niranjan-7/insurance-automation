import flask
from flask import request, make_response, jsonify
from models.claim import Claim
from models.users import Users
from models.policy import Policy
from flask import Blueprint
from app import db
from utils.constants import ROLES
from sqlalchemy import join, desc

adminuser = Blueprint("adminuser", __name__)


@adminuser.route("/user/getalladminuser", methods=["GET"])
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
            role = db.session.query(Users.role).filter(Users.id == resp).first()
            if role and role[0].code == "ROLE_ADMIN":
                user = (
                    db.session.query(Users)
                    .filter(Users.is_deleted == False)
                    .order_by(desc(Users.modified_at))
                    .all()
                )
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


@adminuser.route("/user/deleteuser/<id>", methods=["DELETE"])
def deleteuserdata(id):
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
            role = db.session.query(Users.role).filter(Users.id == resp).first()
            if role and role[0].code == "ROLE_ADMIN":
                user = (
                    db.session.query(Users)
                    .filter(Users.is_deleted == False, Users.id == id)
                    .first()
                )

                if not user:
                    responseObject = {"status": "fail", "message": "no users found"}
                    return make_response(jsonify(responseObject)), 400

                user.is_deleted = True
                db.session.commit()

                responseObject = {"status": "success", "message": "User deleted"}
                return make_response(jsonify(responseObject)), 200

            else:
                responseObject = {"status": "fail", "message": "you are not authorized"}
                return make_response(jsonify(responseObject)), 401

            return make_response(jsonify([i.serialize for i in user])), 200
        responseObject = {"status": "fail", "message": resp}
        return make_response(jsonify(responseObject)), 400
    else:
        responseObject = {
            "status": "fail",
            "message": "Provide a valid auth token.",
        }
        return make_response(jsonify(responseObject)), 401


@adminuser.route("/user/getallcustomers", methods=["GET"])
def getallcustomers():
    users = db.session.query(Users).filter(Users.role == "ROLE_USER").all()
    return make_response(jsonify([i.serialize for i in users])), 200
