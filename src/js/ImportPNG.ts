import { dom, status } from "./helper";
import { App } from './App';
import { SpriteHelpers } from './SpriteTypes';

export default class ImportPNG {
  app: App | null;
  imported_file: any;

  constructor(public config, public eventhandler) {
    this.app = null;
    this.config = config;
    this.eventhandler = eventhandler;
    this.imported_file = null;
    this.setup_import_png_input();
  }

  get_imported_file() {
    return this.imported_file;
  }

  setup_import_png_input() {
    this.app = (window as any).app;
    const element: any = document.createElement("div");
    element.innerHTML =
      '<input type="file" id="input-import-png" style="display: none" accept=".png">';
    const fileInput = element.firstChild;
    document.body.appendChild(fileInput);
    const that = this;
    fileInput.addEventListener("change", function () {
      that.read_file_data(fileInput);
    });
  }

  read_file_data(fileInput) {
    this.app = window.app;
    const file = fileInput.files[0];

    if (file && file.name.match(/\.(png)$/)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.process_image(img);
          this.eventhandler.onLoad();
          // by removing the input field and reassigning it, reloading the same file will work
          document.querySelector("#input-import-png")?.remove();
          this.setup_import_png_input();
        };
        img.onerror = () => {
          alert("Error loading PNG image");
          document.querySelector("#input-import-png")?.remove();
          this.setup_import_png_input();
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Extract filename without extension and update the menubar input
      const filenameWithoutExt = file.name.replace(/\.png$/i, '');
      if (this.app) {
        this.app.set_filename(filenameWithoutExt);
      }
    } else {
      alert("File not supported, .png files only");
    }
  }

  /**
   * Process a PNG image and convert it to C64 sprites.
   *
   * Algorithm:
   * 1. Extract raw sprite regions from the image grid
   * 2. Determine global background color (most common across all sprites)
   * 3. Detect which sprites are multicolor using strict pixel-pair checking
   * 4. Analyze colors from multicolor sprites only to find MC1 and MC2
   * 5. Convert each sprite using the determined global colors
   */
  process_image(img: HTMLImageElement) {
    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;
    const cols = Math.floor(img.width / spriteWidth);
    const rows = Math.floor(img.height / spriteHeight);

    if (!this.validate_image_dimensions(img.width, img.height, spriteWidth, spriteHeight, cols, rows)) {
      return;
    }

    const ctx = this.create_canvas_context(img);
    if (!ctx) {
      alert("Error: Could not create canvas context");
      return;
    }

    const paletteColors = this.get_current_palette_colors();
    const rawSprites = this.extract_raw_sprites(ctx, rows, cols, spriteWidth, spriteHeight, paletteColors);

    const globalBackground = this.find_most_common_color(rawSprites.globalColorCounts);
    const spriteMulticolorFlags = this.detect_multicolor_sprites(rawSprites.sprites, spriteWidth, spriteHeight, paletteColors);
    const { mc1, mc2 } = this.determine_multicolor_globals(rawSprites.sprites, spriteMulticolorFlags, spriteWidth, spriteHeight, paletteColors, globalBackground);

    const allSpriteData = this.convert_sprites(rawSprites.sprites, spriteMulticolorFlags, paletteColors, mc1, mc2, globalBackground);

    if (allSpriteData.length === 0) {
      alert("Error converting spritesheet to sprites");
      return;
    }

    this.create_imported_file_from_multiple(allSpriteData, globalBackground, mc1, mc2);

    const totalSprites = cols * rows;
    status(totalSprites === 1
      ? "PNG image imported successfully as sprite."
      : `Spritesheet imported successfully: ${totalSprites} sprites (${cols}x${rows} grid).`
    );
  }

  private validate_image_dimensions(width: number, height: number, spriteWidth: number, spriteHeight: number, cols: number, rows: number): boolean {
    if (width % spriteWidth !== 0 || height % spriteHeight !== 0) {
      alert(`Invalid image dimensions. Image must be a multiple of ${spriteWidth}x${spriteHeight} pixels.\nGot ${width}x${height} pixels (${cols}x${rows} sprites with ${width % spriteWidth}x${height % spriteHeight} pixel remainder).`);
      return false;
    }

    if (cols === 0 || rows === 0) {
      alert(`Image too small. Expected at least ${spriteWidth}x${spriteHeight} pixels, got ${width}x${height} pixels.`);
      return false;
    }

    return true;
  }

  private create_canvas_context(img: HTMLImageElement): CanvasRenderingContext2D | null {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0);
    }
    return ctx;
  }

  private extract_raw_sprites(
    ctx: CanvasRenderingContext2D,
    rows: number,
    cols: number,
    spriteWidth: number,
    spriteHeight: number,
    paletteColors: string[]
  ) {
    const sprites: Uint8ClampedArray[] = [];
    const globalColorCounts = new Map<number, number>();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spriteWidth;
        const y = row * spriteHeight;
        const imageData = ctx.getImageData(x, y, spriteWidth, spriteHeight);
        const pixels = imageData.data;

        sprites.push(pixels);
        this.count_colors_in_pixels(pixels, spriteWidth, spriteHeight, paletteColors, globalColorCounts);
      }
    }

    return { sprites, globalColorCounts };
  }

  private count_colors_in_pixels(
    pixels: Uint8ClampedArray,
    width: number,
    height: number,
    palette: string[],
    colorCounts: Map<number, number>
  ) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const colorIndex = this.find_closest_color(pixels[idx], pixels[idx + 1], pixels[idx + 2], palette);
        colorCounts.set(colorIndex, (colorCounts.get(colorIndex) || 0) + 1);
      }
    }
  }

  private find_most_common_color(colorCounts: Map<number, number>): number {
    if (colorCounts.size === 0) return 0;
    return Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])[0][0];
  }

  private detect_multicolor_sprites(sprites: Uint8ClampedArray[], spriteWidth: number, spriteHeight: number, palette: string[]): boolean[] {
    return sprites.map(pixels => this.detectMulticolorFromPixels(pixels, spriteWidth, spriteHeight, palette));
  }

  /**
   * Determine the global multicolor 1 and 2 values by analyzing only multicolor sprites.
   *
   * C64 color architecture:
   * - Pen 0 (background): Shared globally across all sprites
   * - Pen 1 (individual): Per-sprite, can vary
   * - Pen 2 (MC1): Shared globally across all multicolor sprites
   * - Pen 3 (MC2): Shared globally across all multicolor sprites
   *
   * This finds the two most common colors (excluding background) across all
   * multicolor sprites, which become MC1 and MC2.
   */
  private determine_multicolor_globals(
    sprites: Uint8ClampedArray[],
    multicolorFlags: boolean[],
    spriteWidth: number,
    spriteHeight: number,
    palette: string[],
    globalBackground: number
  ) {
    const multicolorOnlyColorCounts = new Map<number, number>();

    for (let i = 0; i < sprites.length; i++) {
      if (multicolorFlags[i]) {
        for (let y = 0; y < spriteHeight; y++) {
          for (let x = 0; x < spriteWidth; x++) {
            const idx = (y * spriteWidth + x) * 4;
            const pixels = sprites[i];
            const colorIndex = this.find_closest_color(pixels[idx], pixels[idx + 1], pixels[idx + 2], palette);

            if (colorIndex !== globalBackground) {
              multicolorOnlyColorCounts.set(colorIndex, (multicolorOnlyColorCounts.get(colorIndex) || 0) + 1);
            }
          }
        }
      }
    }

    const sorted = Array.from(multicolorOnlyColorCounts.entries()).sort((a, b) => b[1] - a[1]);
    return {
      mc1: sorted[0]?.[0] ?? this.config.sprite_defaults.multicolor_1,
      mc2: sorted[1]?.[0] ?? this.config.sprite_defaults.multicolor_2
    };
  }

  private convert_sprites(
    sprites: Uint8ClampedArray[],
    multicolorFlags: boolean[],
    palette: string[],
    mc1: number,
    mc2: number,
    background: number
  ): number[][][] {
    const converted: number[][][] = [];

    for (let i = 0; i < sprites.length; i++) {
      const spriteData = this.convert_to_sprite_with_globals(
        sprites[i],
        palette,
        multicolorFlags[i],
        mc1,
        mc2,
        background
      );

      if (spriteData) {
        converted.push(spriteData);
      }
    }

    return converted;
  }

  get_current_palette_colors(): string[] {
    // Get the currently active palette
    const selectedPalette = this.config.selected_palette || 'colodore';
    return this.config.palettes[selectedPalette].values;
  }

  rgb_to_hex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase();
  }

  find_closest_color(r: number, g: number, b: number, palette: string[]): number {
    const pixelHex = this.rgb_to_hex(r, g, b);

    // First try exact match
    const exactMatch = palette.indexOf(pixelHex);
    if (exactMatch !== -1) {
      return exactMatch;
    }

    // Find closest color using Euclidean distance in RGB space
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < palette.length; i++) {
      const paletteColor = palette[i];
      const pr = parseInt(paletteColor.substring(1, 3), 16);
      const pg = parseInt(paletteColor.substring(3, 5), 16);
      const pb = parseInt(paletteColor.substring(5, 7), 16);

      const distance = Math.sqrt(
        Math.pow(r - pr, 2) +
        Math.pow(g - pg, 2) +
        Math.pow(b - pb, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex;
  }


  /**
   * Detect if a sprite is multicolor using strict pixel-pair checking.
   *
   * C64 multicolor sprites have pixels that come in horizontal pairs.
   * This function checks EVERY pixel pair - if even ONE pair doesn't match,
   * the sprite is single-color.
   */
  detectMulticolorFromPixels(
    pixels: Uint8ClampedArray,
    spriteWidth: number,
    spriteHeight: number,
    palette: string[]
  ): boolean {
    const paletteIndices: number[][] = [];
    for (let y = 0; y < spriteHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < spriteWidth; x++) {
        const idx = (y * spriteWidth + x) * 4;
        const colorIndex = this.find_closest_color(pixels[idx], pixels[idx + 1], pixels[idx + 2], palette);
        row.push(colorIndex);
      }
      paletteIndices.push(row);
    }

    for (let y = 0; y < spriteHeight; y++) {
      for (let x = 0; x < spriteWidth - 1; x += 2) {
        if (paletteIndices[y][x] !== paletteIndices[y][x + 1]) {
          return false;
        }
      }
    }

    return true;
  }


  convert_to_sprite_with_globals(
    pixels: Uint8ClampedArray,
    palette: string[],
    isMulticolor: boolean,
    globalMulticolor1: number,
    globalMulticolor2: number,
    globalBackground: number
  ): number[][] | null {
    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;

    const { sprite, colorCounts } = this.pixels_to_sprite_grid(pixels, palette, spriteWidth, spriteHeight);
    const sortedColors = Array.from(colorCounts.entries()).sort((a, b) => b[1] - a[1]);

    if (sortedColors.length === 0) {
      (sprite as any).individualColor = 1;
      (sprite as any).multicolor = isMulticolor;
      return sprite;
    }

    const { colorMapping, individualColor } = this.create_color_mapping(
      isMulticolor,
      sortedColors,
      globalBackground,
      globalMulticolor1,
      globalMulticolor2
    );

    this.apply_color_mapping(sprite, colorMapping, isMulticolor);

    (sprite as any).individualColor = individualColor;
    (sprite as any).multicolor = isMulticolor;
    if (isMulticolor) {
      (sprite as any).multicolor1 = globalMulticolor1;
      (sprite as any).multicolor2 = globalMulticolor2;
    }

    return sprite;
  }

  private pixels_to_sprite_grid(pixels: Uint8ClampedArray, palette: string[], width: number, height: number) {
    const sprite: number[][] = [];
    const colorCounts = new Map<number, number>();

    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const colorIndex = this.find_closest_color(pixels[idx], pixels[idx + 1], pixels[idx + 2], palette);
        row.push(colorIndex);
        colorCounts.set(colorIndex, (colorCounts.get(colorIndex) || 0) + 1);
      }
      sprite.push(row);
    }

    return { sprite, colorCounts };
  }

  private create_color_mapping(
    isMulticolor: boolean,
    sortedColors: [number, number][],
    globalBackground: number,
    globalMulticolor1: number,
    globalMulticolor2: number
  ) {
    const colorMapping = new Map<number, number>();
    let individualColor = 1;

    if (isMulticolor) {
      colorMapping.set(globalBackground, 0);
      colorMapping.set(globalMulticolor1, 2);
      colorMapping.set(globalMulticolor2, 3);

      for (const [color] of sortedColors) {
        if (!colorMapping.has(color)) {
          individualColor = color;
          colorMapping.set(color, 1);
          break;
        }
      }
    } else {
      colorMapping.set(globalBackground, 0);

      for (const [color] of sortedColors) {
        if (color !== globalBackground) {
          individualColor = color;
          colorMapping.set(color, 1);
          break;
        }
      }
    }

    return { colorMapping, individualColor };
  }

  private apply_color_mapping(sprite: number[][], colorMapping: Map<number, number>, isMulticolor: boolean) {
    const defaultPen = isMulticolor ? 0 : 1;
    for (let y = 0; y < sprite.length; y++) {
      for (let x = 0; x < sprite[y].length; x++) {
        sprite[y][x] = colorMapping.get(sprite[y][x]) ?? defaultPen;
      }
    }
  }

  create_imported_file(spriteData: number[][]) {
    const individualColor = (spriteData as any).individualColor || this.config.sprite_defaults.individual_color;
    const isMulticolor = (spriteData as any).multicolor || false;
    const multicolor1 = (spriteData as any).multicolor1;
    const multicolor2 = (spriteData as any).multicolor2;

    const sprite = SpriteHelpers.createSprite(this.config, {
      name: "sprite_0",
      color: individualColor,
      multicolor: isMulticolor,
      pixels: spriteData,
    });

    const colors = multicolor1 !== undefined && multicolor2 !== undefined
      ? { 0: this.config.sprite_defaults.background_color, 2: multicolor1, 3: multicolor2 }
      : undefined;

    this.imported_file = SpriteHelpers.createCollection(this.config, {
      filename: "imported",
      colors: colors,
      sprites: [sprite],
    });
  }

  create_imported_file_from_multiple(
    allSpriteData: number[][][],
    globalBackground: number,
    globalMulticolor1: number,
    globalMulticolor2: number
  ) {
    const sprites = allSpriteData.map((spriteData, index) => {
      const individualColor = (spriteData as any).individualColor || this.config.sprite_defaults.individual_color;
      const isMulticolor = (spriteData as any).multicolor || false;

      return SpriteHelpers.createSprite(this.config, {
        name: `sprite${index}`,
        color: individualColor,
        multicolor: isMulticolor,
        pixels: spriteData,
      });
    });

    this.imported_file = SpriteHelpers.createCollection(this.config, {
      filename: "imported",
      colors: {
        0: globalBackground,
        2: globalMulticolor1,
        3: globalMulticolor2,
      },
      sprites: sprites,
    });
  }
}
