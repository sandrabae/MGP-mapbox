from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from bson.json_util import dumps
from jarvis_march import JarvisMarch
from api import mongo

import json


class TimeRange(Resource):

    def requestDB(self,year):
    	print("hello")
    	mongo.db.noaa.create_index( 'Year' )
    	test = mongo.db.noaa.find({'Year': year}, {'Year':1, "Longitude":1, "Latitude":1}) # huge speed up
    	l_test = list(test)
    	solution = {'data': dumps(l_test) }
    	print("done")
    	return "solution"

    # def post handles a post request
    # post = F(x){ return x + 1}
    def post(self):

    	# print(request.data)
    	# body = json.loads(request.data) #convert it to json
    	# year = body["Year"] # get what you care about

    	# data = self.requestDB(year)
    	# from request.data return data based on time
    	return {'data': 'data'} #the database returns
