import mysql.connector

global resultsExportStations
resultsExportStations = []

def VelibStations(latitude, longitude):
    db = mysql.connector.connect(
        host="169.51.141.72",
        user="demo",
        password="ChangeMe",
        database="demodb"
    )
    cursor = db.cursor()

    del resultsExportStations[:]
    query = "SELECT `Nom de la station`,SUBSTRING_INDEX(geo, ',',1) as latitude, SUBSTRING_INDEX(geo, ',',-1) as longitude FROM demodb.velib_pos WHERE ST_Distance_Sphere(POINT(SUBSTRING_INDEX(geo, ',',1) , SUBSTRING_INDEX(geo, ',',-1)), POINT(%s, %s)) <= 500;"
    cursor.execute(query, (latitude, longitude))
    velibStations = cursor.fetchall()

    for row in velibStations:
        item = {
            "station_name": row[0],
            "latitude": row[1],
            "longitude" : row[2]
        }
        resultsExportStations.append(item)

    cursor.close()
    db.close()
