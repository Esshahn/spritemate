

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
    $('#button-save-spd').mouseup((e) => this.save_spd(this.savedata, 'myfilename.spd'));
   
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

  save_spd(data, filename, type)
  {
      var hexdata = this.create_spd_array();

      var byteArray = new Uint8Array(hexdata.match(/.{2}/g).map(e => parseInt(e, 16)));

      var file = new Blob([byteArray], {type: "application/octet-stream"});

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

    var data = new Array(122, 222, 12, 18, 255);

    return data;
  }


  set_save_data(savedata)
  {
    this.savedata = savedata;
  }


}


