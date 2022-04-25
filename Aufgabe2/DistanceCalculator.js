"use strict"

var distanceToCity = new Array();



// Hier wurde die Funktion calculateDistance erstellt.
function calculateDistance() {

    for (var i = 0; i < cities.length; i++) {

        // hier werden die zur Verfügung gestellten cities.js und point.js der unten stehenden Code angepasst.
        var lat1 = point[1];
        var lon1 = point[0];
        var lat2 = cities[i][1];
        var lon2 = cities[i][0];

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

        var d = (R * c) / 1000; // hier wird die berechnete Distanz in km umgerechnet.
        var d = (Math.round(d)); // hier wird die Distanz gerundet.

        distanceToCity[i] = d; // hier wird die hintere Stelle im 2-dim-Array angepasst.

    }
}

//folgender Code wurde hier gefunden: https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/array/sort
function sort2nd(a, b) {
    return a[1] - b[1];
}

//Funktion wird ausgeführt.
calculateDistance();

//Array wird sortiert.
distanceToCity.sort(sort2nd);


//hier wird der Text der in der HTML ausgegeben wird konfiguriert.
var output = "";
for (var i = 0; i < distanceToCity.length; i++) {
    output = output + distanceToCity[i][0] + " is " + distanceToCity[i][1] + " km away from Münster." + "<br />";
}
