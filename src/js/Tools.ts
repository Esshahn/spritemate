import { dom } from "./helper";

export default class Tools {
  constructor(public window: number, public config) {
    this.config = config;
    this.window = window;

    const template = `
    <div id="menu">
      <div class ="iconset icon-hover" id="icon-load">
            <img src="img/ui/icon-load.png" class="icon" title="load">
            <div class="icontext">load</div>
        </div>
        <div class ="iconset icon-hover" id="icon-save">
            <img src="img/ui/icon-save.png" class="icon" title="save">
            <div class="icontext">save</div>
        </div>
        <div class ="iconset icon-hover" id="icon-undo">
            <img src="img/ui/icon-undo.png" class="icon" title="undo">
            <div class="icontext">undo</div>
        </div>
        <div class ="iconset icon-hover" id="icon-redo">
            <img src="img/ui/icon-redo.png" class="icon" title="redo">
            <div class="icontext">redo</div>
        </div>
        <div class ="iconset icon-hover" id="icon-move">
            <img src="img/ui/icon-move.png" class="icon" id="image-icon-move" title="move tool (m)">
            <div class="icontext">move</div>
        </div>
        <div class ="iconset icon-hover" id="icon-draw">
            <img src="img/ui/icon-draw-hi.png" class="icon" id="image-icon-draw" title="draw tool (d)">
            <div class="icontext">draw</div>
        </div>
        <div class ="iconset icon-hover" id="icon-erase">
            <img src="img/ui/icon-erase.png" class="icon" id="image-icon-erase" title="erase tool (e)">
            <div class="icontext">erase</div>
        </div>
        <div class ="iconset icon-hover" id="icon-fill">
            <img src="img/ui/icon-fill.png" class="icon"  id="image-icon-fill" title="fill tool (f)">  
            <div class="icontext">fill</div>
        </div>
      </div>
    `;

    dom.append("#window-" + this.window, template);
  }
}
