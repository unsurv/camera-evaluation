function deleteAllMarkers(markers) {
  for (i = 0; i < markers.length; i++) {
    map.removeLayer(markers[i]);
  }

}


function populateMap(cameras) {
  deleteAllMarkers(markers);
  markers = [];
  console.log(markers);


  for (var i = 0; i < cameras.length; i++) {
    var camera = cameras[i];
    // console.log(camera[camera.length - 2])
    // console.log(camera[camera.length - 1])

    // see csv file header for order of values
    var lat = camera[8];
    var lon = camera[9];
    var imgPath = camera[6];

    var marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);
    marker.bindPopup(
      "<b>camera</b><br>" +
      "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>" +
      "lat:" + lat + "<br>" +
      "lat:" + lon + "<br>" +
      "status:"
    );
  }

  // pan to first marker and open it
  focusView(0);
}

function focusView(positionInCamerasArray) {

  console.log("focusViewID: " + positionInCamerasArray);
  var camera = cameras[positionInCamerasArray];
  var marker = markers[positionInCamerasArray];

  var lat = marker.getLatLng().lat;
  var lon = marker.getLatLng().lng;

  marker.openPopup();
  map.setZoom(16);
  map.panTo([lat, lon]);


}

function redrawMarker(positionInCamerasArray) {

  marker = markers[positionInCamerasArray];

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
