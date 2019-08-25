define([
    "markos/Folder",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/json",
    'dojo/text!markos/registry.json',
    "dojo/on",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Desktop/templates/Desktop.html",
    "require",
], function(Folder, dom, domStyle, JSON, registry, on, array, declare, lang, _WidgetBase, _TemplatedMixin, template, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos",
        registry: JSON.parse(registry),

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            if (this.registry.folders) {
                var folders = this.registry.folders;
                array.forEach(folders, lang.hitch(this, function(item){
                    this.createFolder(item)
                }));
            }
        },

        createFolder: function(item) {
            var folder = new Folder({
                folderName: item.folderName,
                positionTop: item.positionTop,
                positionLeft: item.positionLeft,
                desktop: this.desktopNode,
                content: item.content
            });
            folder.placeAt(this.desktopNode)
        }
    });

});