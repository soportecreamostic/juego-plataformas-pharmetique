// ==========================================
// TERMINAL TECNOLÓGICO
// ==========================================

export default class TechSwitch {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.label =
            data.label || "ACTIVAR";

        this.onActivate =
            data.onActivate || (() => {});

        this.isActivated =
            false;

        this.createVisual();

        this.createTrigger();

        this.createPrompt();
    }


    // ==========================================
    // APARIENCIA
    // ==========================================

    createVisual() {

        const base =
            this.scene.add.rectangle(
                0,
                0,
                92,
                58,
                0xFFFFFF
            )
            .setStrokeStyle(
                3,
                0x41C0F0
            );


        const screen =
            this.scene.add.rectangle(
                0,
                -8,
                58,
                22,
                0xE7F8FB
            )
            .setStrokeStyle(
                2,
                0x00557F
            );


        const screenLight =
            this.scene.add.circle(
                0,
                -8,
                6,
                0x41C0F0
            );


        const mainButton =
            this.scene.add.circle(
                0,
                20,
                11,
                0x00557F
            )
            .setStrokeStyle(
                3,
                0x41C0F0
            );


        const sideLightLeft =
            this.scene.add.circle(
                -27,
                20,
                4,
                0x41C0F0
            );


        const sideLightRight =
            this.scene.add.circle(
                27,
                20,
                4,
                0x41C0F0
            );


        this.visual =
            this.scene.add.container(
                this.x,
                this.y,
                [
                    base,
                    screen,
                    screenLight,
                    mainButton,
                    sideLightLeft,
                    sideLightRight
                ]
            )
            .setDepth(5);


        this.mainButton =
            mainButton;

        this.screenLight =
            screenLight;

        this.sideLightLeft =
            sideLightLeft;

        this.sideLightRight =
            sideLightRight;


        // Pulso suave del botón
        this.scene.tweens.add({

            targets: mainButton,

            scale: 1.08,

            duration: 800,

            yoyo: true,

            repeat: -1,

            ease: "Sine.easeInOut"
        });
    }


    // ==========================================
    // ZONA DE INTERACCIÓN
    // ==========================================

    createTrigger() {

        this.trigger =
            this.scene.add.zone(
                this.x,
                this.y,
                110,
                90
            );


        this.scene.physics.add.existing(
            this.trigger,
            true
        );
    }


    // ==========================================
    // PROMPT
    // ==========================================

    createPrompt() {

        this.prompt =
            this.scene.add.text(
                this.x,
                this.y - 58,
                `E  ${this.label}`,
                {
                    fontFamily: "Arial",
                    fontSize: "14px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    backgroundColor: "#00557F",
                    padding: {
                        x: 10,
                        y: 7
                    }
                }
            )
            .setOrigin(0.5)
            .setDepth(15)
            .setVisible(false);
    }


    // ==========================================
    // UPDATE
    // ==========================================

    update(player, interactPressed) {

        if (
            !this.trigger ||
            this.isActivated
        ) {
            return;
        }


        const playerNear =
            this.scene.physics.overlap(
                player,
                this.trigger
            );


        this.prompt.setVisible(
            playerNear
        );


        if (
            playerNear &&
            interactPressed
        ) {

            this.activate(
                player
            );
        }
    }


    // ==========================================
    // ACTIVAR
    // ==========================================

    activate(player) {

        if (
            this.isActivated
        ) {
            return;
        }


        this.isActivated =
            true;


        this.prompt.setVisible(
            false
        );


        player.setVelocityX(
            0
        );


        // Estado activado
        this.mainButton.setFillStyle(
            0x7A2C8F
        );


        this.screenLight.setFillStyle(
            0x7A2C8F
        );


        this.sideLightLeft.setFillStyle(
            0x7A2C8F
        );


        this.sideLightRight.setFillStyle(
            0x7A2C8F
        );


        // Animación de activación
        this.scene.tweens.add({

            targets: this.mainButton,

            scale: 1.35,

            duration: 180,

            yoyo: true,

            repeat: 2,

            ease: "Sine.easeOut"
        });


        this.scene.tweens.add({

            targets: this.visual,

            scale: 1.08,

            duration: 250,

            yoyo: true,

            repeat: 1,

            ease: "Cubic.easeOut"
        });


        // Ejecutar acción
        this.scene.time.delayedCall(
            350,
            () => {

                this.onActivate();
            }
        );
    }
}