define([
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/dnd/Moveable",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/_base/lang",
    "dojo/text!./Folder/templates/Folder.html",
    "require",
    "markos/FileManager",
    "dojo/domReady!"
], function(dom, domStyle, on, declare, Moveable, _WidgetBase, _TemplatedMixin, lang, template, require, FileManager) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder",
        folderName: null,
        folderImage: require.toUrl("markos/images/icons/win98_icons/directory_closed.ico"),
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
            
            on(this.dnd, "Move", lang.hitch(this, function(){
                this.hasMoved = true;
            }));

            on(this.folderClickNode, "click", lang.hitch(this, function (e) {
                
                if(!this.hasMoved) {
                    this.openFolder();
                }

                this.hasMoved = false;
            }));

        },

        startup: function() {
            // Get start x,y
            // this.positionTop = this.domNode.offsetTop
            // this.positionLeft = this.domeNode.offsetLeft
        },

        openFolder: function () {
            var openedFolder = new FileManager({
                folderId: this.folderName
            });
            openedFolder.placeAt(this.desktop);
            openedFolder.startup();
        }
    });

});