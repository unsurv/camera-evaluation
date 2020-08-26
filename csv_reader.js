function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  } else {
    alert('FileReader are not supported in this browser.');
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  var csv = event.target.result;
  processData(csv);
}

function processData(csv) {

  cameras = [];

  var allTextLines = csv.split(/\r\n|\n/);
  // i = 1 ignores header desciption
  for (var i = 1; i < allTextLines.length; i++) {
    // individual values
    var data = allTextLines[i].split(',');

    var camera = [];
    for (var j = 0; j < data.length; j++) {
      camera.push(data[j]);
    }

    // don't add empty lines etc
    if (camera.length > 5) {
      // cameras is defined in main html
      cameras.push(camera);
    }
  }

  // add markers
  populateMap(cameras);

}

function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
    alert("Canno't read file !");
  }
}
