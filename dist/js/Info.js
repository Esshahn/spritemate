"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Info = function Info(window, config) {
    var _this = this;

    _classCallCheck(this, Info);

    this.config = config;
    this.window = window;

    var template = "\n    <div id=\"info\">\n        <p>Welcome to</p>\n        <img autofocus src=\"img/logo.png\" id=\"logo\">\n        <p>A tool to draw sprites for the Commodore 64</p>\n\n        <fieldset>\n            <legend>What's new in beta $03</legend>\n            <h1>sprite overlays</h1>\n            <p>Toggle sprite overlays in preview window. The following sprite will be used as overlay. The preview window shows both sprites and the editor window shows the other sprite with reduced visibility (like onion skinning). Please note that currently sprite overlay information is stored in native spritemate format only.</p>\n            <h1>bug fixes and changes</h1>\n            <p>\n                - spritemate should work again in Firefox\n                <br/>- zoom levels for windows have been increased\n                <br/>- fixed a crazy stupid thing in pixel display code\n                <br/>- huge speed improvements for sprite display\n            </p>\n        </fieldset>\n\n        <p>Documentation: <a target=\"_blank\" href=\"https://github.com/Esshahn/spritemate\">https://github.com/Esshahn/spritemate</a></p>\n        <p>Ingo Hinterding / <a target=\"_blank\" href=\"http://csdb.dk/scener/?id=27239\">awsm</a> of <a target=\"_blank\" href=\"http://csdb.dk/group/?id=7228\">Mayday!</a>\n        / <a target=\"_blank\" href=\"http://www.awsm.de\">www.awsm.de</a> / <a target=\"_blank\" href=\"http://www.twitter.com/awsm9000/\">@awsm9000</a></p>\n        <br/>\n        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>\n        <p>Please do not share this link publicly yet. Thank you for testing!</p>\n        <br/>\n        <button id=\"button-info\">Let's go!</button>\n    </div>\n    ";
    $("#window-" + this.window).append(template);

    $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup(function (e) {
        return $("#window-" + _this.window).dialog("close");
    });
};