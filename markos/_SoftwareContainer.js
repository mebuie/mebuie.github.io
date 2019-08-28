define([
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_SoftwareContainer/templates/_SoftwareContainer.html",
    "dojox/xml/parser",
], function(dom, on, query, declare, lang, _WidgetBase, _TemplatedMixin, template, xmlParser) {

    return declare([_WidgetBase, _TemplatedMixin], {
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

            this.fileSystemStore = window.markos.fileSystemStore;
            this.widgetStore = window.markos.widgetStore;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {

            
        },

        loadTemplateString: function(place, template) {
            let xml = xmlParser.parse(this.templateString);
            let xmlDoc = xml.documentElement;

            let xml2 = xmlParser.parse(template);
            let xmlDoc2 = xml2.documentElement;

            // Find target node which should be modified
            let targetNode = query("div[data-dojo-attach-point='" + place + "']", xmlDoc)[0];

            // Append content to the xml template
            targetNode.appendChild(xmlDoc2);

            // Re-set the modified template string
            this.templateString = xmlParser.innerXML(xmlDoc);

        },

        closeWindow() {
            this.destroy();
        }

    });

});