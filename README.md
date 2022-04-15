### leaflet-challenge
# Leaflet Homework: Visualizing Data with Leaflet

### This assignment was to use Leaflet.js to visualize a geoJSON dataset from the USGS website.

----------------------------
----------------------------
## Web application is deployed at: 

## The screen shot of my final map:
![PamsMapScreenShot] (Instructions/Images/PamsMapScreenShot.pdf)



## Process
The basic HTML code was prepared for us. It included:
* a link to the the Leaflet CSS file, 
* a link to our CSS stylesheet,
* a div element with the id for where to insert our map,
* the Leaflet JavaScript file, 
* the D3 JavaScript file, and
* our JavaScript file.

I began creating the JavaScript file with creating the base layers of this map - the street tileLayer and the topography tileLayer in this case.

Then I called on the GeoJSON file from the USGS website and used this data to plot all of the earthquakes based on their longitude and latitude. The size of the data marker to reflects the magnitude of the earthquake and the color of the data marker reflects the depth at which the earthquake occured. 

I also created a pop-up for each marker that contains:
* the location,
* the magnitude,
* the depth,
* the significance rating, and
* the number of reports submitted to the DYFI? system. (Did You Feel It? (DYFI) collects information from people who felt an earthquake and creates maps that show what people experienced and the extent of damage.)

There is a control box in the upper right hand corner that contains the basemaps and the overlay maps and allows each layer to be turned on or off. And there is a legend in the bottom right hand corner that shows what the color of the markers mean - that is the depth of each earthquake.

For a bonus I added an additional overlay to my map to show the borders of the tectonic plates - illustrating the relationship between tecctonic plates and seismic activity. I also added this layer to the control box so the tectonic plate borders layer can be turned on and off.

## Summary
The final product was a web application created with Leaflet.js that included two base layers and two overlayers that could be chosen and turned off and on. 

Each time the application is refreshed it is updated with the current information contained in the geoJSON file hosted on the USGS website.

## My Code
* JavaScript: logic.js
* HTML code: index.html
* CSS code: style.css

## Data Sources Used
*USGS GeoJSON Summary Format webpage: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

*The earthquake GeoJSON dataset I used in my web application - All Earthquakes From The Past 7 Days: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

*The tectonic plate boundaries JSON: https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json

