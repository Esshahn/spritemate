# Spritemate
Spritemate is a new sprite editor for the Commodore 64. It works with most modern browsers on Windows, Mac and Linux and is pure JavaScript and HTML - no plugins. All data is processed on client side only. Spritemate supports importing and exporting of the most common file formats for the Commodore 64 (e.g. SpritePad) and can be used as viewer and editor on almost any device with a browser.


Latest stable version: http://spritemate.com/

Beta version: http://beta.spritemate.com/

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

## How to run

You can use `yarn` to run this project locally

```
$ cd spritemate
$ yarn
$ yarn start

```

Or use `npm`

```
$ cd spritemate
$ npm install
$ npm start

```

## History

Check out the "about" menu option in Spritemate to get a release changelog.

