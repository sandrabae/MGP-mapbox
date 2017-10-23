var express = require('express');
var router = express.Router();
var compute = require('../server/computations');
var dataRetrieval = require('../server/data-retrieval');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main-view');
});

/* POST 
 * Handles the post request from the client-side to render clusters
*/
router.post('/ajax', function(req, res) {
    var body = req.body,
     start = body["start"],
     end = body["end"];

    var clusterToRender =  dataRetrieval.retrieveLocalData(),
        clusters = [];

    clusterToRender.forEach(function(cluster){
        var polygon = compute.computeClustersPolygon(cluster);
        clusters.push(polygon);
    });

    // clusters.push(clusterToRender[1]); <-- if you want to show the markers for it

    var geoCollection = [];
    clusters.forEach(function(d){
        var geoJSON = {"type": "FeatureCollection", "features": d}
        geoCollection.push(geoJSON);
    });

    var streamData = dataRetrieval.retrieveDataFromFile('full-occ'); //<-- this line is just for testing the stream graph
    if(req.xhr || req.accepts('json,html')==='json'){
        res.json({success: true , data :streamData });
    } else {
        res.redirect(303, '/ajax');
    }
});

module.exports = router;



