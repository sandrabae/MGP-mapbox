from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from flask_pymongo import PyMongo
from bson.json_util import dumps
from .jarvis_march import JarvisMarch
from api import mongo

import json

import rpy2.robjects as robjects
from rpy2.robjects.packages import importr 
rjson=importr('rjson')
r = robjects.r

def compute(play,points):
    points.frame(r.matrix(r.unlist(play), ncol=3, byrow=T))


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
        robjects.r('''   
            cluster <- function(k, data, verbose=FALSE){
                cat("I am calling f().\n")
                bio.JSON <- fromJSON(data)
                df <- lapply(bio.JSON, function(play) # Loop through each "play"
                {
                  # Convert each group to a data frame.
                  # This assumes you have 3 elements each time (id, long, lat)
                  data.frame(matrix(unlist(play), ncol=3, byrow=T))
                })

                # one single dataframe
                df <- do.call(rbind, df)

                # Make column names nicer, remove row names
                colnames(df) <- names(bio.JSON[[1]])
                rownames(df) <- NULL

                set.seed(7)
                #determine which columns I care about (long & lat)
                kgroups = kmeans(df[,c(2,3)], k, nstart=100)

                #For k groups:
                    mylist <- list() 
                    #create list of groups (json array) 
                    for (i in 1:k){
                       kcluster = df[kgroups$cluster==i,]
                       x <- toJSON(unname(split(kcluster, 1:nrow(kcluster))))
                       mylist <- append(mylist, x)
                    }

                #return that array
                
                mylist
            }
            ''')
        r_cluster = robjects.globalenv['cluster']
        points_clusters = r_cluster(k,points)

        jarvisMarch = JarvisMarch()
        #Convert clusters to polygons
        polygons = list()
        for points_cluster in points_clusters:
            parsed_cluster = json.loads(points_cluster[0])
            polygons.append(jarvisMarch.getPolygon(parsed_cluster))
        #format as GEOJSON
        output = jarvisMarch.pointsToGEO(polygons)

        return {'data': output } #the database returns

    def requestDB(self,year,microbe):
        mongo.db.noaa.create_index( 'Year' )
        test = mongo.db.noaa.find({ "$and" : [ {'Year':year},{'ITIS TSN':microbe} ]}, {"Longitude":1, "Latitude":1}) # huge speed up
        l_test = list(test)
        solution = dumps(l_test)
        return solution
