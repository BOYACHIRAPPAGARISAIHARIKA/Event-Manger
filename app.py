from flask import Flask, jsonify, request, render_template
import json
import os

app = Flask(__name__)

# Path to the data file
DATA_FILE = 'data.json'

# Load events from the JSON file
def load_events():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    return []

# Save events to the JSON file
def save_events(events):
    with open(DATA_FILE, 'w') as file:
        json.dump(events, file)

@app.route('/')
def index():
    return render_template('index.html')  # Serve the HTML file

@app.route('/api/events', methods=['GET', 'POST'])
def events():
    if request.method == 'GET':
        return jsonify(load_events())
    
    if request.method == 'POST':
        new_event = request.json
        events = load_events()
        events.append(new_event)
        save_events(events)
        return jsonify(new_event), 201

@app.route('/api/events/<int:event_id>', methods=['PUT', 'DELETE'])
def event(event_id):
    events = load_events()
    
    if request.method == 'PUT':
        updated_event = request.json
        for i, event in enumerate(events):
            if event['id'] == event_id:
                events[i] = updated_event
                save_events(events)
                return jsonify(updated_event)
        return jsonify({'error': 'Event not found'}), 404

    if request.method == 'DELETE':
        events = [event for event in events if event['id'] != event_id]
        save_events(events)
        return jsonify({'message': 'Event deleted'}), 204

if __name__ == '__main__':
    app.run(debug=True)
