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
    // Check if image is exactly 24x21 pixels
    if (img.width !== 24 || img.height !== 21) {
      alert(`Invalid image dimensions. Expected 24x21 pixels, got ${img.width}x${img.height} pixels.`);
      return;
    }

    // Create a canvas to read pixel data
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 21;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      alert("Error: Could not create canvas context");
      return;
    }

    // Draw the image onto the canvas
    ctx.drawImage(img, 0, 0);

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, 24, 21);
    const pixels = imageData.data;

    // Get the current palette colors
    const paletteColors = this.get_current_palette_colors();

    // Convert image to sprite data
    const spriteData = this.convert_to_sprite(pixels, paletteColors);

    if (!spriteData) {
      alert("Error converting image to sprite");
      return;
    }

    // Create the imported file object following the same format as Load.ts
    this.create_imported_file(spriteData);

    status("PNG image imported successfully as sprite.");
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

    // First pass: convert all pixels to palette colors and count occurrences
    for (let y = 0; y < 21; y++) {
      const row: number[] = [];

      for (let x = 0; x < 24; x++) {
        const idx = (y * 24 + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];

        const colorIndex = this.find_closest_color(r, g, b, palette);
        row.push(colorIndex);

        // Count color occurrences
        colorCounts.set(colorIndex, (colorCounts.get(colorIndex) || 0) + 1);
      }

      sprite.push(row);
    }

    // Check if this is a multicolor sprite by detecting double-wide pixels
    const isMulticolor = this.detectMulticolor(sprite);

    // Sort colors by frequency (most common first)
    const sortedColors = Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    if (isMulticolor) {
      return this.convertMulticolorSprite(sprite, sortedColors);
    } else {
      return this.convertSinglecolorSprite(sprite, sortedColors);
    }
  }

  detectMulticolor(sprite: number[][]): boolean {
    // Check if pixels come in horizontal pairs (multicolor sprites have double-wide pixels)
    let pairCount = 0;
    let totalChecks = 0;

    for (let y = 0; y < sprite.length; y++) {
      for (let x = 0; x < sprite[y].length - 1; x += 2) {
        totalChecks++;
        // Check if this pixel and the next pixel are the same color
        if (sprite[y][x] === sprite[y][x + 1]) {
          pairCount++;
        }
      }
    }

    // If more than 90% of pixels come in pairs, it's likely multicolor
    const pairRatio = pairCount / totalChecks;
    return pairRatio > 0.9;
  }

  convertSinglecolorSprite(sprite: number[][], sortedColors: [number, number][]): number[][] {
    // Determine background and foreground colors
    let backgroundColor: number;
    let foregroundColor: number;

    if (sortedColors.length === 0) {
      // No colors - shouldn't happen
      console.warn("No colors found in image");
      (sprite as any).individualColor = 1;
      (sprite as any).multicolor = false;
      return sprite;
    } else if (sortedColors.length === 1) {
      // Only one color - treat entire image as foreground
      backgroundColor = sortedColors[0][0];
      foregroundColor = sortedColors[0][0];
      // Don't do any conversion, keep all as 1
      for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 24; x++) {
          sprite[y][x] = 1;
        }
      }
    } else {
      // Multiple colors: most common is background (0), second most is foreground (1)
      backgroundColor = sortedColors[0][0];
      foregroundColor = sortedColors[1][0];

      // Second pass: convert to binary sprite data (0 = background, 1 = foreground)
      for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 24; x++) {
          if (sprite[y][x] === backgroundColor) {
            sprite[y][x] = 0;
          } else if (sprite[y][x] === foregroundColor) {
            sprite[y][x] = 1;
          } else {
            // Any other colors get mapped to foreground
            sprite[y][x] = 1;
          }
        }
      }
    }

    // Store the foreground color as the sprite's individual color
    (sprite as any).individualColor = foregroundColor;
    (sprite as any).multicolor = false;

    return sprite;
  }

  convertMulticolorSprite(sprite: number[][], sortedColors: [number, number][]): number[][] {
    // Multicolor sprites can have up to 4 colors: 0, 1, 2, 3
    // Map the most common colors to these pen values
    const colorMapping = new Map<number, number>();

    if (sortedColors.length === 0) {
      console.warn("No colors found in image");
      (sprite as any).individualColor = 1;
      (sprite as any).multicolor = true;
      (sprite as any).multicolor1 = 8;
      (sprite as any).multicolor2 = 6;
      return sprite;
    }

    // Assign the colors to pen values based on frequency
    // Most common = 0 (transparent/background)
    // 2nd most = 1 (individual)
    // 3rd most = 2 (multicolor 1)
    // 4th most = 3 (multicolor 2)
    for (let i = 0; i < Math.min(4, sortedColors.length); i++) {
      colorMapping.set(sortedColors[i][0], i);
    }

    // For multicolor sprites, the PNG has double-wide pixels (each logical pixel is 2 physical pixels)
    // But Spritemate stores them as 24x21 with each pen value appearing twice
    // So we just need to convert palette colors to pen values (0-3)
    const convertedSprite: number[][] = [];

    for (let y = 0; y < sprite.length; y++) {
      const row: number[] = [];
      for (let x = 0; x < sprite[y].length; x++) {
        const paletteColor = sprite[y][x];
        const penValue = colorMapping.get(paletteColor) ?? 0;
        row.push(penValue);
      }
      convertedSprite.push(row);
    }

    // Store metadata
    (convertedSprite as any).individualColor = sortedColors[1]?.[0] ?? 1;
    (convertedSprite as any).multicolor = true;
    (convertedSprite as any).multicolor1 = sortedColors[2]?.[0] ?? 8;
    (convertedSprite as any).multicolor2 = sortedColors[3]?.[0] ?? 6;

    return convertedSprite;
  }

  create_imported_file(spriteData: number[][]) {
    // Get metadata from the sprite data
    const individualColor = (spriteData as any).individualColor || 1;
    const isMulticolor = (spriteData as any).multicolor || false;
    const multicolor1 = (spriteData as any).multicolor1 || 8;
    const multicolor2 = (spriteData as any).multicolor2 || 6;

    // Clean the sprite data - remove metadata properties and ensure it's a clean 2D array
    const cleanPixels: number[][] = [];
    for (let y = 0; y < spriteData.length; y++) {
      cleanPixels.push([...spriteData[y]]);
    }

    // Create the imported file object in the same format as Load.ts expects
    this.imported_file = {
      version: this.config.version,
      filename: "imported",
      colors: {
        0: 11, // transparent - default to light gray
        2: multicolor1,  // multicolor 1
        3: multicolor2,  // multicolor 2
      },
      sprites: [
        {
          name: "sprite_0",
          color: individualColor,
          multicolor: isMulticolor,
          double_x: false,
          double_y: false,
          overlay: false,
          pixels: cleanPixels,
        }
      ],
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
}
