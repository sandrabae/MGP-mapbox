loadingMap = function(data) {
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

    // This adds the map
    var map = new mapboxgl.Map({
        // container id specified in the HTML
        container: 'map',
        // style URL
        style: 'mapbox://styles/mapbox/light-v9',
        // initial position in [long, lat] format
        center: [-103.913, 18.527],
        // initial zoom
        zoom: 5,
        scrollZoom: true
    });

	console.log(data);

    //Two kinds of sources, polygonal & markers

    // This adds the data to the map
    map.on('load', function(e) {
        // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
        map.addSource("places", {
            "type": "geojson",
            "data": data[0]
        });

        map.addLayer({
            "id": "places-boundary",
            "type": "fill",
            "source": "places",
            "paint": {
                "fill-color": "#888888",
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
        // Initialize the list
        // buildLocationList(stores);

    });

    // // This is where your interactions with the symbol layer used to be
    // // Now you have interactions with DOM markers instead
    data[1].features[1].forEach(function(marker, i) {
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


    // function buildLocationList(data) {
    //     for (i = 0; i < data.features.length; i++) {
    //         var currentFeature = data.features[i];
    //         var prop = currentFeature.properties;

	
    //         var listings = document.getElementById('listings');
    //         var listing = listings.appendChild(document.createElement('div'));
    //         listing.className = 'item';
    //         listing.id = "listing-" + i;

    //         var link = listing.appendChild(document.createElement('a'));

    //         link.href = '#';
    //         link.className = 'title';
    //         link.dataPosition = i;
    //         link.innerHTML = currentFeature.geometry.coordinates.toString();

    //         var details = listing.appendChild(document.createElement('div'));
    //         var date =  prop.Date[0];
    //         details.innerHTML = "# of Samples: " + prop.Samples;
    //         if (prop.Date) {
    //             details.innerHTML += ' </br> Date: ' + date;
    //         }



    //         link.addEventListener('click', function(e) {
    //             // Update the currentFeature to the store associated with the clicked link
    //             var clickedListing = data.features[this.dataPosition];

    //             // 1. Fly to the point
    //             flyToStore(clickedListing);

    //             // 2. Close all other popups and display popup for clicked store
    //             createPopUp(clickedListing);

    //             // 3. Highlight listing in sidebar (and remove highlight for all other listings)
    //             var activeItem = document.getElementsByClassName('active');

    //             if (activeItem[0]) {
    //                 activeItem[0].classList.remove('active');
    //             }
    //             this.parentNode.classList.add('active');

    //         });
    //     }
    // }

}
