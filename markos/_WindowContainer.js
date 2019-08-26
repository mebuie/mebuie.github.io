define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_WindowContainer/templates/_WindowContainer.html",
    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/DijitRegistry",
    "dgrid/extensions/ColumnResizer",
    "dstore/Memory",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Memory, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder-container",
        configuration: null,

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            if (this.configuration) {
                console.log(this.configuration);
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
          }, this.windowContentNode );
          grid.startup();

          grid.on('.dgrid-row:click', function (event) {
            let row = grid.row(event);
            console.log('Row clicked:', row);
          });

          //TODO: Add event listener for column resize that updates the system file.
        },

        closeWindow() {
            this.destroy();
        }

    });

});