

class Info
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="info">
        <img autofocus src="img/logo.png" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor, v${this.config.version}</p>

        <fieldset>
            <h1>Release notes</h1>

            <h1>V1.08</h1>
            <p>
            - reworked Spritemate file format, reducing file size by over 50%<br/>
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

            <br/>
            
            <p>
            Although not many features had been added, it took me quite a while to finish this release. I had to revert a lot of code for a really cool new feature that I didn't get to work reliably. Because of that, I had to maintain two code branches and backport features into the stable version. I finally decided to put the new feature on hold and focus on others instead.
            </p>

            <h1>V1.05</h1>
            <p>
            - Added a brief documentation (click on help in the menu bar).<br/>
            - Fixed an error in Kick Assembler export (thx2 nurpax)
            </p>

            <br/>
            
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

            <br/>
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
            
            <br/>

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
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


