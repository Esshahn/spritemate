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

  constructor(public window: number, public config) {
    super();
    this.config = config;
    this.window = window;
    this.canvas_element = document.createElement("canvas");
    this.zoom = this.config.window_animation?.zoom ?? 6;
    this.zoom_min = 4;
    this.zoom_max = 16;
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
        <div class="icons-zoom-area">
          <img src="ui/icon-zoom-plus.png" class="icon-hover" id="icon-animation-zoom-in" title="zoom in">
          <img src="ui/icon-zoom-minus.png" class="icon-hover" id="icon-animation-zoom-out" title="zoom out">
        </div>
      </div>
      <div id="animation-canvas"></div>
      <div class="animation-controls">
        <div class="animation-control-row">
          <label for="animation-start-sprite">Start Sprite:</label>
          <input type="number" id="animation-start-sprite" min="0" value="0" />
        </div>
        <div class="animation-control-row">
          <label for="animation-end-sprite">End Sprite:</label>
          <input type="number" id="animation-end-sprite" min="0" value="0" />
        </div>
        <div class="animation-control-row">
          <label for="animation-fps">FPS:</label>
          <input type="number" id="animation-fps" min="1" max="60" value="10" />
        </div>
        <div class="animation-control-row">
          <label>Mode:</label>
          <div class="animation-radio-group">
            <label>
              <input type="radio" name="animation-mode" value="restart" checked /> Restart
            </label>
            <label>
              <input type="radio" name="animation-mode" value="pingpong" /> PingPong
            </label>
          </div>
        </div>
        <div class="animation-control-row">
          <button id="animation-play-stop" class="animation-button">Play</button>
        </div>
      </div>
    `;

    dom.append("#window-" + this.window, template);
    dom.append_element("#animation-canvas", this.canvas_element);

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Start/End sprite inputs
    const startInput = dom.sel("#animation-start-sprite") as HTMLInputElement;
    const endInput = dom.sel("#animation-end-sprite") as HTMLInputElement;
    const fpsInput = dom.sel("#animation-fps") as HTMLInputElement;

    if (startInput) {
      startInput.oninput = () => {
        this.startSprite = parseInt(startInput.value) || 0;
        this.currentFrame = this.startSprite;
      };
    }

    if (endInput) {
      endInput.oninput = () => {
        this.endSprite = parseInt(endInput.value) || 0;
        this.currentFrame = this.startSprite;
      };
    }

    if (fpsInput) {
      fpsInput.oninput = () => {
        const newFps = parseInt(fpsInput.value) || 10;
        this.fps = Math.min(60, Math.max(1, newFps));
        fpsInput.value = this.fps.toString();

        // Restart animation with new FPS if playing
        if (this.isPlaying) {
          this.stop();
          this.play();
        }
      };
    }

    // Radio buttons
    const radioButtons = document.querySelectorAll('input[name="animation-mode"]');
    radioButtons.forEach((radio: HTMLInputElement) => {
      radio.onchange = () => {
        this.animationMode = radio.value as "pingpong" | "restart";
        this.direction = 1;
        this.currentFrame = this.startSprite;
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

    // Zoom controls
    const zoomInButton = dom.sel("#icon-animation-zoom-in");
    const zoomOutButton = dom.sel("#icon-animation-zoom-out");

    if (zoomInButton) {
      zoomInButton.onclick = () => {
        this.zoom_in();
        this.canvas_element.width = this.width;
        this.canvas_element.height = this.height;
      };
    }

    if (zoomOutButton) {
      zoomOutButton.onclick = () => {
        this.zoom_out();
        this.canvas_element.width = this.width;
        this.canvas_element.height = this.height;
      };
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

    // Set the animation window x and y stretch
    let double_x: number;
    let double_y: number;
    if (sprite_data.double_x) {
      double_x = 2;
    } else {
      double_x = 1;
    }

    if (sprite_data.double_y) {
      double_y = 2;
    } else {
      double_y = 1;
    }

    dom.css("#animation", "width", this.width * double_x + "px");
    dom.css("#animation", "height", this.height * double_y + "px");
  }

  update(all_data) {
    this.canvas_element.width = this.width;
    this.canvas_element.height = this.height;

    // Cache sprite data for animation playback
    this.cachedSpriteData = all_data;

    // Update max values for start/end sprite inputs
    const startInput = dom.sel("#animation-start-sprite") as HTMLInputElement;
    const endInput = dom.sel("#animation-end-sprite") as HTMLInputElement;

    if (startInput) {
      startInput.max = (all_data.sprites.length - 1).toString();
    }

    if (endInput) {
      endInput.max = (all_data.sprites.length - 1).toString();
      if (this.endSprite === 0) {
        this.endSprite = all_data.sprites.length - 1;
        endInput.value = this.endSprite.toString();
      }
    }

    // If not playing, show the current sprite from the editor
    if (!this.isPlaying) {
      this.currentFrame = all_data.current_sprite;
    }

    // Draw the current frame
    this.drawFrame(all_data);
  }
}
