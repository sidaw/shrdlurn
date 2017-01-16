import json
import csv
import sys
import time
import os
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '\x9aZ\x99\xc1\xf4\xa1\xc2#\xe4BY^A\x81\xef\x12\xa4j\xd4\xbf\xd4\x97\xf3\xad'

CORS(app)
socketio = SocketIO(app)

LOG_FOLDER = "log/"
DATA_FOLDER = "data/"
STRUCTS_FILE = DATA_FOLDER + "structs.json"


@app.route("/")
def index():
    return "Hello World!"


@socketio.on('join')
def on_join(data):
    username = data['sessionId']
    room = data['room']
    join_room(room)


@socketio.on('leave')
def on_leave(data):
    username = data['sessionId']
    room = data['room']
    leave_room(room)


@socketio.on('share')
def handle_share(message):
    # Update the structs file
    with open(STRUCTS_FILE, 'a') as f:
        message["up"] = 0
        message["down"] = 0
        json.dump(message, f)
        f.write('\n')

    # Broadcast addition to the "community" room
    emit("newshare", message, broadcast=True, room="community")


@socketio.on('log')
def handle_log(message):
    path = LOG_FOLDER + message["sessionId"] + ".json"
    with open(path, 'a') as f:
        json.dump(message, f)
        f.write('\n')


@socketio.on('connect')
def connect():
    emit('ok', {'data': 'Connected'})


def make_dir_if_necessary(dir_name):
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)


if __name__ == "__main__":
    # Create any missing directories
    make_dir_if_necessary(LOG_FOLDER)
    make_dir_if_necessary(DATA_FOLDER)

    # Run the server
    socketio.run(app, host='0.0.0.0', port=8408)
