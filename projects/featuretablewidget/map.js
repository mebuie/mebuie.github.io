// TODO Grid is overflowing passed the bottom of screen.

require([
  'dojo/_base/declare',
  'dgrid/OnDemandGrid',
  'dstore/Memory',
  'dgrid/extensions/ColumnHider',
  'dgrid/extensions/ColumnResizer',
  'dgrid/extensions/ColumnReorder',
  'dgrid/Selection',
  'dojo/_base/array',
  'esri/Map',
  'esri/WebScene',
  'esri/views/SceneView',
  'esri/WebMap',
  'esri/views/MapView',
  'esri/layers/SceneLayer',
  'esri/widgets/Legend',
  'esri/layers/FeatureLayer',
  'esri/tasks/support/Query',
  'dojo/domReady!'
], function (declare, OnDemandGrid, Memory, ColumnHider,
             ColumnResizer, ColumnReorder, Selection, array,
             Map, WebScene, SceneView, WebMap,
             MapView, SceneLayer, Legend, FeatureLayer,
             Query, dom) {

  // Layers variables
  var FeatureLayer = new FeatureLayer({
    portalItem: {
      id: '87eefb4c13c242349af2cc2b7e4df19b'
    },
    title: 'Earthquake Locations',
    popupEnabled: true
  })

  // Map variables
  var map = new Map({
    basemap: {
      portalItem: {
        id: '4f2e99ba65e34bb8af49733d9778fb8e'
      }
    },
    layers: [FeatureLayer]
  })

  var view = new MapView({
    container: 'viewDiv',
    map: map,
    center: [-20.351097, 65.108774],
    zoom: 3
  })

  // Map elements
  var legend = new Legend({
    view: view
  })

  view.ui.add(legend, 'bottom-right')

  // Create a feature table by passing a feature layer and the target div id where the grid will be rendered.
  CreateFeatureTable(FeatureLayer, "grid-wrapper");

})
