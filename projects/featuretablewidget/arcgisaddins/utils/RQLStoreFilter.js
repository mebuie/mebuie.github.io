define([
  'dojo/_base/declare',
  'arcgisaddins/utils/SQLtoRQL',
  'dojo/on',
  'dojo/dom',
  'dojo/query',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/form/Button',
  'dojo/_base/array'
], function (declare, SQLtoRQL, on, dom, query, BorderContainer, ContentPane, Button, array) {

  // TODO: Filter popup can no longer be reopened after destroy - add hide method.
  // TODO: Dojo _Templated was not used. Convert to this?
  // TODO: Reorganize functions - move to top?

  return declare([], {
    store: null,
    grid: null,
    isVisible: null,


    constructor: function (options) {
      this.store = options.store;
      this.grid = options.grid;
      this.isVisible = options.isVisible;
    },

    hidden: function () {
      query('.table-popup-container').style("visibility", "hidden");
      this.isVisible = false
      console.log(this.isVisible)
    },

    visible: function () {
      query('.table-popup-container').style("visibility", "visible");
      this.isVisible = true
      console.log(this.isVisible)
    },

    OperatorButtons: function (container) {

      var ApendValue = this.PopupAppendFields
      // REFERENCE: https://www.sitepen.com/blog/2009/02/25/styling-dijit-form-elements/
      // Greater than
      var gtButton = new Button({
        title: '>',
        label: '>',
        showLabel: true,
        id: 'table-popup-button-gt',
        class: 'button-operator-a',
        onClick: function () {
          var field = '>'
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Greater than or equal to
      var gteButton = new Button({
        title: '>=',
        label: '>=',
        showLabel: true,
        id: 'table-popup-button-gte',
        class: 'button-operator-a',
        onClick: function () {
          var field = '>='
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Less than
      var ltButton = new Button({
        title: '<',
        label: '<',
        showLabel: true,
        id: 'table-popup-button-lt',
        class: 'button-operator-a',
        onClick: function () {
          var field = '<'
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Less than or equal to
      var lteButton = new Button({
        title: '<=',
        label: '<=',
        showLabel: true,
        id: 'table-popup-button-lte',
        class: 'button-operator-a',
        onClick: function () {
          var field = '<='
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Equal to
      var eqButton = new Button({
        title: '=',
        label: '=',
        showLabel: true,
        id: 'table-popup-button-eq',
        class: 'button-operator-a',
        onClick: function () {
          var field = '='
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // In
      var inButton = new Button({
        title: 'field=in=(values)',
        label: 'IN',
        showLabel: true,
        id: 'table-popup-button-in',
        class: 'button-operator-b',
        onClick: function () {
          var field = '=in='
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // And
      var andButton = new Button({
        title: '&',
        label: 'AND',
        showLabel: true,
        id: 'table-popup-button-and',
        class: 'button-operator-b',
        onClick: function () {
          var field = '&'
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // OR
      var orButton = new Button({
        title: '||',
        label: 'OR',
        showLabel: true,
        id: 'table-popup-button-or',
        class: 'button-operator-b',
        onClick: function () {
          var field = '||'
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Parenthesis
      var perButton = new Button({
        label: '()',
        showLabel: true,
        id: 'table-popup-button-per',
        class: 'button-operator-a',
        onClick: function () {
          var field = '()'
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // Not equals
      var noteqButton = new Button({
        label: '!=',
        showLabel: true,
        id: 'table-popup-button-notequal',
        class: "button-operator-a",
        onClick: function () {
          var field = '!='
          var targetarea = dom.byId('table-popup-textarea')
          ApendValue(targetarea, field)
        }
      })

      // TODO: Pretty sure this is no longer needed.
      // var quoteButton = new Button({
      //   title: '\'TEXT\'',
      //   label: '\'\'',
      //   showLabel: true,
      //   id: 'table-popup-button-quote',
      //   class: 'button-operator-a',
      //   onClick: function () {
      //     var field = '\'\''
      //     var targetarea = dom.byId('table-popup-textarea')
      //     ApendValue(targetarea, field)
      //   }
      // })

      container.addChild(gtButton)
      container.addChild(gteButton)
      container.addChild(andButton)

      container.addChild(ltButton)
      container.addChild(lteButton)
      container.addChild(orButton)

      container.addChild(eqButton)
      container.addChild(noteqButton)
      container.addChild(inButton)

      container.addChild(perButton)
      // container.addChild(quoteButton)
    },

    startup: function () {
      var AppendValue = this.PopupAppendFields
      var dstore = this.store;
      var grid = this.grid;
      this.isVisible = true;
      var closeFilter = this.hidden;
      // TODO: should only startup if user sets to true

      // BEGIN FILTER POPUP LAYOUT
      PopUpBC = new BorderContainer({
        gutters: true,
        class: 'table-popup-container',
        style: 'height: 400px; width: 350px; padding: 0; margin: 0; overflow: hidden; background-color: gray; z-index: 99; position: absolute; left: 30%; top: 20%; font: 10px Myriad, Helvetica, Tahoma, Arial, clean, sans-serif;',
        id: 'table-popup-container'
      })

      var PopUpHeader = new ContentPane({
        region: 'top',
        style: 'width: 100%; height: 15px; padding: 0; margin: 0;',
        content: 'RQL Filter',
        id: 'table-popup-header'
      })

      //TODO: can no longer open filter after destroy.
      var ClosePopup = new Button({
        label: '<b>X</b>',
        showLabel: true,
        id: 'table-popup-button-destroy',
        class: 'test',
        style: 'float: right; margin: 0; border: none;',
        onClick: function () {
          // TODO: User has to click Filter button twice - How to change isVisible variable?
          closeFilter()
        }
      })

      PopUpHeader.addChild(ClosePopup)

      // create a ContentPane as the center pane in the BorderContainer
      var PopUpCenter = new ContentPane({
        region: 'center',
        id: 'table-popup-center',
        style: 'padding: 0; margin: 0;'
      })

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
        content: '<textarea id=\'table-popup-textarea\' ' +
          'style=\'width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; resize: none;\' ' +
          'placeholder="Example: Magnitude=in=(2,3)||Depth=0">'
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

      PopUpFooter.addChild(PopUpFormSubmit)

      PopUpBC.addChild(PopUpHeader)
      PopUpBC.addChild(PopUpCenter)
      PopUpBC.addChild(PopUpFeatures)
      PopUpBC.addChild(PopUpFields)
      PopUpBC.addChild(PopUpFooter)
      PopUpBC.addChild(PopUpBottom)
      PopUpBC.placeAt(document.body)
      this.OperatorButtons(PopUpCenter)
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
            var targetarea = dom.byId('table-popup-textarea')
            console.log(field)

            AppendValue(targetarea, field)
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
        var PopupUniqueAttributes = []
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
          .innerHTML = '<table id=\'table-popup-features-table\' style=\'width: 100%; cursor: copy\'></table>'

        // For each attribute in the array of unique attributes, insert the attribute in a table cell.
        array.forEach(PopupUniqueAttributes, function (field, index) {
          var PopupAttributeRow = dom.byId('table-popup-features-table').insertRow(index)
          var PopupAttributeCell = PopupAttributeRow.insertCell(0)
          PopupAttributeCell.innerHTML = field
        })

        var cells = document.getElementById('table-popup-features-table').getElementsByTagName('td')
        for (var i = 0; i <= cells.length; i++) {
          // The last element is returning undefined for some reason. Added if statement to prevent errors.
          // Need to research why this is happening.
          if (cells[i]) {
            cells[i].addEventListener('dblclick', function () {
              var field = this.textContent
              var targetarea = dom.byId('table-popup-textarea')
              console.log(field)

              AppendValue(targetarea, field)
            })
          }
        }
      }
      //END POPULATE FILTER POPUP FIELDS

      // BEGIN SUBMIT FILTER
      function PopupSubmitFilter () {
        // Get value of text area
        var userInput = dom.byId('table-popup-textarea').value

        // TODO: expand regex to convert to RQl
        var toRQL = new SQLtoRQL()

        var update = dstore.filter(toRQL.convert(userInput))

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
      }) // END REPOSITION TABLE FILTER POPUP
    }, // End startup method

    // Append the value of the double clicked field to the text area box.
    // Modified from: https://www.everythingfrontend.com/posts/insert-text-into-textarea-at-cursor-position.html
    PopupAppendFields: function (input, textToInsert) {
      // dom.byId("table-popup-textarea").innerHTML += this.textContent
      // get current text of the input
      const value = input.value
      console.log(typeof value)

      // save selection start and end position
      const start = input.selectionStart
      const end = input.selectionEnd

      // update the value with our text inserted
      input.value = value.slice(0, start) + textToInsert + value.slice(end)

      // update cursor to be at the end of insertion
      input.selectionStart = input.selectionEnd = start + textToInsert.length
    }  // END APPEND VALUES TO TEXTAREA

  }) // End declare
}) // End define