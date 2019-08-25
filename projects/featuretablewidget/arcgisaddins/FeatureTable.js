define([
  'dojo/_base/declare',
  'dstore/extensions/RqlQuery',
  'arcgisaddins/utils/MemoryStoreFilter',
  'arcgisaddins/utils/RQLStoreFilter',
  'arcgisaddins/utils/ExportCSV',
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
], function (declare, RqlQuery, MemoryStoreFilter, RQLStoreFilter, ExportCSV, on, dom, OnDemandGrid, Memory, ColumnHider, ColumnResizer, ColumnReorder, Selection, Query, BorderContainer, ContentPane, Toolbar, Button, MenuItem, array) {
  return declare([], {
    divId: null,
    layer: null,
    toolbar: true,
    exportCSV: true,
    filter: true,
    findCellWidth: false,

    constructor: function (options) {
      this.divId = options.divId || 'table-div';
      this.layer = options.layer;
      this.toolbar = options.toolbar;
      this.exportCSV = options.exportCSV;
      this.filter = options.filter;
      this.findCellWidth = options.findCellWidth
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
      var returnCellWidth = this.findCellWidth
      var printCellWidth = this.FindMaxCellWidth
      var inputLayer = this.layer



      // Query the user defined feature layer and create a dgrid from results.
      inputLayer.queryFeatures()
        .then(function (response) {

          console.log(inputLayer)
          console.log(response.features)

          // Map the feature fields to the memory store format.
          var QueryFields = array.map(response.fields, function (field) {

            return {
              field: field.name,
              label: field.alias,
            }

          })


          // BEGIN ADD CODED VALUES
          // TODO: This needs to be modulerized
          // TODO: Add user option to toggle replacement - preferably by field.
          // TODO: Dates are not being returned correcly.
          var featureAttributes = []
          var subtypes = inputLayer.types
          var subtypeField = inputLayer.typeIdField
          var fieldDomains = inputLayer.fields.filter( function ( field ) {

            return field.domain != null && field.domain.codedValues

          }).map( function ( field ) {

            return {
              field: field.name,
              codedValues: field.domain.codedValues
            }

          })


          // If a subtype exists, replace the subtype/domain codes with their coded value.
          if (subtypeField !== "" && subtypeField != null ) {
            console.log("has subtype")

            // Create an array of feature attributes, replacing the subtype id with the coded value if present.
            array.forEach(response.features, function (feature) {

              var featureRow = {}  // Empty object to take the new attributes of the feature
              var featureRowField = Object.keys(feature.attributes)  // Get the fields for the current feature.
              var subtype = subtypes.filter( function (subtype) {

                return subtype.id === feature.attributes[inputLayer.typeIdField]

              })

              var subtypeDomains = subtype[0].domains
              var subtypeCodedDomains = Object.keys(subtypeDomains).filter(function (key) {

                    return subtypeDomains[key].codedValues != null

                }).map(function(key) {

                  return {
                    // [key]: subtypeDomains[key]
                    field: key,
                    codedValues: subtypeDomains[key].codedValues
                  }
                })




              // For each field, get the corresponding attribute, replacing the subtype/domain with the coded value if present.
              // TODO: Change this to forEach()
              for (var i = 0; i < featureRowField.length; i++) {
                var currentField = featureRowField[i]

                var subtypeCodedDomain = subtypeCodedDomains.filter( function ( domain ) {
                  return domain.field === currentField
                })

                var fieldDomain = fieldDomains.filter( function ( domain ) {
                  return domain.field === currentField
                })


                // If the field has a subtype dependent domain return the domains coded value.
                if (subtypeCodedDomain.length > 0) {

                  // TODO: I tried replacing this with a for loop so we could break once the code if found, but it doesn't work for some reason.
                  array.forEach(subtypeCodedDomain[0].codedValues, function ( value ) {

                    if (feature.attributes[currentField] === value.code) {
                      featureRow[currentField] = value.name
                    }

                  })
                }

                // If the field has an assigned domain (not a subtype defined domain), replace the code with the coded value.
                else if (fieldDomain.length > 0) {

                  array.forEach(fieldDomain[0].codedValues, function ( value ) {

                    if (feature.attributes[currentField] === value.code) {
                      featureRow[currentField] = value.name
                    }

                  })

                }

                // If the field is a subtype, return the coded value.
                else if (currentField === inputLayer.typeIdField && subtype.length > 0 ) {

                  if (subtype[0].id === feature.attributes[currentField]) {
                    featureRow[currentField] = subtype[0].name
                  }

                }

                // Otherwise, make no changes to the attribute value.
                else {

                  featureRow[currentField] = feature.attributes[currentField]

                }
              }

              // Push the new feature object as a new item in the array of attributes.
              featureAttributes.push(featureRow)

            })
          }
          // If there are domains assigned to fields, but no subtype, then replace the code with the coded value.
          else if (fieldDomains && subtypes === null) {
            console.log("no subtype, but has field domain")



            // Iterate through each feature's attributes and replace any domain codes with the coded value.
            array.forEach(response.features, function (feature) {

              var featureRow = {}  // Empty object to take the new attributes of the feature
              var featureRowField = Object.keys(feature.attributes)  // Get the fields for the current feature.


              // For each field in the feature's attributes, check if it has domain
              array.forEach(featureRowField, function (field) {

                var fieldDomain = fieldDomains.filter( function ( domain ) {
                  return domain.field === field
                })

                // if a domain is present, change the code to the coded value.
                if (fieldDomain.length > 0) {

                  array.forEach(fieldDomain[0].codedValues, function ( value ) {

                    if (feature.attributes[field] === value.code) {
                      featureRow[field] = value.name

                      console.log(feature.attributes[field], "to", value.name )
                    }

                  })

                }
                // Otherwise return the original attribute value.
                else {

                  featureRow[field] = feature.attributes[field]

                }
              })
              // Push the new feature object as a new item in the array of attributes.
              featureAttributes.push(featureRow)
            })
          }
          // If there is no subtype field detected and no domains for any attributes, no manipulation of the data is
          // required and we can use the attributes from the attribute object.
          else {

            featureAttributes = array.map(response.features, function ( feature ) {
                return feature.attributes
            })

          } // END ADD CODED VALUES


          // Create the dstore.
          // The store must have a unique id column assigned or various problems will result. The default is 'id'. Here,
          // we change it to ObjectID.
          // TODO: programmatically find the id column of the feature layer and set it here - in case ObjectID or FID is used.
          var RQL = declare([ Memory, RqlQuery]);

          var DataStore = new RQL({
            data: featureAttributes,
            idProperty: 'OBJECTID',
          })


          // Create the grid.
          // TODO: ColumnReorder interferes with ColumnResizer. Make toggle button for ColumnResizer.
          var grid = new (declare([OnDemandGrid, Selection, ColumnHider, ColumnResizer, ColumnReorder]))({
            bufferRows: Infinity,
            selectionMode: 'extended',
            columns: QueryFields
          }, 'feature-table-grid')


          grid.set('collection', DataStore)


          if (returnCellWidth) {
            // TODO: Allow user to set font
            // TODO: Test if variables return correct font when user changes font through css file.
            var fontname = dom.byId('feature-table-grid').style.fontFamily
            var fontsize = dom.byId('feature-table-grid').style.fontSize
            printCellWidth(featureAttributes, fontname, fontsize)
          }


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

          on(dom.byId('feature-table-toolbar-export'), 'click', function () {
            ExportCSV().exportCSV({filename: "export.csv"}, grid.collection.data)
          })

        }) // End query layer.
    }, // End refresh method.


    // Tool for finding the max width in pixels of each dgrid column. Results are printed to console log and can be
    // used to set the css of the columns. In theory, the css could be set programmatically. However, per Dojo this is
    // not recommended as this causes severe performance issues.
    FindMaxCellWidth: function (data, fontname, fontsize) {

      var columnWidth = {}
      var columnCSS = ""
      columnWidth.tempSpan = document.createElement('span')
      columnWidth.tempSpan.style = "none"
      columnWidth.tempSpan.style.fontSize = fontsize
      columnWidth.tempSpan.style.fontFamily = fontname
      document.body.appendChild(columnWidth.tempSpan)

      console.log("using fontsize:", columnWidth.tempSpan.style.fontSize )
      console.log("using fontname:", columnWidth.tempSpan.style.fontFamily )

      var columns = Object.keys(data[0])

      array.forEach(columns, function (column) {
        columnWidth.tempSpan.innerText = column
        columnWidth.maxWidth = columnWidth.tempSpan.offsetWidth
        columnWidth.className = ".field-" + column

        array.forEach(data, function (row) {
          columnWidth.tempSpan.innerText = row[column]
          columnWidth.maxWidth = Math.max(columnWidth.maxWidth, columnWidth.tempSpan.offsetWidth )
        })

        columnCSS += String(columnWidth.className) + " {\n    width: " + String(columnWidth.maxWidth + 20) + "px\n}\n\n"

      })

      console.log(columnCSS)
    } // END FindMaxCellWidth

  }) // End declare.
}) // End define.