export const dom = {
  add_class: function (target, source): void {
    if (this.is_canvas(target)) {
      target.classList.add(source);
    } else {
      document.querySelector(target)?.classList.add(source);
    }
  },

  append: function (target: string, source): void {
    const t = document.querySelector(target) as any;
    t.innerHTML = source;
  },

  /** add html element ie a canvas to target */
  append_element: function (target: string, source): void {
    document.querySelector(target)?.appendChild(source);
  },

  /** changes the attribute of an element */
  attr: function (target: string, attribute, value): void {
    document.querySelector(target)?.setAttribute(attribute, value);
  },

  css: function (target, property: string, value): void {
    document.querySelector(target).style[property] = value;
  },

  disabled(target, state): void {
    document.querySelectorAll(target).forEach((element) => {
      element.disabled = state;
    });
  },

  empty(target): void {
    document.querySelector(target).innerHTML = "";
  },

  fade_in(target, delay_milliseconds = 0, fade_milliseconds = 1000): void {
    const fadeTarget: any = document.querySelector(target);
    setTimeout(function () {
      fadeTarget.style.opacity = 0;
      fadeTarget.style.transition = "opacity " + fade_milliseconds / 1000 + "s";
      fadeTarget.style.opacity = 1;
    }, delay_milliseconds);
  },

  fade_out(target, delay_milliseconds = 0, fade_milliseconds = 1000): void {
    const fadeTarget: any = document.querySelector(target);
    setTimeout(function () {
      fadeTarget.style.opacity = 1;
      fadeTarget.style.transition = "opacity " + fade_milliseconds / 1000 + "s";
      fadeTarget.style.opacity = 0;
    }, delay_milliseconds);
  },

  /** fade opacity TARGET, FROM VALUE, TO VALUE, MILLISECONDS */
  fade(target, from_opacity, to_opacity, fade_milliseconds = 200): void {
    const fadeTarget: any = document.querySelectorAll(target);
    fadeTarget.forEach((element) => {
      if (element.style.opacity != to_opacity) {
        setTimeout(function () {
          element.style.opacity = from_opacity;
          element.style.transition =
            "opacity " + fade_milliseconds / 1000 + "s";
          element.style.opacity = to_opacity;
        });
      }
    });
  },

  get_css: function (target, property: string) {
    return document.querySelector(target).style[property];
  },

  hide(target): void {
    document.querySelector(target).style.display = "none";
  },

  html(target, text: string): void {
    document.querySelector(target).innerHTML = text;
  },

  is_canvas(i): boolean {
    return i instanceof HTMLCanvasElement;
  },

  remove_all_class: function (target, source): void {
    document.querySelectorAll(target).forEach((element) => {
      element.classList.remove(source);
    });
  },

  remove_all_elements: function (target): void {
    document.querySelectorAll(target).forEach((element) => {
      element.remove();
    });
  },

  remove_class: function (target, source): void {
    document.querySelector(target)?.classList.remove(source);
  },

  show(target): void {
    document.querySelector(target).style.display = "block";
  },

  /** selects an element from the dom and returns it */
  sel(target) {
    return document.querySelector(target);
  },

  /** if no value is given, returns the current value */
  val(target, value?) {
    if (value) {
      document.querySelector(target).value = value;
    }
    return document.querySelector(target).value;
  },
};

export function status(text: string, state = "normal"): void {
  let delay = 2000;
  const fade = 2000;
  if (state == "tip") delay = 10000;

  dom.html("#statustext", text);
  dom.fade_out("#statustext", delay, fade);
}

export function tipoftheday(): void {
  const tips = [
    "Hold shift while clicking to delete pixels.",
    "You can change and define your own colors in the seetings.",
    "Press 'z' for undo and 'shift + z' for redo.",
    "You can position all windows how you like it best. Spritemate remembers that for your next visit!",
    "Exporting in SpritePad 1.8 format is ideal for using your sprites in a C64 program.",
    "Sort your sprites by dragging them around with your mouse!",
    "Right click on your sprite in the preview window to save it as PNG (works in Chrome at least).",
  ];

  const chosen_tooltip =
    "Tip Of The Day: " + tips[Math.floor(Math.random() * tips.length)];
  status(chosen_tooltip, "tip");
}

export function toggle_fullscreen(): void {
  if (
    !document.fullscreenElement && // alternative standard method
    !(<any>document).mozFullScreenElement &&
    !(<any>document).webkitFullscreenElement &&
    !(<any>document).msFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((<any>document.documentElement).msRequestFullscreen) {
      (<any>document.documentElement).msRequestFullscreen();
    } else if ((<any>document.documentElement).mozRequestFullScreen) {
      (<any>document.documentElement).mozRequestFullScreen();
    } else if ((<any>document.documentElement).webkitRequestFullscreen) {
      (<any>document.documentElement).webkitRequestFullscreen(
        (<any>Element).ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((<any>document).msExitFullscreen) {
      (<any>document).msExitFullscreen();
    } else if ((<any>document).mozCancelFullScreen) {
      (<any>document).mozCancelFullScreen();
    } else if ((<any>document).webkitExitFullscreen) {
      (<any>document).webkitExitFullscreen();
    }
  }
}
