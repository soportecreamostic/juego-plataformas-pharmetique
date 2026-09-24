import MenuScene from "./scenes/MenuScene.js";
import AdventureScene from "./scenes/AdventureScene.js";
import TechnologyScene from "./scenes/TechnologyScene.js";

// ==========================================
// CONFIGURACIÓN GLOBAL DEL JUEGO
// ==========================================

const config = {

    type: Phaser.AUTO,

    width: 800,
    height: 450,

    backgroundColor: "#E7F8FB",

    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 800
            },

            debug: false
        }
    },

    scale: {

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [

        MenuScene,
        AdventureScene,
        TechnologyScene
    ]
};


// ==========================================
// CREAR EL JUEGO
// ==========================================

new Phaser.Game(config);