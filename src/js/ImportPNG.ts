import { dom, status } from "./helper";
import { App } from './App';

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

  process_image(img: HTMLImageElement) {
    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;

    // Calculate how many sprites fit in the image (assuming no borders)
    const cols = Math.floor(img.width / spriteWidth);
    const rows = Math.floor(img.height / spriteHeight);

    console.log('Image dimensions:', img.width, 'x', img.height);
    console.log('Sprite dimensions:', spriteWidth, 'x', spriteHeight);
    console.log('Calculated grid:', cols, 'cols x', rows, 'rows');

    // Check if dimensions are valid multiples of sprite size
    if (img.width % spriteWidth !== 0 || img.height % spriteHeight !== 0) {
      alert(`Invalid image dimensions. Image must be a multiple of ${spriteWidth}x${spriteHeight} pixels.\nGot ${img.width}x${img.height} pixels (${cols}x${rows} sprites with ${img.width % spriteWidth}x${img.height % spriteHeight} pixel remainder).`);
      return;
    }

    if (cols === 0 || rows === 0) {
      alert(`Image too small. Expected at least ${spriteWidth}x${spriteHeight} pixels, got ${img.width}x${img.height} pixels.`);
      return;
    }

    const totalSprites = cols * rows;
    console.log('Total sprites expected:', totalSprites);

    // Create a canvas to read pixel data
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      alert("Error: Could not create canvas context");
      return;
    }

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get the current palette colors
    const paletteColors = this.get_current_palette_colors();

    // Extract all sprites from the spritesheet
    const allSpriteData: number[][][] = [];

    console.log('Starting sprite extraction...');
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spriteWidth;
        const y = row * spriteHeight;

        console.log(`Extracting sprite at row ${row}, col ${col} (x=${x}, y=${y})`);

        // Extract sprite region
        const imageData = ctx.getImageData(x, y, spriteWidth, spriteHeight);
        const pixels = imageData.data;

        // Convert image to sprite data
        const spriteData = this.convert_to_sprite(pixels, paletteColors);

        if (spriteData) {
          allSpriteData.push(spriteData);
          console.log(`Sprite ${allSpriteData.length} extracted successfully`);
        } else {
          console.warn(`Failed to extract sprite at row ${row}, col ${col}`);
        }
      }
    }

    console.log('Total sprites extracted:', allSpriteData.length);

    if (allSpriteData.length === 0) {
      alert("Error converting spritesheet to sprites");
      return;
    }

    // Create the imported file object with all sprites
    this.create_imported_file_from_multiple(allSpriteData);
    console.log('Created imported file with', allSpriteData.length, 'sprites');

    if (totalSprites === 1) {
      status("PNG image imported successfully as sprite.");
    } else {
      status(`Spritesheet imported successfully: ${totalSprites} sprites (${cols}x${rows} grid).`);
    }
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

  convert_to_sprite(pixels: Uint8ClampedArray, palette: string[]): number[][] | null {
    const sprite: number[][] = [];
    const colorCounts = new Map<number, number>();
    const spriteWidth = this.config.sprite_x;
    const spriteHeight = this.config.sprite_y;

    // Convert all pixels to palette colors and count occurrences
    for (let y = 0; y < spriteHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < spriteWidth; x++) {
        const idx = (y * spriteWidth + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        const colorIndex = this.find_closest_color(r, g, b, palette);
        row.push(colorIndex);
        colorCounts.set(colorIndex, (colorCounts.get(colorIndex) || 0) + 1);
      }
      sprite.push(row);
    }

    // Sort colors by frequency (most common first)
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    if (sortedColors.length === 0) {
      console.warn("No colors found in image");
      (sprite as any).individualColor = 1;
      (sprite as any).multicolor = false;
      return sprite;
    }

    // Check if this is a multicolor sprite by detecting double-wide pixels
    const isMulticolor = this.detectMulticolor(sprite);
    const maxColors = isMulticolor ? 4 : 2;

    // Map the most common colors to pen values
    // Single-color: 0=background, 1=foreground
    // Multi-color: 0=transparent, 1=individual, 2=multicolor1, 3=multicolor2
    const colorMapping = new Map<number, number>();
    for (let i = 0; i < Math.min(maxColors, sortedColors.length); i++) {
      colorMapping.set(sortedColors[i][0], i);
    }

    // Convert palette colors to pen values
    for (let y = 0; y < spriteHeight; y++) {
      for (let x = 0; x < spriteWidth; x++) {
        sprite[y][x] = colorMapping.get(sprite[y][x]) ?? (isMulticolor ? 0 : 1);
      }
    }

    // Store metadata
    (sprite as any).individualColor = sortedColors[1]?.[0] ?? sortedColors[0]?.[0] ?? 1;
    (sprite as any).multicolor = isMulticolor;
    if (isMulticolor) {
      (sprite as any).multicolor1 = sortedColors[2]?.[0] ?? 8;
      (sprite as any).multicolor2 = sortedColors[3]?.[0] ?? 6;
    }

    return sprite;
  }

  detectMulticolor(sprite: number[][]): boolean {
    // Check if pixels come in horizontal pairs (multicolor sprites have double-wide pixels)
    let pairCount = 0;
    let totalChecks = 0;

    for (let y = 0; y < sprite.length; y++) {
      for (let x = 0; x < sprite[y].length - 1; x += 2) {
        totalChecks++;
        if (sprite[y][x] === sprite[y][x + 1]) {
          pairCount++;
        }
      }
    }

    // If more than 90% of pixels come in pairs, it's likely multicolor
    return pairCount / totalChecks > 0.9;
  }

  create_imported_file(spriteData: number[][]) {
    const individualColor = (spriteData as any).individualColor || 1;
    const isMulticolor = (spriteData as any).multicolor || false;
    const multicolor1 = (spriteData as any).multicolor1 || 8;
    const multicolor2 = (spriteData as any).multicolor2 || 6;

    this.imported_file = {
      version: this.config.version,
      filename: "imported",
      colors: {
        0: 11, // transparent - default to light gray
        2: multicolor1,
        3: multicolor2,
      },
      sprites: [{
        name: "sprite_0",
        color: individualColor,
        multicolor: isMulticolor,
        double_x: false,
        double_y: false,
        overlay: false,
        pixels: spriteData,
      }],
      current_sprite: 0,
      pen: 1,
      animation: {
        startSprite: 0,
        endSprite: 0,
        fps: 10,
        mode: "restart",
        doubleX: false,
        doubleY: false
      }
    };
  }

  create_imported_file_from_multiple(allSpriteData: number[][][]) {
    // Use the first sprite's settings for global colors
    const firstSprite = allSpriteData[0];
    const multicolor1 = (firstSprite as any).multicolor1 || 8;
    const multicolor2 = (firstSprite as any).multicolor2 || 6;

    // Create sprite objects for each sprite data
    const sprites = allSpriteData.map((spriteData, index) => {
      const individualColor = (spriteData as any).individualColor || 1;
      const isMulticolor = (spriteData as any).multicolor || false;

      return {
        name: `sprite${index}`,
        color: individualColor,
        multicolor: isMulticolor,
        double_x: false,
        double_y: false,
        overlay: false,
        pixels: spriteData,
      };
    });

    this.imported_file = {
      version: this.config.version,
      filename: "imported",
      colors: {
        0: 11, // transparent - default to light gray
        2: multicolor1,
        3: multicolor2,
      },
      sprites: sprites,
      current_sprite: 0,
      pen: 1,
      animation: {
        startSprite: 0,
        endSprite: sprites.length - 1,
        fps: 10,
        mode: "restart",
        doubleX: false,
        doubleY: false
      }
    };
  }
}
