/**
 * All functions are used to process GeoJSON 
*/ 

module.exports = {
    /**
     * @param {Array<Object>} required This parameter is always needed. Array of GeoJSON objects
    */
    computeClustersPolygon: function(data){
        var clusters = [];

        data.forEach(function(obj){
            var coordinateTable = {},
                features = obj["features"];

            features.forEach(function(feature){ 
                var longLatKey = feature["geometry"]["coordinates"].toString();

                if(longLatKey in coordinateTable){
                    var date = feature["properties"]["date"],
                        dateList = coordinateTable[longLatKey]["Date"];

                    //Only add unique dates to date list
                    if(dateList.indexOf(date) < 0){
                        coordinateTable[longLatKey]["Date"].push(date);
                    }

                    //Update the number of samples at this long and lat
                    coordinateTable[longLatKey]["Samples"] = coordinateTable[longLatKey]["Samples"] + 1;
                }else{
                    var date = feature["properties"]["date"];

                    //Initialize the object for this coordinate
                    coordinateTable[longLatKey] = { Date:[date], Samples: 1};
                }
            });
            clusters.push(coordinateTable);
        });

        var polygons = [];
        clusters.forEach(function(cluster){
            var polygon = createPolygons(cluster);
            polygons.push(polygon);
        });

        return polygons;
    }  
};
 
/**
 * @param {Object} required This parameter is always needed. 
 *  Object is a dictionary (key = longLat, value = {Samples: int, Date: Array<String>})
*/
function createPolygons(dictionary){
    var polygons = [],
        coordinates = [];

    for(key in dictionary){
        var longLatKeys = key.split(','); // splits long,lat to Array<string,string>
        var longitudeLatitude = [0,0];

        longitudeLatitude[0] = parseFloat(longLatKeys[0]);
        longitudeLatitude[1] = parseFloat(longLatKeys[1]);

        coordinates.push(longitudeLatitude);
    }
    
    var polygonPoints = JarvisMarch(coordinates),
        geoJSONObject = { type: "Feature", geometry:{"coordinates": [polygonPoints], type: "Polygon"} };

    return geoJSONObject;
}

/**
 * @param {Array< Array<int,int> >} required This parameter is always needed. 
 * List of coordinates is the input
 *
 * TODO:
 *  (1) Current implementation seems like it is failing... 
 *  (2) Do this preprocessing in python rather than in javascript.
*/
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

return module.exports;

