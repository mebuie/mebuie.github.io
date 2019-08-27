define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Project/Project.html",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-file-project",
        configuration: null,

        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            if (this.configuration) {
                console.log(this.configuration);
                this.loadContent(this.configuration)
            }
        },

        loadContent: function(config) {
            if (config.files.headers && config.files.data) {
                this.loadFileTree(config.files)
            }

        },

        closeWindow() {
            this.destroy();
        }

    });

});