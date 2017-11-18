"use strict";

/*

HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLL             PPPPPPPPPPPPPPPPP   EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR   
H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::::::::::::P  E::::::::::::::::::::ER::::::::::::::::R  
H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::PPPPPP:::::P E::::::::::::::::::::ER::::::RRRRRR:::::R 
HH::::::H     H::::::HHEE::::::EEEEEEEEE::::ELL:::::::LL             PP:::::P     P:::::PEE::::::EEEEEEEEE::::ERR:::::R     R:::::R
  H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L                 P::::P     P:::::P  E:::::E       EEEEEE  R::::R     R:::::R
  H:::::H     H:::::H    E:::::E               L:::::L                 P::::P     P:::::P  E:::::E               R::::R     R:::::R
  H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::PPPPPP:::::P   E::::::EEEEEEEEEE     R::::RRRRRR:::::R 
  H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P:::::::::::::PP    E:::::::::::::::E     R:::::::::::::RR  
  H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P::::PPPPPPPPP      E:::::::::::::::E     R::::RRRRRR:::::R 
  H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::P              E::::::EEEEEEEEEE     R::::R     R:::::R
  H:::::H     H:::::H    E:::::E               L:::::L                 P::::P              E:::::E               R::::R     R:::::R
  H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L         LLLLLL  P::::P              E:::::E       EEEEEE  R::::R     R:::::R
HH::::::H     H::::::HHEE::::::EEEEEEEE:::::ELL:::::::LLLLLLLLL:::::LPP::::::PP          EE::::::EEEEEEEE:::::ERR:::::R     R:::::R
H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::R
HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPP          EEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR

*/

function status(text) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "normal";

  $("#statustext").stop(true, true);

  if (state == "normal") {
    $("#statustext").html(text).fadeIn(100).delay(2000).fadeOut(1000);
  }

  if (state == "tip") {
    $("#statustext").html(text).fadeIn(100).delay(10000).fadeOut(1000);
  }
}

function tipoftheday() {
  var tips = ["Did you know there was a C64 in John Wick 2?", "Hold shift while clicking to delete pixels.", "You can change and define your own colors in the seetings.", "Press 'z' for undo and 'shift + z' for redo.", "Save your project in Spritemate format when working with multiple overlays.", "You can position all windows how you like it best. Spritemate remembers that for your next visit!", "Exporting in SpritePad 1.8 format is ideal for using your sprites in a C64 program.", "Sort your sprites by dragging them around with your mouse!", "You can enter sprite numbers (like 1,5,12,4) in overlay mode or leave the field blank for overlaying the next sprite."];

  var chosen_tooltip = tips[Math.floor(Math.random() * tips.length)] + "\xa0\xa0\xa0" + "<a href='#' onclick='tipoftheday();'>next tip</a>";
  status(chosen_tooltip, "tip");
}