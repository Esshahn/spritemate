
import { dom } from "./helper";
export default class About {
  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img autofocus src="logo-menu.svg" width="300px" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor</p>

        <fieldset>
            <h1>Release notes</h1>

            <h1>25.12.27-03</h1>
            <h2>The Age Of Vibe Coding</h2>
            <p>
            Ahhhh.... it's finally time to vibe code some life into Spritemate again.<br/>
            Let's see how far it gets us today:<br/><br/>
            - Cleaned up and refactored codebase and threw away around 20% of the code<br/>
            - Nondestrucive save options are now under "Save" (Spritemate & Spritepad data)<br/>
            - Destructive save options are now under "Export" (Assembly, BASIC, PNG)<br/>
            - VICE snapshots can now be imported by clicking "Import VICE (*.vsf) Snapshot"<br/>
            - When importing VICE snapshots, the monitor will be opened automatically<br/>
            - Moved the VICE snapshot window from the "file" to the "view" menu<br/>
            - Added the option to export the curent sprite as PNG image<br/>
            - Added the option to export all sprites as PNG images in a ZIP file<br/>
            - Tweaked wording of the menu items to be more concise<br/>
            </p>

            <h1>25.12.27-02</h1>
            <h2>VICE Snapshot Monitor</h2>
            <p>
            Finally a feature release, thanks to the amazing contribution by <a target="_blank" href="https://github.com/elliot2">Elliot Tanner</a>. Spritemate now has a VICE Snapshot Monitor and sprite grabber, making it even easier to import sprites from any game. Just export a snapshot image from VICE (make sure to use the latest version) and load it into spritemate. Now from the file menu choose the VICE Snapshot Monitor and import sprite data. For a quick overview, enter "help" into the monitor and watch this <a target="_blank" href="https://www.youtube.com/watch?v=UdFc7yFCZGw">great tutorial video</a> from Elliot himself.
            </p>

            <h1>25.12.27-01</h1>
            <h2>Security patches.</h2>
            <p>
            - Housecleaning to address some library updates.<br/>
            - Switching to date based version numbering
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
