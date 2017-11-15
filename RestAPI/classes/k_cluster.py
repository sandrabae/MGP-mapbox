from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from bson.json_util import dumps
from jarvis_march import JarvisMarch
from api import mongo


import requests
import json


class KCluster(Resource):
	# def post handles a post request
    # Input {'K': #, microbe: 'name', timerange: 'date-date' }
    # group microbes for the given time period in to k groups
    # return the polygon(s) to draw in geojson format
    def post(self):

    	print(request.data)
    	body = json.loads(request.data) #convert it to json
    	year = body["K"] # get what you care about

    	#data = self.requestDB(year)
    	# from request.data return data based on time
    	return {'data': "data"} #the database returns