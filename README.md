# Spritemate
Spritemate is a new sprite editor for the Commodore 64. It works with most modern browsers on Windows, Mac and Linux and is pure JavaScript and HTML - no plugins. All data is processed on client side only. Spritemate supports importing and exporting of the most common file formats for the Commodore 64 (e.g. SpritePad) and can be used as viewer and editor on almost any device with a browser.

Latest version: http://spritemate.com/

<img src="https://user-images.githubusercontent.com/434355/31865103-30467f1e-b769-11e7-9f3e-c065b4413f82.png" width= "80%"/>

## Features

* choose from the 16 colors of the C64 palette
* draw pixels on a 24x21 pixel (singlecolor) or 12x21 pixel (multicolor) canvas
* C64 mode restrictions (number of colors per sprite, global sprite colors)
* delete, fill, shift left, right, up, down, flip horizontal & vertical
* check your sprite in the preview window
* display grid in editor
* multiple sprites
* double width & height sprites
* stacked sprite layers (sprite overlays)
* sprite sorting
* undo & redo
* copy & paste
* window based GUI
* save window layout
* import & export Spritemate format
* import & export SpritePad 2.0 format
* import & export SpritePad 1.8.1 format
* export as ASM source (KICK and ACME)
* keyboard shortcuts

## Backlog

* animation
* export animation as GIF
* import & export PNG images
* select and move pixels
* touch controls and tablet optimization
* and tons of other stuff

## Menu toolbar

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/30785990-6a8e9bd0-a16f-11e7-904f-33975fbdb725.png" > | - | Loads a file.<br>Supported formats: Spritemate (SPM), SpritePad (SPD, SPR) |
| <img src="https://user-images.githubusercontent.com/434355/30785997-6ab25638-a16f-11e7-9392-13c1c4b899cd.png" > | - | Saves a file.<br>Supported formats: Spritemate (SPM), SpritePad 2.0 & 1.8.1 (SPD), ASM source (TXT) |
| <img src="https://user-images.githubusercontent.com/434355/30786005-6acf7dc6-a16f-11e7-9725-42ba4ca5bfe1.png" > | z | Undo. For when you screwed up. |
| <img src="https://user-images.githubusercontent.com/434355/30785996-6aabec80-a16f-11e7-9345-6a0fe4ed051c.png" > | shift + z | Redo. For when you realized it wasn't that bad |
| <img src="https://user-images.githubusercontent.com/434355/31428668-e7a4882e-ae6b-11e7-9bcc-60efe6726a92.png" > | d (toggle) | Draw pixels |
| <img src="https://user-images.githubusercontent.com/434355/30785982-6a72dbf2-a16f-11e7-9f1c-35b415d59b8e.png" > | d (toggle) | Flood fill |
| <img src="https://user-images.githubusercontent.com/434355/31428727-147bfd46-ae6c-11e7-8f04-5e383322f82a.png" > | f | Toggle fullscreen window mode |
| <img src="https://user-images.githubusercontent.com/434355/31428730-187cf6fc-ae6c-11e7-81ac-d64fce3c95f9.png" > | - | Displays the info window |

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
| <img src="https://user-images.githubusercontent.com/434355/30785986-6a82ef1a-a16f-11e7-92ef-bb755f6dcc8d.png" > | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/30786004-6acf03be-a16f-11e7-956d-dfdc4c412bf7.png" ><img src="https://user-images.githubusercontent.com/434355/30786006-6ad1105a-a16f-11e7-86b9-2af57883c167.png" > | - | Zooms window in/out |
|  | 1,2,3,4 | Select individual color, transparent, multicolor 1 or multicolor 2 |
|  | shift + mouse | delete pixel |

## Preview window

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/31428737-1dd2f520-ae6c-11e7-80af-9d269fa33ac9.png" > | - | Stretches sprite horizontally |
| <img src="https://user-images.githubusercontent.com/434355/31428740-1ff3dfc2-ae6c-11e7-97f8-0ccd8517d7ee.png" > | - | Stretches sprite vertically |
| <img src="https://user-images.githubusercontent.com/434355/31675717-c742c2fe-b365-11e7-9b03-1caae8ee39ea.png" > | - | Overlay next sprite |
| <img src="https://user-images.githubusercontent.com/434355/30786004-6acf03be-a16f-11e7-956d-dfdc4c412bf7.png" ><img src="https://user-images.githubusercontent.com/434355/30786006-6ad1105a-a16f-11e7-86b9-2af57883c167.png" > | - | Zooms window in/out |

## Sprite list window

| Symbol        | Shortcut      | Function  |
| :-------------: | ------------- | --------------- |
| <img src="https://user-images.githubusercontent.com/434355/31494459-a8293e90-af53-11e7-9a94-6116f320e520.png" > | - | Create new sprite |
| <img src="https://user-images.githubusercontent.com/434355/31494458-a80da95a-af53-11e7-87a3-ec6f5f82658b.png" > | - | Remove selected sprite |
| <img src="https://user-images.githubusercontent.com/434355/31494457-a7ed60f0-af53-11e7-8ceb-db8b61a6a2db.png" > | - | Copy sprite |
| <img src="https://user-images.githubusercontent.com/434355/31494460-a84380ac-af53-11e7-8ee1-dd733beaa912.png" > | - | Paste sprite |
| <img src="https://user-images.githubusercontent.com/434355/30785986-6a82ef1a-a16f-11e7-92ef-bb755f6dcc8d.png" > | - | Toggles grid display on/off |
| <img src="https://user-images.githubusercontent.com/434355/30786004-6acf03be-a16f-11e7-956d-dfdc4c412bf7.png" ><img src="https://user-images.githubusercontent.com/434355/30786006-6ad1105a-a16f-11e7-86b9-2af57883c167.png" > | - | Zooms window in/out |
| | cursor left & right | cycle through sprite list |

## Some useful hints

* you can rearrange sprites by just dragging them to the desired position
* you can copy & paste sprites by using the corresponding icons in the sprite list window

## History

2017-11-01
* local config file support
* window positions, zoom levels are saved locally
* new settings modal with color palette options: pepto, colodore and custom
* cursor keys rotate through the sprite list
* minar fixes and tweaks

2017-10-24
* first public release

2017-10-20
* Keyboard shortcuts support
* fixed a bug in sprite importer script introduced the other day
* nicer looking tooltips

2017-10-19
* KICK ASS syntax support for source export
* Sprite overlays are shown in editor
* import & export sprite overlay settings from SpritePad
* number of sprites and current sprite index shown in list window title
* new sprites inherit the color and multicolor settings of the active sprite
* cursor keys left & right to navigate through the sprite list
* performance enhancements

2017-10-17
* Simple sprite overlays
* Additional zoom levels for big screens
* fix for Firefox, should work now

2017-10-12
* Copy & Paste for sprites
* Symbols for Copy & Paste
* More UI context states

2017-10-10
* flood fill
* draw & fill modes can be switched
* performance optimization when working with huge sprite set
* export as ASM sourcecode

2017-10-07
* reworked toolbar/menu
* fullscreen option
* status bar

2017-10-05
* full import & export of SpritePad 1.8.1 and 2.0 formats
* preview window zoom

2017-10-04
* export sprites as SPD to SpritePad

2017-09-27
* import sprites from SpritePad SPD files

2017-09-23
* Zoom in/out in the sprite list window
* redo
* fixed an issue where the same file could not be reloaded
* more reliable behaviour of palette window

2017-09-20
* basic loading and saving is now working (finally!)
* lots of reworked UI
* lots of cleaned up code

2017-09-13
* proper C64 color restrictions are now implemented
* lots of cleanup, still one huge pile of crap left to do right

2017-09-07
* Zoom levels for editor, preview and list view can be set in the config
* Sprites in list view are sortable correctly when size is changing
* Info button has a new modal with version info and links
* sprite streching for preview window

2017-09-06
* Sorting in list view finally works

2017-09-04
* Undo implemented

