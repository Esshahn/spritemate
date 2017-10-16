"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Info = function Info(window, config) {
  var _this = this;

  _classCallCheck(this, Info);

  this.config = config;
  this.window = window;

  var template = "\n    <div id=\"info\">\n        <p>Welcome to</p>\n        <img autofocus src=\"img/logo.png\" id=\"logo\">\n        <p>A tool to draw sprites for the Commodore 64</p>\n        <br/>\n        <p>This is the closed beta $01.<br/>Please do not share this link publicly yet. </p>\n        <p>Check out the documentation on Github:<br/><a target=\"_blank\" href=\"https://github.com/Esshahn/spritemate\">https://github.com/Esshahn/spritemate</a></p>\n        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>\n        <br/>\n        <p>Thank you for testing!</p>\n        <p>Ingo Hinterding // <a target=\"_blank\" href=\"http://csdb.dk/scener/?id=27239\">awsm</a> of <a target=\"_blank\" href=\"http://csdb.dk/group/?id=7228\">Mayday!</a></p>\n        <p>Website: <a target=\"_blank\" href=\"http://www.awsm.de\">www.awsm.de</a> | Twitter: <a target=\"_blank\" href=\"http://www.twitter.com/awsm9000/\">@awsm9000</a></p>\n        <br/>\n        <button id=\"button-info\">Let's go!</button>\n    </div>\n    ";
  $("#window-" + this.window).append(template);

  $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
  $('#button-info').mouseup(function (e) {
    return $("#window-" + _this.window).dialog("close");
  });
};