renderMapView = function(data, parameters) {

    /* Variables */
    var map;

    function initializeMap(){
        if (!('remove' in Element.prototype)) {
            Element.prototype.remove = function() {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            };
        }

        mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

        // This adds the map
        map = new mapboxgl.Map({
            // container id specified in the HTML
            container: parameters['id'],
            // style URL
            style: 'mapbox://styles/mapbox/light-v9',
            // initial position in [long, lat] format
            center: [-103.913, 18.527],
            // initial zoom
            zoom: 5,
            scrollZoom: true
        });
    }
    
    function populateMap(){
        // This adds the data to the map
        map.on('load', function(e) {

            //Add Polygonal Sources
            //TODO: add a check to enusre it is a polygon geoJSON not points
            var color =  d3.scaleOrdinal(d3['schemeCategory20b']);
            data.forEach(function(layer, i){
                var layerID = 'places' + parameters['layers'][i];

                map.addSource(parameters['layers'][i], {
                    "type": "geojson",
                    "data": layer
                });

                map.addLayer({
                    "id": layerID,
                    "type": "fill",
                    "source": parameters['layers'][i],
                    "paint": {
                        "fill-color": color(i),
                        "fill-opacity": 0.4
                    },
                    "filter": ["==", "$type", "Polygon"]
                });

                // Change the cursor to a pointer when the mouse is over the states layer.
                map.on('mouseenter', 'places-boundary', function () {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('click', 'places-boundary', function (e) {
                    //Catch the data for this polygon and forward it to the stream-map 
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(e.features[0].properties.name)
                        .addTo(map);
                });
            });
            
        });
    }


    //Used to render points rather than polygon
    function showMarkers(index){
        // This is where your interactions with the symbol layer used to be
        // Now you have interactions with DOM markers instead
        data[index].features.features.forEach(function(marker, i) {
            // Create an img element for the marker
            var el = document.createElement('div');
            el.id = "marker-" + i;
            el.className = 'marker';
            // Add markers to the map at all points
            new mapboxgl.Marker(el, {
                    offset: [-28, -46]
                })
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

            el.addEventListener('click', function(e) {
                // 1. Fly to the point
                flyToStore(marker);

                // 2. Close all other popups and display popup for clicked store
                createPopUp(marker);

                // 3. Highlight listing in sidebar (and remove highlight for all other listings)
                var activeItem = document.getElementsByClassName('active');

                e.stopPropagation();
                if (activeItem[0]) {
                    activeItem[0].classList.remove('active');
                }

                var listing = document.getElementById('listing-' + i);
                listing.classList.add('active');

            });
        }); 
    }
    

    function flyToStore(currentFeature) {
        map.flyTo({
            center: currentFeature.geometry.coordinates,
            zoom: 15
        });
    }

    function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();


        var popup = new mapboxgl.Popup({
                closeOnClick: false
            })
            .setLngLat(currentFeature.geometry.coordinates)
            .setHTML('<h3>Cast</h3>' +
                '<h4> # Samples: ' + currentFeature.properties.Samples + '</br>' + currentFeature.geometry.coordinates.toString() + '</h4>')
            .addTo(map);
    }

    initializeMap(); 
    populateMap(); 
    //TODO: update map w/ new data as need be

};
