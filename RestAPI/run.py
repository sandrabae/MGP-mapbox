from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from api import app


CORS(app)
api = Api(app)

from classes.time_range import TimeRange
from classes.k_cluster import KCluster


api.add_resource(TimeRange, '/TimeRange')
api.add_resource(KCluster, '/KCluster')

if __name__ == '__main__':
    app.run(debug=True)
