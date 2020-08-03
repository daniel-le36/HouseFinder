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

# Get the locations for the specified category
def getLocations(pref):
    locations = json.load(open('locations.json', encoding='utf-8'))
    locations = [[location['longitude'],location['latitude']] for location in locations['locations'] if location['category'] == pref]
    return locations

# Calculate the score for a neighbourhood based on its distance and preference ranking
def calculateScore(distance,position):
    score = (1 / distance) * (1 / (position+1))
    return score

# Create a geojson for the neighbourhoods
def createGeoJson(coordList):
    geojson = {'type':'FeatureCollection','features':[]}
    for coord in coordList:
        newFeature = {'type':'Feature','geometry':{'type':'Polygon','coordinates':[coord['coords']]}}
        geojson['features'].append(newFeature)
    return geojson
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
        # Get the coordinates of the locations for the given preference
        locations = getLocations(chosenPrefs[i])
        for nh in nhList:
            # Query the KD-Tree for this neighbourhood with the locations
            queryRes = nh.coordTree.query(locations)
            closestCoords = nh.coordTree.data[queryRes[1]]
            # For each location, get the distance from the neighbourhood to that location
            for i in range(len(closestCoords)):   
                distance = geopy.distance.distance(locations[i],closestCoords[i]).km
                # Calculate the score and add to the neighbourhood
                nh.score += calculateScore(distance,i)
    sortedNhList = [{'coords':nh.coords,'score':nh.score} for nh in nhList]
    sortedNhList.sort(key=operator.itemgetter("score"), reverse=True)
    return {'neighbourhoods':createGeoJson(sortedNhList[:10])}
app.run()