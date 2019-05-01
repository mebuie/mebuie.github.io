define([
  "dijit/_WidgetBase",
  "dijit/_OnDijitClickMixin",
  "dijit/_TemplatedMixin",

  "dojo/Evented",
  "dojo/_base/declare",
  "dojo/_base/lang",

  "dojo/on",

  // load template
  "dojo/text!./HelpUI.html",

  "dojo/dom-class",
  "dojo/dom-style"
], function (
  _WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented, declare, lang, on, dijitTemplate, domClass, domStyle
) {

  var Widget = declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin, Evented], {
    declaredClass: "esri.dijit.HelpUI",
    templateString: dijitTemplate,

    constructor: function( options, srcRefNode) {
      this.set("theme", "HelpUI");
    }

  });

  return Widget
});