var express = require('express');
var router = express.Router();
var compute = require('../server/computations');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'yas' });
});

router.post('/ajax', function(req, res) {
    var result = require('../public/data/Spatial'), 
     fish = require('../public/data/fish-cluster'),
     body = req.body,
     start = body["start"],
     end = body["end"];

    // var featuresSlice = features.slice(start,end);
    var slimmedSlice = compute.computeClustersPolygon(result);
    var fishSlice = compute.computeClustersPolygon(fish);

    slimmedSlice.push(fish[0]);
    slimmedSlice.push(fishSlice[0]);
    var geoCollection = [];
    slimmedSlice.forEach(function(d){
        var geoJSON = {"type": "FeatureCollection", "features": d}
        geoCollection.push(geoJSON);
    });

    if(req.xhr || req.accepts('json,html')==='json'){
        res.json({success: true , data :geoCollection });
    } else {
        res.redirect(303, '/ajax');
    }
});

module.exports = router;



