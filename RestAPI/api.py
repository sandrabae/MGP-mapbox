from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
import requests

from classes.time_range import TimeRange 

app = Flask(__name__)
CORS(app)
api = Api(app)

app.config['MONGO2_DBNAME'] = 'test' 
mongo = PyMongo(app, config_prefix='MONGO2')


api.add_resource(TimeRange, '/TimeRange')

if __name__ == '__main__':
    app.run(debug=True)
