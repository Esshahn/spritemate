

class Help
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="help">
        <img autofocus src="img/logo.png" class="center">
        <div id="help-container">
            <h1>Documentation</h1>
            <ol>
                <li><a href="#about">About Spritemate</a></li>
                <li><a href="#features">Feature Overview</a></li>
                <li><a href="#ui">Interface & Hotkeys</a></li>
                <li><a href="#import">Loading & Saving data</a></li>
               <!--
                <li><a href="#drawing">Drawing sprites</a>
                    <ol>
                        <li><a href="#pixeldrawing"></a>Pixel drawing</li>
                        <li><a href="#multicolor">Single- and Multicolor</a></li>
                    </ol>
                </li>
                -->
                <li><a href="#hints">Tricks & Hints</a></li>
                <li><a href="#links">Links & Resources</a></li>
            </ol>

            <div class="spacer"></div>

            <h1 id="about">About Spritemate</h1>
            <p>
            Spritemate is a new sprite editor for the Commodore 64.
            It works with most modern browsers on Windows, Mac and Linux and is pure JavaScript and HTML - no plugins. 
            All data is processed on client side only. Spritemate supports importing and exporting of the most common file formats for the Commodore 64 (e.g. SpritePad) and can be used as viewer and editor on almost any device with a browser.
            </p>

            <p>
            If you're unfamiliar with the Commodore 64 or haven't created sprites for it before, some stuff might strike you as odd. This is due to the technical restrictions of this computer. For example, you can  use only one foreground and one background color per sprite at a resolution of 24 by 21 pixels. Even worse, that background color is shared between all sprites. You can switch to a multicolor mode giving you four colors in total, but at the downside of half the horizontal resolution (now only 12 by 21 pixels).
            </p>
            <p>These restrictions often make creating art for the C64 a challenge. Modern painting programs do not support those modes and because of that Spritemate was created.</p>

            <div class="spacer"></div>

            <h1 id="features">Feature Overview</h1>
            <p>
            An overview of the features already implemented
            </p>
                <ul>
                    <li>choose from the 16 colors of the C64 palette</li>
                    <li>draw pixels on a 24x21 pixel (singlecolor) or 12x21 pixel (multicolor) canvas</li>
                    <li>C64 mode restrictions (number of colors per sprite, global sprite colors)</li>
                    <li>delete, fill, shift left, right, up, down, flip horizontal & vertical</li>
                    <li>check your sprite in the preview window</li>
                    <li>display grid in editor</li>
                    <li>multiple sprites</li>
                    <li>double width & height sprites</li>
                    <li>stacked sprite layers (sprite overlays)</li>
                    <li>sprite sorting</li>
                    <li>undo & redo</li>
                    <li>copy & paste</li>
                    <li>window based GUI</li>
                    <li>save window layout</li>
                    <li>import & export Spritemate format</li>
                    <li>import & export SpritePad 2.0 format</li>
                    <li>import & export SpritePad 1.8.1 format</li>
                    <li>export as ASM source (KICK and ACME)</li>
                    <li>keyboard shortcuts</li>
                </ul>
            <p>
            Here are some features I'd like to work on next. If you got an idea how to improve Spritemate, let me know!
            </p>

            <ul>
                <li>animation</li>
                <li>export animation as GIF</li>
                <li>import & export PNG images</li>
                <li>select and move pixels</li>
                <li>touch controls and tablet optimization</li>
                <li>and tons of other stuff</li>
            </ul>

            <div class="spacer"></div>

            <h1 id="ui">Interface & Hotkeys</h1>

            <h1>Menu Toolbar</h1>

            <table>
                <tr>
                    <th width="10%">Symbol</th>
                    <th width="10%">Shortcut</th>
                    <th>Decription</th>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-load.png" class="icon"></td>
                    <td></td>
                    <td>Loads a file. Supported formats: Spritemate (SPM), SpritePad (SPD, SPR)</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-save.png" class="icon"></td>
                    <td></td>
                    <td>Saves a file. Supported formats: Spritemate (SPM), SpritePad 2.0 & 1.8.1 (SPD), ASM source (TXT)</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-undo.png" class="icon"></td>
                    <td>z</td>
                    <td>Undo. For when you screwed up.</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-redo.png" class="icon"></td>
                    <td>shift + z</td>
                    <td>Redo. For when you realized it wasn't that bad</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-draw.png" class="icon"></td>
                    <td>d (toggle)</td>
                    <td>Draw pixels. Hold shift to delete pixels.</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-fill.png" class="icon"></td>
                    <td>d (toggle)</td>
                    <td>Flood fill</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-fullscreen.png" class="icon"></td>
                    <td>f</td>
                    <td>Toggle fullscreen window mode</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-settings.png" class="icon"></td>
                    <td></td>
                    <td>Open Settings window to change the color palette</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-help.png" class="icon"></td>
                    <td></td>
                    <td>Shows the documentation which you are reading right now</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-info.png" class="icon"></td>
                    <td></td>
                    <td>Displays the splash window</td>
                </tr>
            </table>

            <div class="spacer"></div>

            <h1>Editor Window</h1>

            <table>
                <tr>
                    <th width="10%">Symbol</th>
                    <th width="10%">Shortcut</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-multicolor.png" class="icon"></td>
                    <td>m</td>
                    <td>Toggle between singlecolor and multicolor mode</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-shift-left.png" class="icon"></td>
                    <td></td>
                    <td>Shift sprite left</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-shift-right.png" class="icon"></td>
                    <td></td>
                    <td>Shift sprite right</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-shift-up.png" class="icon"></td>
                    <td></td>
                    <td>Shift sprite up</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-shift-down.png" class="icon"></td>
                    <td></td>
                    <td>Shift sprite down</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-flip-horizontal.png" class="icon"></td>
                    <td></td>
                    <td>Flip sprite horizontal</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-flip-vertical.png" class="icon"></td>
                    <td></td>
                    <td>Flip sprite vertical</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-grid.png" class="icon"></td>
                    <td></td>
                    <td>Toggles grid display on/off</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-zoom-in.png" class="icon"><img src="img/ui/icon-zoom-out.png" class="icon"></td>
                    <td></td>
                    <td>Zooms window in/out</td>
                </tr>
                <tr>
                    <td></td>
                    <td>1,2,3,4</td>
                    <td>Select individual color, transparent, multicolor 1 or multicolor 2</td>
                </tr>
            </table>

            <div class="spacer"></div>

            <h1>Preview Window</h1>

            <table>
                <tr>
                    <th width="10%">Symbol</th>
                    <th width="10%">Shortcut</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-preview-x2.png" class="icon"></td>
                    <td></td>
                    <td>Stretches sprite horizontally</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-preview-y2.png" class="icon"></td>
                    <td></td>
                    <td>Stretches sprite vertically</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-zoom-in.png" class="icon"><img src="img/ui/icon-zoom-out.png" class="icon"></td>
                    <td></td>
                    <td>Zooms window in/out</td>
                </tr>
            </table>

            <div class="spacer"></div>

            <h1>Sprite list Window</h1>

            <table>
                <tr>
                    <th width="10%">Symbol</th>
                    <th width="10%">Shortcut</th>
                    <th>Description</th>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-list-new.png" class="icon"></td>
                    <td></td>
                    <td>Create new sprite</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-list-delete.png" class="icon"></td>
                    <td></td>
                    <td>Remove selected sprite</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-list-copy.png" class="icon"></td>
                    <td></td>
                    <td>Copy sprite</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-list-paste.png" class="icon"></td>
                    <td></td>
                    <td>Paste sprite</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-grid.png" class="icon"></td>
                    <td></td>
                    <td>Toggles grid display on/off</td>
                </tr>
                <tr>
                    <td><img src="img/ui/icon-zoom-in.png" class="icon"><img src="img/ui/icon-zoom-out.png" class="icon"></td>
                    <td></td>
                    <td>Zooms window in/out</td>
                </tr>
                <tr>
                    <td></td>
                    <td>cursor left & right</td>
                    <td>cycle through sprite list</td>
                </tr>
            </table>

        <div class="spacer"></div>

            <h1 id="import">Importing & Exporting data</h1>

            <p>Spritemate supports various file formats, each with a dedicated use case.</p>

            <div class="spacer"></div>

            <h1>Loading data</h1>
            <p>This should be pretty straight forward as Spritemate identifies the file format by its suffix. Just make sure that the file suffix (like *.spd for SpritePad data) matches the ones listed below.</p>
            
            <div class="spacer"></div>

            <h1>Saving data</h1>
            <p>When saving data, choose the file format which suits your use case the best. Note that you can enter a name for your file in the save dialog, but you can't choose where to save it to. Due to browser security (which is a good thing), your file is saved to the default download location of your browser. Chances are you're a smart kid, so you'll figure that out.</p>

            <h2>Save as Spritemate (*.spm)</h2>
            <p>JSON file format and therefore quite handy if you like to play around with the generated data on a modern platform. Also the only option that saves all your work and keeps information unique to this editor, like sprite overlays. Generally the recommended file format as long as you're not finished working on your sprites yet.</p>

            <h2>Save as SpritaPad (*.spd)</h2>
            <p>SpritePad is probably the most common sprite editing software on Windows. Files are saved as C64 compatible binaries, with minor differences:</p>
            <p>SpritePad 1.8.1: saves your sprite data including color information and simple sprite overlays (overlay next sprite). Not recommended if you work with overlay lists as this information can't be handled by SpritePad. Recommended if you want a standard, slim binary to import into your C64 assembly project.</p>
            <p>SpritePad 2.0: pretty similar to 1.8.1, but with the addition of storing animation information. Spritemate can read and write this format, but be aware that since animation is not a feature yet, that data is ignored when imported from SpritePad.</p>

            <h2>Save as assembly source (*.txt)</h2>
            <p>Gives you a text file containing 6502 assembly code to import right into your C64 projects. Syntax formatting for KICK Assembler and ACME Assembler is provided, choose your favorite.</p>

<!--
        <div class="spacer"></div>

            <h1 id="drawing">Drawing sprites</h1>
-->
        <div class="spacer"></div>

            <h1 id="hints">Useful Tricks & Hints</h1>
            <ul>
                <li>You can customize the window positions and zoom levels to your personal workflow, Spritemate remembers your settings</li>
                <li>Handy shortcuts: "1,2,3,4" to set the color, "shift + click" to delete, "cursor left & right" to cycle through the sprites</li>
                <li>Rearrange sprites in the sprite list by dragging them around with the mouse</li>
                <li>You can define and work with your own color palette. Open settings, choose "custom" and change the values. They will be stored in the browser for you</li>
                <li>The Spritemate JSON file format is great for editing data in the text editor or use with custom tools</li>
                <li>Right click on the sprite in the editor and you can save the picture as PNG file!</li>
            </ul>

        <div class="spacer"></div>

            <h1 id="links">Links & Resources</h1>
            <p>
            Download & fork Spritemate on Github: <a target="_blank" rel="noopener" href="https://github.com/Esshahn/spritemate">github.com/Esshahn/spritemate</a></p>
            <p>Ingo Hinterding: <a target="_blank" rel="noopener" href="http://csdb.dk/scener/?id=27239">awsm on csdb</a>, my website <a target="_blank" rel="noopener" href="http://www.awsm.de">www.awsm.de</a> and Twitter: <a target="_blank" rel="noopener" href="http://www.twitter.com/awsm9000/">@awsm9000</a></p>
            
        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>
            
        </div>
        <button id="button-help" class="center">Close</button>
    </div>
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-help').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


