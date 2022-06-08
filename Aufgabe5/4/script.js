/**abfahrten
 * Musterlösung zu Aufgabe 2, Geosoft 1, SoSe 2022
 * @author {Tim Lehmann}   matr.Nr.: {503417}
 */

 "use strict";

 //declaration of global variables
 var pointcloud = [];
 var point;
 var abfahrten;
 
 /**
  * @function onLoad function that is executed when the page is loaded
  */
 function onLoad() {
   //event listener
   document.getElementById("refreshBtn").addEventListener("click",
     () => {
       refresh()
     }
   );
   document.getElementById("getLocationBtn").addEventListener("click",
     () => {
       var x = document.getElementById("userPosition");
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(showPosition);
         navigator.geolocation.getCurrentPosition(userPositionMarking);
       } else {
         x.innerHTML = "Geolocation is not supported by this browser.";
       }
     }
   );
   busstops.haltestellen();
 }
 
 //##############################################################################
 //## FUNCTIONS
 //##############################################################################
 
 /**
  * @function the main function
  */
 function main(point, pointcloud) {
   //sortiere Daten nach distanz und mach damit eine Tabelle auf der HTML
   let results = sortByDistance(point, pointcloud);
   clearTable('depatureTable');
   drawTable(results);
   busstops.abfahrten(results[0].id, 3600);
 }
 
 /**
  * @function refresh
  * @desc is called when new coordinates are inserted. refreshes the data on the site
  */
 function refresh() {
   let positionGeoJSON = document.getElementById("userPosition").value;
 
   //remove all table rows
   var tableHeaderRowCount = 1;
   var table = document.getElementById('resultTable');
   var rowCount = table.rows.length;
   for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
   }
 
   try {
     positionGeoJSON = JSON.parse(positionGeoJSON);
     //check validity of the geoJSON. it can only be a point
     if (validGeoJSONPoint(positionGeoJSON)) {
       point = positionGeoJSON.features[0].geometry.coordinates;
       main(point, pointcloud);
     } else {
       alert("invalid input.please input a single valid point in a feature collection");
     }
   } catch (error) {
     console.log(error);
     alert("invalid input. see console for more info.");
   }
 }
 
 /** 
  * This class contains all methods that are used to communicate and get the data from the given API 
  * and a constructor for creating objects
  * @class
  */
 class BusRadarAPI {
   /**
    * haltestellen
    * @public
    * @desc fills the pointcloud array with the response data from the api and calls the main method with it
    */
   async haltestellen() {
     const API_URL = "https://rest.busradar.conterra.de/prod";
     const response = await fetch(API_URL + '/haltestellen');
     const data = await response.json();
     pointcloud = data;
     main(point, pointcloud);
   }
   /**
    * abfahrten
    * @public
    * @desc gets the nearest bus stop by the id and then gets the time of depature for it
    * @param identifier busstop id for nearest bus stop
    * @param time in seconds
    */
   async abfahrten(identifier, time) {
     let resource = `https://rest.busradar.conterra.de/prod/haltestellen/${identifier}/abfahrten?sekunden=`;
     resource += time;
 
     const response = await fetch(resource);
     const data = await response.json();
     abfahrten = data;
 
     drawDepatureTable(abfahrten);
   }
 }
 /**
  * timeConverter
  * @desc converts the given time in seconds (hh:mm:ss)
  * @source https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
  * @param seconds time in seconds
  */
 function timeConverter(timeinseconds) {
   var miliseconds = timeinseconds * 1000 + (60000 * 120);
   var date = new Date(miliseconds)
   var convertedtime = date.toISOString().slice(11, -8);
 
   return convertedtime;
 }
 
 var busstops = new BusRadarAPI();
 /**
  * @function sortByDistance
  * @desc takes a point and an array of points and sorts them by distance ascending
  * @param point array of [lon, lat] coordinates
  * @param pointArray array of points to compare to
  * @returns Array with JSON Objects, which contain coordinate and distance
  */
 function sortByDistance(point, pointArray) {
   let output = [];
 
   for (let i = 0; i < pointArray.features.length; i++) {
     let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
     let j = 0;
     //Searches for the Place
     while (j < output.length && distance > output[j].distance) {
       j++;
     }
     let newPoint = {
       name: pointArray.features[i].properties.lbez,
       coordinates: pointArray.features[i].geometry.coordinates,
       distance: Math.round(distance),
       richtung: pointArray.features[i].properties.richtung,
       id: pointArray.features[i].properties.nr,
     };
     output.splice(j, 0, newPoint);
   }
 
   return output;
 }
 
 /**
  * @function twoPointDistance
  * @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
  * @param start array of [lon, lat] coordinates
  * @param end array of [lon, lat] coordinates
  * @returns the distance between 2 points on the surface of a sphere with earth's radius
  */
 function twoPointDistance(start, end) {
   //variable declarations
   var earthRadius; //the earth radius in meters
   var phi1;
   var phi2;
   var deltaLat;
   var deltaLong;
 
   var a;
   var c;
   var distance; //the distance in meters
 
   //function body
   earthRadius = 6371e3; //Radius
   phi1 = toRadians(start[1]); //latitude at starting point. in radians.
   phi2 = toRadians(end[1]); //latitude at end-point. in radians.
   deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
   deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.
 
   a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
   c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   distance = earthRadius * c;
 
   return distance;
 }
 
 /**
  * @function validGeoJSONPoint
  * @desc funtion that validates the input GeoJSON so it's only a point
  * @param geoJSON the input JSON that is to be validated
  * @returns boolean true if okay, false if not
  */
 function validGeoJSONPoint(geoJSON) {
   if (geoJSON.features.length == 1 &&
     geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
   ) {
     return true;
   } else {
     return false;
   }
 }
 
 /**
  * @function toRadians
  * @desc helping function, takes degrees and converts them to radians
  * @returns a radian value
  */
 function toRadians(degrees) {
   var pi = Math.PI;
   return degrees * (pi / 180);
 }
 
 /**
  * @function toDegrees
  * @desc helping function, takes radians and converts them to degrees
  * @returns a degree value
  */
 function toDegrees(radians) {
   var pi = Math.PI;
   return radians * (180 / pi);
 }
 
 /**
  * function clearTable
  * @desc removes all table entries and rows except for the header.
  * @param tableID the id of the table to clear
  */
 function clearTable(tableID) {
   //remove all table rows
   var tableHeaderRowCount = 1;
   var table = document.getElementById(tableID);
   var rowCount = table.rows.length;
   for (var i = tableHeaderRowCount; i < rowCount; i++) {
     table.deleteRow(tableHeaderRowCount);
   }
 }
 
 /**
  * @function drawTable
  * @desc inserts the calculated data into the table that's displayed on the page
  * @param {*} results array of JSON with contains
  */
 function drawTable(results) {
   var table = document.getElementById("resultTable");
   //creates the Table with the direction an distances
   for (var j = 0; j < 20; j++) {
     var newRow = table.insertRow(j + 1);
     var cel1 = newRow.insertCell(0);
     var cel2 = newRow.insertCell(1);
     var cel3 = newRow.insertCell(2);
     var cel4 = newRow.insertCell(3);
     cel1.innerHTML = results[j].name;
     cel2.innerHTML = results[j].coordinates;
     cel3.innerHTML = results[j].richtung;
     cel4.innerHTML = results[j].distance;
   }
 }
 /**
  * drawDepatureTable
  * @desc draws the table for the nearest bus stop containg the linienid as number
  * the direction as end stop and the actual depature time with date and time as YY:MM:DD:T:hh:mm:ss GMT
  * @param {*} results array of JSON with contains
  */
 function drawDepatureTable(results) {
   var table = document.getElementById("depatureTable");
   for (var j = 0; j < results.length; j++) {
     var newRow = table.insertRow(j + 1);
     var cel1 = newRow.insertCell(0);
     var cel2 = newRow.insertCell(1);
     var cel3 = newRow.insertCell(2);
     cel1.innerHTML = results[j].linienid;
     cel2.innerHTML = results[j].richtungstext;
     cel3.innerHTML = timeConverter(results[j].abfahrtszeit);
   }
 }
 /**
  * @function arrayToGeoJSON
  * @desc function that converts a given array of points into a geoJSON feature collection.
  * @param inputArray Array that is to be converted
  * @returns JSON of a geoJSON feature collectio
  */
 function arrayToGeoJSON(inputArray) {
   //"Skeleton" of a valid geoJSON Feature collection
   let outJSON = {
     "type": "FeatureCollection",
     "features": []
   };
   //skelly of a (point)feature
   let pointFeature = {
     "type": "Feature",
     "properties": {},
     "geometry": {
       "type": "Point",
       "coordinates": []
     }
   };
 
   //turn all the points in the array into proper features and append
   for (const element of inputArray) {
     let newFeature = pointFeature;
     newFeature.geometry.coordinates = element;
     outJSON.features.push(JSON.parse(JSON.stringify(newFeature)));
   }
 
   return outJSON;
 }
 
 /**
  * @function showPosition
  * @desc Shows the position of the user in the textares
  * @param {*} position Json object of the user
  */
 function showPosition(position) {
   var x = document.getElementById("userPosition");
   //"Skeleton" of a valid geoJSON Feature collection
   let outJSON = {
     "type": "FeatureCollection",
     "features": []
   };
   //skelly of a (point)feature
   let pointFeature = {
     "type": "Feature",
     "properties": {},
     "geometry": {
       "type": "Point",
       "coordinates": []
     }
   };
   pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
   //add the coordinates to the geoJson
   outJSON.features.push(pointFeature);
   x.innerHTML = JSON.stringify(outJSON);
 }
 
 var map = L.map('mapid').setView([51.961, 7.618], 12);
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 }).addTo(map);
 
 // styling for the icon for the user position
 var standortIcon = L.icon({
   iconUrl: '4/RotePinnadel.png',
   iconSize: [25, 25], // size of the icon
   iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
   popupAnchor: [13, 0] // point from which the popup should open relative to the iconAnchor
 });
 
 // styling for the icon for the bus station
 var bushaltestelleIcon = L.icon({
   iconUrl: '4/Bushaltestelle.png',
   iconSize: [25, 25], // size of the icon
   iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
   popupAnchor: [13, 0] // point from which the popup should open relative to the iconAnchor
 });
 
 /**
  * userPositionMarking
  * @desc shows user position on the map with a marker and popup
  * @param position user position from getLocation() 
  * @return coordinates as text in pop up
  */
 function userPositionMarking(position) {
   var lat = position.coords.latitude;
   var lng = position.coords.longitude;
   var marker = L.marker([lat, lng], {
     icon: standortIcon
   }).addTo(map);
   marker.bindPopup("User position: " + lat + " " + lng);
   marker.openPopup();;
   map.setView([lat, lng], 16);
 }
 
 var drawnItems = new L.FeatureGroup()
 var drawControl = new L.Control.Draw({
   draw: {
     polygon: false,
     marker: false,
     circle: false,
     polyline: false,
     circlemarker: false
   },
   edit: {
     featureGroup: drawnItems
   }
 })
 
 
 map.addLayer(drawnItems)
 map.addControl(drawControl)
 
 var polygon = [];
 map.on(L.Draw.Event.CREATED, (e) => {
   var type = e.layerType;
   var layer = e.layer;
   polygon = layer.toGeoJSON().geometry.coordinates;
   drawnItems.addLayer(layer);
   map.addLayer(layer);
 
   var haltestellenImPolygon = sortByDistance(point, pointcloud);
   for (var i = 0; i < haltestellenImPolygon.length; i++) {
 
     var poly = turf.polygon(polygon);
     var pt = turf.point(haltestellenImPolygon[i].coordinates);
 
     // checking if the coodinates from the bus stops from the array are inside the drawn polygon with turf.booleanPointInPolygon
     turf.booleanPointInPolygon(pt, poly)
     if (turf.booleanPointInPolygon(pt, poly) == true) {
       let marker = new L.marker([haltestellenImPolygon[i].coordinates[1], haltestellenImPolygon[i].coordinates[0]], {
         icon: bushaltestelleIcon
       }).addTo(map);
 
       marker.bindPopup("Name of bus stop: " + haltestellenImPolygon[i].name + "<br> coordinates: " + haltestellenImPolygon[i].coordinates +
         " <br> direction: " + haltestellenImPolygon[i].richtung + "<br> distance: " + haltestellenImPolygon[i].distance + " m")
 
     }
   }
 })