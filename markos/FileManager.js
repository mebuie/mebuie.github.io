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
    "dstore/Filter",
    "markos/_SoftwareContainer",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Filter, _SoftwareContainer, require) {

    return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {
        // For _SoftwareContainer; Merges this template into the _SotwareContainer template.
        softwareBodyTemplate: template,
        baseClass: "markos-filemanager",
        folderId: null,
        parentFolderId: null,


        postCreate: function () {

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {

            this.loadFolderContent();

            this.inherited(arguments); //_SoftwareContainer startup() will not fire without this! Position is irrelevant.
        },

        loadFolderContent: function() {
            // Display all the child items of this directory.
            let folderContent = this.fileSystemStore.filter(
                new Filter().eq('parent', this.folderId));

            // Get the columns from the widget registry.
            let fileManagerRegistry = [];
            this.widgetStore.filter({name: "FileManager"}).forEach( function(e) {
                fileManagerRegistry.push(e)
            });
            let columns = fileManagerRegistry[0].properties.grid.headers;

            let CustomGrid = declare([ OnDemandGrid, Keyboard, Selection, DijitRegistry, ColumnResizer , ColumnHider]);

            let grid = new CustomGrid({
                collection: folderContent,
                columns: columns,
                // for Selection; only select a single row at a time
                selectionMode: 'single',
                // for Keyboard; allow only row-level keyboard navigation
                cellNavigation: false,
                // for ColumnResizer; adjusts the last column's width to "auto"
                // adjustLastColumn: true
            }, this.fileManagerNode );
            grid.startup();

            grid.on('.dgrid-row:click', lang.hitch(this, function (event) {
                this.openItem(grid.row(event));
            }));

            //TODO: Add event listener for column resize that updates the system file.
        },

        openItem: function (item) {
            // Opens a child file or folder on click.

            //Check Widget Registry for file type
            let result = [];
            this.widgetStore.filter({type: item.data.type}).forEach( function(e) {
                result.push(e)
            });

            // Get parameters from fileSystem
            let parameters = Object;
            if (item.data.parameters) {
                parameters = item.data.parameters
            }

            require([ result[0].uri ], function(LoadedWidget){
                let newWidget = new LoadedWidget(parameters);
                // Run new widget:
                newWidget.placeAt(window.markos.desktopNode);
                newWidget.startup();
            });




        }

    });

});