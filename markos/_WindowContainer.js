define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_WindowContainer/templates/_WindowContainer.html",
    "dgrid/Grid",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, Grid, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder-container",
        files: null,

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            if (this.files) {
                this.loadContent(this.files)
            }
        },

        loadContent: function(data) {
            var gridTemplate = ""

        },

        closeWindow() {
            this.destroy();
        }

    });

});