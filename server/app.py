from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import geopy
import operator
from scipy import spatial
import geopy.distance

class Neighbourhood():
    def __init__(self,coords):
        self.coords = coords
        self.coordTree = spatial.cKDTree(coords)
        self.score = 0

# Create a KD tree for each neighbourhood
def createTrees():
    NeighbourhoodList = []
    geo = json.load(open('vaughan.json', encoding='utf-8'))
    for polygon in geo['coordinates']:
        newNeighbourhood = Neighbourhood(polygon)
        NeighbourhoodList.append(newNeighbourhood)
    return NeighbourhoodList
def getLocations(pref):
    locations = json.load(open('locations.json', encoding='utf-8'))
    locations = [[location['longitude'],location['latitude']] for location in locations['locations'] if location['category'] == pref]
    return locations
# Calculate the score for a neighbourhood based on its distance and preference ranking
def calculateScore(distance,position):
    score = (1 / distance) * (1 / (position+1))
    return score

neighbourhoods = createTrees()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
def home():
    return {'cont':200}

@app.route('/getpreferences',methods=['GET'])
def getprefs():
    preferences = json.load(open('preferences.json', encoding='utf-8'))
    return preferences

@app.route('/getrankedhouses',methods=['POST'])
def getHouses():
    requestData = request.get_json()
    chosenPrefs = requestData["preferences"]
    nhList = neighbourhoods
    for i in range(len(chosenPrefs)):
        locations = getLocations(chosenPrefs[i])
        for nh in nhList:
            queryRes = nh.coordTree.query(locations)
            closestCoords = nh.coordTree.data[queryRes[1]]
            for i in range(len(closestCoords)):   
                distance = geopy.distance.distance(locations[i],closestCoords[i])
                nh.score += calculateScore(distance,i)
    return {'neighbourhoods':nhList.sort(key=operator.attrgetter("score"), reverse=True)}
app.run()