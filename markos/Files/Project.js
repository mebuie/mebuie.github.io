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
    "require"
], function(dom, domConstruct, on, array, declare, lang, _WidgetBase, _TemplatedMixin, _SoftwareContainer, require) {

    // To create a widget, you need to derive from _SoftwareContainer.
    return declare([_SoftwareContainer, _WidgetBase, _TemplatedMixin], {
        // For _SoftwareContainer; Merges this template into the _SotwareContainer template.
        baseClass: null,
        softwareBodyTemplate: null,

        buildRendering: function () {

            // let template2 = "dojo/text!" + "./markos/data/projects/MultiCriteria/multicriteria.html";
            //
            // require([ template2 ], lang.hitch(this, function(LoadedWidget){
            //     this.softwareBodyTemplate = LoadedWidget;
            // }));
            //
            //
            // console.log(this.softwareBodyTemplate);

            this.inherited(arguments);
        },

        postCreate: function () {

            console.log(this.iframe);
            if (this.iframe) {
                array.forEach(this.iframe, lang.hitch(this, function(iframe) {
                    let dom = domConstruct.toDom(iframe.link);
                    console.log(iframe.attachPoint)
                    domConstruct.place(dom, this[iframe.attachPoint]);
                }))
            }






            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
        }

    });

});