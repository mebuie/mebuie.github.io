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
    "require",
    "dojo/domReady!"
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
            // Get all of the root (parent = null) items in system.json.
            let folderContent = this.fileSystemStore.filter(
                new Filter().eq('parent', this.item.id));

            // Get the column parameters from the widget registry.
            this.parameters = this.getColumnParameters();

            // Appen formatters to column parameters 
            this.columns = this.appendFormatter();

            let CustomGrid = declare([ OnDemandGrid, Keyboard, Selection, DijitRegistry, ColumnResizer , ColumnHider]);

            // Create grid (worlds worst comment). 
            let grid = new CustomGrid({
                collection: folderContent,
                columns: this.columns,
                // for Selection; only select a single row at a time
                selectionMode: 'single',
                // for Keyboard; allow only row-level keyboard navigation
                cellNavigation: false,
                // for ColumnResizer; adjusts the last column's width to "auto"
                // adjustLastColumn: true
            }, this.fileManagerNode );
            grid.startup();

            // Add event listern to grid rows.
            grid.on('.dgrid-row:click', lang.hitch(this, function (event) {
                this.openItem(grid.row(event));
            }));

            //TODO: Add event listener for grid that updates system.json with parameters.
        },

        /**
         * Gets the dgrid column parameters from system.json. 
         * 
         * @return {dgrid object}      A dgrid column object. 
         */
        getColumnParameters: function() {
            let fileManagerRegistry = [];
            this.widgetStore.filter({name: "FileManager"}).forEach( function(e) {
                fileManagerRegistry.push(e)
            });
            return  fileManagerRegistry[0].properties.grid.headers;
        },

        /**
         * Appends a formatter method for columns that support ${} string replacement. 
         * 
         * Methods can't be stored in json, so we append them here. 
         *  
         * @return {dgrid object}      A dgrid column ojbect. 
         */
        appendFormatter: function() {

            this.parameters.forEach( lang.hitch(this, function(item) {

                switch ( item.label.toLowerCase()) {
                    case "name":
                        item.formatter = this.gridFormater
                        break;
                    
                    case "description":
                        item.formatter = this.gridFormater
                
                    default:
                        break;
                }
            }));

            return this.parameters

        },

        /**
         * Replaces ${some text} in a string with inner text. 
         * @param  {string} data a string containing ${some text}
         * @return {string}      a string with ${some text} replace. 
         */
        gridFormater: function(data) {
            const regex = /\${(.*)}/gm;
            let m;
            
            while ((m = regex.exec(data)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }             

                data = data.replace(m[0], m[1])
            }

            return data
        },

        /**
         * Opens a system.json item displayed in the FileManager widget.  
         * @param  {Item Object} item An item object from system.json.
         */
        openItem: function (item) {
            // Check Widget Registry for item type
            let result = [];
            this.widgetStore.filter({type: item.data.type}).forEach( function(e) {
                result.push(e)
            });

            // Get item object parameters.
            let parameters = Object;
            if (item.data.parameters) {
                parameters = item.data.parameters
            }

            // If the item object has an associated widget (uri), then open the widget.
            if (result[0].uri) {
                require([ result[0].uri ], function(LoadedWidget){
                    let newWidget = new LoadedWidget(parameters);
                    // Run new widget:
                    newWidget.placeAt(window.markos.desktopNode);
                    newWidget.startup();
                });
            }
        }

    });

});