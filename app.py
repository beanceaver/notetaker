# init
import os

from dotenv import load_dotenv
from flask import Flask, render_template, request
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




# models
class folders(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __init__(self, name="Folder"):
        self.name = name

class notes(db.Model):
    _id = db.Column("id", db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    text = db.Column(db.Text, nullable=False)
    folder_id = db.Column(db.Integer, db.ForeignKey("folders.id"), nullable=True)


    def __init__(self, name="Note", text="", folder_id=None):
        self.name = name
        self.text = text
        self.folder_id = folder_id




# routes
@app.route("/", methods=["POST","GET", "PUT", "DELETE"])
def index():
    return render_template("index.html")

@app.post("/folders")
def create_folder():
        folder = folders()
        db.session.add(folder)
        db.session.commit()
        return ({"id": folder._id, "name": folder.name}, 201)

@app.post("/notes")
def create_note():
    data = request.get_json()

    if not isinstance(data, dict):
        return {"error": "Expected a JSON object."}, 400

    folder_id = data.get("folder_id")

    if folder_id is not None:
        if type(folder_id) is not int:
            return {"error": "Folder ID must be an integer."}, 400

        if db.session.get(folders, folder_id) is None:
            return {"error": "Folder does not exist."}, 404

    note = notes(folder_id=folder_id)

    db.session.add(note)
    db.session.commit()

    return {
        "id": note._id,
        "name": note.name,
        "text": note.text,
        "folder_id": note.folder_id,
    }, 201

@app.patch("/notes/<int:note_id>")
def move_note(note_id):
    note = db.session.get(notes, note_id)

    if note is None:
        return {"error": "Note does not exist."}, 404

    data = request.get_json()

    if not isinstance(data, dict) or "folder_id" not in data:
        return {"error": "A folder_id is required."}, 400

    folder_id = data["folder_id"]

    if folder_id is not None:
        if type(folder_id) is not int:
            return {"error": "Folder ID must be an integer."}, 400

        if db.session.get(folders, folder_id) is None:
            return {"error": "Folder does not exist."}, 404

    note.folder_id = folder_id
    db.session.commit()

    return {"id": note._id, "folder_id": note.folder_id}