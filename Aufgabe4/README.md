Geosoftware 1 - SoSe 2022
Aufgabe 04 Abgabe: 25.05.2022, 23:59
4 Web-Maps
Konzepte: Einbinden externer Libraries (Leaflet, Leaflet-Draw, Turf.js), Asyncho- nes JS (fetch API), JSDoc
Das Ziel dieser Aufgabe ist die Darstellung der Bushaltestellen auf einer Karte. Hierfür werden externe Libraries verwendet (mehr dazu im Podcast 05).
Erweitert eure Seite um eine Leaflet-Karte (leafletjs.com/examples/quick- start), welche die Position der Bushaltestellen, sowie den Nutzerstandort anzeigt. Pop-ups sollen Informationen über die jeweilige Haltestelle beinhalten und die Entfernung zum Nutzerstandort zeigen.
Für alle API-Anfragen in dieser Übung soll nun statt dem XHR-Objekt die fetch API (siehe Podcast 04) verwendet werden.
Das Anzeigen aller Bushaltestellen resultiert in einer großen Menge von Markern. Implementiert die Möglichkeit, mit Leaflet-draw (leaflet.github.io/Leaflet.draw) eine Bounding Box zu zeichnen, mit welcher eine Auswahl von Bushaltestellen gewählt werden kann, welche alleine angezeigt werden. Verwendet die turf-js Library zur Bestimmung der Haltestellen die sich in der Auswahlbox befinden (Beispiel: turfjs.org/docs/#booleanPointInPolygon).
..................................................................
Die Aufgabe soll in Einzelarbeit bearbeitet werden. Achtet auf eine sinnvolle Strukturierung und Dokumentation des Codes.
Erstellt bitte bei Fragen oder Unklarheiten einen Forenpost im Learnweb so dass diese dort, und gegebenenfalls in der darauf folgenden Sitzung, beantwortet werden können.
Kreative Lösungsansätze und Codeschnipsel werden nominiert um in einer 5-minütigen Präsentation von den Verfassern vorgestellt zu werden. Durch die Vorstellung wird Schokolade gewonnen.
viel Erfolg.