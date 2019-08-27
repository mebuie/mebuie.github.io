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
        baseClass: "markos-file-manager",
        softwareTemplate: null,

        buildRendering: function () {

            // Used to merger a custom widgit template into this template at data-dojo-attach-point='windowContentNode'
            this.loadTemplateString(this.softwareTemplate);

            this.inherited(arguments);
        },

        postCreate: function () {

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            
        },

        loadTemplateString: function(template) {
            let xml = xmlParser.parse(this.templateString);
            let xmlDoc = xml.documentElement;

            let xml2 = xmlParser.parse(template);
            let xmlDoc2 = xml2.documentElement;

            // Find target node which should be modified
            let targetNode = query("div[data-dojo-attach-point='windowContentNode']", xmlDoc)[0];

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