define([
    "markos/Folder",
    "markos/Icon",
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
    "dojo/domReady!",
], function(Folder, Icon, dom, domStyle, JSON, System, on, array, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, TreeStore, Memory, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos",
        system: JSON.parse(System),

        postCreate: function () {
            // Check if browser is compatible with local storage. 
            var hasLocalStorage = this.validateLocalStorage();

            // Load system.json
            if (hasLocalStorage) {                

                this.loadSystemFile();

            } else {
                // Sorry! No Web Storage support...load default system.
                console.log("Local storage is not supported, loading default page")
                if (this.system) {
                    this.loadMarkos(this.system)
                }
            }

            // Set golbal references to desktop and hotbar nodes.
            // Users could access these directly for use in their widgets, but
            // They will be made available through a widget mixin.
            lang.setObject("window.markos.desktopNode", this.desktopNode);
            lang.setObject("window.markos.hotbarNode", this.hotbarNode);

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {

        },

        validateLocalStorage: function() {
            // Check if browser supports localstorage.
            return (typeof(Storage) !== "undefined") 
        },

        loadSystemFile: function() {

            // Check if system.json exists on localstorage and load it.
            // If it doesn't exist, load the default system.json.  
            if (localStorage.system) {

                // Replace local system.json with localstorage system.json.
                this.system = JSON.parse(localStorage.system)

                console.log("Welcome back. Let's get you back to where you left off.")

                // Load markos. 
                this.loadMarkos(this.system)

            } else {
                
                // No system.json from previous session found.
                // Load markos from default system.json. 
                console.log("Local storage enabled, but no system.json found.")
                this.loadMarkos(this.system)                        
            }
        },

        loadMarkos: function (systemObject) {

            this.createFileSystemStore(systemObject);

            this.createWidgetStore(systemObject.registry.widgets);

            this.loadDesktop();

            // For development:
            // window.markos.fileSystemStore.add({id: "test"});
            // this.saveSystem();
        },

        // TODO: Create a createStore method. 
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

            // Allows all widgets to have access to the file System Store.
            lang.setObject("window.markos.fileSystemStore", this.fileSystemStore);

            // Update system.json in localStorage when it changes. 
            // Anytime the store changes save it to local storage so parameters persist.
            // If store never updates, we can assume no changes need to be updated in local storage. 
            window.markos.fileSystemStore.on('delete, add, update', lang.hitch(this, function(event){
                this.saveSystem();
            }));
        },

        createWidgetStore: function(widgets) {
            let data = widgets;

            this.widgetStore = new Memory({ idProperty: "name", data: data});

            // Allows all widgets to have access to the widget store.
            lang.setObject("window.markos.widgetStore", this.widgetStore)

            // Update system.json in localStorage when it changes. 
            // Anytime the store changes save it to local storage so parameters persist.
            // If store never updates, we can assume no changes need to be updated in local storage.
            window.markos.widgetStore.on('delete, add, update', lang.hitch(this, function(event){
                this.saveSystem();
            }));
        },

        loadDesktop: function () {

            // Some widgets, such as the Clock in the hotbar, need to be loaded on start.
            // Search the widget store for any program widgets that need to load on start.
            this.widgetStore.filter({onStart: true}).forEach( lang.hitch(this, function(program) {
                this.loadProgram(program);
            }));

            // Get all items in the file system root directory.
            let rootItems = [];
            this.fileSystemStore.getRootCollection().forEach( lang.hitch(this, function(item) {
                // rootItems.push(item)
                this.createFile(item);
            }));

            // TODO: Switch needs to be replaced with uri lookup.
            // 
            

        },

        loadProgram: function(program) {
            let node = this.desktopNode;
            require([ program.uri ], lang.hitch(this, function(LoadedWidget){
                let newWidget = new LoadedWidget();
                // Run new widget:
                newWidget.placeAt(this[program.placeAt]);
                newWidget.startup();
            }));
        },

        // createFolder: function(item) {
        //     let folder = new Folder({
        //         id: item.id,
        //         positionTop: item.positionTop,
        //         positionLeft: item.positionLeft,
        //         desktop: this.desktopNode,
        //     });
        //     folder.placeAt(this.desktopNode)
        // },

        createFile: function(item) {
            let file = new Icon(item);
            file.placeAt(this.desktopNode)
        },

        /**
         * Convert stores to json and save to local storage.
         */
        saveSystem: async function() {
            
            this.systemUpdate = {};
            this.systemUpdate.registry = {};

            let fileSystem = await this.getStoreAsObject(window.markos.fileSystemStore);
            let widgets = await this.getStoreAsObject(window.markos.widgetStore);

            this.systemUpdate.fileSystem = fileSystem;
            this.systemUpdate.registry.widgets = widgets;

            localStorage.system = JSON.stringify(this.systemUpdate);
            localStorage.time = Date();
            
            console.log("system.json save to local storage.")
        },

        /**
         * Converts a dojo store to an object.
         * 
         * Used to get the contents of a store before passing
         * to system.json on local storage. 
         *  
         * @param  {dojo store} store a dojo store. 
         * @return {object}      an object with store contents. 
         */
        getStoreAsObject: async function(store) {
            let storeObject = store.fetch().then( function(results) {
                return results
            });

            return await storeObject
        }



    });

});