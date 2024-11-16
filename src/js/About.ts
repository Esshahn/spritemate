
import { dom } from "./helper";
export default class About {
  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img autofocus src="logo-menu.svg" width="300px" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor, v${this.config.version.toFixed(
          2
        )}</p>

        <fieldset>
            <h1>Release notes</h1>

            <h1>v1.4 - 2024.11.16</h1>
            <h2>This update should not introduce any major changes or issues and is meant to update the framework and clean up the codebase. New features will follow soon, if you like to test them early and give valuable feedback, visit <a href="https://beta.spritemate.com">https://beta.spritemate.com</a>.</h2>
            <br/>
            <p>
            - Removed webpack and many dependancies. Spritemate now uses Vite<br/>
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
