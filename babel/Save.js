class Save
{

  constructor(window,config,eventhandler)
  {
    this.config = config;
    this.window = window;
    this.default_filename ="mysprites";
    this.eventhandler = eventhandler;

    let template = `
    <div id="window-save">
      <h1>Save Data</h1>
      <h2>The file will be saved to your default download location</h2>

      <div class="center">
        Filename: <input autofocus type="text" id="filename" name="filename" value="${this.default_filename}">
      </div>
      <br/>
      <fieldset>
        <legend>spritemate // *.spm</legend>
        <button id="button-save-spm">Save as Spritemate</button>
        <p>JSON file format for spritemate. Recommended as long as you are not done working on the sprites.</p>
      </fieldset>
    
      <fieldset>
        <legend>Spritepad // *.spd</legend>
        <div class="fieldset right">
          <button id="button-save-spd">Save as 2.0</button>
          <button id="button-save-spd-old">Save as 1.8.1</button>
        </div>
        <p>Choose between the 2.0 beta or the older 1.8.1 file format, which is recommended if you want to import the data in your C64 project.</p>
      </fieldset>

      <fieldset>
        <legend>assembly source // *.txt</legend>
        <div class="fieldset right">
          <button id="button-save-source-kick">KICK ASS syntax</button>
          <button id="button-save-source-acme">ACME syntax</button>
        </div>
        <p>A text file containing the sprite data in assembly language.</p>
      </fieldset>

      <div id="button-row">
        <button id="button-save-cancel" class="button-cancel">Cancel</button>
      </div>
    </div> 
    `;

    $("#window-"+this.window).append(template);
    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-save-cancel').mouseup((e) => this.close_window());
    $('#button-save-spm').mouseup((e) => this.save_spm());
    $('#button-save-spd').mouseup((e) => this.save_spd("new"));
    $('#button-save-spd-old').mouseup((e) => this.save_spd("old"));
    $('#button-save-source-kick').mouseup((e) => this.save_source("kick"));
    $('#button-save-source-acme').mouseup((e) => this.save_source("acme"));

    $( "#filename" ).keyup((e) => 
    {
      this.default_filename = $("#filename").val();
      if (this.default_filename.length < 1)
      {
        $("#filename").addClass("error");
        $('#button-save-spm').prop('disabled', true).addClass("error");
        $('#button-save-spd').prop('disabled', true).addClass("error");
        $('#button-save-spd-old').prop('disabled', true).addClass("error");
        $('#button-save-source-kick').prop('disabled', true).addClass("error");
        $('#button-save-source-acme').prop('disabled', true).addClass("error");
      }else{
        $("#filename").removeClass("error");
        $('#button-save-spm').prop('disabled', false).removeClass("error");
        $('#button-save-spd').prop('disabled', false).removeClass("error");
        $('#button-save-spd-old').prop('disabled', false).removeClass("error");
        $('#button-save-source-kick').prop('disabled', false).removeClass("error");
        $('#button-save-source-acme').prop('disabled', false).removeClass("error");
      }
    });


   
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file

  save_spm()
  {
      let filename = this.default_filename + ".spm";
      var file = new Blob([JSON.stringify(this.savedata)], {type: "text/plain"});
      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
      }

      status("File has been saved.");
      this.close_window();
  }

  save_source(format)
  {

    let filename = this.default_filename + ".txt";
    var data = this.create_source(format);
    var file = new Blob([data], {type: "text/plain"});

    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }

    status("File has been saved.");
    this.close_window();
  }

  save_spd(format)
  {
      let filename = this.default_filename + ".spd";
      var hexdata = this.create_spd_array(format);
      var bytes = new Uint8Array(hexdata);
      var file = new Blob([bytes], {type: "application/octet-stream"});

      if (window.navigator.msSaveOrOpenBlob) // IE10+
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
          var a = document.createElement("a"),
                  url = URL.createObjectURL(file);
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);  
          }, 0); 
      }

      status("File has been saved.");
      this.close_window();
  }

  create_spd_array(format)
  {

    // WIZBALL!!
    // var data = new Array(83,80,68,1,0,16,0,11,1,0,0,0,0,255,0,3,254,192,3,105,128,13,20,224,13,52,224,14,235,208,62,190,168,59,215,232,45,65,120,52,0,28,45,65,116,43,215,212,58,189,84,10,150,80,10,169,80,14,150,80,2,169,64,2,85,64,0,149,0,0,0,0,133,0,24,40,125,72,104,68,56,43,88,48,64,62,108,112,59,84,39,39,42,127,83,107,70,58,46,92,53,67,63,111,122,61,87,2,2,2,3,3,3,3,3,2,2,4,5,8,3,8,3,3,128,128,128,128,128,144,128,128,128,144,128,128,128,144,128,128,128);

    // SPD file format information
    // bytes 00,01,02 = "SPD"
    // byte 03 = version number of spritepad
    // byte 04 = number of sprites
    // byte 05 = number of animations
    // byte 06 = color transparent
    // byte 07 = color multicolor 1
    // byte 08 = color multicolor 2
    // byte 09 = start of sprite data
    // byte 73 = 0-3 color, 4 overlay, 7 multicolor/singlecolor
    // bytes xx = "00", "00", "01", "00" added at the end of file (SpritePad animation info)
    
    var data = []

    if (format == "new")
    {
      data.push(83,80,68); // the "SPD" header that identifies SPD files apparently
      data.push(1,this.savedata.sprites.length-1,0); // number of sprites
    }

    data.push(this.savedata.colors.t,this.savedata.colors.m1,this.savedata.colors.m2); // colors
    
    var byte = "";
    var bit = "";

    for (var j=0; j<this.savedata.sprites.length; j++)  // iterate through all sprites
    {

      var spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      
      var is_multicolor = this.savedata.sprites[j].multicolor;
      var is_overlay = this.savedata.sprites[j].overlay;

      var stepping = 1; 
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored

      // iterate through the pixel data array 
      // and create a hex values based on multicolor or singlecolor
      for(var i=0; i<spritedata.length; i=i+8)
      {
        for (let k=0; k<8; k=k+stepping)
        {
          let pen = spritedata[i+k];

          if (is_multicolor)
          {
            if (pen == "i") bit = "10";
            if (pen == "t") bit = "00";
            if (pen == "m1") bit = "01";
            if (pen == "m2") bit = "11"; 
          }

          if (!is_multicolor)
          {
            bit = "1";
            if (pen == "t") bit = "0";
          } 
         
          byte = byte + bit;
        }

        let hex = parseInt(byte, 2);
        data.push(hex);
        byte = "";

      }

      // finally, we add multicolor, overlay and color info for byte 64
      
      // bit 7 of the high nibble stands for multicolor
      let multicolor = "00";
      if (is_multicolor) multicolor = "10";

      // bit 4 of the high nibble stands for overlay
      let overlay = "00";
      if (is_overlay) overlay = "01";

      let high_nibble = multicolor + overlay;

      var low_nibble = ("000" + (this.savedata.sprites[j].color >>> 0).toString(2)).slice(-4);
      
      let color_byte = parseInt(high_nibble + low_nibble, 2);
      data.push(color_byte); // should be the individual color
    }

    if (format == "new")
    {
      // almost done, just add some animation data crap at the end
      data.push(0,0,1,0); // SpritePad animation info (currently unused) 
    }

    return data;
  }


  create_source(format)
  {

    var comment = ";";
    var prefix = "!";
    var label_suffix = "";

    if (format == "kick")
    {
      comment = "//";
      prefix = ".";
      label_suffix =":";
    }

    var data = "";

    data += "\n"+comment+" generated with spritemate on " + new Date().toLocaleString();

    data += "\n\nLDA #" + this.savedata.colors.m1 + " "+comment+" sprite multicolor 1";
    data += "\nSTA $D025";
    data += "\nLDA #" + this.savedata.colors.m2 + " "+comment+" sprite multicolor 2";
    data += "\nSTA $D026";
    data += "\n";
    
    var byte = "";
    var bit = "";

    for (var j=0; j<this.savedata.sprites.length; j++)  // iterate through all sprites
    {

      var spritedata = [].concat.apply([], this.savedata.sprites[j].pixels); // flatten 2d array
      
      var is_multicolor = this.savedata.sprites[j].multicolor;
      var stepping = 1; 
      if (is_multicolor) stepping = 2; // for multicolor, half of the array data can be ignored

      data +="\n\nsprite_" + (j+1) + label_suffix + "\n";
      // iterate through the pixel data array 
      // and create a hex values based on multicolor or singlecolor
      for(var i=0; i<spritedata.length; i=i+8)
      {

        if (i%64 == 0)
        {
          data = data.substring(0, data.length - 1);
          data +="\n"+prefix+"byte ";
        }

        for (let k=0; k<8; k=k+stepping)
        {
          let pen = spritedata[i+k];

          if (is_multicolor)
          {
            if (pen == "i") bit = "10";
            if (pen == "t") bit = "00";
            if (pen == "m1") bit = "01";
            if (pen == "m2") bit = "11"; 
          }

          if (!is_multicolor)
          {
            bit = "1";
            if (pen == "t") bit = "0";
          } 
         
          byte = byte + bit;
        }

        let hex = parseInt(byte, 2).toString(16);
        data += "$"+("0"+hex).slice(-2)+",";
        byte = "";

      }

      // finally, we add multicolor and color info for byte 64
      var high_nibble = "0000";
      if (is_multicolor) high_nibble = "1000";

      var low_nibble = ("000" + (this.savedata.sprites[j].color >>> 0).toString(2)).slice(-4);
      
      let color_byte = "$" +("0" + parseInt(high_nibble + low_nibble, 2).toString(16)).slice(-2);
      data += color_byte; // should be the individual color
    }
    
    return data;
  }

  set_save_data(savedata)
  {
    this.savedata = savedata;
  }

  close_window()
  {
      $("#window-"+this.window).dialog( "close" );
      this.eventhandler.onLoad(); // calls "regain_keyboard_controls" method in app.js
  }


}


