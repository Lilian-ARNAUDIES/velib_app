from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim
import db

app = Flask(__name__)
CORS(app)

geolocator = Nominatim(user_agent='velib-locator')

@app.route('/api/search', methods=['POST'])
def Velib_Stations():
    print('Request received') # ajout de cette instruction print
    data = request.get_json()
    address = data['address']
    print(address)
    location = geolocator.geocode(address)
    print(location)
    
    db.VelibStations(location.latitude, location.longitude)
    result = db.resultsExportStations
    print(result)
    return jsonify(result)
