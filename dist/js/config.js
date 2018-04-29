"use strict";

function get_config() {

        var config = {
                version: 1.08,
                sprite_x: 24,
                sprite_y: 21,
                palettes: {
                        "colodore": ["#000000", "#ffffff", "#813338", "#75cec8", "#8e3c97", "#56ac4d", "#2e2c9b", "#edf171", "#8e5029", "#553800", "#c46c71", "#4a4a4a", "#7b7b7b", "#a9ff9f", "#706deb", "#b2b2b2"],
                        "pepto": ["#000000", "#ffffff", "#67372d", "#73a3b1", "#6e3e83", "#5b8d48", "#362976", "#b7c576", "#6c4f2a", "#423908", "#98675b", "#444444", "#6c6c6c", "#9dd28a", "#6d5fb0", "#959595"],
                        "custom": ["#000000", "#ffffff", "#813338", "#75cec8", "#8e3c97", "#56ac4d", "#2e2c9b", "#edf171", "#8e5029", "#553800", "#c46c71", "#4a4a4a", "#7b7b7b", "#a9ff9f", "#706deb", "#b2b2b2"] },
                selected_palette: "pepto",
                window_editor: {
                        "top": 25,
                        "left": 210,
                        "zoom": 18,
                        "grid": true
                },
                window_preview: {
                        "top": 25,
                        "left": 700,
                        "zoom": 5
                },
                window_list: {
                        "top": 220,
                        "left": 700,
                        "width": 440,
                        "height": 200,
                        "zoom": 4
                },
                window_palette: {
                        "top": 25,
                        "left": 110,
                        "zoom": 1
                },
                window_playfield: {
                        "top": 25,
                        "left": 890,
                        "width": 400,
                        "height": 400,
                        "canvas_x": 5,
                        "canvas_y": 5,
                        "zoom": 2
                }

        };

        return config;
}