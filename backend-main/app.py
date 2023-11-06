from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import get_config
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app(env=None):
    app = Flask(__name__)
    app.config.from_object(get_config(env))
    db.init_app(app)
    migrate = Migrate(app, db)
    return app
