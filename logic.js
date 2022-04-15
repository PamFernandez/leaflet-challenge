// Store our API endpoint as queryUrl
// My chosen API is: all earthquakes in the last 7 days
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// Adding "Level 2: More Data" - the tectonic plates data from GitHub
let platesURL = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    createMap(data.features);
  
    function createMap(earthquakes) {
        let quakeMarkers = [];
  
    // Loop through locations, and create the city and state markers
    for (var i = 0; i < earthquakes.length; i++) {
      
    quakeMarkers.push(
    // coordinates are in long,lat so they need to be specified in the reverse order 
    L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
        stroke: true,  // border
        weight: 1,  // border weight
        color: "black",  // border color
        fillOpacity: 0.65,
        // go to getColor function to get the right color for the circle 
        fillColor: getColor(earthquakes[i].geometry.coordinates[2]),
        // Set the marker radius porportinal to the magnitude of the earthquake
        radius: earthquakes[i].properties.mag * 25000
    }).bindPopup(
        `<h3>${earthquakes[i].properties.place}</h3><hr>
        <p>magnitude: ${earthquakes[i].properties.mag}</p>
        <p>depth: ${earthquakes[i].geometry.coordinates[2]} kilometers</p>
        <p>significance rating (0-1000): ${earthquakes[i].properties.sig}</p>
        <p>number of felt reports submitted to DYFI?: ${earthquakes[i].properties.felt}</p>`)    
        );
    }

    console.log(quakeMarkers);  // can verify that it's the same number as are in the data 
  
    let quakeLayer = new L.layerGroup(quakeMarkers);
    let platesLayer = new L.LayerGroup();

    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
  
    // Create an overlays object for the quake markers
    let overlayMaps = {
        "Earthquakes": quakeLayer,
        "Plate Boundaries": platesLayer,
    };

    // Create a new map.
    // show the quake markers on the street map
    let myMap = L.map("map", {
        center: [17.00, -35.00],
        zoom: 3,
        layers: [street, quakeLayer, platesLayer]
    });
  
    // Create a layer control that contains our baseMaps and add an overlay Layer that contains the earthquake GeoJSON
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

    // function needed to grab the color related to the depth of the earthquake
    function getColor() {
        if (earthquakes[i].geometry.coordinates[2] <50) {
            return "#ffffb2"
        } else if (earthquakes[i].geometry.coordinates[2] <100) {
            return "#fed976"
        } else if (earthquakes[i].geometry.coordinates[2] <150) {
            return "#feb24c"
        } else if (earthquakes[i].geometry.coordinates[2] <200) {
            return "#fd8d3c"
        } else if (earthquakes[i].geometry.coordinates[2] <300) {
            return "#f03b20"
        } else if (earthquakes[i].geometry.coordinates[2] >301) {
            return "#bd0026"
        }
    };

    // Perform a GET request to the tectonicplates URL
    d3.json(platesURL).then (function(plateData) {
        console.log(plateData)
        // Create layer for the plateData
        L.geoJson(plateData, {
            color: "orange",
            weight: 2
        // Add plateData to tectonicplates LayerGroups 
        }).addTo(platesLayer);
        // Add tectonicplates Layer to the Map
        platesLayer.addTo(myMap);
    });

    // Set up the legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        const depths = ['<50 km', '100', '150', '200', '300', '>301 km']
        const colors = ["#ffffb2",
                        "#fed976", 
                        "#feb24c", 
                        "#fd8d3c", 
                        "#f03b20", 
                        "#bd0026"
        ];
        const labels = [];

        // Add minimum and maximum.
        div.innerHTML = `<h1>Earthquake Depth</h1>` + "<div class=\"labels\">" +
            "<div class=\"min\">" + depths[0] + "</div>" +
            "<div class=\"max\">" + depths[depths.length - 1] + "</div>" +
            "</div>";

        depths.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
       };

    // Adding the legend to the map 
    legend.addTo(myMap);
    }
});