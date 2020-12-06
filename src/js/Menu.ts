import $ from "jquery";

export default class Menu {
  constructor(public window, public config) {
    this.config = config;
    this.window = window;

    let template = `
    <div id="menu">
      <div class ="iconset" id="icon-load">
            <img src="img/ui/icon-load.png" class="icon" title="load">
            <div class="icontext">load</div>
        </div>
        <div class ="iconset" id="icon-save">
            <img src="img/ui/icon-save.png" class="icon" title="save">
            <div class="icontext">save</div>
        </div>
        <div class ="iconset" id="icon-undo">
            <img src="img/ui/icon-undo.png" class="icon" title="undo">
            <div class="icontext">undo</div>
        </div>
        <div class ="iconset" id="icon-redo">
            <img src="img/ui/icon-redo.png" class="icon" title="redo">
            <div class="icontext">redo</div>
        </div>
        <div class ="iconset" id="icon-move">
            <img src="img/ui/icon-move.png" class="icon" id="image-icon-move" title="move tool (m)">
            <div class="icontext">move</div>
        </div>
        <div class ="iconset" id="icon-draw">
            <img src="img/ui/icon-draw-hi.png" class="icon" id="image-icon-draw" title="draw tool (d)">
            <div class="icontext">draw</div>
        </div>
        <div class ="iconset" id="icon-erase">
            <img src="img/ui/icon-erase.png" class="icon" id="image-icon-erase" title="erase tool (e)">
            <div class="icontext">erase</div>
        </div>
        <div class ="iconset" id="icon-fill">
            <img src="img/ui/icon-fill.png" class="icon"  id="image-icon-fill" title="fill tool (f)">  
            <div class="icontext">fill</div>
        </div>
        <!--
        <div class ="iconset" id="icon-fullscreen">
            <img src="img/ui/icon-fullscreen.png" class="icon" title="toggle fullscreen (f)">  
            <div class="icontext">fullscr.</div>
        </div>
        <div class ="iconset" id="icon-settings">
            <img src="img/ui/icon-settings.png" class="icon"  title="settings">  
            <div class="icontext">settings</div>
        </div>
        
        <div class ="iconset" id="icon-help">
            <img src="img/ui/icon-help.png" class="icon"  title="info">  
            <div class="icontext">help</div>
        </div>
         <div class ="iconset" id="icon-info">
            <img src="img/ui/icon-info.png" class="icon"  title="info">  
            <div class="icontext">info</div>
        </div>  
        -->
      </div>
    `;

    $("#window-" + this.window).append(template);
  }
}
