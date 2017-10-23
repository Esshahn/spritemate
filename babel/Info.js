

class Info
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="info">
        <p>Welcome to</p>
        <img autofocus src="img/logo.png" id="logo">
        <p>The Commodore 64 sprite editor</p>

        <fieldset>
            <legend>What's new</legend>
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

        <p>Documentation: <a target="_blank" href="https://github.com/Esshahn/spritemate">https://github.com/Esshahn/spritemate</a></p>
        <p>Ingo Hinterding / <a target="_blank" href="http://csdb.dk/scener/?id=27239">awsm</a> of <a target="_blank" href="http://csdb.dk/group/?id=7228">Mayday!</a>
        / <a target="_blank" href="http://www.awsm.de">http://www.awsm.de</a> / <a target="_blank" href="http://www.twitter.com/awsm9000/">@awsm9000</a></p>
        <p>Report bugs, ideas & requests to ingo (at) awsm (dot) de</p>
        <br/>
        <button id="button-info">Let's go!</button>
    </div>
    `;
    $("#window-"+this.window).append(template);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-info').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

   
  }



}


