# Spritemate
Spritemate is a new sprite editor for the Commodore 64. It works with most modern browsers on Windows, Mac and Linux and is pure JavaScript and HTML - no plugins. All data is processed on client side only. Spritemate supports importing and exporting of the most common file formats for the Commodore 64 (e.g. SpritePad) and can be used as viewer and editor on almost any device with a browser.

Spritemate is still in development. If you like it, let me know ;) Feel free to submit pull requests or submit ideas, bugs, requests in the issues section. Cheers!


Latest stable version: https://spritemate.com/

Beta version: https://beta.spritemate.com/

Video of an earlier version: https://www.youtube.com/watch?v=n59axaEQDWE

<img src="https://user-images.githubusercontent.com/434355/50591295-24ade880-0e8f-11e9-8bed-3b333692b6da.jpg" width= "80%"/>

## Features

* choose from the 16 colors of the C64 palette
* draw pixels on a 24x21 pixel (singlecolor) or 12x21 pixel (multicolor) canvas
* C64 mode restrictions (number of colors per sprite, global sprite colors)
* delete, fill, shift left, right, up, down, flip horizontal & vertical, move, erase
* check your sprite in the preview window
* display grid in editor
* multiple sprites
* double width & height sprites
* stacked sprite layers (sprite overlays)
* sprite sorting
* undo & redo
* copy, paste, duplicate
* window based GUI
* save window layout
* import & export Spritemate format
* import & export SpritePad 2.0 format
* import & export SpritePad 1.8.1 format
* export as ASM source (KICK and ACME)
* export as hex or binary notation source
* keyboard shortcuts

## Install & Dependencies

Use `npm`

```
$ npm install
$ npm run dev

```



## Menu toolbar

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/30785990-6a8e9bd0-a16f-11e7-904f-33975fbdb725.png" > | - | Loads a file.<br>Supported formats: Spritemate (SPM), SpritePad (SPD, SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30785997-6ab25638-a16f-11e7-9392-13c1c4b899cd.png" > | - | Saves a file.<br>Supported formats: Spritemate (SPM), SpritePad 2.0 & 1.8.1 (SPD), ASM source (TXT) |
| <img src="https://user-images.githubusercontent.com/434355/30786005-6acf7dc6-a16f-11e7-9725-42ba4ca5bfe1.png" > | z | Undo. For when you screwed up. |
| <img src="https://user-images.githubusercontent.com/434355/30785996-6aabec80-a16f-11e7-9345-6a0fe4ed051c.png" > | shift + z | Redo. For when you realized it wasn't that bad |
| <img src="https://user-images.githubusercontent.com/434355/31428668-e7a4882e-ae6b-11e7-9bcc-60efe6726a92.png" > | d | Draw pixels |
| <img src="https://user-images.githubusercontent.com/434355/30785982-6a72dbf2-a16f-11e7-9f1c-35b415d59b8e.png" > | f | Flood fill |
| <img src="https://user-images.githubusercontent.com/434355/50591466-25934a00-0e90-11e9-8298-2bf53b6119fa.png" > | e | eraser |
| <img src="https://user-images.githubusercontent.com/434355/50591467-27f5a400-0e90-11e9-998f-2159a6095822.png" > | m | move |

## Editor window

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/30785991-6a99bf10-a16f-11e7-821b-b5be9f81d7d7.png" > | m | Toggle between singlecolor and multicolor mode |
| <img src="https://user-images.githubusercontent.com/434355/30785999-6ab77d5c-a16f-11e7-8f46-05859afea191.png" > | - | Shift sprite left |
| <img src="https://user-images.githubusercontent.com/434355/30786000-6ab92882-a16f-11e7-9b0b-39517adf02a3.png" > | - | Shift sprite right |
| <img src="https://user-images.githubusercontent.com/434355/30786001-6abda4c0-a16f-11e7-9e23-53b845c900ba.png" > | - | Shift sprite up |
| <img src="https://user-images.githubusercontent.com/434355/30785998-6ab5f36a-a16f-11e7-9694-772a8fd79331.png" > | - | Shift sprite down |
| <img src="https://user-images.githubusercontent.com/434355/30785983-6a741e18-a16f-11e7-89e6-931b5cc52a0e.png" > | - | Flip sprite horizontal |
| <img src="https://user-images.githubusercontent.com/434355/30785984-6a75c10a-a16f-11e7-8701-589fd6218bd5.png" > | - | Flip sprite vertical |
| <img src="https://user-images.githubusercontent.com/434355/50591514-83c02d00-0e90-11e9-8687-07ec5e34eb0c.png" > | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/50591507-7dca4c00-0e90-11e9-93a9-e18042027d85.png" ><img src="https://user-images.githubusercontent.com/434355/50591510-802ca600-0e90-11e9-8e1a-4304a46861d5.png" > | - | Zooms window in/out |
|  | 1,2,3,4 | Select individual color, transparent, multicolor 1 or multicolor 2 |
|  | shift + mouse | delete pixel |

## Preview window

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/31428737-1dd2f520-ae6c-11e7-80af-9d269fa33ac9.png" > | - | Stretches sprite horizontally |
| <img src="https://user-images.githubusercontent.com/434355/31428740-1ff3dfc2-ae6c-11e7-97f8-0ccd8517d7ee.png" > | - | Stretches sprite vertically |
| <img src="https://user-images.githubusercontent.com/434355/31675717-c742c2fe-b365-11e7-9b03-1caae8ee39ea.png" > | - | Overlay next sprite |
| <img src="https://user-images.githubusercontent.com/434355/50591507-7dca4c00-0e90-11e9-93a9-e18042027d85.png" ><img src="https://user-images.githubusercontent.com/434355/50591510-802ca600-0e90-11e9-8e1a-4304a46861d5.png" > | - | Zooms window in/out |

## Sprite list window

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/31494459-a8293e90-af53-11e7-9a94-6116f320e520.png" > | - | Create new sprite |
| <img src="https://user-images.githubusercontent.com/434355/50591512-81f66980-0e90-11e9-9065-6819a28245b9.png" > | - | Delete selected sprite |
| <img src="https://user-images.githubusercontent.com/434355/31494457-a7ed60f0-af53-11e7-8ceb-db8b61a6a2db.png" > | - | Copy sprite |
| <img src="https://user-images.githubusercontent.com/434355/31494460-a84380ac-af53-11e7-8ee1-dd733beaa912.png" > | - | Paste sprite |
| <img src="https://user-images.githubusercontent.com/434355/50591514-83c02d00-0e90-11e9-8687-07ec5e34eb0c.png" > | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/50591507-7dca4c00-0e90-11e9-93a9-e18042027d85.png" ><img src="https://user-images.githubusercontent.com/434355/50591510-802ca600-0e90-11e9-8e1a-4304a46861d5.png" > | - | Zooms window in/out |
| | cursor left & right | cycle through sprite list |

## Some useful hints

* Rearrange sprites by dragging them to the desired position
* Save a sprite as PNG by right clicking on the Preview window image


## Changelog

### V1.3
#### This is a housekeeping update without new functionality. While you might be sad to not get new stuff, it is a sign of life that I'm dedicating time to this project again.

- Converted all JavaScript to TypeScript
- Rewrite of menubar, should fix annoying bug and is more responsive
- Fixed a UI issue in the save dialog
- Fixed a bug in the sprite invert code
- Added Spritemate version number to SPM save data 
- Updated to latest jQuery
- Updated webpack
- Lots of cleanup & modernization
- Added <a href="https://beta.spritemate.com">beta.spritemate.com</a> for latest version
- Changed deploy setup to work with Netlify
- jQuery excluded from bundle.js
- Release notes will only show the latest release, not all releases
- Removed Help window, documentation will again be handled on the github repo page

Initially I wanted to remove jQuery and jQuery UI from this project and replace it with Vanilla JS. Build time had grown to 10 seconds, which I found quite annoying. Replicating jQuery's modal functionality was more challenging than anticipated, therefore I decided to exclude jQuery from the JS bundle again and load it from the CDN. This greatly reduced compile time to under 4 seconds. Overall the app remains extremely small, with the main App code around 20kb and jQuery around 98kb.


### V1.2
#### Sprites can now be named. The name will show as label name in ASM and BASIC exports (thx to Janne and MacBacon for the suggestions).

 Note that two changes were introduced with the sprite naming feature: sprites start with index number 0 instead of 1, e.g. the first sprite is called "sprite_0" instead of "sprite_1". This was necessary for consistancy and my personal sanity - internally the index number always was 0 instead of 1. The other change is that sprite data exported as ASM or BASIC file would not label the sprites by incrementing index anymore. This means that a sprite would keep its name no matter if you sort it in the sprite list to a different position (which seems obvious, but wasn't like this before).

 The sprite naming feature is backwards compatible, so when you load an older SPM file, default names will be applied.

#### Sprites can be inverted (hotkey 'i').

 The sprite invert (or "negative" in SpritePad) might look a bit strange in multicolor mode, but that's no bug. In singlecolor, a 0 (transparent) gets replaced by a 1 (pixel) and vice versa, but in multicolor we have two more colors. Spritemate switches colors 3 and 4 in this case, just as SpritePad does.

#### The file name is now displayed in the top right corner of the window (thx to nurpax)

 This can prove helpful when working with several files. Also a good indicator if the file hasn't been saved yet. Note that due to the nature how browsers save files and operating systems handle security, a file might save with a slightly different name if the same file name already exists in the download location (e.g. "mysprites (1).spm" instead of "mysprites.spm").

### V1.11

#### Tweaked menu bar to react more intuitive (click to open, hover between entries)

 The menu bar does seem to malfunction for some setups, but the issue currently is not reproducable. Thx2 to leissa for additional testing and finding out that turning off "content blocking" in Firefox might fix the problem. If you encounter a reproducable issue with the menu bar, please report the description here: <a href="https://github.com/Esshahn/spritemate/issues">https://github.com/Esshahn/spritemate/issues</a>



### V1.10

This release focuses on better usabality. While technically no features were added, the overall workflow should be better now. For example, instead of having four different icons for shifting a sprite up, down, left or right, the new move tool lets you do this more intuitive now. As a side effect, less icons complicate the UI.

The option to erase pixels has been in Spritemate before (by holding down 'shift' while drawing), but now the 'eraser' tool makes it more visible and easier to use in a one-handed workflow.

A new option to duplicate a sprite has been introduced. This was previously possible by a combination of 'copy', 'new' and 'paste' (and the new duplicate is in fact exactly this), but this should add to a more intuitive experience.

There are other improvements, like the visually more distinguishable 'trash' icon to delete a sprite. All combined, Spritemate should start to feel more familiar if you are used to other paint programs like Photoshop.

- added new move tool
- added eraser tool
- added new 'duplicate sprite' option to menu and list view
- added hotkey 'shift+c' for copy
- added hotkey 'shift+v' for paste
- added hotkey 'shift+d' for duplicate
- added hotkey 'shift+x' for delete
- added hotkey 'e' for eraser tool
- added hotkey 'm' for move tool
- changed hotkey for fill to 'f'
- changed hotkey for fullscreen to 'shift+f'
- changed hotkey for color mode from 'm' to 'c'
- changed icons for zoom & grid
- removed shift left, right, up, down icons from editor
- moved 'delete sprite' icon in sprite list to right side
- replaced 'delete sprite' icon with new one (trash bin)
- changed menu bar behavior from 'click' to 'hover'

### V1.09
 
- added binary notation for assembly export (thx2 mist64!)

### V1.08
 
- added option to start a new file
- export sprite data as BASIC2.0 listing
- color tooltip now also shows the C64 color value (thx2 nurpax)
- spritemate has a new logo now
- added menu bar, making room for more features
- fixed keyboard becoming unresponsive after a modal was opened
- slightly tweaked save window
- migrated Spritemate to use webpack (thx2 nurpax)<br />
- reworked Spritemate file format, reducing file size by over 50%
- added line breaks in SPM file format for better readability
- added more info to the assembly export formats
- switched individual and transparent color pickers in color palette (thx2 Steril)
- repo cleanup (thx2 nurpax)


### V1.07
 
- added sprite number tooltips for sprites in the sprite list
- the menu palette can now be moved around and the position is saved
- updated to jquery 3.3.1, code cleanup (removed playfield code)
- the tools in the sprite list window are now fixed to the top
- some tweaks to the window design
- some icons have been refined


### V1.06
 
- added divider lines in the editor grid view (thx2 v3to)
- zoom icons moved from right side of the window to the left for better usability
- color palette now uses DIVs instead of CANVAS (needed for later features)

Although not many features had been added, it took me quite a while to finish this release. I had to revert a lot of code for a really cool new feature that I didn't get to work reliably. Because of that, I had to maintain two code branches and backport features into the stable version. I finally decided to put the new feature on hold and focus on others instead.


### V1.05
 
- Added a brief documentation (click on help in the menu bar).
- Fixed an error in Kick Assembler export (thx2 nurpax)

 I didn't get any chance to work on Spritemate for months due to my commercial stuff sucking away all my free time. Also, feedback was stopping recently, which didn't motivate me too much either. Eventually I checked the traffic for Spritemate and was suprised about the steady amount of users. So I decided to dedicate more time to this project again. In any case, if you like Spritemate, you can make a hell of a difference by letting me know, either by mail ( ingo at awsm dot de ) or by sending me a tweet ( <a href="https://twitter.com/awsm9000">@awsm9000</a> ). Let me know how I can make Spritemate better for you!

### November 08, 2017

#### Features, changes & bugfixes
- Huge speed boost when working with large sprite sets 

### October 30, 2017

#### Save settings & color palette change
 
Spritemate saves settings locally now. 
It might work a bit wonky still and I know about at least one case where the code works but should not as to my understanding (but who am I to judge the developer...). 
Anyway, the foundation for more configuration options has been layed for future updates.

- locally saved config file
- this info modal will be displayed only once when new features are introduced
- new settings modal
- choose between three color palettes: colodore, pepto and custom
- custom palette feature lets you define your own palette
- zoom levels are remembered now
- grid on/off in editor is remembered now
- window positions are now remembered
- tooltips now have a delay of one second before showing
- modals are now in focus to prevent unwanted interface interaction
- cursor keys rotate through the sprite list instead of stopping at start and end
- current version number is now shown in info modal

### October 24, 2017

#### First public beta release
 
spritemate is now in public beta. Thanks to all the beta testers who helped find bugs and suggest features and improvements. Please check out the <a target="_blank" href="https://github.com/Esshahn/spritemate">documentation on Github</a> to get a feature overview. 


### October 20, 2017

#### Keyboard Shortcuts
 
The most common actions have received hotkeys for quick access. 
Using hotkeys in a browser is always a bit tricky, as many combinations are taken by the browser (like CMD/CTRL + C for "copy"). 
Therefore some shortcuts might seem less intuitive. These functions are available by pressing keys now:

(1,2,3,4) - set one of the four available pens/colors
(f) - toggle fullscreen on/off
(d) - toggle between "draw" and "fill" modes
(z) - undo, (shift + z) = redo
(m) - toggle singlecolor/multicolor
(cursor left, right) - navigate through sprite list (thx2 Wiebo)


#### Bug fixes and changes

- Tooltips on the icons now look nicer (thx2 korshun)
- Fixed a bug in the SpritePad importer
- small visual and bug fixes


### October 19, 2017

- SpritePad 2.x overlay settings will be imported & exported now
- new sprites inherit the multicolor setting of the current sprite (thx2 Wiebo)
- sprite index & amount of sprites shown in list window title (thx2 Wiebo)
- assembler source now supports KICK ASS and ACME syntax (thx2 korshun)
- zoom icons fade out when min/max level is reached
- more speed enhancements

### October 18, 2017
#### Sprite Overlays
 Toggle sprite overlays in preview window. The following sprite will be used as overlay. The preview window shows both sprites and the editor window shows the other sprite with reduced visibility (like onion skinning). Please note that currently sprite overlay information is stored in native spritemate format only.
#### Bug fixes and changes

- spritemate should work again in Firefox (thx2 merman1974)
- zoom levels for windows have been increased (thx2 INC$D021)
- fixed a crazy stupid thing in pixel display code
- huge speed improvements for sprite display
          
