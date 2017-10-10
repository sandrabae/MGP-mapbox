var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'yas' });
});


function aggregateLocation(data){
    var features = []
    var location = {};

    data.forEach(function(d){
        var longAndLatArray = d["geometry"]["coordinates"].toString();
        if(longAndLatArray in location){
            var date = d["properties"]["date"];
            var dateArray = location[longAndLatArray]["Date"];
            if(dateArray.indexOf(date) < 0){location[longAndLatArray]["Date"].push(date);}
            location[longAndLatArray]["Samples"] = location[longAndLatArray]["Samples"] + 1;
        }else{
            var date = d["properties"]["date"];
            location[longAndLatArray] = { Date:[date], Samples: 1};
        }
        
    });

    
    var polygons = createPolygons(location);

    polygons.forEach(function(d){ features.push(d);});

    return features;
}

function markers(data){
    var solution = [];

    for(var key in data){
        var coordinates = key.split(',');
        var object = { type: "Feature", 
            geometry:{"coordinates": coordinates, type: "Point"}, 
            properties: {Samples: location[key]["Samples"], Date: location[key]["Date"] }
        };

        solution.push(object);
    }

    return solution;
}

function createPolygons(data){
    var US = [];
    var US_Data = [];
    var Greenland = [];
    var GreenData = [];
    var polygons = [];

    //TODO: method for grouping a set coordinates to be then turned into polygons
    for(var key in data){
        var stringCoordinates = key.split(',');
        var coordinates = [0,0];
        coordinates[0] = parseFloat(stringCoordinates[0]);
        coordinates[1] = parseFloat(stringCoordinates[1]);

        if(coordinates[0] > -156  && coordinates[0] < -70){
            //United states related check if between -156 && -70
            US.push(coordinates);
            US_Data.push(data[key]);
        }else{
            //Greenland check if between -6 && 39
            Greenland.push(coordinates);
            GreenData.push(data[key]);
        }
    }

    var USPoly = JarvisMarch(US);
    var GreenlandPoly =  JarvisMarch(Greenland);

    var polys = [USPoly, GreenlandPoly];
    var names = ["America W", "Greenland"];
    polys.forEach(function(poly, i){
        var object = { type: "Feature", geometry:{"coordinates": [poly], type: "Polygon"}, properties: {name: names[i]}};
        polygons.push(object);
    });

    return polygons;
}

function JarvisMarch(data){
    var sortedData = Array.from(data);
    sortedData.sort(function(a,b){ return a[0] - b[0];}); //sort by ascending

    var pointOnHull = sortedData[0]; //left most point
    var pointsOnHull = [pointOnHull];
    var angleAbsolutePrev = 0;
    var displacement = [0,0];

    while(pointOnHull != pointsOnHull[0] ||  pointsOnHull.length == 1){
        var minAngleRelativeSoFar = Number.POSITIVE_INFINITY;
        var pointWithMinAngleRelativeSoFar = null;
        var i = 0;
        for(;i < data.length; i++){
            var pointCandidate = data[i];

            //pointCandidate - pointOnHull
            var x = pointCandidate[0] - pointOnHull[0];
            var y =  pointCandidate[1] - pointOnHull[1];

            displacement[0] = x; 
            displacement[1] = y;

            //magnitude
            var distanceFromPointOnHullToCandidate = magnitude(displacement);

            if(distanceFromPointOnHullToCandidate != 0){
                var angleAbsolute = angleInCycles(displacement);
                var angleRelativeToHullEdge = angleAbsolute - angleAbsolutePrev;

                if(angleRelativeToHullEdge < 0){ angleRelativeToHullEdge += 1;}

                if(angleRelativeToHullEdge < minAngleRelativeSoFar ){
                    if (angleRelativeToHullEdge == minAngleRelativeSoFar){
                        displacement[0] = pointWithMinAngleRelativeSoFar[0] -  pointOnHull[0];
                        displacement[1] = pointWithMinAngleRelativeSoFar[1] -  pointOnHull[1];

                        var distancePrev = magnitude(displacement);
                        if (distanceFromPointOnHullToCandidate < distancePrev){
                            minAngleRelativeSoFar = angleRelativeToHullEdge;
                            pointWithMinAngleRelativeSoFar =  pointCandidate;
                        }

                    }else{
                        minAngleRelativeSoFar = angleRelativeToHullEdge;
                        pointWithMinAngleRelativeSoFar = pointCandidate;
                    }
                }

            }
        }

        pointOnHull = pointWithMinAngleRelativeSoFar;
        pointsOnHull.push(pointOnHull);
        angleAbsolutePrev += minAngleRelativeSoFar;
    }

    return pointsOnHull;
}

function angleInCycles(point){
    var solution = Math.atan2(point[1], point[0]) / (2 * Math.PI);

    if(solution < 0){
        solution += 1;
    }
    return solution;
}

function magnitude(point){
    return Math.sqrt(point[0] * point[0] + point[1] * point[1]);
}


router.post('/ajax', function(req, res) {
    var result = require('../public/javascripts/test2'), //54k rows
     body = req.body,
     start = body["start"],
     end = body["end"],
     features = result["features"];
    console.log(features.length); 

    // var featuresSlice = features.slice(start,end);
    var slimmedSlice = aggregateLocation(features);
    var geoJSON = {"type": "FeatureCollection", "features": slimmedSlice}

    if(req.xhr || req.accepts('json,html')==='json'){
        res.json({success: true , data :geoJSON });
    } else {
        res.redirect(303, '/ajax');
    }
});

module.exports = router;



