//TODO Change size of BikeStop icon.
//TODO Add counts to BikeStop feature class and render by count.
//TODO Add slider to top-right so user can filter by route counts.
//TODO Add info, help tool, and explanations.

require([
    "esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
    "esri/tasks/support/Query",
    "modules/HelpUI"
], function (Map, WebMap, MapView, Legend, FeatureLayer, Query, HelpUI) {


    //Layers variables
    var BikeStart = new FeatureLayer({
        portalItem: {
            id: "85a049a51f654c8e8432679caf60d14f"
        },
        title: "Query Stations",
        popupEnabled: false,
        legendEnabled: false
    });

    var BikeStop = new FeatureLayer({
        portalItem: {
            id: "5cf9d9d7e7384fa5a4c31bc0b75c9a39"
        },
        title: "Destination Stations",
        visible: false,
        popupEnabled: false,
        legendEnabled: false
    });

    var BikeRoutes = new FeatureLayer({
        portalItem: {
            id: "db58676c14d449c19f5b8d52d731caec"
        },
        title: "Bike Routes",
        visible: false,
        popupEnabled: false
    });

    // Map variables
    var map = new WebMap({
        portalItem: {
            id: "422c2455f3f24024b60b12868dcf4ecd"
        },
        layers: [ BikeRoutes, BikeStop, BikeStart ]
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-71.092261, 42.344404],
        zoom: 14
    });

    var hintUI = new HelpUI();

    view.ui.add(hintUI, "top-right");

    view.on("click", function (event) {
        view.hitTest(event)
            .then(function (response) {
                var BikeStartGraphic = response.results.filter(function(result){
                    return result.graphic.layer === BikeStart;
                });

                var BikeStartStationID = BikeStartGraphic[0].graphic.attributes.start_stat;

                BikeRoutes.definitionExpression = "bluebikes_ = " + BikeStartStationID;

                var BikeRoutesQuery = BikeRoutes.createQuery();
                BikeRoutesQuery.where = "bluebikes_ = " + BikeStartStationID;
                BikeRoutesQuery.outFields = [ "bluebikes1" ];
                BikeRoutesQuery.returnDistinctValues = true;

                BikeRoutes.queryFeatures(BikeRoutesQuery)
                    .then(function(response){
                        var BikeRoutesQueryResults = [];

                        response.features.forEach(function(result){
                            BikeRoutesQueryResults.push(result.attributes.bluebikes1);
                        });

                        BikeStop.definitionExpression = "end_statio IN ( " + BikeRoutesQueryResults.toString() + ")";
                        BikeStop.visible = true;
                        BikeRoutes.visible = true;
                    });
        });
    });
});

