

class Load
{

  constructor(config,eventhandler)
  {
    this.config = config;
    this.eventhandler = eventhandler;
    this.setup_load_input();
  }

  setup_load_input()
  {
    let element = document.createElement('div');
    element.innerHTML = '<input type="file" id="input-load" style="display: none">';
    let fileInput = element.firstChild;
    document.body.append(fileInput);
    var that = this;
    fileInput.addEventListener('change',function() {  that.read_file_data(fileInput); });
  }

  read_file_data(fileInput)
  {
    var file = fileInput.files[0];
 
      if (file.name.match(/\.(spm|spd|spr)$/)) 
      {
        var reader = new FileReader();
        reader.onload = () => 
        {
          if (file.name.match(/\.(spm)$/)) 
          {
            this.parse_file_spritemate(reader.result);
          }
          if (file.name.match(/\.(spd|spr)$/)) 
          {
            this.parse_file_spritepad(reader.result);
          }
          this.eventhandler.onLoad();
          $('#input-load').remove();    // by removing the input field and reassigning it, reloading the same file will work
          this.setup_load_input();
        };

        if (file.name.match(/\.(spm)$/))
        {
          reader.readAsText(file);
        } 

        if (file.name.match(/\.(spd|spr)$/)) 
        {
          reader.readAsBinaryString(file);
        } 
            
      } else {
          alert("File not supported, .spm or .spd files only");
      }
  }


  parse_file_spritemate(file) 
  {
    this.imported_file = JSON.parse(file);
  }

 parse_file_spritepad(file) 
  {
    
    this.sprite_count = Math.floor( file.length / 64 );
    console.log("Number of sprites: "+ this.sprite_count);
    console.log("bytes left: "+ file.length % 64);

    // check byte 72 which is the indidual color (low nibble) and the multicolor state (high nibble)
    if (file.charCodeAt(72)>127)
    {
      this.multicolor = true;
      this.pencolor = file.charCodeAt(72) - 128;
    } else {
      this.multicolor = false;
      this.pencolor = file.charCodeAt(72)
    }

    this.imported_file = {};
    this.imported_file.colors = {"t": file.charCodeAt(6), "m1": file.charCodeAt(7), "m2": file.charCodeAt(8)};
    this.imported_file.sprites = [];
    this.imported_file.current_sprite = 0;
    this.imported_file.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
    
    var sprite = {
      color: this.pencolor,
      multicolor: this.multicolor,
      double_x : false,
      double_y : false,
      pixels: []
    };

    var binary = []; 
    for(let i=9; i<65 + 7; i++)
    {
     // convert data in SPR file into binary
     let converted_number = ( "0000000" + file.charCodeAt(i).toString(2) ).slice(-8);
     var bit = converted_number.match(/.{1,2}/g);
     for (let j=0; j<bit.length; j++)
     {
      let pen;

      if(this.multicolor)
      {
        if (bit[j] == "00")  pen = "t";
        if (bit[j] == "10")  pen = "i";
        if (bit[j] == "01")  pen = "m1";
        if (bit[j] == "11")  pen = "m2";

        binary.push( pen );
        binary.push( pen );
      } else {

        if (bit[j][0] == "0")
        {
          binary.push ("t");
        } else {
          binary.push ("i");
        }

        if (bit[j][1] == "0")
        {
          binary.push ("t");
        } else {
          binary.push ("i");
        }
      }


     }
    }

    var spritedata = [];
    var line = 0;
    for(let i=0; i<binary.length; i++)
    {
      spritedata.push(binary[i]);

      line ++;
      
      if(line == 24)
      {
        sprite.pixels.push(spritedata);

        line = 0;
        spritedata = [];
        console.log("line");
      }
      
    }
    
    this.imported_file.sprites.push(sprite);

  }





  get_imported_file()
  {
    return this.imported_file;
  }

}


