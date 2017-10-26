

class Settings
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;
    this.custom_colors = config.colors;

    let template = `
    <div id="modal">
        <h1 autofocus>Settings</h1>
        <h2>Your settings will be saved locally in your browser storage</h2>
        <fieldset>
            <legend>Color palette</legend>
            
            <select name="colorpalette" id="colorpalette">
              <option "selected">Colodore</option>
              <option>Pepto</option>
              <option>Vice</option>
              <option>Custom</option>
            </select>

            <br/>
            <br/>
            <p>Custom values</p>

            
            <div class="settings_colorfield">
                <div class="settings_color" id="col-0"></div>
                <input type="text" class="settings_colorvalue" id="colval-0" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-1"></div>
                <input type="text" class="settings_colorvalue" id="colval-1" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-2"></div>
                <input type="text" class="settings_colorvalue" id="colval-2" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-3"></div>
                <input type="text" class="settings_colorvalue" id="colval-3" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-4"></div>
                <input type="text" class="settings_colorvalue" id="colval-4" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-5"></div>
                <input type="text" class="settings_colorvalue" id="colval-5" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-6"></div>
                <input type="text" class="settings_colorvalue" id="colval-6" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-7"></div>
                <input type="text" class="settings_colorvalue" id="colval-7" name="" value="">
            </div>

            <div class="settings_colorfield">
                <div class="settings_color" id="col-8"></div>
                <input type="text" class="settings_colorvalue" id="colval-8" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-9"></div>
                <input type="text" class="settings_colorvalue" id="colval-9" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-10"></div>
                <input type="text" class="settings_colorvalue" id="colval-10" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-11"></div>
                <input type="text" class="settings_colorvalue" id="colval-11" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-12"></div>
                <input type="text" class="settings_colorvalue" id="colval-12" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-13"></div>
                <input type="text" class="settings_colorvalue" id="colval-13" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-14"></div>
                <input type="text" class="settings_colorvalue" id="colval-14" name="" value="">
            </div>
            <div class="settings_colorfield">
                <div class="settings_color" id="col-15"></div>
                <input type="text" class="settings_colorvalue" id="colval-15" name="" value="">
            </div>
        

        </fieldset>

        <button id="button-settings">Done</button>

    </div>
    `;
    $("#window-"+this.window).append(template);

    // assign jquery ui style for the dropdown select
    $( function() 
    {
        $( "#colorpalette" ).selectmenu();
    } );

    this.assign_colors(this.custom_colors);

    this.init_inputfields(this.custom_colors);

    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-settings').mouseup((e) => $("#window-"+this.window).dialog( "close" ));

  }

  assign_colors(colors)
  {
    for (let i=0; i<colors.length;i++)
    {
      $("#colval-"+i).val(colors[i]);
      $("#col-"+i).animate({backgroundColor: colors[i]}, 'fast');
    }
  }

  init_inputfields(colors)
  {
    let that = this;
    for (let i=0; i<colors.length;i++)
    {
      $("#colval-"+i).change(function(){
        that.update_color(i);
      });
    }   
  }

  update_color(color)
  {
    let colvalue = $("#colval-"+color).val();
    colvalue = "#" + colvalue.replace(/#/g,"");
    $("#colval-"+color).val(colvalue);
    $("#col-"+color).animate({backgroundColor: colvalue}, 'fast');
  }



}


