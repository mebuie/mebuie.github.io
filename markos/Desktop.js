define([
    "markos/Folder",
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
    "require",
], function(Folder, dom, domStyle, JSON, System, on, array, declare, lang, _WidgetBase, _TemplatedMixin, template, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos",
        system: JSON.parse(System),

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            // Use system.json to load desktop content.
            let desktopItems = this.system.directory;
            if (desktopItems) {
                this.loadDesktopItems(desktopItems)
            }
        },

        loadDesktopItems: function (items) {
            array.forEach(items, lang.hitch(this, function(item){
                switch (item.type){
                    case "folder":
                        this.createFolder(item);
                        break;
                    case "file":
                        break;
                }
            }));
        },

        createFolder: function(item) {
            let folder = new Folder({
                folderName: item.folderName,
                positionTop: item.positionTop,
                positionLeft: item.positionLeft,
                desktop: this.desktopNode,
                files: item.files
            });
            folder.placeAt(this.desktopNode)
        }
    });

});