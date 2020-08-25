function deleteAllMarkers(markers) {
  for(i = 0; i < markers.length; i++) {
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
    var lat = camera[camera.length - 2];
    var lon = camera[camera.length - 1];
    var imgPath = camera[camera.length - 4];

    var marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);
    marker.bindPopup(
      "<b>camera</b><br>" +
      "<img style=\"width:100px;\" src=export/captures/" + imgPath + "><br>"  +
      "lat:" + lat + "<br>" +
      "lat:" + lon
    );
  }

}
