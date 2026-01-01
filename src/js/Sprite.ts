export default class Sprite {
  width: number;
  height: number;
  all: any = {};
  backup: any = [];
  backup_position: number;
  copy_sprite: any = {};
  sprite_name_counter: number;
  storage: any = null;
  autosave_timeout: any = null;

  constructor(public config, storage: any = null) {
    this.config = config;
    this.storage = storage;
    this.width = config.sprite_x;
    this.height = config.sprite_y;
    this.all = {};
    this.all.version = this.config.version;
    this.all.filename = this.config.default_filename;
    this.all.colors = {
      0: config.sprite_defaults.background_color,
      2: config.sprite_defaults.multicolor_1,
      3: config.sprite_defaults.multicolor_2
    };

    this.all.sprites = [];
    this.all.current_sprite = 0;
    this.all.pen = config.sprite_defaults.pen;

    this.all.animation = {
      startSprite: 0,
      endSprite: 0,
      fps: config.sprite_defaults.animation_fps,
      mode: config.sprite_defaults.animation_mode,
      doubleX: false,
      doubleY: false
    };

    this.backup = [];
    this.backup_position = -1;
    this.copy_sprite = {};
    this.sprite_name_counter = 0;
  }

  // Helper: Create pixel grid with given fill value
  private createPixelGrid(fillValue: number = 0): number[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => fillValue)
    );
  }

  // Helper: Get current sprite reference
  private get currentSprite() {
    return this.all.sprites[this.all.current_sprite];
  }

  // Helper: Deep clone an object
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  // Helper: Check if there's an active selection
  private hasActiveSelection(): boolean {
    return (window as any).app?.selection?.active || false;
  }

  // Helper: Check if a pixel is in the selection
  private isInSelection(x: number, y: number): boolean {
    return (window as any).app?.isPixelInSelection(x, y) ?? true;
  }

  // Helper: Get operation bounds (selection bounds if active, else full sprite)
  private getOperationBounds() {
    const app = (window as any).app;
    if (app?.selection?.active && app.selection.bounds) {
      return app.selection.bounds;
    }
    return {
      x1: 0,
      y1: 0,
      x2: this.width - 1,
      y2: this.height - 1
    };
  }

  new_sprite(color = 1, multicolor = false): void {
    const sprite = {
      name: "sprite" + (this.sprite_name_counter + 1),
      color: color,
      multicolor: multicolor,
      double_x: false,
      double_y: false,
      overlay: false,
      pixels: this.createPixelGrid(0),
    };

    this.all.sprites.push(sprite);
    this.all.current_sprite = this.all.sprites.length - 1;
    this.sprite_name_counter++;

    if (!multicolor && this.is_pen_multicolor()) this.set_pen(1);

    this.save_backup();
  }

  clear(): void {
    this.currentSprite.pixels = this.createPixelGrid(0);
    this.save_backup();
  }

  fill(): void {
    this.currentSprite.pixels = this.createPixelGrid(this.all.pen);
    this.save_backup();
  }

  flip_vertical(): void {
    const s = this.currentSprite;
    const bounds = this.getOperationBounds();

    if (this.hasActiveSelection()) {
      // Flip only within selection bounds
      const step = s.multicolor ? 2 : 1;
      const rows: number[][] = [];
      // Extract rows from selection
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row: number[] = [];
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          row.push(s.pixels[y][x]);
        }
        rows.push(row);
      }
      // Reverse rows and write back
      rows.reverse();
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row = rows[y - bounds.y1];
        let idx = 0;
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          s.pixels[y][x] = row[idx++];
        }
      }
    } else {
      // Flip entire sprite
      this.currentSprite.pixels.reverse();
    }
    this.save_backup();
  }

  flip_horizontal(): void {
    const s = this.currentSprite;
    const bounds = this.getOperationBounds();

    if (this.hasActiveSelection()) {
      // Flip only within selection bounds
      const step = s.multicolor ? 2 : 1;
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row: number[] = [];
        // Extract pixels from selection
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          row.push(s.pixels[y][x]);
        }
        // Reverse and write back
        row.reverse();
        let idx = 0;
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          s.pixels[y][x] = row[idx++];
        }
      }
    } else {
      // Flip entire sprite
      for (let i = 0; i < this.height; i++) s.pixels[i].reverse();
      if (s.multicolor) {
        for (let i = 0; i < this.height; i++)
          s.pixels[i].push(s.pixels[i].shift());
      }
    }
    this.save_backup();
  }

  shift_vertical(direction: string): void {
    const s = this.currentSprite;
    const bounds = this.getOperationBounds();

    if (this.hasActiveSelection()) {
      // Rotate within selection bounds
      const step = s.multicolor ? 2 : 1;
      const rows: number[][] = [];

      // Extract all rows from selection
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row: number[] = [];
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          row.push(s.pixels[y][x]);
        }
        rows.push(row);
      }

      // Rotate rows
      if (direction === "down") {
        rows.unshift(rows.pop()!);
      } else {
        rows.push(rows.shift()!);
      }

      // Write back
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row = rows[y - bounds.y1];
        let idx = 0;
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          s.pixels[y][x] = row[idx++];
        }
      }
    } else {
      // Shift entire sprite
      if (direction === "down") {
        s.pixels.unshift(s.pixels.pop());
      } else {
        s.pixels.push(s.pixels.shift());
      }
    }
    this.save_backup();
  }

  shift_horizontal(direction: string): void {
    const s = this.currentSprite;
    const bounds = this.getOperationBounds();
    const step = s.multicolor ? 2 : 1;

    if (this.hasActiveSelection()) {
      // Rotate within selection bounds
      for (let y = bounds.y1; y <= bounds.y2; y++) {
        const row: number[] = [];
        // Extract row
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          row.push(s.pixels[y][x]);
        }
        // Rotate
        if (direction === "right") {
          row.unshift(row.pop()!);
        } else {
          row.push(row.shift()!);
        }
        // Write back
        let idx = 0;
        for (let x = bounds.x1; x <= bounds.x2; x += step) {
          s.pixels[y][x] = row[idx++];
        }
      }
    } else {
      // Shift entire sprite
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < step; j++) {
          if (direction === "right") {
            s.pixels[i].unshift(s.pixels[i].pop());
          } else {
            s.pixels[i].push(s.pixels[i].shift());
          }
        }
      }
    }
    this.save_backup();
  }

  get_colors() {
    // used to update the palette with the right colors
    const sprite_colors = {
      0: this.all.colors[0],
      1: this.currentSprite.color,
      2: this.all.colors[2],
      3: this.all.colors[3],
    };
    return sprite_colors;
  }

  get_name(): string {
    return this.currentSprite.name;
  }

  is_multicolor(): boolean {
    return this.currentSprite.multicolor;
  }

  toggle_double_x(): void {
    this.currentSprite.double_x = !this.currentSprite.double_x;
    this.save_backup();
  }

  toggle_double_y(): void {
    this.currentSprite.double_y = !this.currentSprite.double_y;
    this.save_backup();
  }

  toggle_multicolor(): void {
    this.currentSprite.multicolor = !this.currentSprite.multicolor;
    if (!this.currentSprite.multicolor && this.is_pen_multicolor()) {
      this.set_pen(1);
    }
    this.save_backup();
  }

  set_pixel(pos, shiftkey): void {
    // writes a pixel to the sprite pixel array

    // multicolor check
    if (this.currentSprite.multicolor && pos.x % 2 !== 0) {
      pos.x = pos.x - 1;
    }

    // Check if pixel is in selection
    if (!this.isInSelection(pos.x, pos.y)) {
      return;
    }

    if (!shiftkey) {
      // draw with selected pen
      this.currentSprite.pixels[pos.y][pos.x] = this.all.pen;
    } else {
      // shift is hold down, so we delete with transparent color
      this.currentSprite.pixels[pos.y][pos.x] = 0;
    }
  }

  get_current_sprite() {
    return this.currentSprite;
  }

  get_current_sprite_number(): number {
    return this.all.current_sprite;
  }

  get_number_of_sprites(): number {
    return this.all.sprites.length;
  }

  only_one_sprite(): boolean {
    return this.all.sprites.length === 1;
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
    if (this.all.pen === 1) {
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
    // Ensure filename exists (for backward compatibility with old save files)
    if (!this.all.filename) {
      this.all.filename = this.config.default_filename;
    }
    // Ensure animation settings exist (for backward compatibility with old save files)
    if (!this.all.animation) {
      this.all.animation = {
        startSprite: 0,
        endSprite: 0,
        fps: 10,
        mode: "restart",
        doubleX: false,
        doubleY: false
      };
    }
    this.save_backup();
  }

  get_filename(): string {
    return this.all.filename || this.config.default_filename;
  }

  set_filename(filename: string): void {
    this.all.filename = filename;
    this.save_backup();
  }

  get_animation_settings() {
    return this.all.animation || {
      startSprite: 0,
      endSprite: 0,
      fps: 10,
      mode: "restart",
      doubleX: false,
      doubleY: false
    };
  }

  set_animation_settings(settings: any): void {
    this.all.animation = settings;
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
      if (sorted_list[i] === this.all.current_sprite) temp_current_sprite = i;
    }

    this.all.sprites = new_sprite_list;
    this.all.current_sprite = temp_current_sprite;
    this.save_backup();
  }

  set_current_sprite(spritenumber: string | number): void {
    let spriteNum: number;

    if (spritenumber === "right") {
      spriteNum = this.all.current_sprite + 1;
    } else if (spritenumber === "left") {
      spriteNum = this.all.current_sprite - 1;
    } else {
      spriteNum = typeof spritenumber === "number" ? spritenumber : parseInt(spritenumber);
    }

    // cycle through the list
    if (spriteNum < 0) spriteNum = this.all.sprites.length - 1;
    if (spriteNum > this.all.sprites.length - 1) spriteNum = 0;

    this.all.current_sprite = spriteNum;
    this.save_backup();
  }

  delete(): void {
    if (this.all.sprites.length > 1) {
      this.all.sprites.splice(this.all.current_sprite, 1);
      if (this.all.current_sprite === this.all.sprites.length)
        this.all.current_sprite--;
      this.save_backup();
    }
  }

  save_backup(): void {
    this.backup_position++;
    this.backup[this.backup_position] = this.deepClone(this.all);

    // Trigger debounced auto-save to local storage
    this.trigger_autosave();
  }

  /**
   * Triggers a debounced auto-save to local storage
   * Debounced by 2 seconds to avoid excessive saves during rapid edits
   */
  private trigger_autosave(): void {
    if (!this.storage) return;

    // Clear any existing timeout
    if (this.autosave_timeout) {
      clearTimeout(this.autosave_timeout);
    }

    // Set a new timeout for auto-save
    this.autosave_timeout = setTimeout(() => {
      this.storage.write_sprites(this.all);
    }, 2000); // 2 second debounce
  }

  undo(): void {
    if (this.backup_position > 0) {
      this.backup_position--;
      this.all = this.deepClone(this.backup[this.backup_position]);
      this.trigger_autosave();
    }
  }

  redo(): void {
    if (this.backup_position < this.backup.length - 1) {
      this.backup_position++;
      this.all = this.deepClone(this.backup[this.backup_position]);
      this.trigger_autosave();
    }
  }

  floodfill(pos): void {
    // https://stackoverflow.com/questions/22053759/multidimensional-array-fill
    // get target value
    let x = pos.x;
    const y = pos.y;
    const data = this.currentSprite.pixels;

    // multicolor check
    const is_multi = this.currentSprite.multicolor;
    const stepping = is_multi ? 2 : 1;

    if (is_multi && x % 2 !== 0) x = x - 1;
    const target = data[y][x];

    // Get app reference for selection checking
    const app = (window as any).app;
    const checkSelection = (x: number, y: number) => {
      return app?.isPixelInSelection(x, y) ?? true;
    };

    function flow(x, y, pen) {
      // bounds check what we were passed
      if (y >= 0 && y < data.length && x >= 0 && x < data[y].length) {
        if (is_multi && x % 2 !== 0) x = x - 1;
        // Check selection bounds
        if (!checkSelection(x, y)) return;
        if (data[y][x] === target && data[y][x] !== pen) {
          data[y][x] = pen;
          flow(x - stepping, y, pen); // check left
          flow(x + stepping, y, pen); // check right
          flow(x, y - 1, pen); // check up
          flow(x, y + 1, pen); // check down
        }
      }
    }

    flow(x, y, this.all.pen);
  }

  is_copy_empty(): boolean {
    return Object.keys(this.copy_sprite).length === 0;
  }

  copy(): void {
    this.copy_sprite = this.deepClone(this.currentSprite);
  }

  paste(): void {
    this.all.sprites[this.all.current_sprite] = this.deepClone(this.copy_sprite);
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
    this.currentSprite.overlay = !this.currentSprite.overlay;
  }

  is_overlay(): boolean {
    return this.currentSprite.overlay;
  }

  is_double_x(): boolean {
    return this.currentSprite.double_x;
  }

  is_double_y(): boolean {
    return this.currentSprite.double_y;
  }

  set_sprite_name(sprite_name: string): void {
    this.currentSprite.name = sprite_name;
  }

  invert(): void {
    const INVERT_MAP: Record<number, number> = { 0: 1, 1: 0, 2: 3, 3: 2 };
    const bounds = this.getOperationBounds();
    const step = this.currentSprite.multicolor ? 2 : 1;

    for (let y = bounds.y1; y <= bounds.y2; y++) {
      for (let x = bounds.x1; x <= bounds.x2; x += step) {
        const pixel = this.currentSprite.pixels[y][x];
        this.currentSprite.pixels[y][x] = INVERT_MAP[pixel] ?? pixel;
      }
    }

    this.save_backup();
  }
}
