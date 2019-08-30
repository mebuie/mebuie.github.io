define([
    "markos/Folder",
    "markos/File",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/json",
    'dojo/text!markos/system.json',
    "dojo/on",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Desktop/templates/Desktop.html",
    "dgrid/OnDemandGrid",
    "dstore/Tree",
    "dstore/Memory",
    "require",
], function(Folder, File, dom, domStyle, JSON, System, on, array, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, TreeStore, Memory, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos",
        system: JSON.parse(System),

        postCreate: function () {

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            // Use system.json to load desktop content.
            if (this.system) {
                this.loadMarkos(this.system)
            }
        },

        loadMarkos: function (fileSystem) {

            this.createFileSystemStore(fileSystem);

            this.createWidgetStore(fileSystem.registry.widgets);

            this.loadDesktop();

            // Set golbal references to desktop and hotbar nodes.
            // Users could access these directly for use in their widgets, but
            // They will be made available through a widget mixin.
            lang.setObject("window.markos.desktopNode", this.desktopNode);
            lang.setObject("window.markos.hotbarNode", this.hotbarNode);
        },

        createFileSystemStore: function (fileSystem) {
            let data = fileSystem.fileSystem;

            let MemoryTreeStore = declare([Memory, TreeStore]);
            this.fileSystemStore = new MemoryTreeStore({
                idProperty: "id",
                data: data,
                // getRootCollection: function () {
                //     return this.root.filter({parent: null});
                //     },
                // getChildren: function (object) {
                //     return this.root.filter({parent: object.id});
                // },
                // mayHaveChildren: function (object) {
                //     return object.parent == null || object.hasChildren == true;
                // }
            });

            // Allows all widgets to have access to the fileSystemStore.
            lang.setObject("window.markos.fileSystemStore", this.fileSystemStore);
        },

        createWidgetStore: function(widgets) {
            let data = widgets;

            this.widgetStore = new Memory({ idProperty: "name", data: data});

            lang.setObject("window.markos.widgetStore", this.widgetStore)
        },

        loadDesktop: function () {

            // Get all items in the root directory.
            let rootItems = [];
            this.fileSystemStore.getRootCollection().forEach( function(item) {
                rootItems.push(item)
            });

            array.forEach(rootItems, lang.hitch(this, function(item){
                switch (item.type.toLowerCase()){
                    case "folder":
                        this.createFolder(item);
                        break;
                    case "project":
                        this.createFile(item);
                        break;
                }
            }));

        },

        createFolder: function(item) {
            let folder = new Folder({
                folderName: item.id,
                positionTop: item.positionTop,
                positionLeft: item.positionLeft,
                desktop: this.desktopNode,
            });
            folder.placeAt(this.desktopNode)
        },

        createFile: function(item) {
            let file = new File(item);
            file.placeAt(this.desktopNode)
        }
    });

});