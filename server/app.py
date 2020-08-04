from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import geopy
import operator
from scipy import spatial
import geopy.distance
import sqlite3

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
        newFeature = {'type':'Feature','geometry':{'type':'Polygon','coordinates':[coord]}}
        geojson['features'].append(newFeature)
    return geojson
#neighbourhoods = createTrees()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['GET'])
def home():
    return {'cont':200}

@app.route('/getpreferences',methods=['GET'])
def getprefs():
    conn = sqlite3.connect('GeoData.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM Categories')
    categories = c.fetchall()
    conn.close()
    
    categoryList = []
    for category in categories:
        newCat = {'id':category['CategoryId'],'factor':category['Name']} 
        categoryList.append(newCat)
    return {'preferences':categoryList}

@app.route('/getrankedhouses',methods=['POST'])
def getHouses():
    requestData = request.get_json()
    chosenPrefs = requestData["preferences"]
    
    # Connect to database
    conn = sqlite3.connect('GeoData.db')
    c = conn.cursor()
    # Get the total distances from each neighbourhood to nearby locations of each category
    c.execute("SELECT NhId,CategoryId,SUM(Distance) FROM Distances JOIN (SELECT LocationId, CategoryId FROM Locations WHERE CategoryId IN (%s)) AS chosencategories ON chosencategories.LocationId = Distances.LocationId GROUP BY NhId,CategoryId" % ','.join('?' for i in chosenPrefs),chosenPrefs)
    nhs = c.fetchall()
    groups = {}
    
    # Get the ranks for each category of location
    prefRanks ={}
    for i in range(len(chosenPrefs)):
        prefRanks[chosenPrefs[i]] = i+1
        
    # For each neighbourhood calculate its score
    for nh in nhs:
        score = (1 / nh[2]) * (1 / prefRanks[nh[1]])
        if nh[0] in groups:
            groups[nh[0]] += score
        else:
            groups[nh[0]] = score
            
    # Get the top 10 neighbourhoods by score
    sortDicted = sorted(groups, key=groups.get, reverse=True)[:10]
    
    # Get the polygon coordinates for the chosen neighbourhoods
    c.execute('SELECT * FROM Neighbourhoods WHERE NhID IN (%s)' % ','.join('?' for i in sortDicted),sortDicted)
    vals = c.fetchall()
    conn.close()
    coordDict = {}
    for val in vals:
        if val[0] in coordDict:
            coordDict[val[0]].append([val[1],val[2]])
        else:
            coordDict[val[0]] = [[val[1],val[2]]]
    
    # Return results as geojson
    return {'neighbourhoods':createGeoJson(coordDict.values())}
app.run()