from models import Users
from app import create_app, db
from views.auth import auth_blueprint
from views.policy import policy_blueprint
from views.agent import agent_blueprint
from views.payment import payment_blueprint
from routes.claims import claim
from flask_cors import CORS
from routes.policy import adminpolicy
from routes.users import adminuser
from routes.info import stats

app = create_app()
CORS(app)

# API
app.register_blueprint(auth_blueprint)
app.register_blueprint(policy_blueprint)
app.register_blueprint(agent_blueprint)
app.register_blueprint(payment_blueprint)

app.register_blueprint(claim)
app.register_blueprint(adminpolicy)
app.register_blueprint(adminuser)
app.register_blueprint(stats)

# CLI for migrations
@app.shell_context_processor
def make_shell_context():
    return dict(app=app, db=db, User=Users)
