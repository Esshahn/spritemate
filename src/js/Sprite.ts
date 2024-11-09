export default class Sprite {
  width: number;
  height: number;
  all: any = {};
  backup: any = [];
  backup_position: number;
  copy_sprite: any = {};
  sprite_name_counter: number;

  constructor(public config) {
    this.config = config;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.all = {};
    this.all.version = this.config.version; // current version number
    this.all.colors = { 0: 11, 2: 8, 3: 6 }; // 0 = transparent, 2 = mc1, 3 = mc2

    this.all.sprites = [];
    this.all.four_up = false;
    this.all.current_sprite = 0;
    this.all.pen = 1; // can be individual = i, transparent = t, multicolor_1 = m1, multicolor_2 = m2
    this.backup = [];
    this.backup_position = -1;
    this.copy_sprite = {};
    this.sprite_name_counter = 0; // increments for every new sprite regardless of deleted sprites. Used for the default name
  }

  new_sprite(color = 1, multicolor = false): void {
    const sprite = {
      name: "sprite_" + this.sprite_name_counter,
      color: color,
      multicolor: multicolor,
      double_x: false,
      double_y: false,
      overlay: false,
      pixels: [],
    };

    for (let i = 0; i < this.height; i++) {
      const line = [] as any;
      for (let j = 0; j < this.width; j++) line.push(0);
      (sprite.pixels as any).push(line);
    }
    this.all.sprites.push(sprite);
    this.all.current_sprite = this.all.sprites.length - 1;
    this.sprite_name_counter++;

    if (!multicolor && this.is_pen_multicolor()) this.set_pen(1);

    this.save_backup();
  }

  clear(): void {
    // fills the sprite data with the default color
    // generate a bitmap array

    const pixels = [] as any;

    for (let i = 0; i < this.height; i++) {
      const line = [] as any;
      for (let j = 0; j < this.width; j++) line.push(0);
      pixels.push(line);
    }
    this.all.sprites[this.all.current_sprite].pixels = pixels;
    this.save_backup();
  }

  fill(): void {
    // fills the sprite data with the default color
    // generate a bitmap array

    const pixels = [] as any;

    for (let i = 0; i < this.height; i++) {
      const line = [] as any;
      for (let j = 0; j < this.width; j++) line.push(this.all.pen);
      pixels.push(line);
    }
    this.all.sprites[this.all.current_sprite].pixels = pixels;
    this.save_backup();
  }

  flip_vertical(): void {
    this.all.sprites[this.all.current_sprite].pixels.reverse();
    this.save_backup();
  }

  toggle_four_up(): void {
    this.all.four_up = !this.all.four_up;
  }

  flip_horizontal(): void {
    const s = this.all.sprites[this.all.current_sprite];
    for (let i = 0; i < this.height; i++) s.pixels[i].reverse();
    if (s.multicolor) {
      for (let i = 0; i < this.height; i++)
        s.pixels[i].push(s.pixels[i].shift());
    }
    this.all.sprites[this.all.current_sprite] = s;
    this.save_backup();
  }

  shift_vertical(direction: string): void {
    const s = this.all.sprites[this.all.current_sprite];
    if (direction == "down") {
      s.pixels.unshift(s.pixels.pop());
    } else {
      s.pixels.push(s.pixels.shift());
    }
    this.all.sprites[this.all.current_sprite] = s;
    this.save_backup();
  }

  shift_horizontal(direction: string): void {
    const s = this.all.sprites[this.all.current_sprite];
    for (let i = 0; i < this.height; i++) {
      if (direction == "right") {
        if (s.multicolor) {
          s.pixels[i].unshift(s.pixels[i].pop());
          s.pixels[i].unshift(s.pixels[i].pop());
        } else {
          s.pixels[i].unshift(s.pixels[i].pop());
        }
      } else {
        if (s.multicolor) {
          s.pixels[i].push(s.pixels[i].shift());
          s.pixels[i].push(s.pixels[i].shift());
        } else {
          s.pixels[i].push(s.pixels[i].shift());
        }
      }
    }
    this.all.sprites[this.all.current_sprite] = s;
    this.save_backup();
  }

  get_colors() {
    // used to update the palette with the right colors
    const sprite_colors = {
      0: this.all.colors[0],
      1: this.all.sprites[this.all.current_sprite].color,
      2: this.all.colors[2],
      3: this.all.colors[3],
    };
    return sprite_colors;
  }

  get_name(): string {
    return this.all.sprites[this.all.current_sprite].name;
  }

  is_multicolor(): boolean {
    return this.all.sprites[this.all.current_sprite].multicolor;
  }

  toggle_double_x(): void {
    this.all.sprites[this.all.current_sprite].double_x = !this.all.sprites[
      this.all.current_sprite
    ].double_x;
    this.save_backup();
  }

  toggle_double_y(): void {
    this.all.sprites[this.all.current_sprite].double_y = !this.all.sprites[
      this.all.current_sprite
    ].double_y;
    this.save_backup();
  }

  toggle_multicolor(): void {
    if (this.all.sprites[this.all.current_sprite].multicolor) {
      this.all.sprites[this.all.current_sprite].multicolor = false;
      if (this.is_pen_multicolor()) this.set_pen(1);
    } else {
      this.all.sprites[this.all.current_sprite].multicolor = true;
    }
    this.save_backup();
  }

  set_pixel(pos, shiftkey): void {
    // writes a pixel to the sprite pixel array
    const { sprite_offset } = pos;

    // multicolor check
    if (
      this.all.sprites[this.all.current_sprite + sprite_offset].multicolor &&
      pos.x % 2 !== 0
    )
      pos.x = pos.x - 1;

    if (!shiftkey) {
      // draw with selected pen
      this.all.sprites[this.all.current_sprite + sprite_offset].pixels[pos.y][
        pos.x
      ] = this.all.pen;
    } else {
      // shift is hold down, so we delete with transparent color
      this.all.sprites[this.all.current_sprite + sprite_offset].pixels[pos.y][
        pos.x
      ] = 0;
    }
  }

  get_current_sprite() {
    return this.all.sprites[this.all.current_sprite];
  }

  get_current_sprite_number(): number {
    return this.all.current_sprite;
  }

  get_number_of_sprites(): number {
    return this.all.sprites.length;
  }

  only_one_sprite(): boolean {
    return this.all.sprites.length == 1 ? true : false;
  }

  get_pen() {
    return this.all.pen;
  }

  is_pen_multicolor(): boolean {
    return this.all.pen === 2 || this.all.pen === 3;
  }

  set_pen(pen): void {
    this.all.pen = pen;
  }

  set_pen_color(pencolor): void {
    if (this.all.pen == 1) {
      this.all.sprites[this.all.current_sprite].color = pencolor;
    } else {
      this.all.colors[this.all.pen] = pencolor;
    }
    this.save_backup();
  }

  get_all() {
    return this.all;
  }

  set_all(all): void {
    this.all = all;
    this.save_backup();
  }

  sort_spritelist(sprite_order_from_dom): void {
    const sorted_list = sprite_order_from_dom.map(function (x) {
      return parseInt(x);
    });
    const new_sprite_list = [] as any;
    let temp_current_sprite = 0;

    for (let i = 0; i < sorted_list.length; i++) {
      new_sprite_list.push(this.all.sprites[sorted_list[i]]);
      if (sorted_list[i] == this.all.current_sprite) temp_current_sprite = i;
    }

    this.all.sprites = new_sprite_list;
    this.all.current_sprite = temp_current_sprite;
    this.save_backup();
  }

  set_current_sprite(spritenumber: string | number): void {
    if (spritenumber == "right") spritenumber = this.all.current_sprite + 1;
    if (spritenumber == "left") spritenumber = this.all.current_sprite - 1;

    // cycle through the list
    if (spritenumber < 0) spritenumber = this.all.sprites.length - 1;
    if (spritenumber > this.all.sprites.length - 1) spritenumber = 0;

    if (typeof spritenumber == "number") this.all.current_sprite = spritenumber;
    this.save_backup();
  }

  delete(): void {
    if (this.all.sprites.length > 1) {
      this.all.sprites.splice(this.all.current_sprite, 1);
      if (this.all.current_sprite == this.all.sprites.length)
        this.all.current_sprite--;
      this.save_backup();
    }
  }

  save_backup(): void {
    this.backup_position++;
    this.backup[this.backup_position] = JSON.parse(JSON.stringify(this.all)); //$.extend(true, {}, this.all);
  }

  undo(): void {
    if (this.backup_position > 0) {
      this.backup_position--;
      this.all = JSON.parse(JSON.stringify(this.backup[this.backup_position])); // $.extend(true, {}, this.backup[this.backup_position]);
    }
  }

  redo(): void {
    if (this.backup_position < this.backup.length - 1) {
      this.backup_position++;
      this.all = JSON.parse(JSON.stringify(this.backup[this.backup_position])); // $.extend(true, {}, this.backup[this.backup_position]);
    }
  }

  floodfill(pos): void {
    // https://stackoverflow.com/questions/22053759/multidimensional-array-fill
    // get target value
    let x = pos.x;
    const y = pos.y;
    const data = this.all.sprites[this.all.current_sprite].pixels;

    // multicolor check
    let stepping = 1;
    const is_multi = this.all.sprites[this.all.current_sprite].multicolor;
    if (is_multi) stepping = 2;

    if (is_multi && x % 2 !== 0) x = x - 1;
    const target = data[y][x];

    function flow(x, y, pen) {
      // bounds check what we were passed
      if (y >= 0 && y < data.length && x >= 0 && x < data[y].length) {
        if (is_multi && x % 2 !== 0) x = x - 1;
        if (data[y][x] === target && data[y][x] != pen) {
          data[y][x] = pen;
          flow(x - stepping, y, pen); // check up
          flow(x + stepping, y, pen); // check down
          flow(x, y - 1, pen); // check left
          flow(x, y + 1, pen); // check right
        }
      }
    }

    flow(x, y, this.all.pen);
    this.all.sprites[this.all.current_sprite].pixels = data;
  }

  is_copy_empty(): boolean {
    return Object.keys(this.copy_sprite).length === 0;
  }

  copy(): void {
    this.copy_sprite = JSON.parse(
      JSON.stringify(this.all.sprites[this.all.current_sprite])
    ); //$.extend(true,{},this.all.sprites[this.all.current_sprite]);
  }

  paste(): void {
    this.all.sprites[this.all.current_sprite] = JSON.parse(
      JSON.stringify(this.copy_sprite)
    ); //$.extend(true,{},this.copy_sprite);
    this.save_backup();
  }

  duplicate(): void {
    this.copy();
    this.new_sprite();
    this.paste();
  }

  can_undo(): boolean {
    return this.backup_position > 0;
  }

  can_redo(): boolean {
    return this.backup_position < this.backup.length - 1;
  }

  toggle_overlay(): void {
    this.all.sprites[this.all.current_sprite].overlay = !this.all.sprites[
      this.all.current_sprite
    ].overlay;
  }

  is_overlay(): boolean {
    return this.all.sprites[this.all.current_sprite].overlay;
  }

  is_double_x(): boolean {
    return this.all.sprites[this.all.current_sprite].double_x;
  }

  is_double_y(): boolean {
    return this.all.sprites[this.all.current_sprite].double_y;
  }

  set_sprite_name(sprite_name: string): void {
    this.all.sprites[this.all.current_sprite].name = sprite_name;
  }

  invert(): void {
    // inverts the sprite

    // prevent too much data to be inverted in multicolor mode
    let stepping: number;
    if (this.is_multicolor()) {
      stepping = 1;
    } else {
      stepping = 1;
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x = x + stepping) {
        const pixel = this.all.sprites[this.all.current_sprite].pixels[y][x];
        let pixel_inverted;

        if (pixel == 0) pixel_inverted = 1;
        if (pixel == 1) pixel_inverted = 0;
        if (pixel == 2) pixel_inverted = 3;
        if (pixel == 3) pixel_inverted = 2;

        this.all.sprites[this.all.current_sprite].pixels[y][x] = pixel_inverted;
      }
    }

    this.save_backup();
  }
}
