import { dom } from "./helper";
import Window_Controls from "./Window_Controls";

export default class Animation extends Window_Controls {
  canvas_element: any = {};
  canvas: any = {};
  animationInterval: any = null;
  isPlaying: boolean = false;
  currentFrame: number = 0;
  startSprite: number = 0;
  endSprite: number = 0;
  fps: number = 10;
  animationMode: "pingpong" | "restart" = "restart";
  direction: number = 1; // 1 for forward, -1 for backward (used in pingpong mode)
  cachedSpriteData: any = null; // Cache sprite data for animation playback
  doubleX: boolean = false; // Global X stretch for animation
  doubleY: boolean = false; // Global Y stretch for animation
  firstUpdate: boolean = true; // Track if this is the first update

  // Cache DOM elements to avoid repeated queries
  private inputs: {
    start?: HTMLInputElement;
    end?: HTMLInputElement;
    fps?: HTMLInputElement;
  } = {};

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_animation?.zoom ?? 6;
    this.zoom_min = this.config.zoom_limits.animation.min;
    this.zoom_max = this.config.zoom_limits.animation.max;
    this.pixels_x = this.config.sprite_x;
    this.pixels_y = this.config.sprite_y;
    this.width = this.pixels_x * this.zoom;
    this.height = this.pixels_y * this.zoom;

    this.canvas_element.id = "animation";
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.canvas = this.canvas_element.getContext("2d");

    const template = `
      <div class="window_menu">
        <div class="window_menu_icon_area">
          <img src="ui/icon-zoom-in.png" class="icon-hover" id="icon-animation-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-out.png" class="icon-hover" id="icon-animation-zoom-out" title="zoom out">
        </div>
        <img src="ui/icon-preview-x2.png" class="icon-hover" id="icon-animation-x" title="double width">
        <img src="ui/icon-preview-y2.png" class="icon-hover" id="icon-animation-y" title="double height">

        <img src="ui/icon-list-trash.png" class="icon-right icon-hover" id="icon-animation-delete" title="delete animation">
      </div>
      <div id="animation-canvas"></div>
      <div class="window-control-panel">
        <div class="control-row control-row-centered">
          Start/End:
          <input type="number" id="animation-start-sprite" min="1" value="1" />
          <input type="number" id="animation-end-sprite" min="1" value="1" />
          FPS:
          <input type="number" id="animation-fps" min="1" max="60" value="10" />
        </div>
        <div class="control-row control-row-centered">
          <div class="animation-radio-group">
              <input type="radio" name="animation-mode" value="restart" checked /> Restart
              <input type="radio" name="animation-mode" value="pingpong" /> PingPong
          </div>
        </div>
        <div class="control-row control-row-centered">
          <button id="animation-play-stop" class="btn btn-primary">Play</button>
        </div>
      </div>
    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#animation-canvas", this.canvas_element);

    this.setupEventListeners();

    // Prevent auto-focus on input fields
    setTimeout(() => {
      const canvasContainer = dom.sel("#animation-canvas") as HTMLElement;
      if (canvasContainer) {
        canvasContainer.setAttribute("tabindex", "0");
        canvasContainer.focus();
        canvasContainer.blur(); // Immediately blur to remove focus outline
      }
    }, 0);
  }

  setupEventListeners() {
    // Cache input elements
    this.inputs.start = dom.sel("#animation-start-sprite") as HTMLInputElement;
    this.inputs.end = dom.sel("#animation-end-sprite") as HTMLInputElement;
    this.inputs.fps = dom.sel("#animation-fps") as HTMLInputElement;

    if (this.inputs.start) {
      this.inputs.start.onchange = () => {
        const uiValue = parseInt(this.inputs.start!.value) || 1;
        this.startSprite = Math.max(0, uiValue - 1);
        this.currentFrame = this.startSprite;
        this.saveSettings();
      };
    }

    if (this.inputs.end) {
      this.inputs.end.onchange = () => {
        const uiValue = parseInt(this.inputs.end!.value) || 1;
        this.endSprite = Math.max(0, uiValue - 1);
        this.currentFrame = this.startSprite;
        this.saveSettings();
      };
    }

    if (this.inputs.fps) {
      this.inputs.fps.onchange = () => {
        const newFps = parseInt(this.inputs.fps!.value) || 10;
        this.fps = Math.min(60, Math.max(1, newFps));
        this.inputs.fps!.value = this.fps.toString();

        if (this.isPlaying) {
          this.stop();
          this.play();
        }
        this.saveSettings();
      };
    }

    // Radio buttons
    const radioButtons = document.querySelectorAll('input[name="animation-mode"]');
    radioButtons.forEach((radio) => {
      const radioInput = radio as HTMLInputElement;
      radioInput.onchange = () => {
        this.animationMode = radioInput.value as "pingpong" | "restart";
        this.direction = 1;
        this.currentFrame = this.startSprite;
        this.saveSettings();
      };
    });

    // Play/Stop button
    const playButton = dom.sel("#animation-play-stop");
    if (playButton) {
      playButton.onclick = () => {
        if (this.isPlaying) {
          this.stop();
        } else {
          this.play();
        }
      };
    }

    // Delete animation button
    const deleteButton = dom.sel("#icon-animation-delete");
    if (deleteButton) {
      deleteButton.onclick = () => {
        this.deleteAnimation();
      };
    }

    // Zoom is handled by App.ts event handlers
  }

  update_zoom(): void {
    super.update_zoom();
    // Update canvas element dimensions when zoom changes
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    if (this.cachedSpriteData) {
      this.drawFrame(this.cachedSpriteData);
    }
  }

  toggleDoubleX() {
    this.doubleX = !this.doubleX;
    this.updateIconStates();
    if (this.cachedSpriteData) {
      this.drawFrame(this.cachedSpriteData);
    }
    this.saveSettings();
  }

  toggleDoubleY() {
    this.doubleY = !this.doubleY;
    this.updateIconStates();
    if (this.cachedSpriteData) {
      this.drawFrame(this.cachedSpriteData);
    }
    this.saveSettings();
  }

  updateIconStates() {
    // Update X icon by changing the image src
    if (this.doubleX) {
      dom.attr("#icon-animation-x", "src", "ui/icon-preview-x2-hi.png");
    } else {
      dom.attr("#icon-animation-x", "src", "ui/icon-preview-x2.png");
    }

    // Update Y icon by changing the image src
    if (this.doubleY) {
      dom.attr("#icon-animation-y", "src", "ui/icon-preview-y2-hi.png");
    } else {
      dom.attr("#icon-animation-y", "src", "ui/icon-preview-y2.png");
    }
  }

  play() {
    if (this.startSprite > this.endSprite) {
      return; // Invalid range
    }

    this.isPlaying = true;
    this.currentFrame = this.startSprite;
    this.direction = 1;

    const playButton = dom.sel("#animation-play-stop");
    if (playButton) {
      playButton.textContent = "Stop";
    }

    const frameDelay = 1000 / this.fps;

    this.animationInterval = setInterval(() => {
      this.nextFrame();
    }, frameDelay);
  }

  stop() {
    this.isPlaying = false;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    const playButton = dom.sel("#animation-play-stop");
    if (playButton) {
      playButton.textContent = "Play";
    }
  }

  nextFrame() {
    if (this.animationMode === "restart") {
      this.currentFrame++;
      if (this.currentFrame > this.endSprite) {
        this.currentFrame = this.startSprite;
      }
    } else if (this.animationMode === "pingpong") {
      this.currentFrame += this.direction;

      if (this.currentFrame >= this.endSprite) {
        this.direction = -1;
        this.currentFrame = this.endSprite;
      } else if (this.currentFrame <= this.startSprite) {
        this.direction = 1;
        this.currentFrame = this.startSprite;
      }
    }

    // Redraw the canvas with the new frame
    if (this.cachedSpriteData) {
      this.drawFrame(this.cachedSpriteData);
    }
  }

  drawFrame(all_data) {
    // Determine which sprite to display
    let spriteIndex = this.currentFrame;
    spriteIndex = Math.max(0, Math.min(spriteIndex, all_data.sprites.length - 1));

    const sprite_data = all_data.sprites[spriteIndex];
    let x_grid_step = 1;
    if (sprite_data.multicolor) x_grid_step = 2;

    // First fill the whole sprite with the background color
    this.canvas.fillStyle = this.config.colors[all_data.colors[0]];
    this.canvas.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.pixels_x; i = i + x_grid_step) {
      for (let j = 0; j < this.pixels_y; j++) {
        const array_entry = sprite_data.pixels[j][i];

        if (array_entry != 0) {
          // transparent
          let color = sprite_data.color;
          if (array_entry != 1 && sprite_data.multicolor)
            color = all_data.colors[array_entry];
          this.canvas.fillStyle = this.config.colors[color];
          this.canvas.fillRect(
            i * this.zoom,
            j * this.zoom,
            x_grid_step * this.zoom,
            this.zoom
          );
        }
      }
    }

    // Set the animation window x and y stretch (using global stretch settings)
    const double_x = this.doubleX ? 2 : 1;
    const double_y = this.doubleY ? 2 : 1;

    dom.css("#animation", "width", this.width * double_x + "px");
    dom.css("#animation", "height", this.height * double_y + "px");
  }

  loadSettings(all_data) {
    // Get the current sprite's animation settings
    const app = (window as any).app;
    let animationSettings;

    if (app && app.sprite) {
      animationSettings = app.sprite.get_animation_settings();
    } else if (all_data.animation) {
      animationSettings = all_data.animation;
    } else {
      // Default settings with current sprite
      animationSettings = {
        startSprite: all_data.current_sprite || 0,
        endSprite: all_data.current_sprite || 0,
        fps: 10,
        mode: "restart",
        doubleX: false,
        doubleY: false
      };
    }

    // Load settings into instance variables
    this.startSprite = animationSettings.startSprite || 0;
    this.endSprite = animationSettings.endSprite || 0;
    this.fps = animationSettings.fps || 10;
    this.animationMode = animationSettings.mode || "restart";
    this.doubleX = animationSettings.doubleX || false;
    this.doubleY = animationSettings.doubleY || false;

    // Update UI using cached inputs
    if (this.inputs.start) this.inputs.start.value = (this.startSprite + 1).toString();
    if (this.inputs.end) this.inputs.end.value = (this.endSprite + 1).toString();
    if (this.inputs.fps) this.inputs.fps.value = this.fps.toString();

    // Update radio buttons
    const radioButtons = document.querySelectorAll('input[name="animation-mode"]');
    radioButtons.forEach((radio) => {
      const radioInput = radio as HTMLInputElement;
      radioInput.checked = (radioInput.value === this.animationMode);
    });

    this.updateIconStates();
  }

  saveSettings() {
    // Get sprite data and update animation settings
    const app = (window as any).app;
    if (app && app.sprite) {
      app.sprite.set_animation_settings({
        startSprite: this.startSprite,
        endSprite: this.endSprite,
        fps: this.fps,
        mode: this.animationMode,
        doubleX: this.doubleX,
        doubleY: this.doubleY
      });
    }
  }

  deleteAnimation() {
    // Stop animation if playing
    if (this.isPlaying) {
      this.stop();
    }

    // Delete the animation from the current sprite
    const app = (window as any).app;
    if (app && app.sprite) {
      const currentSprite = app.sprite.get_current_sprite();
      if (currentSprite.animation) {
        delete currentSprite.animation;

        // Trigger save and update
        app.sprite.save_backup();
        app.update();
      }
    }
  }

  update(all_data, stopAnimation = false) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;
    this.cachedSpriteData = all_data;

    // Only stop animation if explicitly requested (e.g., when loading a new file)
    if (stopAnimation && this.isPlaying) {
      this.stop();
    }

    // Load settings from data (handles both first load and file loads)
    this.loadSettings(all_data);

    // Update input constraints using cached elements
    const maxSprites = all_data.sprites.length.toString();
    if (this.inputs.start) {
      this.inputs.start.max = maxSprites;
      // Set start sprite to current sprite if animation hasn't been defined yet
      const currentSprite = all_data.sprites[all_data.current_sprite];
      if (!currentSprite.animation) {
        this.startSprite = all_data.current_sprite;
        this.inputs.start.value = (this.startSprite + 1).toString();
      }
    }
    if (this.inputs.end) {
      this.inputs.end.max = maxSprites;
      // Set end sprite to current sprite if animation hasn't been defined yet
      const currentSprite = all_data.sprites[all_data.current_sprite];
      if (!currentSprite.animation) {
        this.endSprite = all_data.current_sprite;
        this.inputs.end.value = (this.endSprite + 1).toString();
      }
    }

    // Update the current frame to the start sprite and redraw
    this.currentFrame = this.startSprite;
    this.drawFrame(all_data);
  }
}
