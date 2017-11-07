from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from bson.json_util import dumps
import requests

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['MONGO2_DBNAME'] = 'test' 
mongo = PyMongo(app, config_prefix='MONGO2')


class TimeRange(Resource):

	# def get handles a post request
    def get(self):
    	test = mongo.db.noaa.find({'Year':'2006'})
    	l_test = list(test)

    	solution = {'data': dumps(l_test) }
    	return solution

    # def post handles a post request
    def post(self):
    	print(request.data)
    	# from request.data return data based on time
    	return {'data': 'happy'} 


api.add_resource(TimeRange, '/TimeRange')

if __name__ == '__main__':
    app.run(debug=True)