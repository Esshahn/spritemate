
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


function status(text,state = "normal")
{
  $("#statustext").stop(true,true);

  if (state == "normal")
  {
    $("#statustext").html(text).fadeIn(100).delay(2000).fadeOut(1000);
  }

  if (state == "tip")
  {
    $("#statustext").html(text).fadeIn(100).delay(10000).fadeOut(1000);
  }
}


function tipoftheday()
{
  let tips = 
  [
  "Did you know there was a C64 in John Wick 2?",
  "Hold shift while clicking to delete pixels.",
  "You can change and define your own colors in the seetings.",
  "Press 'z' for undo and 'shift + z' for redo.",
  "You can position all windows how you like it best. Spritemate remembers that for your next visit!",
  "Exporting in SpritePad 1.8 format is ideal for using your sprites in a C64 program.",
  "Sort your sprites by dragging them around with your mouse!",
  "Right click on your sprite in the editor window to save it as PNG (works in Chrome at least)."
  ];

  let chosen_tooltip = tips[Math.floor(Math.random()*tips.length)] + "\xa0\xa0\xa0" + "<a href='#' onclick='tipoftheday();'>next tip</a>";
  status(chosen_tooltip,"tip");
}


