<?php

// Display error messages
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Read in SEUCK's sprite data from an .a file
$filename = 'snt sprites   .a';
$handle = fopen($filename, 'rb');
$sprites = array();

// Convert SEUCK's sprite data into Spritemate's sprite data
fread($handle, 2); // Ignore the first 2 bytes in the file

// The file contains 127 sprites, 000 through to 126
for ($sprite = 0; $sprite < 127; $sprite++) {
	$spriteInput = fread($handle, 64); // Each sprite is 64 bytes long
	$pixels = array();

	$j = 0;

	// Each sprite contains 21 rows
	for ($row = 0; $row < 21; $row++) {
		$rowPixels = array();

		// Each row contains 12 pairs of bits
		for ($rowBlock = 0; $rowBlock < 3; $rowBlock++) {
			$byte = ord($spriteInput[$j]);
			$bitpairs = array();

			$bitpairs[] = ($byte & 0b11000000) >> 6;
			$bitpairs[] = ($byte & 0b00110000) >> 4;
			$bitpairs[] = ($byte & 0b00001100) >> 2;
			$bitpairs[] = $byte & 0b00000011;

			foreach ($bitpairs as $bitpair) {
				switch ($bitpair) {
				case 0:
					$rowPixels[] = 't';
						break;

				case 1:
					$rowPixels[] = 'm1';
						break;

				case 2:
					$rowPixels[] = 'i';
						break;

				case 3:
					$rowPixels[] = 'm2';
						break;
				}

				$rowPixels[] = 't'; // Spritemate seems to pad each pixel
			}

			$j++;
		}

		$pixels[] = $rowPixels;
	}

	// The 64th byte's last nibble contains the sprite's custom colour
	$colour = ord($spriteInput[63]) & 0b00001111;

	$sprites[] = array(
		'color' => $colour,
		'multicolor' => true,
		'double_x' => false,
		'double_y' => false,
		'overlay' => false,
		'pixels' => $pixels
	);
}

fclose($handle);

// Write Spritemate's sprite data to an .spm file
$output = array(
	'colors' => array(
		't' => 11,
		'm1' => 0,
		'm2' => 1
	),
	'sprites' => $sprites,
	'current_sprite' => 0,
	'pen' => 'i'
);

$filename = 'snt sprites   .spm';
file_put_contents($filename, json_encode($output));

?>
