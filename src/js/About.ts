
import { dom } from "./helper";
export default class About {
  constructor(public window: number, public config, public eventhandler) {
    this.config = config;
    this.window = window;
    this.eventhandler = eventhandler;

    const template = `
    <div id="info">
        <img src="logo-menu.svg" width="300px" id="logo" alt="spritemate">
        <p>The Commodore 64 sprite editor</p>

        <fieldset>
            <legend>Release Notes</legend>

            <h1>v26.01.02</h1>

            <h2>Playfield</h2>
            <p>
            This took a lot of work and refactoring... Spritemate now has a feature called playfield, which you can access from the View menu. The playfield is basically a canvas where you can drag around  sprites to arrange them for multi-sprite layouts. You can stack sprites onto others, stretch them and use the grid mode for pixel exact placement. Adding a sprite to the playfield is done via a new button in the sprite list - not the most intuitive yet, but working. Hope you like it!
            </p>

            <h2>Changes</h2>
            <ul>
            <li>Another day, another code refactoring. Hopefully no breaking change, but a lot got shuffled around</li>
            <li>The usual UI changes</li>
            </ul>

            <hr>

            <h1>v26.01.01</h1>

            <h2>Import Spritesheets</h2>
            <p>
            Happy New Year! I've updated the sprite import from PNG, it now does even more magic and identifies spritesheets. It should correctly identify if a sprite is single- or multicolor and it should be smart enough to set the multicolor and singlecolor values based on their occurance in the image. It's tricky stuff and I'm sure there will be edge cases where it does not work (first edge case: don't use borders between sprites), but its a good start!
            </p>

            <h2>Changes</h2>
            <ul>
            <li>More code refactoring, working with AI is a blast, but can easily introduce bloated code.</li>
            <li>New Tooltip design, which should provide better information about shortkeys</li>
            <li>More robust local storage management when data is corrupted or the data format changed</li>
            <li>Sprite numbering starts at 1 now, making the UI more consistent</li>
            <li>Added info toggle for sprite number and name in the list view</li>
            <li>much improved drag'n'drop sorting in list view</li>
            </ul>

            <hr>

            <h1>v25.12.30</h1>

            <h2>Import Sprite from PNG</h2>
            <p>
            Spritemate can now import a 24x21 pixel image in PNG format and convert it into a sprite. The import happens automagical, meaning that Spritemate tries to identify the right format (singlecolor or multicolor) based on pixel width and the right colors based on euclidean distance. 
            </p>

            <h2>Changes</h2>
            <ul>
            <li>Cleaned up the menu bar again</li>
            <li>Importing a PNG image or a VCF snapshot now append to the current sprites instead of replacing</li>
            <li>reverted back to magnifying glasses icons for zoom (thx2 TheSarge)</li>
            <li>changed selection move behavior from copy to cut (thx2 TheSarge)</li>
            <li>select tool is now an on/off toggle</li>
            <li>changed most keyboard shortcuts from 'shift' to 'control' (thx2 TheSarge)</li>
            </ul>

            <hr>

            <h1>v25.12.29</h1>

            <h2>Animations!</h2>
            <p>
            Oh boy, I've dodged that bullet literally for years now, but thanks to AI support, I finally got some basic animation support in. The animation window is closed by default and can be opened from the View menu. The functionality is simple as of now: you can enter a start and end sprite number and the desired fps (frames per second) and finally the mode of animation (ping pong or restarting). You can't have more than one animation defined at the moment, but the animation information is saved in the Spritemate file format, too.
            </p>

            <h2>Spritesheet Export</h2>
            <p>
            Sprites can now be exported as a Spritesheet PNG image. You can specify the number of rows and Spritemate tries to evenly spread the sprites. Furthermore a border can be applied as an option. 
            </p>

            <h2>Automatic Local Storage Saves</h2>
            <p>
            No more accidental work loss! Spritemate now saves the current workstage in your browser's local storage. This means that if you accidentally reload the page or revisit Spritemate after a while, your sprites are still there for you.
            </p>
            
            <h2>Changes</h2>
            <ul>
            <li>the filename can now be set from the menu bar</li>
            <li>completely restructured the Save and Export modals and made all but one obsolte. Instead, all options are now available directly from the menu bar</li>
            <li>added the PALette color palette (thx2 Retrofan)</li>
            <li>removed some redundant options from the View menu</li>
            </ul>
            
            <hr>
            
            <h1>v25.12.28</h1>
            <h2>Marquee tool</h2>
            <p>
            This release adds the probably most requested feature, a select tool. You can now activate it from the tool bar and draw a rectangle around an area. The draw, erase and fill operations now only work inside the selection. Also, you can select the move tool and move the selection around to copy the content to another location. Once you're done, hit the Escape (ESC) key to deselect.
            </p>

            <h2>No more jQuery and jQueryUI</h2>
            <p>
            While spritemate was working fine using the now deprecated jQueryUI, I wasn't happy with all the extra code and quirks for window management. With the help of the trusty AI overlord, I finally took the effort to remove all jQuery code from the project. This might result in minor visual issues, but hopefully nothing breaks functionally. I'm quite happy it's finally done.
            </p>

            <hr>

            <h1>v25.12.27</h1>
            <h2>VICE Snapshot Monitor</h2>
            <p>
            Finally a feature release, thanks to the amazing contribution by <a target="_blank" href="https://github.com/elliot2">Elliot Tanner</a>. Spritemate now has a VICE Snapshot Monitor and sprite grabber, making it even easier to import sprites from any game. Just export a snapshot image from VICE (make sure to use the latest version) and load it into spritemate. Now from the file menu choose the VICE Snapshot Monitor and import sprite data. For a quick overview, enter "help" into the monitor and watch this <a target="_blank" href="https://www.youtube.com/watch?v=UdFc7yFCZGw">great tutorial video</a> from Elliot himself.
            </p>

            <h2>The Age Of Vibe Coding</h2>
            <p>
            Ahhhh.... it's finally time to vibe code some life into Spritemate again.<br/>
            Let's see how far it gets us today:
            <ul>
            <li>Cleaned up and refactored codebase and threw away around 20% of the code</li>
            <li>Nondestrucive save options are now under "Save" (Spritemate & Spritepad data)</li>
            <li>Destructive save options are now under "Export" (Assembly, BASIC, PNG)</li>
            <li>VICE snapshots can now be imported by clicking "Import VICE (*.vsf) Snapshot"</li>
            <li>When importing VICE snapshots, the monitor will be opened automatically</li>
            <li>Moved the VICE snapshot window from the "file" to the "view" menu</li>
            <li>Added the option to export the curent sprite as PNG image</li>
            <li>Added the option to export all sprites as PNG images in a ZIP file</li>
            <li>Tweaked wording of the menu items to be more concise</li>
            <li>Housecleaning to address some library updates.</li>
            <li>Switching to date based version numbering</li>
            </ul>
            </p>



        </fieldset>

        <button id="button-info">Let's go!</button>
    </div>
    `;

    dom.append("#window-" + this.window, template);

    // Add close button to the dialog title bar
    // Wait for next tick to ensure dialog is created
    setTimeout(() => {
      const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
      if (dialogElement) {
        const titleBar = dialogElement.querySelector(".dialog-titlebar");
        if (titleBar) {
          const closeButton = document.createElement("div");
          closeButton.className = "window-close-button";
          titleBar.appendChild(closeButton);

          closeButton.addEventListener("click", () => {
            dialogElement.close();
            this.eventhandler.onLoad();
          });
        }
      }
    }, 0);

    dom.sel("#button-info").onclick = () => {
      const dialogElement = document.querySelector(`#dialog-window-${this.window}`) as HTMLDialogElement;
      if (dialogElement) {
        dialogElement.close();
      }
      this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
    };

    // Prevent auto-scroll to first link by focusing the fieldset
    const fieldset = dom.sel("#info fieldset") as HTMLElement;
    if (fieldset) {
      fieldset.setAttribute("tabindex", "0");
      setTimeout(() => {
        fieldset.focus();
        fieldset.scrollTop = 0;
      }, 0);
    }
  }
}
