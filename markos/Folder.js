define([
    "dojo/dom",
    "dojo/dom-style",
    "dojo/on",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Folder/templates/Folder.html",
    "require",
    "markos/FileManager"
], function(dom, domStyle, on, declare, _WidgetBase, _TemplatedMixin, template, require, FileManager) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder",
        folderName: null,
        folderImage: require.toUrl("./Folder/images/default.png"),
        positionTop: "10px",
        positionLeft: "10px",
        desktop: null,

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;
            domStyle.set(domNode, {
                "top": this.positionTop,
                "left": this.positionLeft
            });

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);

            // Assign the thumbnail image to the folder.
            this.folderImageNode.src = this.folderImage;
        },

        startup: function() {},

        openFolder: function () {
            var openedFolder = new FileManager({
                folderId: this.folderName
            });
            if (this.configuration) {
                openedFolder.set("configuration", this.configuration);
            }
            openedFolder.placeAt(this.desktop);
            openedFolder.startup();
        }
    });

});