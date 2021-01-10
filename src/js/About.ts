import $ from "jquery";
import { dom } from "./helper";
export default class About {
  constructor(public window, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img autofocus src="img/logo-menu.svg" width="300px" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor, v${this.config.version.toFixed(
          2
        )}</p>

        <fieldset>
            <h1>Release notes</h1>

            <h1>V1.22</h1>
            <h2>This is mostly a housekeeping update without new functionality. While you might be sad to not get new stuff, it is a sign of life and that I'm dedicating time to this project again. Hopefully I can add new features soon.</h2>
            <br/>
            <p>
            - Rewrite of menubar, should fix annoying bug and is more responsive<br/>
            - Fixed a UI issue in the save dialog<br/>
            - Fixed a bug in the sprite invert code<br/>
            - Added Spritemate version number to SPM save data <br/>
            - Updated to latest jQuery<br/>
            - Updated webpack<br/>
            - Lots of cleanup & modernization<br/>
            - Added <a href="https://beta.spritemate.com">beta.spritemate.com</a> for latest version<br/>
            - Changed deploy setup to work with Netlify<br/>
            - Converted all JavaScript to TypeScript
            </p>

            <h1>V1.2</h1>
            <h2>Sprites can now be named. The name will show as label name in ASM and BASIC exports (thx to Janne and MacBacon for the suggestions).</h2>
            <br/>
            <p>Note that two changes were introduced with the sprite naming feature: sprites start with index number 0 instead of 1, e.g. the first sprite is called "sprite_0" instead of "sprite_1". This was necessary for consistancy and my personal sanity - internally the index number always was 0 instead of 1. The other change is that sprite data exported as ASM or BASIC file would not label the sprites by incrementing index anymore. This means that a sprite would keep its name no matter if you sort it in the sprite list to a different position (which seems obvious, but wasn't like this before).</p>

            <p>The sprite naming feature is backwards compatible, so when you load an older SPM file, default names will be applied.</p>
            
            <h2>Sprites can be inverted (hotkey 'i').</h2>

            <p>The sprite invert (or "negative" in SpritePad) might look a bit strange in multicolor mode, but that's no bug. In singlecolor, a 0 (transparent) gets replaced by a 1 (pixel) and vice versa, but in multicolor we have two more colors. Spritemate switches colors 3 and 4 in this case, just as SpritePad does.</p>

            <h2>The file name is now displayed in the top right corner of the window (thx to nurpax)</h2>

            <p>This can prove helpful when working with several files. Also a good indicator if the file hasn't been saved yet. Note that due to the nature how browsers save files and operating systems handle security, a file might save with a slightly different name if the same file name already exists in the download location (e.g. "mysprites (1).spm" instead of "mysprites.spm").</p>

            <h1>V1.11</h1>

            <h2>Tweaked menu bar to react more intuitive (click to open, hover between entries)</h2>

            <p>The menu bar does seem to malfunction for some setups, but the issue currently is not reproducable. Thx2 to leissa for additional testing and finding out that turning off "content blocking" in Firefox might fix the problem. If you encounter a reproducable issue with the menu bar, please report the description here: <a href="https://github.com/Esshahn/spritemate/issues">https://github.com/Esshahn/spritemate/issues</a>
            </p>
    

            <h1>V1.10</h1>

            <p>
            This release focuses on better usabality. While technically no features were added, the overall workflow should be better now. For example, instead of having four different icons for shifting a sprite up, down, left or right, the new move tool lets you do this more intuitive now. As a side effect, less icons complicate the UI.
            </p>


            <p>
            The option to erase pixels has been in Spritemate before (by holding down 'shift' while drawing), but now the 'eraser' tool makes it more visible and easier to use in a one-handed workflow.
            </p>

            <p>
            A new option to duplicate a sprite has been introduced. This was previously possible by a combination of 'copy', 'new' and 'paste' (and the new duplicate is in fact exactly this), but this should add to a more intuitive experience.
            </p>

            <p>
            There are other improvements, like the visually more distinguishable 'trash' icon to delete a sprite. All combined, Spritemate should start to feel more familiar if you are used to other paint programs like Photoshop.
            </p>


            <p>
            - added new move tool<br/>
            - added eraser tool<br/>
            - added new 'duplicate sprite' option to menu and list view<br/>
            
            - added hotkey 'shift+c' for copy<br/>
            - added hotkey 'shift+v' for paste<br/>
            - added hotkey 'shift+d' for duplicate<br/>
            - added hotkey 'shift+x' for delete<br/>
            - added hotkey 'e' for eraser tool<br/>
            - added hotkey 'm' for move tool<br/>
            - changed hotkey for fill to 'f'<br/>
            - changed hotkey for fullscreen to 'shift+f'<br/>
            - changed hotkey for color mode from 'm' to 'c'<br/>
            
            - changed icons for zoom & grid<br/>
            - removed shift left, right, up, down icons from editor<br/>
            - moved 'delete sprite' icon in sprite list to right side<br/>
            - replaced 'delete sprite' icon with new one (trash bin)<br/>
            - changed menu bar behavior from 'click' to 'hover'
            </p>


            <h1>V1.09</h1>
            <p>
            - added binary notation for assembly export (thx2 mist64!)
            </p>
            
            <h1>V1.08</h1>
            <p>
            - added option to start a new file<br/>
            - export sprite data as BASIC2.0 listing<br/>
            - color tooltip now also shows the C64 color value (thx2 nurpax)<br/>
            - spritemate has a new logo now<br/>
            - added menu bar, making room for more features<br/>
            - fixed keyboard becoming unresponsive after a modal was opened<br/>
            - slightly tweaked save window<br/>
            - migrated Spritemate to use webpack (thx2 nurpax)<br />
            - reworked Spritemate file format, reducing file size by over 50%<br/>
            - added line breaks in SPM file format for better readability<br/>
            - added more info to the assembly export formats<br/>
            - switched individual and transparent color pickers in color palette (thx2 Steril)<br/>
            - repo cleanup (thx2 nurpax)<br/>
            </p>

            <h1>V1.07</h1>
            <p>
            - added sprite number tooltips for sprites in the sprite list<br/>
            - the menu palette can now be moved around and the position is saved<br/>
            - updated to jquery 3.3.1, code cleanup (removed playfield code)<br/>
            - the tools in the sprite list window are now fixed to the top<br/>
            - some tweaks to the window design<br/>
            - some icons have been refined
            </p>

            <h1>V1.06</h1>
            <p>
            - added divider lines in the editor grid view (thx2 v3to)<br/>
            - zoom icons moved from right side of the window to the left for better usability<br/>
            - color palette now uses DIVs instead of CANVAS (needed for later features)<br/>
            </p>

 
            
            <p>
            Although not many features had been added, it took me quite a while to finish this release. I had to revert a lot of code for a really cool new feature that I didn't get to work reliably. Because of that, I had to maintain two code branches and backport features into the stable version. I finally decided to put the new feature on hold and focus on others instead.
            </p>

            <h1>V1.05</h1>
            <p>
            - Added a brief documentation (click on help in the menu bar).<br/>
            - Fixed an error in Kick Assembler export (thx2 nurpax)
            </p>


            
            <p>I didn't get any chance to work on Spritemate for months due to my commercial stuff sucking away all my free time. Also, feedback was stopping recently, which didn't motivate me too much either. Eventually I checked the traffic for Spritemate and was suprised about the steady amount of users. So I decided to dedicate more time to this project again. In any case, if you like Spritemate, you can make a hell of a difference by letting me know, either by mail ( ingo at awsm dot de ) or by sending me a tweet ( <a href="https://twitter.com/awsm9000">@awsm9000</a> ). Let me know how I can make Spritemate better for you!</p>

            <h1>November 08, 2017</h1>

            <h2>Features, changes & bugfixes</h2>
            - Huge speed boost when working with large sprite sets 

            <h1>October 30, 2017</h1>

            <h2>Save settings & color palette change</h2>
            <p>
            Spritemate saves settings locally now. 
            It might work a bit wonky still and I know about at least one case where the code works but should not as to my understanding (but who am I to judge the developer...). 
            Anyway, the foundation for more configuration options has been layed for future updates.
            </p>

 
            - locally saved config file<br/>
            - this info modal will be displayed only once when new features are introduced<br/>
            - new settings modal<br/>
            - choose between three color palettes: colodore, pepto and custom<br/>
            - custom palette feature lets you define your own palette<br/>
            - zoom levels are remembered now<br/>
            - grid on/off in editor is remembered now<br/>
            - window positions are now remembered<br/>
            - tooltips now have a delay of one second before showing<br/>
            - modals are now in focus to prevent unwanted interface interaction<br/>
            - cursor keys rotate through the sprite list instead of stopping at start and end<br/>
            - current version number is now shown in info modal

            <h1>October 24, 2017</h1>

            <h2>First public beta release</h2>
            <p>
            spritemate is now in public beta. Thanks to all the beta testers who helped find bugs and suggest features and improvements. Please check out the <a target="_blank" href="https://github.com/Esshahn/spritemate">documentation on Github</a> to get a feature overview. 

            </p>
            <h1>October 20, 2017</h1>

            <h2>Keyboard Shortcuts</h2>
            <p>
            The most common actions have received hotkeys for quick access. 
            Using hotkeys in a browser is always a bit tricky, as many combinations are taken by the browser (like CMD/CTRL + C for "copy"). 
            Therefore some shortcuts might seem less intuitive. These functions are available by pressing keys now:
            </p>
            
  

            <p>
            (1,2,3,4) - set one of the four available pens/colors<br/>
            (f) - toggle fullscreen on/off<br/>
            (d) - toggle between "draw" and "fill" modes<br/>
            (z) - undo, (shift + z) = redo<br/>
            (m) - toggle singlecolor/multicolor<br/>
            (cursor left, right) - navigate through sprite list (thx2 Wiebo)<br/>
            </p>

            <h2>Bug fixes and changes</h2>

            <p>
                - Tooltips on the icons now look nicer (thx2 korshun)<br/>
                - Fixed a bug in the SpritePad importer<br/>
                - small visual and bug fixes
            </p>

            <h1>October 19, 2017</h1>

            <p>
                - SpritePad 2.x overlay settings will be imported & exported now<br/>
                - new sprites inherit the multicolor setting of the current sprite (thx2 Wiebo)<br/>
                - sprite index & amount of sprites shown in list window title (thx2 Wiebo)<br/>
                - assembler source now supports KICK ASS and ACME syntax (thx2 korshun)<br/>
                - zoom icons fade out when min/max level is reached<br/>
                - more speed enhancements
            </p>
            <h1>October 18, 2017</h1>
            <h2>Sprite Overlays</h2>
            <p>Toggle sprite overlays in preview window. The following sprite will be used as overlay. The preview window shows both sprites and the editor window shows the other sprite with reduced visibility (like onion skinning). Please note that currently sprite overlay information is stored in native spritemate format only.</p>
            <h2>Bug fixes and changes</h2>
            <p>
                - spritemate should work again in Firefox (thx2 merman1974)<br/>
                - zoom levels for windows have been increased (thx2 INC$D021)<br/>
                - fixed a crazy stupid thing in pixel display code<br/>
                - huge speed improvements for sprite display
            </p>
        </fieldset>

        <button id="button-info">Let's go!</button>
    </div>
    `;

    dom.append("#window-" + this.window, template);

    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });
    dom.sel("#button-info").onclick = (e) => {
      $("#window-" + this.window).dialog("close");
      this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
    };
  }
}
