from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/', methods=['GET'])
def home():
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

@app.route('/getpreferences',methods=['GET'])
def getprefs():
    preferences = json.load(open('preferences.json', encoding='utf-8'))
    return preferences

app.run()