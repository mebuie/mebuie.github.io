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
    "dojo/text!./Icon/templates/Icon.html",
    "require",
    "markos/FileManager",
    "dojo/domReady!"
], function(dom, domStyle, domConstruct, on, win, Moveable, lang, declare, _WidgetBase, _TemplatedMixin, template, require, FileManager) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-icon",
        iconName: null,
        iconImage: null,
        positionTop: null,
        positionLeft: null,
        desktop: null,
        hasMoved: false,


        postCreate: function () {
            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
            
            if (this.icon) {
                this.iconImage = require.toUrl(this.icon);
            } else {
                console.log("icon error")
            }

            // Set position on desktop. 
            domStyle.set(this.domNode, {
                top: this.positionTop + "px",
                left: this.positionLeft + "px"
            });

            // Assign the thumbnail image to the icon.
            this.iconImageNode.src = this.iconImage;

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
                    this.openItem(this.params);
                }

                this.hasMoved = false;
            }));
        },

        startup: function() {
            this.inherited(arguments); //_SoftwareContainer startup() will not fire without this! Position is irrelevant.
        },

        /**
         * Opens a system.json item displayed in the FileManager widget.  
         * @param  {Item Object} item An item object from system.json.
         */
        openItem: function (item) {
            // Check Widget Registry for item type
            let result = [];
            window.markos.widgetStore.filter({type: item.type}).forEach( function(e) {
                result.push(e)
            });

            // If the item object has an associated widget (uri), then use it to open the widget.
            // The item properties can be accessed using this.id in the loaded widget. 
            if (result[0].uri) {
                require([ result[0].uri ], function(LoadedWidget){
                    let newWidget = new LoadedWidget({item});
                    // Run new widget:
                    newWidget.placeAt(window.markos.desktopNode);
                    newWidget.startup();
                });
            }
        },

    });
});