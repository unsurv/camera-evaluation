function deleteMarkers(markers) {
  for (i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }

}


function populateMap(camerasToShow, osm) {

  if (osm) {
    // osm as data source
    deleteMarkers(osmMarkers);

    console.log(camerasToShow);

    for (var i = 0; i < camerasToShow.length; i++) {
      var osmCamera = camerasToShow[i];

      var lat = osmCamera.lat;
      var lon = osmCamera.lon;
      var timestamp = osmCamera.timestamp;

      var osmIcon = L.icon({
        iconUrl: "leaflet/images/marker-icon_red.png",
        iconRetinaUrl: "leaflet/images/marker-icon-2x_red.png",
        shadowUrl: "leaflet/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      var osmMarker = L.marker([lat, lon], {
        icon: osmIcon
      }).addTo(map);
      osmMarkers.push(osmMarker);
      osmMarker.bindPopup(
        "<b>osm camera</b><br>" +
        "lat:" + lat + "<br>" +
        "lat:" + lon + "<br>" +
        "upload: " + timestamp
      );
    }

  } else {
    console.log(markers);
    deleteMarkers(markers);
    // exported csv from android as data source
    for (var i = 0; i < cameras.length; i++) {
      var csvCamera = camerasToShow[i];
      // console.log(camera[camera.length - 2])
      // console.log(camera[camera.length - 1])

      // see csv file header for order of values
      var lat = csvCamera[8];
      var lon = csvCamera[9];
      var imgPath = csvCamera[6];

      var csvMarker = L.marker([lat, lon]).addTo(map);
      markers.push(csvMarker);
      csvMarker.bindPopup(
        "<b>camera</b><br>" +
        // "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>" +
        "lat:" + lat + "<br>" +
        "lat:" + lon + "<br>" +
        "status:"
      );
    }

    console.log(markers);

    // pan to first marker and open it
    focusView(0);

  }



}

function focusView(positionInCamerasArray) {

  console.log("focusViewID: " + positionInCamerasArray);
  var camera = cameras[positionInCamerasArray];
  var tmp_marker = markers[positionInCamerasArray];


  var lat = tmp_marker.getLatLng().lat;
  var lon = tmp_marker.getLatLng().lng;

  tmp_marker.openPopup();

  map.panTo([lat, lon]);

}

function redrawMarker(positionInCamerasArray) {

  console.log(markers);

  var marker = markers[positionInCamerasArray];

  var camera = cameras[positionInCamerasArray];
  // console.log(camera[camera.length - 2])
  // console.log(camera[camera.length - 1])

  // see csv file header for order of values
  var lat = camera[8];
  var lon = camera[9];
  var imgPath = camera[6];

  var status = "";
  var len = camera.length;

  if (len == 12) {
    status = "unknown";
  } else if (camera[12] == "1") {
    // status has been set before
    status = "<br><p style=\"color:blue;\">+++APPROVED+++</p>";

  } else if (camera[10] == "0") {
    status = "<br><p style=\"color:red;\">---DO NOT UPLOAD---</p>";
  }



  marker.setPopupContent(
    "<b>camera</b><br>" +
    // "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>" +
    "lat:" + lat + "<br>" +
    "lat:" + lon + "<br>" +
    "status:" + status
  ).openPopup();


}

// download osm cameras from overpass-api.de
// this data is helpful for determining whether a datapoint already exists in the OSM database

// https://overpass-api.de/api/interpreter?data=[out:json];node[man_made=surveillance](52.5082248,13.3780064,52.515041,13.3834472);out;

function downloadOsmData() {

  var mapBounds = map.getBounds();
  var latitudeDistance = Math.abs(mapBounds.getSouth() - mapBounds.getNorth());
  var longitudeDistance = Math.abs(mapBounds.getWest() - mapBounds.getEast());
  console.log(latitudeDistance);
  console.log(longitudeDistance);

  if (latitudeDistance < 0.1 && longitudeDistance < 0.2) { // latitudeDistance ~ 10 km, // longitudeDistance changes with latitude
    var area = [mapBounds.getSouth(), mapBounds.getWest(), mapBounds.getNorth(), mapBounds.getEast()];
    console.log(area.toString());

    fetch("https://overpass-api.de/api/interpreter?data=[out:json];node[man_made=surveillance](" + area.toString() + ");out meta;")
      .then(response => response.json())
      .then(data => {
        console.log(data.elements[0]);

        osmCameras = data.elements;

        populateMap(osmCameras, true);

      });

  } else {
    alert("Please decrease mapsize!");
  }


}


function downloadCsv() {

  const types = {
    "0": "fixed",
    "1": "dome",
    "2": "panning"
  }

  const areas = {
    "0": "unknown",
    "1": "outdoor",
    "2": "public",
    "3": "indoor",
    "4": "traffic"
  }

  const mounts = {
    "0": "unknown",
    "1": "pole",
    "2": "wall",
    "3": "ceiling",
    "4": "street_lamp"
  }

  console.log(mounts["0"]);

  // var csv = 'TYPE,AREA,DIRECTION,MOUNT,HEIGHT,ANGLE,THUMBNAIL,IMAGE,LAT,LON,surveillance,UPLOAD\n';
  var csv = '\"camera:type\",\"surveillance\",\"camera:direction\",\"camera:mount\",\"height\",\"camera:angle\",\"image\",\"latitude\",\"longitude\",\"surveillance:type\",\"man_made\"\n';

  var data = cameras;

  data.forEach(function(row) {
    console.log(row);

    // camera has been approved by user
    if (row[12] == "1") {

      var processedRow = "";

      // type
      processedRow += types[row[0]] + ",";

      // area
      var area = areas[row[1]];

      if (area != "unknown") {
        processedRow += area + ",";
      } else {
        processedRow += "" + ",";
      }

      // direction
      if (row[2] != "-1") {
        processedRow += row[2] + ",";
      } else {
        processedRow += "" + ",";
      }

      // mount
      var mount = areas[row[3]];

      if (mount != "unknown") {
        processedRow += mount + ",";
      } else {
        processedRow += "" + ",";
      }

      // height
      if (row[4] != "-1") {
        processedRow += row[4] + ",";
      } else {
        processedRow += "" + ",";
      }

      // angle
      processedRow += row[5] + ",";

      // imageUrl
      processedRow += "https://unsurv.org/" + row[6] + ",";

      // latitude
      processedRow += row[8] + ",";


      // longitude
      processedRow += row[9] + ",";

      // surveillance
      processedRow += "camera";
      // man_made
      processedRow += "surveillance";

      processedRow += "\n";

      csv += processedRow;

    }

  });

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = Math.random().toString(36).substr(2, 5) + '.csv';
  hiddenElement.click();
}
