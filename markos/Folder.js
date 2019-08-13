define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Folder/templates/Folder.html",
    "require",
    "markos/_WindowContainer",
], function(dom, on, declare, _WidgetBase, _TemplatedMixin, template, require, _FolderContainer) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder",
        folderName: "Untitled",
        folderImage: require.toUrl("./Folder/images/default.png"),

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);

            // Assign the thumbnail image to the folder.
            this.folderImageNode.src = this.folderImage;
        },

        startup: function() {
            // Add event handler to open folder
            var folderNode = dom.byId("folder-image");
            on(folderNode, "click", this.openFolder);

            // TODO: Add event handler to change folder name.
        },

        openFolder: function () {
            var openedFolder = new _FolderContainer();
            openedFolder.placeAt(document.body);
            openedFolder.startup();
        }
    });

});