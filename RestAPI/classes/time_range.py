from flask import Flask, request, make_response
from flask_restful import Resource, Api
import requests
from bson import json_util

class TimeRange(Resource):

	# def get handles a post request
    def get(self):
    	test = mongo.db.noaa.find({'Year':'2006'})
    	l_test = list(test)
    	print(len(l_test))

    	solution = {'data': "sad" }
    	return solution

    # def post handles a post request
    def post(self):
    	print(request.data)
    	# from request.data return data based on time
    	return {'data': 'happy'}