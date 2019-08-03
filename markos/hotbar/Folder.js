define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Folder/templates/Folder.html",
    "require",
], function(declare, _WidgetBase, _TemplatedMixin, template, require) {

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

            this.folderImageNode.src = this.folderImage;
        }
    });

});