// TODO: Add array of options to function (gutters, input fields, indexid, default sort field for grid).
// TODO: Add ability to select features and have them hilighted in table / also the reverse - map to highlight feature.
// TODO: Test domains and subtypes.
// TODO: Test table horizontal overun.

function CreateFeatureTable (layer, divID) {

  require([
    'dojo/on',
    'dojo/dom',
    'dojo/_base/declare',
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
    'dijit/form/DropDownButton',
    'dijit/DropDownMenu',
    'dijit/MenuItem',
    'dojo/_base/array',
    'dojo/domReady!'
  ], function (on, dom, declare, OnDemandGrid, Memory, ColumnHider, ColumnResizer, ColumnReorder, Selection, Query, BorderContainer, ContentPane, Toolbar, Button, DropDownButton, DropDownMenu, MenuItem, array) {

    // BEGIN LAYOUT...
    // Creates the containers that will house the dgrid. A border container is created with a child top and center
    // content pane, which is placed inside the user defined divID. The the top content pane is the container for the
    // dgrid toolbar, which has the filter,export to CSV, and any future option icons. The center content pane is the
    // container for the dgrid.
    // TODO: HTML elements need to be in their own function, so that they are only created once when table refresh is implemented.
    // TODO: Add attribute table reset button to popup
    // TODO: Add refresh button in case user updates definition query - can this be an event listener?
    var bc = new BorderContainer({
      gutters: false,
      style: 'height: 100%; width: 100%;, padding: 0; margin: 0;',
      id: 'feature-table-container'
    })

    var cpTop = new ContentPane({
      region: 'top',
      style: 'width: 100%; height: 26px; padding: 0; margin: 0;',
      content: '<span id=\'test\'></span>',
      id: 'feature-table-options'
    })

    // create a ContentPane as the center pane in the BorderContainer
    var cpCenter = new ContentPane({
      region: 'center',
      id: 'feature-table-grid',
      style: 'height: 100%; width: 100%; padding: 0; margin: 0;'

    })
    bc.addChild(cpTop)
    bc.addChild(cpCenter)
    bc.placeAt(divID) //divID defined by user from function parameter.
    bc.startup()

    //Create a toolbar above the dgrid and add some buttons.
    var toolbar = new Toolbar({
      id: 'feature-table-toolbar',
      style: 'padding: 0; padding-left: 2px; padding-right: 2px; margin: 0;'
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
    // END LAYOUT.


    // BEGIN CREATE TABLE
    // Query the user defined feature layer, then map the response to the correct dstore/dgrid formats.
    layer.queryFeatures()
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
        var DataStore = new  Memory({
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

        on(dom.byId('feature-table-toolbar-filter'), 'click', function (event) {
          // FilterFeatureTable(DataStore, grid)
          FilterTablePopup(DataStore, grid)
        })
      })
    // END CREATE TABLE

    // BEGIN EXPORT TO CSV
    function ExportToCSV (event) {
      alert('Oops, still working on this feature...')
    }
    // END EXPORT TO CSV


    // BEGIN FILTER TABLE POPUP
    // TODO: Style title
    // TODO: Add attribute table reset button to popup
    // TODO: All attributes are being converted to string, which makes it impossible to dynamically add single quotes - necessary for query builder.
    // A GUI that is created when the user clicks the Filter button and allows the user to filter the results of the
    // dgrid.
    function FilterTablePopup (dstore, grid) {
      console.log(dstore)
      // BEGIN FILTER POPUP LAYOUT
      PopUpBC = new BorderContainer({
        gutters: true,
        style: 'height: 400px; width: 350px;, padding: 0; margin: 0; overflow: hidden; background-color: gray; z-index: 99; position: absolute; left: 30%; top: 20%; font: 10px Myriad, Helvetica, Tahoma, Arial, clean, sans-serif;',
        id: 'table-popup-container'
      })

      var PopUpHeader = new ContentPane({
        region: 'top',
        style: 'width: 100%; height: 15px; padding: 0; margin: 0;',
        content: 'Dojo Collection Filter',
        id: 'table-popup-header'
      })

      var ClosePopup = new Button ({
        label: '<b>X</b>',
        showLabel: true,
        id: 'table-popup-button-destroy',
        class: "test",
        style: 'float: right; margin: 0; border: none;',
        onClick: function () {
          PopUpBC.destroy()
        }
      })

      PopUpHeader.addChild(ClosePopup);

      // create a ContentPane as the center pane in the BorderContainer
      var PopUpCenter = new ContentPane({
        region: 'center',
        id: 'table-popup-center',
        style: 'padding: 0; margin: 0;'

      })

      // REFERENCE: https://www.sitepen.com/blog/2009/02/25/styling-dijit-form-elements/
      var gtButton = new Button({
        title: ".gt( field, value )",
        label: '>',
        showLabel: true,
        id: 'table-popup-button-gt',
        class: "button-operator-a",
        // onClick: function () {
        //         //   dom.byId("table-popup-textarea").value += ".gt( , )"
        //         // }
        onClick: function () {
          var field = ".gt( , )"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      var gteButton = new Button({
        title: ".gte( field, value )",
        label: '>=',
        showLabel: true,
        id: 'table-popup-button-gte',
        class: "button-operator-a",
        onClick: function () {
          var field = ".gte( , )"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      var ltButton = new Button({
        title: ".lt( field, value )",
        label: '<',
        showLabel: true,
        id: 'table-popup-button-lt',
        class: "button-operator-a",
        onClick: function () {
          var field = ".lt( , )"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      var lteButton = new Button({
        title: ".lte( field, value )",
        label: '<=',
        showLabel: true,
        id: 'table-popup-button-lte',
        class: "button-operator-a",
        onClick: function () {
          var field = ".lte( , )"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      var eqButton = new Button({
        title: ".eq( field, value )",
        label: '=',
        showLabel: true,
        id: 'table-popup-button-eq',
        class: "button-operator-b",
        onClick: function () {
          var field = ".eq( , )"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      // TODO: Add title with tip
      var inButton = new Button({
        label: 'IN',
        showLabel: true,
        id: 'table-popup-button-in',
        class: "button-operator-b",
      })

      // TODO: Add title with tip
      // TODO: Not needed until new filter engine implemented.
      var andButton = new Button({
        label: 'AND',
        showLabel: true,
        id: 'table-popup-button-and',
        class: "button-operator-b"
      })

      // TODO: Add title with tip
      // TODO: Not needed until new filter engine implemented.
      var orButton = new Button({
        label: 'OR',
        showLabel: true,
        id: 'table-popup-button-or',
        class: "button-operator-b"
      })

      // TODO: Not needed until new filter engine implemented.
      // var perButton = new Button({
      //   label: '()',
      //   showLabel: true,
      //   id: 'table-popup-button-per',
      // })

      // TODO: Not needed until new filter engine implemented.
      // var noteqButton = new Button({
      //   label: '<>',
      //   showLabel: true,
      //   id: 'table-popup-button-notequal',
      //   class: "button-operator-a"
      // })

      var quoteButton = new Button({
        title: "'TEXT'",
        label: "''",
        showLabel: true,
        id: 'table-popup-button-quote',
        class: "button-operator-a",
        onClick: function () {
          var field = "''"
          var targetarea = dom.byId("table-popup-textarea")
          console.log(field)
          PopupAppendFields(targetarea, field)
        }
      })

      PopUpCenter.addChild(gtButton);
      PopUpCenter.addChild(gteButton);
      PopUpCenter.addChild(inButton);
      // PopUpCenter.addChild(andButton);
      PopUpCenter.addChild(ltButton);
      PopUpCenter.addChild(lteButton);
      // PopUpCenter.addChild(orButton);
      // PopUpCenter.addChild(noteqButton);

      PopUpCenter.addChild(eqButton);
      // PopUpCenter.addChild(perButton);
      PopUpCenter.addChild(quoteButton);


      var PopUpFeatures = new ContentPane({
        region: 'right',
        id: 'table-popup-features',
        style: 'width: 30%; padding: 0; margin: 0;',
      })

      var PopUpFields = new ContentPane({
        region: 'right',
        id: 'table-popup-fields',
        style: 'width: 30%; padding: 0; margin: 0;',
        content: '<table id=\'table-popup-fields-table\' style=\'width: 100%; cursor: copy\'></table>'
      })

      var PopUpBottom = new ContentPane({
        region: 'bottom',
        id: 'table-popup-bottom',
        style: 'height: 15%; width: 100%; padding: 0; margin: 0; overflow: hidden;',
        content: "<textarea id='table-popup-textarea' " +
          "style='width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; resize: none;' " +
          "placeholder=\"EXAMPLE .eq('FIELD','TEXT').gt('FIELD',INT)\">"
      })

      var PopUpFooter = new ContentPane({
        region: 'bottom',
        id: 'table-popup-footer',
        style: 'height: 25px; width: 100%; padding: 0; margin: 0; overflow: hidden;',
      })

      var PopUpFormSubmit = new Button({
        label: 'FILTER',
        showLabel: true,
        id: 'table-popup-button-filter',
        style: 'float: right;',
        onClick: PopupSubmitFilter
      })

      PopUpFooter.addChild(PopUpFormSubmit);

      PopUpBC.addChild(PopUpHeader)
      PopUpBC.addChild(PopUpCenter)
      PopUpBC.addChild(PopUpFeatures)
      PopUpBC.addChild(PopUpFields)
      PopUpBC.addChild(PopUpFooter)
      PopUpBC.addChild(PopUpBottom)
      PopUpBC.placeAt(document.body)
      PopUpBC.startup()
      // END FILTER POPUP LAYOUT


      // BEGIN POPULATE FILTER POPUP FIELDS
      // An array of fields in the dstore.
      var PopupFields = Object.keys(dstore.data[0])
      // For each field in the array, insert the field in a table cell.
      array.forEach(PopupFields, function (field, index) {
        var PopupFieldsRow = dom.byId('table-popup-fields-table').insertRow(index)
        var PopupFieldsCell = PopupFieldsRow.insertCell(0)
        PopupFieldsCell.innerHTML = field
      })

      // TODO: Rename  variables.
      // TODO: Is there a dojo way to accomplish this?
      // Create event listeners on the cells of the popup filter. When the user clicks once a table of unique attributes
      // for that field is created. When the user double clicks, the field name is passed to the textarea box to create
      // the query.
      var cells = document.getElementById('table-popup-fields-table').getElementsByTagName('td')
      for (var i = 0; i <= cells.length; i++) {
        // The last element is returning undefined for some reason. Added if statement to prevent errors.
        // Need to research why this is happening.
        if (cells[i]) {
          cells[i].addEventListener('click', PopupFindDistinctAttributes)
          cells[i].addEventListener('dblclick', function () {
            var field = this.textContent
            var targetarea = dom.byId("table-popup-textarea")
            console.log(field)

            PopupAppendFields(targetarea, field)
          })
        }
      }

      // Find the distinct attributes of the clicked field and append them to the filter popup attribute dom.
      // TODO: None numeric quotes need to be in quotes.
      function PopupFindDistinctAttributes () {

        // Get the value of the clicked field.
        var PopupField = this.textContent

        // Create an array of unique attributes for the clicked field.
        // This could be done using an RQL Distincty query, but having trouble setting up.
        var PopupUniqueAttributes = [];
        array.forEach(dstore.data, function (row, index) {
          if (PopupUniqueAttributes.includes(row[PopupField]) === false) {
            PopupUniqueAttributes.push(row[PopupField])
          }
        })
        // TODO: User should have option to toggle sort.
        // TODO: Fix sorting on numeric values.
        // Sort the unique attributes alphabetically.
        PopupUniqueAttributes.sort()

        // Create the initial table where the unique attributes will be appended as rows.
        // Also clears any previous queries.
        dom.byId('table-popup-features')
          .innerHTML = "<table id='table-popup-features-table' style='width: 100%; cursor: copy'></table>"

        // For each attribute in the array of unique attributes, insert the attribute in a table cell.
        array.forEach(PopupUniqueAttributes, function (field, index) {
          var PopupAttributeRow = dom.byId('table-popup-features-table').insertRow(index);
          var PopupAttributeCell = PopupAttributeRow.insertCell(0);
          PopupAttributeCell.innerHTML = field
        })

        var cells = document.getElementById('table-popup-features-table').getElementsByTagName('td')
        for (var i = 0; i <= cells.length; i++) {
          // The last element is returning undefined for some reason. Added if statement to prevent errors.
          // Need to research why this is happening.
          if (cells[i]) {
            cells[i].addEventListener('dblclick', function () {
              var field = this.textContent
              var targetarea = dom.byId("table-popup-textarea")
              console.log(field)

              PopupAppendFields(targetarea, field)
            })
          }
        }
      }
      //END POPULATE FILTER POPUP FIELDS


      // BEGIN APPEND VALUES TO TEXTAREA
      // Append the value of the double clicked field to the text area box.
      // Modified from: https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
      function PopupAppendFields (input, textToInsert) {
        // dom.byId("table-popup-textarea").innerHTML += this.textContent
        // get current text of the input
        const value = input.value;
        console.log(typeof value);

        // save selection start and end position
        const start = input.selectionStart;
        const end = input.selectionEnd;

        // update the value with our text inserted
        input.value = value.slice(0, start) + textToInsert + value.slice(end);

        // update cursor to be at the end of insertion
        input.selectionStart = input.selectionEnd = start + textToInsert.length;
      }
      // END APPEND VALUES TO TEXTAREA


      // BEGIN SUBMIT FILTER
      // TODO: Change filter to RQL once I figure it out...
      function PopupSubmitFilter () {
        // Get value of text area
        var query = dom.byId("table-popup-textarea").value

        // TODO: Fix evil code
        // TODO: Use regex to parse from SQL
        // I know this is evil code, but it's the only way I know how to accomplish this right now...
        var filter = new dstore.Filter()

        var parameters = eval("filter" + query)
        console.log("parameters", parameters)

        var update = dstore.filter(parameters)

        grid.set('collection', update)
      }
      // END SUBMIT FILTER


      //BEGIN REPOSITION TABLE FILTER POPUP
      // Allows the user to reposition the table filter popup by dragging.
      // Code modified from https://stackoverflow.com/questions/24050738/javascript-how-to-dynamically-move-div-by-clicking-and-dragging
      // TODO: Putting the event listener on the container allows the user to drag an click anywhere in the popup to reposition, but prevents the user from highlight text. Need to add a moving box in top corner.
      // TODO: Add on mouseover to display moving box in top corner
      var PopupContainer = dom.byId('table-popup-container')
      var PopupMousePosition
      var mouseIsDown = false
      var PopupOffsets = [0, 0]

      on(PopupContainer, 'mousedown', function (e) {
        mouseIsDown = true
        PopupOffsets = [
          PopupContainer.offsetLeft - e.clientX,
          PopupContainer.offsetTop - e.clientY
        ]
      })

      // TODO: On mouseup reposition the popup
      on(PopupContainer, 'mouseup', function (e) {
        mouseIsDown = false
      })

      on(PopupContainer, 'mousemove', function (e) {
        e.preventDefault()

        if (mouseIsDown) {
          PopupMousePosition = {
            x: e.clientX,
            y: e.clientY
          }
          PopupContainer.style.left = (PopupMousePosition.x + PopupOffsets[0]) + 'px'
          PopupContainer.style.top = (PopupMousePosition.y + PopupOffsets[1]) + 'px'
        }
      })
      // END REPOSITION TABLE FILTER POPUP
    }
    // END FEATURE TABLE POPUP
  })
}