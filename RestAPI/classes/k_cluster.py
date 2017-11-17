from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from bson.json_util import dumps
from .jarvis_march import JarvisMarch
from api import mongo

import json
# import rpy2
# from rpy2.robjects.packages import importr



class KCluster(Resource):
    # def post handles a post request
    # Input {'K': #, microbe: 'name', timerange: 'date-date' }
    # group microbes for the given time period in to k groups
    # return the polygon(s) to draw in geojson format
    def post(self):
        

        #from request.data
        #convert it to json
        body = request.get_json()
        print(body)

        microbe = body["microbe"]
        k = body["k"]
        time = body["time-range"]

        #query DB return data based on time & microbe (only return longitude and latitude)
        points = self.requestDB(time, microbe) #works

        #call rpy2 and cluster it (k-means)

        #Convert clusters to polygons

        #format as GEOJSON
            #properties = microbe name , # samples, year

        #return result

        return {'data': points} #the database returns

    def requestDB(self,year,microbe):
        mongo.db.noaa.create_index( 'Year' )
        test = mongo.db.noaa.find({ "$and" : [ {'Year':year},{'ITIS TSN':microbe} ]}, {"Longitude":1, "Latitude":1}) # huge speed up
        l_test = list(test)
        solution = dumps(l_test)
        return solution
