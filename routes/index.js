var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'yas' });
});

router.post('/ajax', function(req, res) {
    var result = require('../public/javascripts/test2'),
     body = req.body,
     start = body["start"],
     end = body["end"],
     features = result["features"];

    var featuresSlice = features.slice(start,end);
    var geoJSON = {"type": "FeatureCollection", "features": featuresSlice}

    if(req.xhr || req.accepts('json,html')==='json'){
        res.json({success: true , data :geoJSON });
    } else {
        res.redirect(303, '/ajax');
    }
});

module.exports = router;



