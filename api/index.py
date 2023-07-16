from flask import Flask, render_template
from flask_socketio import SocketIO

# Socketio initialization, default settings
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
socketio = SocketIO(app)

# Initialize song data
songs = [
    {'id': 1, 'title': 'nyc in 1940', 'votes': 0},
    {'id': 2, 'title': 'Heat Waves', 'votes': 0},
    {'id': 3, 'title': 'WAIT FOR U', 'votes': 0},
    {'id': 4, 'title': 'Malamente', 'votes': 0}
]

# Events triggered when a client connects to the server
@socketio.on('connect')
def handle_connect():
    emit_songs()

# Triggered when a 'vote' event is received
@socketio.on('vote')
def handle_vote(song_id):
    for song in songs:
        if song['id'] == song_id:
            song['votes'] += 1
    emit_songs()

# Triggered when the 'cancel_vote' event is received
@socketio.on('cancel_vote')
def handle_cancel_vote(song_id):
    for song in songs:
        if song['id'] == song_id:
            song['votes'] -= 1
    emit_songs()

# Send 'update_songs' event to all browers
def emit_songs():
    sorted_songs = sorted(songs, key=lambda x: x['votes'], reverse=True)
    socketio.emit('update_songs', sorted_songs)

# Render the html file and return to client
@app.route('/')
def index():
    return render_template('index.html')

# Default setting to run the app
if __name__ == '__main__':
    socketio.run(app, debug = True)