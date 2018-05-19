"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Help = function Help(window, config) {
    var _this = this;

    _classCallCheck(this, Help);

    this.config = config;
    this.window = window;

    var template = "\n    <div id=\"help\">\n        <img autofocus src=\"img/logo.png\" class=\"center\">\n        <div id=\"help-container\">\n            <h1>Documentation</h1>\n            <ol>\n                <li><a href=\"#about\">About Spritemate</a></li>\n                <li><a href=\"#features\">Feature Overview</a></li>\n                <li><a href=\"#ui\">Interface & Hotkeys</a></li>\n                <li><a href=\"#import\">Loading & Saving data</a></li>\n               <!--\n                <li><a href=\"#drawing\">Drawing sprites</a>\n                    <ol>\n                        <li><a href=\"#pixeldrawing\"></a>Pixel drawing</li>\n                        <li><a href=\"#multicolor\">Single- and Multicolor</a></li>\n                    </ol>\n                </li>\n                -->\n                <li><a href=\"#hints\">Tricks & Hints</a></li>\n                <li><a href=\"#links\">Links & Resources</a></li>\n            </ol>\n\n            <div class=\"spacer\"></div>\n\n            <h1 id=\"about\">About Spritemate</h1>\n            <p>\n            Spritemate is a new sprite editor for the Commodore 64.\n            It works with most modern browsers on Windows, Mac and Linux and is pure JavaScript and HTML - no plugins. \n            All data is processed on client side only. Spritemate supports importing and exporting of the most common file formats for the Commodore 64 (e.g. SpritePad) and can be used as viewer and editor on almost any device with a browser.\n            </p>\n\n            <p>\n            If you're unfamiliar with the Commodore 64 or haven't created sprites for it before, some stuff might strike you as odd. This is due to the technical restrictions of this computer. For example, you can  use only one foreground and one background color per sprite at a resolution of 24 by 21 pixels. Even worse, that background color is shared between all sprites. You can switch to a multicolor mode giving you four colors in total, but at the downside of half the horizontal resolution (now only 12 by 21 pixels).\n            </p>\n            <p>These restrictions often make creating art for the C64 a challenge. Modern painting programs do not support those modes and because of that Spritemate was created.</p>\n\n            <div class=\"spacer\"></div>\n\n            <h1 id=\"features\">Feature Overview</h1>\n            <p>\n            An overview of the features already implemented\n            </p>\n                <ul>\n                    <li>choose from the 16 colors of the C64 palette</li>\n                    <li>draw pixels on a 24x21 pixel (singlecolor) or 12x21 pixel (multicolor) canvas</li>\n                    <li>C64 mode restrictions (number of colors per sprite, global sprite colors)</li>\n                    <li>delete, fill, shift left, right, up, down, flip horizontal & vertical</li>\n                    <li>check your sprite in the preview window</li>\n                    <li>display grid in editor</li>\n                    <li>multiple sprites</li>\n                    <li>double width & height sprites</li>\n                    <li>stacked sprite layers (sprite overlays)</li>\n                    <li>sprite sorting</li>\n                    <li>undo & redo</li>\n                    <li>copy & paste</li>\n                    <li>window based GUI</li>\n                    <li>save window layout</li>\n                    <li>import & export Spritemate format</li>\n                    <li>import & export SpritePad 2.0 format</li>\n                    <li>import & export SpritePad 1.8.1 format</li>\n                    <li>export as ASM source (KICK and ACME)</li>\n                    <li>keyboard shortcuts</li>\n                </ul>\n            <p>\n            Here are some features I'd like to work on next. If you got an idea how to improve Spritemate, let me know!\n            </p>\n\n            <ul>\n                <li>animation</li>\n                <li>export animation as GIF</li>\n                <li>import & export PNG images</li>\n                <li>select and move pixels</li>\n                <li>touch controls and tablet optimization</li>\n                <li>and tons of other stuff</li>\n            </ul>\n\n            <div class=\"spacer\"></div>\n\n            <h1 id=\"ui\">Interface & Hotkeys</h1>\n\n            <h1>Menu Toolbar</h1>\n\n            <table>\n                <tr>\n                    <th width=\"10%\">Symbol</th>\n                    <th width=\"10%\">Shortcut</th>\n                    <th>Decription</th>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-load.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Loads a file. Supported formats: Spritemate (SPM), SpritePad (SPD, SPR)</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-save.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Saves a file. Supported formats: Spritemate (SPM), SpritePad 2.0 & 1.8.1 (SPD), ASM source (TXT)</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-undo.png\" class=\"icon\"></td>\n                    <td>z</td>\n                    <td>Undo. For when you screwed up.</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-redo.png\" class=\"icon\"></td>\n                    <td>shift + z</td>\n                    <td>Redo. For when you realized it wasn't that bad</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-draw.png\" class=\"icon\"></td>\n                    <td>d (toggle)</td>\n                    <td>Draw pixels. Hold shift to delete pixels.</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-fill.png\" class=\"icon\"></td>\n                    <td>d (toggle)</td>\n                    <td>Flood fill</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-fullscreen.png\" class=\"icon\"></td>\n                    <td>f</td>\n                    <td>Toggle fullscreen window mode</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-settings.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Open Settings window to change the color palette</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-help.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Shows the documentation which you are reading right now</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-info.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Displays the splash window</td>\n                </tr>\n            </table>\n\n            <div class=\"spacer\"></div>\n\n            <h1>Editor Window</h1>\n\n            <table>\n                <tr>\n                    <th width=\"10%\">Symbol</th>\n                    <th width=\"10%\">Shortcut</th>\n                    <th>Description</th>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-multicolor.png\" class=\"icon\"></td>\n                    <td>m</td>\n                    <td>Toggle between singlecolor and multicolor mode</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-shift-left.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Shift sprite left</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-shift-right.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Shift sprite right</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-shift-up.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Shift sprite up</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-shift-down.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Shift sprite down</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-flip-horizontal.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Flip sprite horizontal</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-flip-vertical.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Flip sprite vertical</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-grid.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Toggles grid display on/off</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-zoom-in.png\" class=\"icon\"><img src=\"img/icon3/icon-zoom-out.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Zooms window in/out</td>\n                </tr>\n                <tr>\n                    <td></td>\n                    <td>1,2,3,4</td>\n                    <td>Select individual color, transparent, multicolor 1 or multicolor 2</td>\n                </tr>\n            </table>\n\n            <div class=\"spacer\"></div>\n\n            <h1>Preview Window</h1>\n\n            <table>\n                <tr>\n                    <th width=\"10%\">Symbol</th>\n                    <th width=\"10%\">Shortcut</th>\n                    <th>Description</th>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-preview-x2.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Stretches sprite horizontally</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-preview-y2.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Stretches sprite vertically</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-zoom-in.png\" class=\"icon\"><img src=\"img/icon3/icon-zoom-out.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Zooms window in/out</td>\n                </tr>\n            </table>\n\n            <div class=\"spacer\"></div>\n\n            <h1>Sprite list Window</h1>\n\n            <table>\n                <tr>\n                    <th width=\"10%\">Symbol</th>\n                    <th width=\"10%\">Shortcut</th>\n                    <th>Description</th>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-list-new.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Create new sprite</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-list-delete.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Remove selected sprite</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-list-copy.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Copy sprite</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-list-paste.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Paste sprite</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-grid.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Toggles grid display on/off</td>\n                </tr>\n                <tr>\n                    <td><img src=\"img/icon3/icon-zoom-in.png\" class=\"icon\"><img src=\"img/icon3/icon-zoom-out.png\" class=\"icon\"></td>\n                    <td></td>\n                    <td>Zooms window in/out</td>\n                </tr>\n                <tr>\n                    <td></td>\n                    <td>cursor left & right</td>\n                    <td>cycle through sprite list</td>\n                </tr>\n            </table>\n\n        <div class=\"spacer\"></div>\n\n            <h1 id=\"import\">Importing & Exporting data</h1>\n\n            <p>Spritemate supports various file formats, each with a dedicated use case.</p>\n\n            <div class=\"spacer\"></div>\n\n            <h1>Loading data</h1>\n            <p>This should be pretty straight forward as Spritemate identifies the file format by its suffix. Just make sure that the file suffix (like *.spd for SpritePad data) matches the ones listed below.</p>\n            \n            <div class=\"spacer\"></div>\n\n            <h1>Saving data</h1>\n            <p>When saving data, choose the file format which suits your use case the best. Note that you can enter a name for your file in the save dialog, but you can't choose where to save it to. Due to browser security (which is a good thing), your file is saved to the default download location of your browser. Chances are you're a smart kid, so you'll figure that out.</p>\n\n            <h2>Save as Spritemate (*.spm)</h2>\n            <p>JSON file format and therefore quite handy if you like to play around with the generated data on a modern platform. Also the only option that saves all your work and keeps information unique to this editor, like sprite overlays. Generally the recommended file format as long as you're not finished working on your sprites yet.</p>\n\n            <h2>Save as SpritaPad (*.spd)</h2>\n            <p>SpritePad is probably the most common sprite editing software on Windows. Files are saved as C64 compatible binaries, with minor differences:</p>\n            <p>SpritePad 1.8.1: saves your sprite data including color information and simple sprite overlays (overlay next sprite). Not recommended if you work with overlay lists as this information can't be handled by SpritePad. Recommended if you want a standard, slim binary to import into your C64 assembly project.</p>\n            <p>SpritePad 2.0: pretty similar to 1.8.1, but with the addition of storing animation information. Spritemate can read and write this format, but be aware that since animation is not a feature yet, that data is ignored when imported from SpritePad.</p>\n\n            <h2>Save as assembly source (*.txt)</h2>\n            <p>Gives you a text file containing 6502 assembly code to import right into your C64 projects. Syntax formatting for KICK Assembler and ACME Assembler is provided, choose your favorite.</p>\n\n<!--\n        <div class=\"spacer\"></div>\n\n            <h1 id=\"drawing\">Drawing sprites</h1>\n-->\n        <div class=\"spacer\"></div>\n\n            <h1 id=\"hints\">Useful Tricks & Hints</h1>\n            <ul>\n                <li>You can customize the window positions and zoom levels to your personal workflow, Spritemate remembers your settings</li>\n                <li>Handy shortcuts: \"1,2,3,4\" to set the color, \"shift + click\" to delete, \"cursor left & right\" to cycle through the sprites</li>\n                <li>Rearrange sprites in the sprite list by dragging them around with the mouse</li>\n                <li>You can define and work with your own color palette. Open settings, choose \"custom\" and change the values. They will be stored in the browser for you</li>\n                <li>The Spritemate JSON file format is great for editing data in the text editor or use with custom tools</li>\n                <li>Right click on the sprite in the editor and you can save the picture as PNG file!</li>\n            </ul>\n\n        <div class=\"spacer\"></div>\n\n            <h1 id=\"links\">Links & Resources</h1>\n            <p>\n            Download & fork Spritemate on Github: <a target=\"_blank\" rel=\"noopener\" href=\"https://github.com/Esshahn/spritemate\">github.com/Esshahn/spritemate</a></p>\n            <p>Ingo Hinterding: <a target=\"_blank\" rel=\"noopener\" href=\"http://csdb.dk/scener/?id=27239\">awsm on csdb</a>, my website <a target=\"_blank\" rel=\"noopener\" href=\"http://www.awsm.de\">www.awsm.de</a> and Twitter: <a target=\"_blank\" rel=\"noopener\" href=\"http://www.twitter.com/awsm9000/\">@awsm9000</a></p>\n            \n        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>\n            \n        </div>\n        <button id=\"button-help\" class=\"center\">Close</button>\n    </div>\n    ";
    $("#window-" + this.window).append(template);

    $("#window-" + this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-help').mouseup(function (e) {
        return $("#window-" + _this.window).dialog("close");
    });
};