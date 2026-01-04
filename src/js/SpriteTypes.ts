/**
 * Type definitions for sprite data structures.
 *
 * This provides a single source of truth for the sprite data format
 * used throughout the application.
 */

export interface AnimationData {
  startSprite: number;
  endSprite: number;
  fps: number;
  mode: string;          // "restart" or "pingpong"
  doubleX: boolean;
  doubleY: boolean;
}

export interface SpriteData {
  name: string;
  color: number;           // Individual color (pen 1), palette index 0-15
  multicolor: boolean;
  double_x: boolean;
  double_y: boolean;
  overlay: boolean;
  pixels: number[][];      // 2D array [y][x], values: 0=transparent, 1=individual, 2=mc1, 3=mc2
  animation?: AnimationData; // Per-sprite animation settings (optional for backward compatibility)
}

export interface SpriteCollection {
  version: string;
  filename: string;
  colors: {
    0: number;             // Background/transparent color (shared globally)
    2: number;             // Multicolor 1 (shared by all multicolor sprites)
    3: number;             // Multicolor 2 (shared by all multicolor sprites)
  };
  sprites: SpriteData[];
  current_sprite: number;
  pen: number;             // Current drawing pen: 0, 1, 2, or 3
  animation: {
    startSprite: number;
    endSprite: number;
    fps: number;
    mode: string;          // "restart" or "pingpong"
    doubleX: boolean;
    doubleY: boolean;
  };
}

/**
 * Helper functions for creating sprite data with defaults from config
 */
export class SpriteHelpers {
  /**
   * Create empty pixel grid filled with a specific value
   */
  static createPixelGrid(width: number, height: number, fillValue: number = 0): number[][] {
    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        row.push(fillValue);
      }
      grid.push(row);
    }
    return grid;
  }

  /**
   * Create a sprite object with defaults
   */
  static createSprite(
    config: any,
    params: Partial<SpriteData> = {}
  ): SpriteData {
    return {
      name: params.name ?? "sprite0",
      color: params.color ?? config.sprite_defaults.individual_color,
      multicolor: params.multicolor ?? false,
      double_x: params.double_x ?? false,
      double_y: params.double_y ?? false,
      overlay: params.overlay ?? false,
      pixels: params.pixels ?? this.createPixelGrid(config.sprite_x, config.sprite_y),
    };
  }

  /**
   * Create a sprite collection with defaults
   */
  static createCollection(
    config: any,
    params: Partial<SpriteCollection> = {}
  ): SpriteCollection {
    const sprites = params.sprites ?? [];
    const colors = params.colors ?? {
      0: config.sprite_defaults.background_color,
      2: config.sprite_defaults.multicolor_1,
      3: config.sprite_defaults.multicolor_2,
    };

    return {
      version: config.version,
      filename: params.filename ?? config.default_filename,
      colors: colors,
      sprites: sprites,
      current_sprite: params.current_sprite ?? 0,
      pen: params.pen ?? config.sprite_defaults.pen,
      animation: params.animation ?? {
        startSprite: 0,
        endSprite: Math.max(0, sprites.length - 1),
        fps: config.sprite_defaults.animation_fps,
        mode: config.sprite_defaults.animation_mode,
        doubleX: false,
        doubleY: false,
      },
    };
  }
}
