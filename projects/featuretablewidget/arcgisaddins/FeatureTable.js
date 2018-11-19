define([
  'dojo/_base/declare',
  'dstore/extensions/RqlQuery',
  'arcgisaddins/utils/MemoryStoreFilter',
  'arcgisaddins/utils/RQLStoreFilter',
  'dojo/on',
  'dojo/dom',
  'dgrid/OnDemandGrid',
  'dstore/Memory',
  // 'dstore/extensions/RqlQuery', //Not finding a requred module.
  'dgrid/extensions/ColumnHider',
  'dgrid/extensions/ColumnResizer',
  'dgrid/extensions/ColumnReorder',
  'dgrid/Selection',
  'esri/tasks/support/Query',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/Toolbar',
  'dijit/form/Button',
  'dijit/MenuItem',
  'dojo/_base/array',
], function (declare, RqlQuery, MemoryStoreFilter, RQLStoreFilter, on, dom, OnDemandGrid, Memory, ColumnHider, ColumnResizer, ColumnReorder, Selection, Query, BorderContainer, ContentPane, Toolbar, Button, MenuItem, array) {
  return declare([], {
    divId: null,
    layer: null,
    toolbar: true,
    exportCSV: true,
    filter: true,

    constructor: function (options) {
      this.divId = options.divId || 'table-div';
      this.layer = options.layer;
      this.toolbar = options.toolbar;
      this.exportCSV = options.exportCSV;
      this.filter = options.filter;
    },

    startup: function () {
      // BEGIN LAYOUT...
      // Creates the containers that will house the dgrid. A border container is created with a child top and center
      // content pane, which is placed inside the user defined divID. The the top content pane is the container for the
      // dgrid toolbar, which has the filter,export to CSV, and any future option icons. The center content pane is the
      // container for the dgrid.
      // TODO: Filter popup can no longer be reopened after destroy.
      // TODO: Add attribute table reset button to popup
      // TODO: Add refresh button to toolbar
      // TODO: Move popup to new module
      // TODO: Add toggle toolbar constructor.

      var cpTop = new ContentPane({
        region: 'top',
        splitter: false,
        style: 'width: 100%; height: 26px; padding: 0; margin: 0;',
        content: "<span id='test'</span>",
        id: 'feature-table-options'
      })

      // create a ContentPane as the center pane in the BorderContainer
      var cpCenter = new ContentPane({
        region: 'center',
        splitter: false,
        id: 'feature-table-grid',
        style: 'height: 100%; width: 100%; padding: 0; margin: 0; font: 10px Myriad, Helvetica, Tahoma, Arial, clean, sans-serif;'

      })
      cpTop.placeAt(this.divId)
      cpCenter.placeAt(this.divId)
      // bc.placeAt(this.divId) //divID defined by user from function parameter.
      // bc.startup()

      //Create a toolbar above the dgrid and add some buttons.
      var toolbar = new Toolbar({
        id: 'feature-table-toolbar',
        style: 'padding: 0; padding-left: 2px; padding-right: 2px; margin: 0; font: 10px Myriad, Helvetica, Tahoma, Arial, clean, sans-serif;'
      }, 'test')

      // TODO iconClass is not behaving as expected. Should be displaying grayed out icon, but it's in color.
      var FilterButton = new Button({
        label: 'Filter',
        showLabel: true,
        iconClass: 'dijitDisabled dijitIconFilter',
        id: 'feature-table-toolbar-filter',
      })

      var CSVButton = new Button({
        label: 'Export all to CSV',
        showLabel: true,
        iconClass: 'dijitEditorIcon dijitEditorIconUndo',
        id: 'feature-table-toolbar-export',
        style: 'float: right;'
      })

      toolbar.addChild(FilterButton)
      toolbar.addChild(CSVButton)
      toolbar.startup()

      this.refresh()
      // END LAYOUT.
    },

    refresh: function() {

      // BEGIN CREATE GRID
      // Query the user defined feature layer, then map the response to the correct dstore/dgrid formats.
      this.layer.queryFeatures()
        .then(function (response) {

          //Map the fields to the correct format.
          var QueryFields = array.map(response.fields, function (field) {
            return {
              field: field.name,
              label: field.alias
            }
          })

          // Map the attributes to the correct format.
          // For each feature in the layer, we get the fields for that feature using object.keys. Then, for each key we
          // find the corresponding attribute and add the resulting field:attribute object pair to TableAttributes. Once
          // all field:attributes object pairs are added for the feature, the TableAttribute object is pushed to the
          // TableFeature array, which is passed to the dgrid collection.
          var TableFeatures = []
          array.forEach(response.features, function (feature) {

            // field:attribute object pairs. Resets after each feature in the feature layer.
            var TableAttributes = {}

            // Get the fields for the feature.
            var TableFields = Object.keys(feature.attributes)

            // For each field, get the corresponding attribute and add the field:attribute object pair to TableAttributes.
            for (var i = 0; i < TableFields.length; i++) {
              TableAttributes[TableFields[i]] = feature.attributes[TableFields[i]]
            }

            // Once all field:attribute object pairs are added to TableAttributes, push the object to TableFeatures.
            TableFeatures.push(TableAttributes)
          })

          // Create the dstore.
          // The store must have a unique id column assigned or various problems will result. The default is 'id'. Here,
          // we change it to ObjectID.
          // TODO: programmatically find the id column of the feature layer and set it here - in case ObjectID or FID is used.
          var RQL = declare([ Memory, RqlQuery]);

          var DataStore = new RQL({
            data: TableFeatures,
            idProperty: 'OBJECTID',
          })

          // Create the grid.
          // TODO: the grid auto adjusts columns to fit div. This can cause things to get squished. Find way to scroll horizontally.
          // TODO: ColumnReorder interferes with ColumnResizer. Make toggle button for ColumnResizer.
          var grid = new (declare([OnDemandGrid, Selection, ColumnHider, ColumnResizer, ColumnReorder]))({
            bufferRows: Infinity,
            selectionMode: 'extended',
            columns: QueryFields
          }, 'feature-table-grid')

          grid.set('collection', DataStore)

          // TODO: Add option to choose between filters / datastores?
          var FilterPopUp = new RQLStoreFilter({
            store: DataStore,
            grid: grid
          })

          var FilterStartup = false

          on(dom.byId('feature-table-toolbar-filter'), 'click', function (event) {

            if (FilterStartup == false) {
              FilterPopUp.startup()
              FilterStartup = true

            } else if (FilterPopUp.isVisible == true && FilterStartup == true) {
              FilterPopUp.hidden()
              console.log(FilterPopUp.isVisible)

            } else if (FilterPopUp.isVisible == false && FilterStartup == true) {
              FilterPopUp.visible()
              console.log(FilterPopUp.isVisible)
            }
          })

        }) // End query layer.
    } // End refresh method.
  }) // End declare.
}) // End define.