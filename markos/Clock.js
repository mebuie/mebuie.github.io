define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Clock/templates/Clock.html",
    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/extensions/ColumnHider",
    "dgrid/extensions/DijitRegistry",
    "dgrid/extensions/ColumnResizer",
    "dstore/Filter",
    "markos/_SoftwareContainer",
    "require"
], function(dom, on, declare, lang, _WidgetBase, _TemplatedMixin, template, OnDemandGrid, Keyboard, Selection,
            ColumnHider, DijitRegistry, ColumnResizer, Filter, _SoftwareContainer, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        template: template,
        baseClass: "markos-clock",

        postCreate: function () {


            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {

        }

    });

});