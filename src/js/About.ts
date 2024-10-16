
import { dom } from "./helper";
export default class About {
  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img autofocus src="src/img/logo-menu.svg" width="300px" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor, v${this.config.version.toFixed(
          2
        )}</p>

        <fieldset>
            <h1>Release notes</h1>

            <h1>V1.3</h1>
            <h2>This is mostly a housekeeping update without new functionality. While you might be sad to not get new stuff, it is a sign of life and that I'm dedicating time to this project again. Hopefully I can add new features soon.</h2>
            <br/>
            <p>
            - Converted all JavaScript to TypeScript<br/>
            - Rewrite of menubar, should fix annoying bug and is more responsive<br/>
            - Fixed a UI issue in the save dialog<br/>
            - Fixed a bug in the sprite invert code<br/>
            - Added Spritemate version number to SPM save data<br/>
            - Updated to latest jQuery<br/>
            - Updated webpack<br/>
            - Lots of cleanup & modernization<br/>
            - Added <a href="https://beta.spritemate.com">beta.spritemate.com</a> for latest version<br/>
            - Changed deploy setup to work with Netlify<br/>
            - jQuery excluded from bundle.js<br/>
            - Release notes will only show the latest release, not all releases<br/>
            - Removed Help window, documentation will again be handled on the github repo page
            </p>
            <p>
            Initially I wanted to remove jQuery and jQuery UI from this project and replace it with Vanilla JS. Build time had grown to 10 seconds, which I found quite annoying. Replicating jQuery's modal functionality was more challenging than anticipated, therefore I decided to exclude jQuery from the JS bundle again and load it from the CDN. This greatly reduced compile time to under 4 seconds. Overall the app remains extremely small, with the main App code around 20kb and jQuery around 98kb.
            </p>
        </fieldset>

        <button id="button-info">Let's go!</button>
    </div>
    `;

    dom.append("#window-" + this.window, template);

    $("#window-" + this.window).dialog({ show: "fade", hide: "fade" });
    dom.sel("#button-info").onclick = () => {
      $("#window-" + this.window).dialog("close");
      this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
    };
  }
}
