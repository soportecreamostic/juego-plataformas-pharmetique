import Capsule from "./capsule.js";


export default class PowerBlock {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.rewardType =
            data.rewardType || "technology";

        this.duration =
            data.duration || 8000;

        this.isUsed = false;

        this.createVisual();
        this.createBody();
    }


    // ======================================
    // APARIENCIA DEL BLOQUE
    // ======================================

    createVisual() {

        let accentColor = 0x41C0F0;

        if (this.rewardType === "technology") {
            accentColor = 0x7A2C8F;
        }

        if (this.rewardType === "innovation") {
            accentColor = 0xC13B9B;
        }

        if (this.rewardType === "life") {
            accentColor = 0x36B7A5;
        }


        // Aura
        const glow =
            this.scene.add.rectangle(
                0,
                0,
                62,
                48,
                accentColor,
                0.08
            );

        // Bloque
        const block =
            this.scene.add.rectangle(
                0,
                0,
                54,
                40,
                0xFFFFFF
            )
            .setStrokeStyle(
                3,
                accentColor
            );

        // Centro
        const center =
            this.scene.add.rectangle(
                0,
                0,
                34,
                26,
                0xE7F8FB
            )
            .setStrokeStyle(
                2,
                accentColor
            );


        // Símbolo
        const symbol =
            this.scene.add.text(
                0,
                0,
                "?",
                {
                    fontFamily: "Arial",
                    fontSize: "20px",
                    fontStyle: "bold",
                    color:
                        this.getTextColor(
                            accentColor
                        )
                }
            )
            .setOrigin(0.5);


        this.visual =
            this.scene.add.container(
                this.x,
                this.y,
                [
                    glow,
                    block,
                    center,
                    symbol
                ]
            )
            .setDepth(3);


        this.glow = glow;
        this.block = block;
        this.center = center;
        this.symbol = symbol;
        this.accentColor = accentColor;


        // Pulso muy suave
        this.scene.tweens.add({

            targets: this.glow,

            scale: 1.08,

            alpha: 0.04,

            duration: 1000,

            yoyo: true,

            repeat: -1,

            ease: "Sine.easeInOut"
        });
    }


    getTextColor(color) {

        if (color === 0x41C0F0) {
            return "#00557F";
        }

        if (color === 0x7A2C8F) {
            return "#7A2C8F";
        }

        if (color === 0xC13B9B) {
            return "#C13B9B";
        }

        return "#248B7D";
    }


    // ======================================
    // CUERPO FÍSICO
    // ======================================

    createBody() {

        this.bodyObject =
            this.scene.add.rectangle(
                this.x,
                this.y,
                54,
                40,
                0xFFFFFF,
                0
            );


        this.scene.physics.add.existing(
            this.bodyObject,
            true
        );


        this.bodyObject.body.setSize(
            54,
            40
        );
    }


    // ======================================
    // GOLPEAR BLOQUE
    // ======================================

    hit(player) {

        if (this.isUsed) {
            return;
        }

        const playerBody = player.body;
        const blockBody = this.bodyObject.body;

        if (!playerBody || !blockBody) {
            return;
        }

        // El jugador debe estar debajo del bloque.
        const playerIsBelow =
            playerBody.center.y >
            blockBody.center.y;

        // El jugador debe estar horizontalmente
        // alineado con el bloque.
        const horizontalOverlap =
            playerBody.right >
            blockBody.left &&
            playerBody.left <
            blockBody.right;

        // La parte superior del jugador debe estar
        // tocando o muy cerca de la parte inferior
        // del bloque.
        const hittingFromBelow =
            playerBody.top <=
            blockBody.bottom + 10;

        if (
            playerIsBelow &&
            horizontalOverlap &&
            hittingFromBelow
        ) {

            this.activate();
        }
    }


    // ======================================
    // ACTIVACIÓN
    // ======================================

    activate() {

        if (this.isUsed) {
            return;
        }


        this.isUsed = true;


        // Cambiar símbolo
        this.symbol.setText("✓");


        // Cambio visual
        this.block.setFillStyle(
            0xF2F6F8
        );


        this.center.setFillStyle(
            0xFFFFFF
        );


        // Rebote del bloque
        this.scene.tweens.add({

            targets: this.visual,

            y: this.y - 10,

            duration: 90,

            yoyo: true,

            ease: "Quad.easeOut"
        });


        // Destello
        this.scene.tweens.add({

            targets: this.glow,

            scale: 1.35,

            alpha: 0.25,

            duration: 180,

            yoyo: true,

            repeat: 2,

            ease: "Sine.easeOut"
        });


        this.scene.tweens.add({

            targets: this.visual,

            scaleX: 1.12,

            scaleY: 0.88,

            duration: 90,

            yoyo: true,

            ease: "Quad.easeOut"
        });


        this.spawnReward();
    }


    // ======================================
    // APARECER CÁPSULA
    // ======================================

    spawnReward() {

        const capsule =
            new Capsule(
                this.scene,
                this.x,
                this.y - 45,
                {
                    type: this.rewardType,
                    duration: this.duration
                }
            );


        if (!this.scene.capsules) {
            this.scene.capsules = [];
        }


        this.scene.capsules.push(
            capsule
        );


        // Entrada de la cápsula
        capsule.visual.setScale(
            0.3
        );

        capsule.visual.setAlpha(
            0
        );


        capsule.trigger.setPosition(
            this.x,
            this.y
        );


        this.scene.tweens.add({

            targets: [
                capsule.visual,
                capsule.trigger
            ],

            y:
                this.y - 58,

            duration: 420,

            ease: "Back.easeOut"
        });


        this.scene.tweens.add({

            targets: capsule.visual,

            scale: 1,

            alpha: 1,

            duration: 300,

            ease: "Back.easeOut"
        });


        // Efecto de aparición
        const burst =
            this.scene.add.text(
                this.x,
                this.y - 18,
                "✨",
                {
                    fontFamily: "Arial",
                    fontSize: "24px"
                }
            )
            .setOrigin(0.5)
            .setDepth(10);


        this.scene.tweens.add({

            targets: burst,

            y: this.y - 80,

            alpha: 0,

            scale: 1.4,

            duration: 600,

            ease: "Cubic.easeOut",

            onComplete: () => {
                burst.destroy();
            }
        });
    }


    // ======================================
    // MÉTODO PARA COLLISIÓN
    // ======================================

    getObject() {

        return this.bodyObject;
    }
}