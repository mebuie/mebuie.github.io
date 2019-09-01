define([
    "dojo/dom",
    "dojo/on",
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Clock/templates/Clock.html",
    "require"
], function(dom, on, declare, domConstruct, lang, _WidgetBase, _TemplatedMixin, template, require) {

    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: "markos-clock",

        postCreate: function () {


            // Run any parent postCreate processes - can be done at any point
            this.inherited(arguments);
        },

        startup: function() {
            this.startTime();


        },

        startTime: function () {
            let today = new Date();
            let h = today.getHours();
            let m = today.getMinutes();
            let s = today.getSeconds();
            let month = today.getMonth() + 1;
            let d = today.getDate();
            let y = today.getFullYear();
            m = this.checkTime(m);
            s = this.checkTime(s);
            d = this.checkTime(d);
            let time = h + ":" + m + ":" + s;
            let date = month + "/" + d + "/" + y;
            this.timeNode.innerHTML = time;
            this.dateNode.innerHTML = date;
            setTimeout(lang.hitch(this, this.startTime), 500);
        },

        checkTime: function (i) {
            if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
            return i;
        }

    });

});