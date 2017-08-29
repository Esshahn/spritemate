

class Tools
{
  

  constructor(window,config)
  {
    this.window = window;
    this.setup_icons();
  }

  setup_icons()
  {

    let template = `

    <img src="img/icon-shift-left.png" class="icon" id="icon-shift-left"><img src="img/icon-shift-right.png" class="icon" id="icon-shift-right"><img src="img/icon-shift-up.png" class="icon" id="icon-shift-up"><img src="img/icon-shift-down.png" class="icon" id="icon-shift-down"><img src="img/icon-flip-horizontal.png" class="icon" id="icon-flip-horizontal"><img src="img/icon-flip-vertical.png" class="icon" id="icon-flip-vertical">

    `;
    $("#window-" + this.window).append(template);
  }
}
