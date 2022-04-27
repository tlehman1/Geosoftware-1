"use strict"

var poiDistance = new Array(poi.features.length);


function distanceCalculator() {

    for (var i = 0; i < poi.features.length; i++) {

        // hier werden die zur Verfügung gestellten poi.js und point.js der unten stehenden Code angepasst.
        var lat1 = point[1];
        var lon1 = point[0];
        var lat2 = poi.features[i].geometry.coordinates[1];
        var lon2 = poi.features[i].geometry.coordinates[0];

        // folgender Code wurde von der Website https://www.movable-type.co.uk/scripts/latlong.html kopiert, welche in der Aufgabenstellung stand.
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // bis hierhin wurde der Code kopiert

        var d = (R * c); 
        var d = (Math.round(d)); 

        poiDistance[i] = d;
    }
}



//Funktion wird ausgeführt.
distanceCalculator();

poiDistance.sort(function (a, b){
    return a - b;
})

//Array wird sortiert.
//poiDistance.sort();

var output = "";
for (var i = 0; i < poiDistance.length; i++) {
    output = output + poiDistance[i] + " m" + "<br />";
}