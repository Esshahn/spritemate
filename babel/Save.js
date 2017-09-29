

class Save
{

  constructor(window,config)
  {
    this.config = config;
    this.window = window;

    let template = `
    <div id="window-save">
      <h1 autofocus>Save Data</h1>
      <h2>The file will be saved to your default download location</h2>
      <br/>
      <fieldset>
        <legend>Spritemate // *.spm</legend>
        <button id="button-save-spm">Save as Spritemate *.spm</button>
        <p>The natural format for Spritemate. Recommended as long as you are not done working on the sprites.</p>
      </fieldset>
    
      <fieldset>
        <legend>Spritepad // *.spd</legend>
        <button id="button-save-spd">Save as Spritepad *.spd</button>
        <p>Most common Sprite editing software on Windows.</p>
      </fieldset>
  <!--
      <fieldset>
        <legend>Binary // *.bin</legend>
        <button id="button-save">Save as Binary *.bin</button>
        <p>Ready to use binary data.</p>
      </fieldset>

      <fieldset>
        <legend>ACME Source // *.asm</legend>
        <button id="button-save">Save as ACME *.asm</button>
        <p>Compilable source code for ACME assembler.</p>  
      </fieldset>
    -->
      <div id="button-row">
        <button id="button-save-cancel" class="button-cancel">Cancel</button>
      </div>
    </div> 
    `;

    $("#window-"+this.window).append(template);
    $("#window-"+this.window).dialog({ show: 'fade', hide: 'fade' });
    $('#button-save-cancel').mouseup((e) => $("#window-"+this.window).dialog( "close" ));
    $('#button-save-spm').mouseup((e) => this.save_spm(this.savedata, 'myfilename.spm'));
    $('#button-save-spd').mouseup((e) => this.save_spd('myfilename.spd'));
   
  }

  // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file

  save_spm(data, filename, type)
  {

      var file = new Blob([JSON.stringify(data)], {type: "text/plain"});
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

      $("#window-"+this.window).dialog( "close" );
  }

  save_spd(filename)
  {
      var hexdata = this.create_spd_array();

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

      $("#window-"+this.window).dialog( "close" );
  }

  create_spd_array()
  {

    // WIZBALL!!
    // var data = new Array(83,80,68,1,0,16,0,11,1,0,0,0,0,255,0,3,254,192,3,105,128,13,20,224,13,52,224,14,235,208,62,190,168,59,215,232,45,65,120,52,0,28,45,65,116,43,215,212,58,189,84,10,150,80,10,169,80,14,150,80,2,169,64,2,85,64,0,149,0,0,0,0,133,0,24,40,125,72,104,68,56,43,88,48,64,62,108,112,59,84,39,39,42,127,83,107,70,58,46,92,53,67,63,111,122,61,87,2,2,2,3,3,3,3,3,2,2,4,5,8,3,8,3,3,128,128,128,128,128,144,128,128,128,144,128,128,128,144,128,128,128);

    // SPD file format information
    // bytes 00,01,02 = "SPD"
    // byte 03 = 
    // byte 04 = number of sprites
    // byte 05 =
    // byte 06 = color transparent
    // byte 07 = color multicolor 1
    // byte 08 = color multicolor 2
    // byte 09 = start of sprite data
    // byte 73 = multicolor (high nibble) and color individual (low nibble)

    var data = []
    data.push(83,80,68); // the "SPD" header that identifies SPD files apparently
    data.push(0,this.savedata.sprites.length-1,0); // what do these bytes do in Spritepad?
    data.push(this.savedata.colors.t,this.savedata.colors.m1,this.savedata.colors.m2);
    for(let i=0; i<63; i++)
    {
      data.push(Math.floor(Math.random()*255)); // 63 bytes of sprite data
    }
    data.push(4); // should be the individual color
    console.log(data);
    return data;
  }


  set_save_data(savedata)
  {
    this.savedata = savedata;
  }


}


