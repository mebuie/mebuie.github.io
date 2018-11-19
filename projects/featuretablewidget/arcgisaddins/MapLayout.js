define([
  'dojo/_base/declare',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane'
], function (declare, BorderContainer, ContentPane) {
  return declare([], {
    divId: null,
    bottomPane: {
      bottomHeight: null,
      splitter: true
    },

    constructor: function (options) {
      console.log(this.bottomPane.splitter)
      this.divId = options.divId || "viewDiv";
      this.bottomPane.bottomHeight = options.bottomPane.bottomHeight || "40%";
      this.bottomPane.splitter = options.bottomPane.splitter;
    },

    TwoPane: function () {
      var bc = new BorderContainer({
        gutters: false,
        liveSplitters: false,
        style: 'height: 100%; width: 100%; overflow: hidden;',
        id: 'layout-container'
      })

      var header = new ContentPane({
        region: 'top',
        style: 'height: 50px; width: 100%; margin: 0; padding: 0; border-bottom: solid; background-color: #004226; border-bottom-color: #d25319;',
        content: '<img id="layout-container-top-logo" style="height: 40px; margin: 5px; float: left;" src="img/YourLogo.png">',
        id: 'layout-container-top'
      })

      var body = new ContentPane({
        region: 'center',
        id: 'layout-container-center',
        style: 'margin: 0; padding: 0;',
        content: '<div id=\'layout-container-center-map\' style=\'width: 100%; height: 100%; margin: 0; padding: 0;\'></div>'
      })

      // Must be BorderContainer to append additional ContentPane for FeatureTable Widget.
      var table = new BorderContainer({
        region: 'bottom',
        splitter: this.bottomPane.splitter,
        gutters: false,
        id: 'layout-container-bottom',
        style: 'height:' + this.bottomPane.bottomHeight + '; margin: 0; padding: 0;', // TODO: change this to user input style.
      })

      bc.addChild(header)
      bc.addChild(body)
      bc.addChild(table)
      bc.placeAt(this.divId)
      bc.startup()
    }
  })
})
