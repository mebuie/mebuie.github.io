define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_SoftwareContainer/templates/_SoftwareContainer.html",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-file-manager",

        postCreate: function () {
            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            
        },

        closeWindow() {
            this.destroy();
        }

    });

});