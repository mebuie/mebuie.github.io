define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_WindowContainer/templates/_WindowContainer.html",
    "dgrid/Grid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, Grid, Keyboard, Selection, require) {

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
          let CustomGrid = declare([ Grid, Keyboard, Selection ]);

          let grid = new CustomGrid({
              columns: columns,
              // for Selection; only select a single row at a time
              selectionMode: 'single',
              // for Keyboard; allow only row-level keyboard navigation
              cellNavigation: false
          }, this.windowContentNode );
          grid.renderArray(data);
        },

        closeWindow() {
            this.destroy();
        }

    });

});