define([
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./File/templates/File.html",
    "require",
    "markos/FileManager",
    "dojo/domReady!"
], function(dom, domStyle, domConstruct, on, win, lang, declare, _WidgetBase, _TemplatedMixin, template, require, FileManager) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-folder",
        folderName: null,
        folderImage: require.toUrl("markos/images/icons/win98_icons/file_lines.ico"),
        positionTop: "10px",
        positionLeft: "10px",
        desktop: null,


        postCreate: function () {
            // Get a DOM node reference for the root of our widget
            var domNode = this.domNode;
            domStyle.set(domNode, {
                "top": this.positionTop,
                "left": this.positionLeft
            });

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);

            // Assign the thumbnail image to the folder.
            this.folderImageNode.src = this.folderImage;
        },

        startup: function() {
            this.inherited(arguments); //_SoftwareContainer startup() will not fire without this! Position is irrelevant.
        },

        openFolder: function () {
            var openedFolder = new FileManager({
                folderId: this.folderName
            });
            openedFolder.placeAt(this.desktop);
            openedFolder.startup();
        },

        openItem: function () {

            if (this.parameters.css) {
                this.loadCSS(this.parameters.css);
            }

            let widgetStore = window.markos.widgetStore;

            //Check Widget Registry for file type
            let result = [];
            widgetStore.filter({type: this.type}).forEach( function(e) {
                result.push(e)
            });

            require([ result[0].uri ], lang.hitch(this, function(LoadedWidget){
                let newWidget = new LoadedWidget(this.parameters);
                // Run new widget:
                newWidget.placeAt(window.markos.desktopNode);
                newWidget.startup();
            }));
        },

        loadCSS: function(css) {
            let styleElement = domConstruct.create("style", {innerHTML: css}, win.body());


        }

    });
});