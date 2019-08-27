define([
    "dojo/dom",
    "dojo/on",
    "dojo/query",
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
    "dojox/xml/parser",
    "markos/_SoftwareContainer",
    "require"
], function(dom, on, query, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Memory, xmlParser, _SoftwareContainer, require) {

    return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {
        // templateString: template,
        // baseClass: "markos-folder-tree-container",
        configuration: null,

        buildRendering: function () {
            // Parse template string into xml document using "dojox/xml/parser"
            let xml = xmlParser.parse(this.templateString);
            let xmlDoc = xml.documentElement;

            let xml2 = xmlParser.parse(template);
            let xmlDoc2 = xml2.documentElement;

            // Find target node which should be modified
            let targetNode = query("div[data-dojo-attach-point='windowContentNode']", xmlDoc)[0];

            // Create new template content using createElement, createAttribute,
            // setAttributeNode
            // let newNode = xml.createElement("button");

            // Append content to the xml template
            targetNode.appendChild(xmlDoc2);

            // Re-set the modified template string
            this.templateString = xmlParser.innerXML(xmlDoc);
            console.log(this.templateString);

            this.inherited(arguments);
        },

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

            let test = query(".markos-folder-container-body", this.templateString);
            console.log(test)
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