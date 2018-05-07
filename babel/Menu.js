
class Menu
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    

    let template = `
    <div id="menu">
      <div class ="iconset" id="icon-load">
            <img src="img/icon3/icon-load.png" class="icon" title="load">
            <div class="icontext">load</div>
        </div>
        <div class ="iconset" id="icon-save">
            <img src="img/icon3/icon-save.png" class="icon" title="save">
            <div class="icontext">save</div>
        </div>
        <div class ="iconset" id="icon-undo">
            <img src="img/icon3/icon-undo.png" class="icon" title="undo">
            <div class="icontext">undo</div>
        </div>
        <div class ="iconset" id="icon-redo">
            <img src="img/icon3/icon-redo.png" class="icon" title="redo">
            <div class="icontext">redo</div>
        </div>
        <div class ="iconset" id="icon-draw">
            <img src="img/icon3/icon-draw-hi.png" class="icon" id="image-icon-draw" title="draw tool (d)">
            <div class="icontext">draw</div>
        </div>
        <div class ="iconset" id="icon-fill">
            <img src="img/icon3/icon-fill.png" class="icon"  id="image-icon-fill" title="fill tool (d)">  
            <div class="icontext">fill</div>
        </div>
        <div class ="iconset" id="icon-fullscreen">
            <img src="img/icon3/icon-fullscreen.png" class="icon" title="toggle fullscreen (f)">  
            <div class="icontext">fullscr.</div>
        </div>
        <div class ="iconset" id="icon-settings">
            <img src="img/icon3/icon-settings.png" class="icon"  title="settings">  
            <div class="icontext">settings</div>
        </div>
        <div class ="iconset" id="icon-help">
            <img src="img/icon3/icon-help.png" class="icon"  title="info">  
            <div class="icontext">help</div>
        </div>
         <div class ="iconset" id="icon-info">
            <img src="img/icon3/icon-info.png" class="icon"  title="info">  
            <div class="icontext">info</div>
        </div>   
      </div>
    `;

    $("#window-"+this.window).append(template);
  }
}