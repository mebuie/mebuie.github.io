define([
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dnd/Moveable",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/on",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./_SoftwareContainer/templates/_SoftwareContainer.html",
    "require",
    "dojox/layout/ResizeHandle",
    "dojo/domReady!"
], function(dom, domClass, domConstruct, Moveable, domStyle, domAttr, on, query, declare, lang, _WidgetBase, _TemplatedMixin, template, require, ResizeHandle) {

    return declare([_WidgetBase, _TemplatedMixin], {
        baseClass: null,
        templateString: template,
        softwareContainerClass: "markos-softwarecontainer",
        softwareBodyTemplate: null,
        softwareHeaderTemplate: null,
        fileSystemStore: null,
        widgetStore: null,
        maxImage: require.toUrl("../markos/images/icons/system/max.jpg"),
        minImage: require.toUrl("../markos/images/icons/system/min.jpg"),
        isMaximized: false,

        // TODO: Needs refactoring.

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

            // Add ability to resize _SoftwareContainer.
            let resizeHandle = new ResizeHandle({
                targetId: this.softwareContainer.id
            }).placeAt(this.resizeContainer);

            // Remove baseClass from the top domNode of _SoftwareContainer
            // For some reason, dojo appends the baseClass of the widget that extends _SoftwareContainer.
            // This can cause css issues if applied to baseClass.
            domClass.remove(this.domNode, this.baseClass );

            this.fileSystemStore = window.markos.fileSystemStore;
            this.widgetStore = window.markos.widgetStore;

            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            this.inherited(arguments);

            this.toggleMaxMinIcon();

        },

        loadTemplateString: function(place, template) {

            let x = domConstruct.toDom(this.softwareBodyTemplate);
            let y = domConstruct.create("div", {innerHTML: this.templateString});

            let targetNode = query("div[data-dojo-attach-point='" + place + "']", y)[0];
            targetNode.appendChild(x);

            this.templateString = y.innerHTML;

        },

        toggleMaxMinIcon: function() {
            let desktop = query(".markos .markos-desktop")[0];

            let desktopH = desktop.offsetHeight;
            let desktopW =  desktop.offsetWidth;

            if (this.domNode.offsetHeight === desktopH && this.domNode.offsetWidth === desktopW) {
                domAttr.set(this.maxminNode, "src", this.minImage);
                this.isMaximized = true;

            } else {
                domAttr.set(this.maxminNode, "src", this.maxImage);
                this.isMaximized = false;
            }

        },

        maxminWindow: function(event) {

            let desktop = query(".markos .markos-desktop")[0];

            let desktopH = desktop.offsetHeight;
            let desktopW =  desktop.offsetWidth;

            if (this.domNode.offsetHeight !== desktopH && this.domNode.offsetWidth !== desktopW) {

                this.currentHeight = this.domNode.offsetHeight;
                this.currentWidth = this.domNode.offsetWidth;

                let positionAbsolute = window.getComputedStyle(this.domNode);
                this.currentTop = positionAbsolute.top;
                this.currentLeft = positionAbsolute.left;

                domStyle.set(this.domNode, {
                        width: "100%",
                        height: "100%",
                        top: "0px",
                        left: "0px"
                    }
                );

                this.isMaximized = true;

                domAttr.set(this.maxminNode, "src", this.minImage);

                this.dnd.destroy();

            } else if (this.domNode.offsetHeight === desktopH && this.domNode.offsetWidth === desktopW &&
                !this.currentHeight ) {

                domStyle.set(this.domNode, {
                        width: this.domNode.offsetWidth - 20 + "px",
                        height: this.domNode.offsetHeight - 20 + "px",
                        top: "10px",
                        left: "10px"
                    }
                );

                this.isMaximized = false;

                domAttr.set(this.maxminNode, "src", this.maxImage);

                this.dnd = new Moveable(this.softwareContainer.id);

            } else {

                // TODO: Need to check if window has been resized smaller than currentHeight.

                domStyle.set(this.domNode, {
                        width: this.currentWidth + "px",
                        height: this.currentHeight + "px",
                        top: this.currentTop,
                        left: this.currentLeft,
                    }
                );

                this.isMaximized = false;

                domAttr.set(this.maxminNode, "src", this.maxImage);

                this.dnd = new Moveable(this.softwareContainer.id);

            }
        },

        closeWindow() {
            this.destroyRecursive();
        }

    });

});