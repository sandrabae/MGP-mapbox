from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo

app = Flask(__name__)


app.config['MONGO2_DBNAME'] = 'test' 
mongo = PyMongo(app, config_prefix='MONGO2')