

class Overlays
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
      <img src="img/icon3/icon-preview-overlay.png" id="icon-preview-overlay" class="icon-inputfield" title="overlay on/off">
      <input type="text" id="input-overlay" class="ui-inputfield" title="enter a list of sprites (1,2,3) or leave blank for next sprite" value="next sprite">
    `;

    $("#window-"+this.window).append(template);
   
  }

  update(all_data)
  {
 
  }


}


