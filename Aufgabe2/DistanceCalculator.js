"use strict"
/**
 * @author Tim Lehmann
 * @descrpition JavaScript Document for Aufgabe 2
 */

// Erstellung der Metadaten mit Hilfe von:
// https://stackoverflow.com/questions/18982228/how-to-add-meta-tag-in-javascript
 var meta = document.createElement('meta');
 meta.author = "author";
 meta.content = "Tim Lehmann";
 document.head.appendChild(meta);

 var meta = document.createElement('meta');
 meta.keywords = "keywords";
 meta.content = "Calculator, HTML, Javascript, Programming"
 document.head.appendChild(meta);

// Erstellung von einem neuen Array, welches die Länge der Punkte in der poi.js hat.
var poiDistance = new Array(poi.features.length);


// Der Titel wird mit einer DOM- Manipulation geändert und mit einem Alert angekündigt.
// https://developer.mozilla.org/de/docs/Web/API/Document/title
document.title = "Welcome to the Distance Calculator";
alert(document.title);


/**
 *  @function distanceCalculator
 *  @description Berechnung von den Distanzen, wie bereits aus Aufgabe1 bekannt
 */
function distanceCalculator(currentPoint) {

    for (var i = 0; i < poi.features.length; i++) {

        // Coordinaten von dem neuen Punkt und aus der poi.js werden definiert.
        var lat1 = currentPoint.coordinates[1];
        var lon1 = currentPoint.coordinates[0];
        var lat2 = poi.features[i].geometry.coordinates[1];
        var lon2 = poi.features[i].geometry.coordinates[0];

        // folgender Code wurde von der Website https://www.movable-type.co.uk/scripts/latlong.html kopiert, welche in der Aufgabenstellung stand (Aufgabe1).
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        var d = (R * c);
        var d = (Math.round(d));

        poiDistance[i] = d;
    }
    // Arrow Funktion:
    // angepasste Sort Funktion aus Aufgabe 1
    poiDistance.sort((a, b) => a - b)

    // Output Message auf der Website
    var output = "";
    for (var i = 0; i < poiDistance.length; i++) {
        output = output + poiDistance[i] + " m" + "<br />";
    }
    document.getElementById("output").innerHTML = output;
}