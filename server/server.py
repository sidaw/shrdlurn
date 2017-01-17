import json
import csv
import sys
import time
import os
import time
import random
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config['SECRET_KEY'] = '\x9aZ\x99\xc1\xf4\xa1\xc2#\xe4BY^A\x81\xef\x12\xa4j\xd4\xbf\xd4\x97\xf3\xad'

CORS(app)
socketio = SocketIO(app)

LOG_FOLDER = "log/"
DATA_FOLDER = "data/"

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
    for file in os.listdir(DATA_FOLDER):
        if file.endswith(".json"):
            with open(os.path.join(DATA_FOLDER, file), 'r') as f:
                lineNo = 0
                for line in f:
                    data = json.loads(line)
                    data["id"] = file[:-5]
                    data["idx"] = lineNo
                    data["score"] = score_struct(data)
                    structs.append(data)
                    lineNo += 1

    sorted_structs = sorted(structs, key=lambda s: s['score'], reverse=True)[:10]
    return sorted_structs


def load_utterances():
    latest_5 = []
    all_files = []

    for dirname, subdirs, files in os.walk(LOG_FOLDER):
        for fname in files:
            full_path = os.path.join(LOG_FOLDER, fname)
            mtime = os.stat(full_path).st_mtime

            struct = (mtime, fname)
            all_files.append(struct)

            if len(latest_5) < 5:
                latest_5.append(struct)
            else:
                earliest_time = latest_5[0][0]
                earliest_idx = 0
                for idx, l in enumerate(latest_5):
                    if l[0] < earliest_time:
                        earliest_time = l[0]
                        earliest_idx = idx

                if mtime > earliest_time:
                    latest_5[earliest_idx] = struct

    # Add a random one
    diff_set = list(set(all_files) - set(latest_5))
    if (len(diff_set) > 1):
        latest_5.append(random.choice(diff_set))

    utterances = []
    for (time, fname) in sorted(latest_5, key=lambda s: int(s[0]), reverse=True):
        uid = fname[:-5]
        utts = []
        count = 0
        for line in reverse_readline(os.path.join(LOG_FOLDER, fname)):
            data = json.loads(line)
            if (data["type"] == "accept" or data["type"] == "define"):
                utts.append(line)
                count += 1

            if count > 10:
                break

        utterances.append((uid, utts))

    return utterances


@socketio.on('join')
def on_join(data):
    username = data['sessionId']
    room = data['room']
    join_room(room)

    structs = load_structs()
    emit("structs", {"structs": structs})

    utterances = load_utterances()
    emit("utterances", {"utterances": utterances})


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
    with open(os.path.join(DATA_FOLDER, message["sessionId"] + ".json"), 'a') as f:
        json.dump(message, f)
        f.write('\n')

    # Broadcast addition to the "community" room
    structs = load_structs()
    emit("structs", {"structs": structs}, broadcast=True, room="community")


@socketio.on('upvote')
def upvote(data):
    lines = []
    file_path = os.path.join(DATA_FOLDER, data["id"] + ".json")
    with open(file_path, 'r') as f:
        lines = f.readlines()

    line = json.loads(lines[data["idx"]])

    uppers = set(line["up"])
    uppers.add(data["sessionId"])
    line["up"] = list(uppers)
    lines[data["idx"]] = json.dumps(line) + '\n'

    with open(file_path, 'w') as f:
        f.writelines(lines)

    message = {"idx": data["idx"], "id": data["id"], "up": line["up"]}
    emit("newupvote", message, broadcast=True, room="community")


@socketio.on('log')
def handle_log(message):
    path = LOG_FOLDER + message["sessionId"] + ".json"
    message["timestamp"] = current_unix_time()
    with open(path, 'a') as f:
        json.dump(message, f)
        f.write('\n')

    if message["type"] == "accept":
        utterances = load_utterances()
        emit("utterances", {"utterances": utterances}, broadcast=True, room="community")


@socketio.on('connect')
def connect():
    emit('ok', {'data': 'Connected'})


# http://stackoverflow.com/questions/2301789/read-a-file-in-reverse-order-using-python
def reverse_readline(filename, buf_size=8192):
    """a generator that returns the lines of a file in reverse order"""
    with open(filename) as fh:
        segment = None
        offset = 0
        fh.seek(0, os.SEEK_END)
        file_size = remaining_size = fh.tell()
        while remaining_size > 0:
            offset = min(file_size, offset + buf_size)
            fh.seek(file_size - offset)
            buffer = fh.read(min(remaining_size, buf_size))
            remaining_size -= buf_size
            lines = buffer.split('\n')
            # the first line of the buffer is probably not a complete line so
            # we'll save it and append it to the last line of the next buffer
            # we read
            if segment is not None:
                # if the previous chunk starts right from the beginning of line
                # do not concact the segment to the last line of new chunk
                # instead, yield the segment first
                if buffer[-1] is not '\n':
                    lines[-1] += segment
                else:
                    yield segment
            segment = lines[0]
            for index in range(len(lines) - 1, 0, -1):
                if len(lines[index]):
                    yield lines[index]
        # Don't yield None if the file was empty
        if segment is not None:
            yield segment


def make_dir_if_necessary(dir_name):
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)


if __name__ == "__main__":
    # Create any missing directories
    make_dir_if_necessary(LOG_FOLDER)
    make_dir_if_necessary(DATA_FOLDER)

    # Run the server
    socketio.run(app, host='0.0.0.0', port=8408)
