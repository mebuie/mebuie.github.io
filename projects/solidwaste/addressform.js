

var tableHeader = document.getElementById("table_header");
var tableBody = document.getElementById("table_body");


function formSubmit(event) {
  console.log("submitted")
  event.preventDefault();

  // Clear any existing address results.
  clearTable();

  // Create the URL for the REST request using the user input address.
  var streetName = document.getElementById("st_full").value;
  var url = "https://gisservices.cityofmesquite.com/gisportal/rest/services/Public/IdentifyRecycleDateByAddress/GPServer/Identify%20Recycle%20Date%20By%20Address/submitJob?f=json&address="
  var request = url + streetName

  // Make a request to the REST service.
  fetch(request).then( function( response ) {
    updateProgress(1);
    return response.json()  // Return the REST response
  }).then( function( job ) {
    updateProgress(2);
    return job.jobId  // Get the job ID
  }).then (function ( jobId) {
    // Monitor the progress of the GP service job.
    updateProgress(3);
    var checkJobInterval = setInterval( function() {

      checkJobProgress(jobId).then(function (progress) {

        switch (progress.jobStatus) {
          case "esriJobSucceeded":
            updateProgress(4);
            clearInterval(checkJobInterval)  // Stop monitoring the GP service.
            getJobResults(jobId)  // Get the results of the GP service.
            break;
          case "esriJobFailed":
            console.log("failed")
        }

      })
    }, 1000)
  })
}


function clearTable() {
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";
}


function checkJobProgress( jobId ) {
  var parameters = "?f=json"
  var jobUrl = "https://gisservices.cityofmesquite.com/gisportal/rest/services/Public/IdentifyRecycleDateByAddress/GPServer/Identify%20Recycle%20Date%20By%20Address/jobs/" + jobId + parameters

  return fetch(jobUrl).then(function (response) {
    return response.json();
  }).then(function (status) {
    return status
  })
}


function getJobResults( jobId ) {
  var url = "https://gisservices.cityofmesquite.com/gisportal/rest/services/Public/IdentifyRecycleDateByAddress/GPServer/Identify%20Recycle%20Date%20By%20Address/jobs/"
  var outputLocation = "/results/output?f=json"
  var resultsUrl = url + jobId + outputLocation

  fetch(resultsUrl).then( function( response ) {
    return response.json();
  }).then( function ( results ){
    generateTable(results)
  })
}


function generateTable( results ) {
  var fields = results.value.fields;
  var features = results.value.features;
  console.log(features)

  var excludeFields = ["OBJECTID", "DAY", "ROUTE"];
  var aliasFields = {
    "GCDAREA": "GARBAGE DATE",
    "RCDAREA": "RECYCLE DATE"
  }

  var headerRow = document.createElement('TR');
  fields.forEach( function( field ) {
    console.log(field)
    if (!excludeFields.includes(field.name)) {
      var fieldName = aliasFields[field.name] || field.alias
      var th = document.createElement('TH');
      var text = document.createTextNode(fieldName);
      th.appendChild(text)
      headerRow.appendChild(th)
    }
  });
  tableHeader.appendChild(headerRow);

  features.forEach( function ( feature ) {
    var attributes = feature.attributes

    var tableRow = document.createElement('TR');


    Object.keys(attributes).forEach( function ( attribute ) {
      if (!excludeFields.includes( attribute )) {
        var td = document.createElement('TD');
        var text = document.createTextNode(attributes[attribute]);
        td.appendChild(text)
        tableRow.appendChild(td)
      }
    });
    tableBody.appendChild(tableRow);


  });

}


function updateProgress(level) {
  var progressBarContainer = document.getElementById("progress-bar-container")
  var progressBar = document.getElementById("progress-bar");

  progressBarContainer.style.visibility = "visible";
  progressBar.classList.remove("bg-success")

  switch (level) {
    case 0:
      progressBarContainer.style.visibility = "hidden";
      break;
    case 1:
      progressBar.innerHTML = "connecting"
      progressBar.style.width = "15%"
      break;
    case 2:
      progressBar.innerHTML = "submitting job"
      progressBar.style.width = "35%"
      break;
    case 3:
      progressBar.innerHTML = "waiting on results"
      progressBar.style.width = "75%"
      break;
    case 4:
      progressBar.innerHTML = "completed"
      progressBar.style.width = "100%"
      progressBar.classList.add("bg-success")
  }
}
