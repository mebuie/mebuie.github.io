define([
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_SoftwareContainer/templates/_SoftwareContainer.html",
    "dojox/xml/parser",
], function(dom, domClass, domConstruct, on, query, declare, lang, _WidgetBase, _TemplatedMixin, template, xmlParser) {

    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: null,
        templateString: template,
        softwareContainerClass: "markos-softwarecontainer",
        softwareBodyTemplate: null,
        softwareHeaderTemplate: null,
        fileSystemStore: null,
        widgetStore: null,

        buildRendering: function () {

            // Used to merger a custom widget template into this template'
            if (this.softwareHeaderTemplate) {
                this.loadTemplateString("softwareContainerHeaderNode", this.softwareHeaderTemplate);
            }
            if (this.softwareBodyTemplate) {
                this.loadTemplateString("softwareContainerBodyNode", this.softwareBodyTemplate);
            }

            this.inherited(arguments);
        },

        postCreate: function () {

            // Remove baseClass from the top domNode of _SoftwareContainer
            // For some reason, dojo appends the baseClass of the widget that extends _SoftwareContainer.
            // This can cause css issues if applied to baseClass.
            domClass.remove(this.domNode, this.baseClass );

            this.fileSystemStore = window.markos.fileSystemStore;
            this.widgetStore = window.markos.widgetStore;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        loadTemplateString: function(place, template) {

            let x = domConstruct.toDom(this.softwareBodyTemplate);
            let y = domConstruct.create("div", {innerHTML: this.templateString});

            let targetNode = query("div[data-dojo-attach-point='" + place + "']", y)[0];
            targetNode.appendChild(x);

            this.templateString = y.innerHTML;

        },

        closeWindow() {
            this.destroy();
        }

    });

});