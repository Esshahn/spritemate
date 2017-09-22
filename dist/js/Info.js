"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Info = function Info(window, config) {
  var _this = this;

  _classCallCheck(this, Info);

  this.config = config;
  this.window = window;

  var template = "\n    <div id=\"info\">\n        <img autofocus src=\"img/logo.png\" id=\"logo\">\n        \n        <p>A tool to draw sprites for the Commodore 64<br/>\n        v0.20 - 2017-09-22</p>\n        <p>Ingo Hinterding // <a target=\"_blank\" href=\"http://csdb.dk/scener/?id=27239\">awsm</a> of <a target=\"_blank\" href=\"http://csdb.dk/group/?id=7228\">Mayday!</a></p>\n        <p>This software is free.<br/>Everything happens in your browser locally.<br/>No data of any kind is leaving your computer.</p>\n        <p>Documentation on Github:<br/><a target=\"_blank\" href=\"https://github.com/Esshahn/spritemate\">https://github.com/Esshahn/spritemate</a></p>\n        <p>Follow me on Twitter<br/><a target=\"_blank\" href=\"http://www.twitter.com/awsm9000/\">http://www.twitter.com/awsm9000/</a><p>\n        <p>Visit my website<br/><a target=\"_blank\" href=\"http://www.awsm.de\">http://www.awsm.de</a></p>\n        <button id=\"button-info\">You're awesome. No, really.</button>\n    </div>\n    ";
  $("#window-" + this.window).append(template);

  $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
  $('#button-info').mouseup(function (e) {
    return $("#window-" + _this.window).dialog("close");
  });
};