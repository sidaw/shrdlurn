import json
import csv
import sys
import time
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '\x9aZ\x99\xc1\xf4\xa1\xc2#\xe4BY^A\x81\xef\x12\xa4j\xd4\xbf\xd4\x97\xf3\xad'

CORS(app)
socketio = SocketIO(app)

STRUCTS_FILE = "/afs/cs.stanford.edu/u/samginn/shrdlurn/structs.json"

@app.route("/")
def index():
    return "Hello World!"

@app.route("/structs")
def get_structs():
	with open(STRUCTS_FILE) as f:
		return f.read()

@app.route("/structs/submit", methods=["POST"])
def submit_struct():
	content = request.get_json()
	with open(STRUCTS_FILE) as f:
		data = json.load(f)
		data["structs"].append(content)
	with open(STRUCTS_FILE, 'w') as f:
		json.dump(data, f)
	return "ok"

@socketio.on('message')
def handle_message(message):
	print('received message: ' + str(message))

@socketio.on('log')
def handle_log(message):
	with open('log/' + message["sessionId"]  + '.json' , 'a') as f:
		json.dump(message, f)
		f.write('\n')

@socketio.on('connect')
def connect():
	emit('ok', {'data':'Connected'})

if __name__ == "__main__":
	socketio.run(app, host='0.0.0.0', port=8410)
