import json
import csv
import sys
import time
import os
import time
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = '\x9aZ\x99\xc1\xf4\xa1\xc2#\xe4BY^A\x81\xef\x12\xa4j\xd4\xbf\xd4\x97\xf3\xad'

CORS(app)
socketio = SocketIO(app)

LOG_FOLDER = "log/"
DATA_FOLDER = "data/"
STRUCTS_FILE = DATA_FOLDER + "structs.json"

GRAVITY = 1.4  # higher the gravity, the faster old structs lose score
TIME_INTERVAL = 1800.0  # break off by every 30 minutes


@app.route("/")
def index():
    return "Hello World!"


def score_struct(data):
    time_ago = (current_unix_time() / TIME_INTERVAL) - (data["timestamp"] / TIME_INTERVAL)
    return (len(data["up"]) + 1) / ((time_ago + 2) ** GRAVITY)


def current_unix_time():
    return int(time.time())


def load_structs():
    # Load the structs
    structs = []
    if os.path.isfile(STRUCTS_FILE):
        lineNo = 0
        with open(STRUCTS_FILE, 'r') as f:
            for line in f:
                data = json.loads(line)
                data["id"] = lineNo
                data["score"] = score_struct(data)
                structs.append(data)
                lineNo += 1

    sorted_structs = sorted(structs, key=lambda s: s['score'], reverse=True)[:10]
    return sorted_structs


@socketio.on('join')
def on_join(data):
    username = data['sessionId']
    room = data['room']
    join_room(room)

    structs = load_structs()
    emit("structs", {"structs": structs})


@socketio.on('leave')
def on_leave(data):
    username = data['sessionId']
    room = data['room']
    leave_room(room)


@socketio.on('share')
def handle_share(message):
    message["up"] = []
    message["timestamp"] = current_unix_time()
    # Update the structs file
    with open(STRUCTS_FILE, 'a') as f:
        json.dump(message, f)
        f.write('\n')

    # Broadcast addition to the "community" room
    structs = load_structs()
    emit("structs", {"structs": structs}, broadcast=True, room="community")


@socketio.on('upvote')
def upvote(data):
    lines = []
    with open(STRUCTS_FILE, 'r') as f:
        lines = f.readlines()

    line = json.loads(lines[data["id"]])

    if line["sessionId"] == data["sessionId"]:
        return

    uppers = set(line["up"])
    uppers.add(data["sessionId"])
    line["up"] = list(uppers)
    lines[data["id"]] = json.dumps(line) + '\n'

    with open(STRUCTS_FILE, 'w') as f:
        f.writelines(lines)

    message = {"id": data["id"], "up": line["up"]}
    emit("newupvote", message, broadcast=True, room="community")


@socketio.on('log')
def handle_log(message):
    path = LOG_FOLDER + message["sessionId"] + ".json"
    message["timestamp"] = current_unix_time()
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
