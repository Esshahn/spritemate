"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*

    Class Window

 */

var Window_Info = function () {
    function Window_Info(config) {
        _classCallCheck(this, Window_Info);

        this.id = "window-" + $('div[id^="window-"]').length;
        this.title = config.title;
        this.type = "info";
        this.left = config.left;
        this.top = config.top;
        this.width = 400; //24 * this.zoomFactor;
        this.height = 420; //21 * this.zoomFactor;
        this.resizable = false;
        this.position = { at: "left+" + this.left + " top+" + this.top };
        this.create_window();
    }

    _createClass(Window_Info, [{
        key: "create_window",
        value: function create_window() {
            var _this = this;

            $("#app").append("<div id='" + this.id + "' class='" + this.type + "' title='" + this.title + "'></div>");
            $("#" + this.id).dialog({
                width: this.width,
                height: this.height,
                autoOpen: false,
                dialogClass: "no-close",
                //position: this.position,
                resizable: this.resizable,
                buttons: this.buttons
            });

            var template = "\n        <div id=\"info\">\n            <img autofocus src=\"img/logo.png\" id=\"logo\">\n            <p>version 0.02 - 2017-09-07</p>\n            <p>Created by Ingo Hinterding // awsm of Mayday!</p>\n            <p>This software is free.<br/>Everything happens in your browser locally.<br/>No data of any kind is leaving your computer.</p>\n            <p>Fork me on Github:<br/><a href=\"https://github.com/Esshahn/spritemate\">https://github.com/Esshahn/spritemate</a></p>\n            <p>Follow me on Twitter<br/><a href=\"http://www.twitter.com/awsm9000/\">http://www.twitter.com/awsm9000/</a><p>\n            <p>Visit my website<br/><a href=\"http://www.awsm.de\">http://www.awsm.de</a></p>\n            <button id=\"button-info\">You're awesome. No, really.</button>\n        ";
            $("#" + this.id).append(template);

            $("#" + this.id).dialog({ show: 'fade', hide: 'fade' });
            $('#button-info').mouseup(function (e) {
                return $("#" + _this.id).dialog("close");
            });
        }
    }]);

    return Window_Info;
}();