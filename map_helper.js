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
        "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>" +
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
  console.log(markers);
  var camera = cameras[positionInCamerasArray];
  var tmp_marker = markers[positionInCamerasArray];
  console.log(tmp_marker);

  var lat = tmp_marker.getLatLng().lat;
  var lon = tmp_marker.getLatLng().lng;

  tmp_marker.openPopup();
  map.setZoom(16);
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

  if (len == 10) {
    status = "unknown";
  } else if (camera[10] == "1") {
    // status has been set before
    status = "<br><p style=\"color:blue;\">+++APPROVED+++</p>";

  } else if (camera[10] == "0") {
    status = "<br><p style=\"color:red;\">---DO NOT UPLOAD---</p>";
  }



  marker.setPopupContent(
    "<b>camera</b><br>" +
    "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>" +
    "lat:" + lat + "<br>" +
    "lat:" + lon + "<br>" +
    "status:" + status
  ).openPopup();


}
