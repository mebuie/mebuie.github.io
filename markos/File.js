define([
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/_base/window",
    "dojo/dnd/Moveable",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./File/templates/File.html",
    "require",
    "markos/FileManager",
    "dojo/domReady!"
], function(dom, domStyle, domConstruct, on, win, Moveable, lang, declare, _WidgetBase, _TemplatedMixin, template, require, FileManager) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder",
        folderName: null,
        folderImage: require.toUrl("markos/images/icons/win98_icons/file_lines.ico"),
        positionTop: null,
        positionLeft: null,
        desktop: null,
        hasMoved: false,


        postCreate: function () {

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);

            // Set position on desktop. 
            domStyle.set(this.domNode, {
                top: this.positionTop + "px",
                left: this.positionLeft + "px"
            });

            // Assign the thumbnail image to the folder.
            this.folderImageNode.src = this.folderImage;

            // Add ability to move _SoftwareContainer.
            this.dnd = new Moveable(this.domNode);

            on(this.dnd, "Move", lang.hitch(this, function() {                
                this.hasMoved = true;
            }));

            // Updates the icon position in the file system. 
            on(this.dnd, "MoveStop", lang.hitch(this, function() {

                // Get the updated position. 
                this.positionTop = domStyle.get(this.domNode, "top");
                this.positionLeft = domStyle.get(this.domNode, "left");

                // Get the item from the store.
                window.markos.fileSystemStore.get(this.id).then( lang.hitch(this, function(result){

                    // update the position. 
                    result.positionTop = this.positionTop;
                    result.positionLeft = this.positionLeft;

                    // and store the change
                    window.markos.fileSystemStore.put(this.id).then(function(){
                    // confirmation that we have succesfully saved the jim object
                    });    
                }));

            }));

            on(this.fileClickNode, "click", lang.hitch(this, function (e) {
                
                if(!this.hasMoved) {
                    this.openItem()
                }

                this.hasMoved = false;
            }));
        },

        startup: function() {
            this.inherited(arguments); //_SoftwareContainer startup() will not fire without this! Position is irrelevant.
        },

        openFolder: function () {
            var openedFolder = new FileManager({
                folderId: this.folderName
            });
            openedFolder.placeAt(this.desktop);
            openedFolder.startup();
        },

        openItem: function () {

            if (this.parameters.css) {
                this.loadCSS(this.parameters.css);
            }

            let widgetStore = window.markos.widgetStore;

            //Check Widget Registry for file type
            let result = [];
            widgetStore.filter({type: this.type}).forEach( function(e) {
                result.push(e)
            });

            require([ result[0].uri ], lang.hitch(this, function(LoadedWidget){
                let newWidget = new LoadedWidget(this.parameters);
                // Run new widget:
                newWidget.placeAt(window.markos.desktopNode);
                newWidget.startup();
            }));
        },

        loadCSS: function(css) {
            let styleElement = domConstruct.create("style", {innerHTML: css}, win.body());


        }

    });
});