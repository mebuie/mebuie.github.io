define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./FileManager/templates/FileManager.html",
    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/DijitRegistry",
    "dgrid/extensions/ColumnResizer",
    "dstore/Memory",
    "markos/_SoftwareContainer"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Memory, _SoftwareContainer) {

    return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {
        // For _SoftwareContainer; Merges this template into the _SotwareContainer template.
        softwareTemplate: template,
        configuration: null,

        postCreate: function () {
            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            if (this.configuration) {
                this.loadContent(this.configuration)
            }
        },

        loadContent: function(config) {
            if (config.files.headers && config.files.data) {
                this.loadFileTree(config.files)
            }
        },

        loadFileTree: function(tree) {
          let columns = tree.headers;
          let data = tree.data;
          let CustomGrid = declare([ OnDemandGrid, Keyboard, Selection, DijitRegistry, ColumnResizer , ColumnHider]);
          let store = new Memory({idProperty: "name", data: data});

          let grid = new CustomGrid({
              collection: store,
              columns: columns,
              // for Selection; only select a single row at a time
              selectionMode: 'single',
              // for Keyboard; allow only row-level keyboard navigation
              cellNavigation: false,
              // for ColumnResizer; adjusts the last column's width to "auto"
              // adjustLastColumn: true
          }, this.fileManagerNode );
          grid.startup();

          grid.on('.dgrid-row:click', function (event) {
            let row = grid.row(event);
            let file = row.data;
            console.log('Row clicked:', row);

          });

          //TODO: Add event listener for column resize that updates the system file.
        }

    });

});