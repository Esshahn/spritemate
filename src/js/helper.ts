import $ from "jquery";

export function status(text, state = "normal") {
  $("#statustext").stop(true, true);

  if (state == "normal") {
    $("#statustext").html(text).fadeIn(100).delay(2000).fadeOut(1000);
  }

  if (state == "tip") {
    $("#statustext").html(text).fadeIn(100).delay(10000).fadeOut(1000);
  }
}

export function tipoftheday() {
  let tips = [
    "Hold shift while clicking to delete pixels.",
    "You can change and define your own colors in the seetings.",
    "Press 'z' for undo and 'shift + z' for redo.",
    "You can position all windows how you like it best. Spritemate remembers that for your next visit!",
    "Exporting in SpritePad 1.8 format is ideal for using your sprites in a C64 program.",
    "Sort your sprites by dragging them around with your mouse!",
    "Right click on your sprite in the preview window to save it as PNG (works in Chrome at least).",
  ];

  let chosen_tooltip =
    "Tip Of The Day: " + tips[Math.floor(Math.random() * tips.length)];
  status(chosen_tooltip, "tip");
}

export function toggle_fullscreen() {
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
