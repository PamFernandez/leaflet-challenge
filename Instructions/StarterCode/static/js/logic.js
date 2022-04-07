// Store our API endpoint as queryUrl
// My chosen API is: all M2.5+ earthquakes in the last 7 days
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    createMap(data.features);
});
  
    function createMap(earthquakes) {
        let quakeMarkers = [];
  
    // Loop through locations, and create the city and state markers
    for (var i = 0; i < earthquakes.length; i++) {
      
    quakeMarkers.push(
    // coordinates are in long, lat so they need to be specified in the reverse order 
    L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
        stroke: true,  // border
        weight: 1,  // border weight
        color: "black",  // border color
        fillOpacity: 0.65,
        // go to getColor function to get the right color for the circle 
        fillColor: getColor(earthquakes[i].properties.dmin),
        // Set the marker radius porportinal to the magnitude of the earthquake
        radius: earthquakes[i].properties.mag * 25000
    }).bindPopup(
        `<h3>${earthquakes[i].properties.place}</h3><hr>
        <p>magnitude: ${earthquakes[i].properties.mag}</p>
        <p>depth: ${earthquakes[i].properties.dmin} kilometers</p>
        <p>significance rating (0-1000): ${earthquakes[i].properties.sig}</p>
        <p>number of felt reports submitted to DYFI?: ${earthquakes[i].properties.felt}</p>`)    
        );
    }
    console.log(quakeMarkers);  // can verify that it's the same number as are in the data 
  
    let quakeLayer = L.layerGroup(quakeMarkers);
    // Create the base layers
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
  
    // Create an overlays object for the quake markers
    var overlayMaps = {
        quakes: quakeLayer,
    };

    // Create a new map.
    // show the quake markers on the street map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [street, quakeLayer]
    });
  
    // Create a layer control that contains our baseMaps and add an overlay Layer that contains the earthquake GeoJSON
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
    }   

// function needed to grab the color related to the depth of the earthquake
function getColor(dmin) {
    if (dmin <.5) {
        return "#ffffb2"
    } else if (dmin <1) {
        return "#fed976"
    } else if (dmin <1.5) {
        return "#feb24c"
    } else if (dmin <2) {
        return "#fd8d3c"
    } else if (dmin <2.5) {
        return "#f03b20"
    } else if (dmin >2.5) {
        return "#bd0026"
    }
}