import os

from dotenv import load_dotenv
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import NullPool

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "poolclass": NullPool,
    "connect_args": {
        "sslmode": "require",
        "prepare_threshold": None,
        "connect_timeout": 10,
    },
}

db = SQLAlchemy(app)

class folders(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))

    def __init__(self, name="New Folder"):
        self.name = name

class notes(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    text = db.Column(db.Text, nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)


    def __init__(self, name="New Note", text="", folder_id=None):
        self.name = name
        self.text = text
        self.folder_id = folder_id




@app.route("/", methods=["POST","GET", "PUT", "DELETE"])
def index():
    return render_template("index.html")