//set url then perform GET request to get the data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url).then(function(data){
    //log data.features to get info for create features function
    console.log(data);
    //pass features to a create features funciton
    createFeatures(data.features);
});


//make a function to determine marker size
function markerSize(magnitude){
    return magnitude * 15000;
};


//create a function to determine marker color by depth
function depthColor(depth){
    if (depth < 10) return "#007e7e";
    else if (depth < 30) return "#309898";
    else if (depth < 50) return "#ff9f00";
    else if (depth < 70) return "#f4631e";
    else if (depth < 90) return "#cb041f";
    else return "red";
}

function createFeatures(earthquakeData) {
    //save earthquake data in a variable and bind a pop up to it
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3> <hr> <p> Date: ${new Date(feature.properties.time)}</p> <p>Magnitude: ${feature.properties.mag}</p> <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    //create geoJSON layer
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        //pointToLayer used to alter markers
        pointToLayer: function(feature, latlng) {

            //determines markes based on properties like markersize & depthcolor functions defined earlier
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                fillOpacity: .75,
                color: "black",
                stroke: true,
                weight: .25
            }
        return L.circle(latlng,markers);
        }
    });
    //pass the earthquake data to a createmap function
    createMap(earthquakes);
}

//use createmap to incorporate the earthquake data into the visualizaion
function createMap(earthquakes) {
    //create street layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    //create basemap layer
    let baseMaps = {
        "Street Map": street
    }

    //create earthquake layer
    let overlayMaps = {
        Earthquakes: earthquakes
    }
    // make the map with our variables
    let myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [street, earthquakes]
    });

    //add layer control
    L.control.layers(baseMaps, overlayMaps,{
        collapsed:false
    }).addTo(myMap);

    //add a legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create('div','info legend');
        var depth = ["-10", "10", "30", "50", "70", "90"];
        var labels = [];
        var legendInfo = "Depth (meters)";
        for (var i =0; i< depth.length; i++) {
            div.innerHTML += 
            '<i style="background:' + depthColor(depth[i]) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        };
        return div;
    };
legend.addTo(myMap)
};




// data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color
// higher magnitudes should be larger, greater depth should be darker in color
// include popups that provide additional info about the earthquake when its associated marker is clicked
// create a legend


// (optional) import & visualize MORE data 