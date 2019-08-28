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
    "markos/_SoftwareContainer"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Filter, _SoftwareContainer) {

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

        },

        loadFolderContent: function() {
            // Display all the child items of this directory.
            let folderContent = this.fileSystemStore.filter(
                new Filter().eq('parent', this.folderId));

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

            grid.on('.dgrid-row:click', function (event) {
                let row = grid.row(event);
                let file = row.data;
                console.log('Row clicked:', row);
            });

            //TODO: Add event listener for column resize that updates the system file.
        }

    });

});