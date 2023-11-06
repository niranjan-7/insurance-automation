from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView
from models import Users

agent_blueprint = Blueprint("agent", __name__)


class AgentsAPI(MethodView):
    def get(self):
        users = Users.query.filter_by(role="ROLE_AGENT").all()
        return make_response(jsonify([i.serialize for i in users])), 200


agents_view = AgentsAPI.as_view("agents_api")

agent_blueprint.add_url_rule("/agents", view_func=agents_view, methods=["GET"])
