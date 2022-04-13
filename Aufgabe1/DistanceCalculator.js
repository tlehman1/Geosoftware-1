"use strict"

var distanceToCity = [
    ["Köln", 0.0],
    ["Amsterdam", 0.0],
    ["Kassel", 0.0],
    ["Barcelona", 0.0],
    ["Tunis", 0.0],
    ["Kyoto", 0.0],
    ["Bucharest", 0.0],
    ["Graz", 0.0],
    ["Kairo", 0.0],
    ["Dublin", 0.0],
    ["Oslo", 0.0]
  ];

  
function calculateDistance(){

    for(var i = 0; i < cities.length; i++){

        var lat1 = point[1]; 
        var lon1 = point[0];
        var lat2 = cities[i][1];
        var lon2 = cities[i][0];
    
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = (R * c)/1000;
        var d = (Math.round(d));

        distanceToCity[i][1] = d;

    }
}

function zweiteSpalteSortieren (a, b){
    return a[1] - b[1];
}

calculateDistance();
// Array citiesDistance aufsteigend sortieren
//Quelle: https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/array/sort
distanceToCity.sort(zweiteSpalteSortieren);
// Funktion für zweite Spalte sortieren 
//gibt entweder -1, 0 oder 1 zurück und sort() tauscht dann die beiden ausgewählten Spalten


var output = "";
for(var i = 0; i < distanceToCity.length; i++) {
    output = output + distanceToCity[i][0] + " ist " +  distanceToCity[i][1] + " km von Münster entfernt" + "<br />";
}