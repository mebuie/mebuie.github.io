define([
    "dojo/dom",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "markos/_SoftwareContainer",
    "dojo/_base/window",
    "require",
    "dojo/domReady!"
], function(dom, domConstruct, on, array, declare, lang, _WidgetBase, _TemplatedMixin, _SoftwareContainer,win, require) {

    // To create a widget, you need to derive from _SoftwareContainer.
    return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {
        // For _SoftwareContainer; Merges this template into the _SotwareContainer template.
        softwareBodyTemplate: null,
        baseClass: null,

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            
            this.loadCSS(this.item.parameters.css)
            
            let dom = domConstruct.toDom(this.item.parameters.softwareBodyTemplate);
            domConstruct.place(dom, this.softwareContainerBodyNode);

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            this.inherited(arguments); //_SoftwareContainer startup() will not fire without this! Position is irrelevant.
        },

        loadCSS: function(css) {
            let styleElement = domConstruct.create("style", {innerHTML: css}, win.body());
        }

    });

});