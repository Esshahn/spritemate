

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
    this.file = file;
    this.start_of_sprite_data = 9;
    this.sprite_size = 64;
    this.gravitational_const_of_the_universe = 8; // TODO: understand this
 
    this.create_sprite_data_object();
    for (let i=0; i<this.number_of_sprites; i++) this.convert_sprite_data_to_internal_format(i);
    
  }


  create_sprite_data_object()
  {
    // colors for transparent, multicolor 1 and multicolor 2
    this.color_trans = this.file.charCodeAt(6);
    this.color_multi1 = this.file.charCodeAt(7);
    this.color_multi2 = this.file.charCodeAt(8);
    this.number_of_sprites = parseInt(this.file.charCodeAt(4),10)+1;

    this.imported_file = {};
    this.imported_file.colors = {"t": this.color_trans, "m1": this.color_multi1, "m2": this.color_multi2};
    this.imported_file.sprites = [];
    this.imported_file.current_sprite = 0;
    this.imported_file.pen = "i"; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
  }

  convert_sprite_data_to_internal_format(sprite_number)
  {

    // check byte 64 which is the indidual color (low nibble) and the multicolor state (high nibble)
    var colorpos = this.gravitational_const_of_the_universe + (sprite_number+1)*this.sprite_size;
    
    this.multicolor = false;

    if (this.file.charCodeAt(colorpos)>=128) this.multicolor = true;

    // this reads in the lower nibble of the byte and converts it do decimal. 
    this.pencolor = parseInt( (this.file.charCodeAt(colorpos).toString(2).slice(-4)) , 2);

    var sprite = {
      color: this.pencolor,
      multicolor: this.multicolor,
      double_x : false,
      double_y : false,
      pixels: []
    };

    var binary = []; 
    for(let i=(this.start_of_sprite_data + sprite_number * this.sprite_size); i<((sprite_number+1) * this.sprite_size) + this.gravitational_const_of_the_universe; i++)
    {
     // convert data in SPR file into binary
     var byte = ( "0000000" + this.file.charCodeAt(i).toString(2) ).slice(-8).match(/.{1,2}/g);
     for (let j=0; j<byte.length; j++)
     {
      let pen;

      if(this.multicolor)
      {
        if (byte[j] == "00")  pen = "t";
        if (byte[j] == "10")  pen = "i";
        if (byte[j] == "01")  pen = "m1";
        if (byte[j] == "11")  pen = "m2";

        binary.push( pen );
        binary.push( pen );
      }

      if(!this.multicolor)
      {
        pen = "i";
        if (byte[j][0] == "0") pen = "t";
        binary.push ( pen );

        pen = "i";
        if (byte[j][1] == "0") pen = "t";
        binary.push ( pen );
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
      }
    }

    this.imported_file.sprites.push(sprite);
  }

  get_imported_file()
  {
    return this.imported_file;
  }

}


