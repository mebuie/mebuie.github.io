


function CreateFeatureTable ( layer, divID ) {

  require([
    "dojo/on",
    "dojo/dom",
    "dojo/_base/declare",
    "dgrid/OnDemandGrid",
    "dstore/Memory",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/ColumnResizer",
    "dgrid/extensions/ColumnReorder",
    "dgrid/Selection",
    "esri/tasks/support/Query",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/Toolbar",
    "dijit/form/Button",
    "dijit/form/DropDownButton",
    "dijit/DropDownMenu",
    "dijit/MenuItem",
    "dojo/_base/array",
    "dojo/domReady!"
  ], function (on, dom, declare, OnDemandGrid, Memory, ColumnHider, ColumnResizer, ColumnReorder, Selection, Query, BorderContainer, ContentPane, Toolbar, Button, DropDownButton, DropDownMenu, MenuItem, array) {
    // create a BorderContainer as the top widget in the hierarchy
    var bc = new BorderContainer({
      gutters: false,
      style: "height: 100%; width: 100%;, padding: 0; margin: 0;"
    });

    var cp1 = new ContentPane({
      region: "top",
      style: "width: 100%; height: 26px; padding: 0; margin: 0;",
      content: "<span id='test'></span>",
      id: "feature-table-options"
    });
    bc.addChild(cp1);

    // create a ContentPane as the center pane in the BorderContainer
    var cp2 = new ContentPane({
      region: "center",
      id: "feature-table-grid",
      style: "height: 100%; width: 100%; padding: 0; margin: 0;"

    });
    bc.addChild(cp2);
    bc.placeAt("grid-wrapper");
    bc.startup();

    //Create a toolbar above the dgrid and add some buttons.
    var toolbar = new Toolbar({
      id: "feature-table-toolbar",
      style: "padding: 0; padding-left: 2px; padding-right: 2px; margin: 0;"
    }, "test");

    // TODO iconClass is not behaving as expected. Should be displaying grayed out icon, but it's in color.
    var FilterButton = new Button({
      label: "Filter",
      showLabel: true,
      iconClass: "dijitDisabled dijitIconFilter",
      id: "feature-table-toolbar-filter",
    });

    var CSVButton = new Button({
      label: "Export all to CSV",
      showLabel: true,
      iconClass: "dijitEditorIcon dijitEditorIconUndo",
      id: "feature-table-toolbar-export",
      style: "float: right;"
    });

    toolbar.addChild(FilterButton);
    toolbar.addChild(CSVButton);
    toolbar.startup();

    var FilterButtonID = dom.byId("feature-table-toolbar-filter")
    on(FilterButtonID, "click", function (event) {
      console.log(event);
      FilterFeatureTable()
    });

    var CSVButtonID = dom.byId("feature-table-toolbar-export")
    on(CSVButtonID, "click", function (event) {
      console.log(event);
      ExportToCSV()
    });

    layer.queryFeatures()
      .then(function (response) {
        console.log(response)

        //Map the fields to dgrid format.
        var QueryFields = array.map(response.fields, function (field) {
          return {
            field: field.name,
            label: field.alias
          }
        })

        var TableFeatures = []
        array.forEach(response.features, function (feature) {

          var TableAttributes = {}
          var TableFields = Object.keys(feature.attributes)

          for (var i = 0; i < TableFields.length; i++) {
            TableAttributes[TableFields[i]] = feature.attributes[TableFields[i]]
          }

          TableFeatures.push(TableAttributes)
        })

        console.log(TableFeatures)

        //The store must have a unique id column. The default is 'id'.
        // TODO: programmatically find the id column of the feature layer and set it here - in case ObjectID or FID.
        var DataStore = new Memory({
          data: TableFeatures,
          idProperty: "OBJECTID",
        })

        // TODO: the grid auto adjusts columns to fit div. This can cause things to get squished. Find way to scroll horizontally.
        // TODO: ColumnReorder interferes with ColumnResizer. Make toggle button for ColumnResizer.
        var grid = new (declare([OnDemandGrid, Selection, ColumnHider, ColumnResizer, ColumnReorder]))({
          bufferRows: Infinity,
          selectionMode: 'extended',
          columns: QueryFields
        }, divID)

        grid.set('collection', DataStore)

      })

    function ExportToCSV(event){
      alert("Oops, still working on this feature...");
    }

    function FilterFeatureTable(event){
      alert("Oops, still working on this feature...");
    }
  });
}