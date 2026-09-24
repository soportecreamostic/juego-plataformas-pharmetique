export default class LabConsole {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.title =
            data.title || "CONSOLA CENTRAL";

        this.isActivated = false;
        this.isProcessing = false;

        this.createVisual();
        this.createTrigger();
        this.createPrompt();
    }

    createVisual() {

        // Aura de la consola
        const glow = this.scene.add.circle(
            0,
            -25,
            55,
            0x41C0F0,
            0.08
        );

        // Base inferior
        const base = this.scene.add.rectangle(
            0,
            28,
            100,
            14,
            0x00557F
        );

        // Columna central
        const column = this.scene.add.rectangle(
            0,
            0,
            62,
            78,
            0xFFFFFF
        )
        .setStrokeStyle(
            3,
            0x00557F
        );

        // Panel principal
        const panel = this.scene.add.rectangle(
            0,
            -14,
            44,
            28,
            0xE8F7FB
        )
        .setStrokeStyle(
            2,
            0x41C0F0
        );

        // Núcleo
        const core = this.scene.add.circle(
            0,
            -14,
            8,
            0x41C0F0
        );

        // Indicadores
        const indicator1 = this.scene.add.circle(
            -15,
            12,
            3,
            0x7A2C8F
        );

        const indicator2 = this.scene.add.circle(
            0,
            12,
            3,
            0x7A2C8F
        );

        const indicator3 = this.scene.add.circle(
            15,
            12,
            3,
            0x7A2C8F
        );

        // Pantalla
        const screen = this.scene.add.rectangle(
            0,
            -42,
            38,
            10,
            0x00557F
        );

        this.visual = this.scene.add.container(
            this.x,
            this.y,
            [
                glow,
                base,
                column,
                panel,
                core,
                indicator1,
                indicator2,
                indicator3,
                screen
            ]
        );

        this.glow = glow;
        this.core = core;

        this.visual.setDepth(4);

        // Pulso tecnológico
        this.scene.tweens.add({
            targets: this.glow,
            scale: 1.2,
            alpha: 0.03,
            duration: 1100,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    createTrigger() {

        this.trigger = this.scene.add.zone(
            this.x,
            this.y - 10,
            95,
            100
        );

        this.scene.physics.add.existing(
            this.trigger,
            true
        );
    }

    createPrompt() {

        this.prompt = this.scene.add.text(
            this.x,
            this.y - 78,
            "E  ACTIVAR",
            {
                fontFamily: "Arial",
                fontSize: "15px",
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

            this.activate(player);
        }
    }

    activate(player) {

        if (
            this.isActivated ||
            this.isProcessing
        ) {
            return;
        }

        this.isProcessing = true;

        this.prompt.setVisible(false);

        player.setVelocityX(0);

        const processingText =
            this.scene.add.text(
                this.x,
                this.y - 82,
                "PROCESANDO...",
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
                .setDepth(20);

        this.scene.tweens.add({
            targets: this.core,
            scale: 1.6,
            alpha: 0.3,
            duration: 180,
            yoyo: true,
            repeat: 5,
            ease: "Sine.easeInOut"
        });

        this.scene.tweens.add({
            targets: this.visual,
            scale: 1.05,
            duration: 250,
            yoyo: true,
            repeat: 2
        });

        this.scene.time.delayedCall(
            1600,
            () => {

                processingText.destroy();

                this.showCompletion();
            }
        );
    }

    showCompletion() {

        this.core.setFillStyle(
            0x41C0F0
        );

        const overlay =
            this.scene.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                0.78
            );

        overlay
            .setScrollFactor(0)
            .setDepth(100);

        const title =
            this.scene.add.text(
                400,
                170,
                "LABORATORIO COMPLETADO",
                {
                    fontFamily: "Arial",
                    fontSize: "30px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            );

        title
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        const subtitle =
            this.scene.add.text(
                400,
                220,
                "La investigación puede continuar.",
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    color: "#FFFFFF"
                }
            );

        subtitle
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        const progress =
            this.scene.add.text(
                400,
                270,
                "CIENCIA  •  TECNOLOGÍA  •  INNOVACIÓN",
                {
                    fontFamily: "Arial",
                    fontSize: "14px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            );

        progress
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        this.scene.time.delayedCall(
            2500,
            () => {

                overlay.destroy();
                title.destroy();
                subtitle.destroy();
                progress.destroy();

                this.isProcessing = false;
                this.isActivated = true;
            }
        );
    }

    getObject() {

        return this.trigger;
    }
}