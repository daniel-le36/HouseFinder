from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import sqlite3
import pymysql
pymysql.install_as_MySQLdb()
pymysql.version_info = (1, 3, 13, 'final', 0)

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

@app.route('/getboundary',methods=['GET'])
def getboundary():
    boundary = json.load(open('Vaughan_Boundary.geojson', encoding='utf-8'))
    return {'geojson':boundary}

@app.route('/getpreferences',methods=['GET'])
def getprefs():
    conn = sqlite3.connect('GeoData.db')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM Categories ORDER BY Name')
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