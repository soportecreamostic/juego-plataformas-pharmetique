export default class Checkpoint {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.label =
            data.label || "ESTACIÓN DE RESGUARDO";

        this.isActivated = false;
        this.isRepairing = false;

        // ======================================
        // POSICIONAMIENTO SOBRE PLATAFORMA
        // ======================================

        this.platformBottomOffset = 24;

        this.alignToPlatform();

        this.createVisual();
        this.createTrigger();
        this.createPrompt();
    }

    alignToPlatform() {

        if (
            !this.scene.platforms ||
            this.scene.platforms.length === 0
        ) {
            return;
        }

        let nearestPlatform = null;
        let nearestDistance = Infinity;

        this.scene.platforms.forEach(
            (platform) => {

                const platformObject =
                    platform.getObject();

                const bounds =
                    platformObject.getBounds();

                let horizontalDistance = 0;

                // El checkpoint está dentro del ancho
                // de la plataforma
                if (
                    this.x >= bounds.left &&
                    this.x <= bounds.right
                ) {

                    horizontalDistance = 0;

                } else if (this.x < bounds.left) {

                    horizontalDistance =
                        bounds.left - this.x;

                } else {

                    horizontalDistance =
                        this.x - bounds.right;
                }

                if (
                    horizontalDistance <
                    nearestDistance
                ) {

                    nearestDistance =
                        horizontalDistance;

                    nearestPlatform =
                        bounds;
                }
            }
        );

        if (!nearestPlatform) {
            return;
        }

        // ======================================
        // AJUSTAR HORIZONTALMENTE
        // ======================================

        if (
            this.x < nearestPlatform.left ||
            this.x > nearestPlatform.right
        ) {

            this.x =
                nearestPlatform.centerX;
        }

        // ======================================
        // AJUSTAR VERTICALMENTE
        // ======================================

        this.y =
            nearestPlatform.top -
            this.platformBottomOffset;

        console.log(
            `🟢 Checkpoint ajustado a plataforma: ${this.x}, ${this.y}`
        );
    }

    createVisual() {

        // Aura de la máquina
        const glow = this.scene.add.circle(
            0,
            -18,
            42,
            0x41C0F0,
            0.08
        );

        // Base
        const base = this.scene.add.rectangle(
            0,
            18,
            70,
            12,
            0x00557F
        );

        // Cuerpo principal de la máquina
        const machine = this.scene.add.rectangle(
            0,
            -5,
            54,
            58,
            0xFFFFFF
        )
        .setStrokeStyle(
            3,
            0x00557F
        );

        // Panel superior
        const panel = this.scene.add.rectangle(
            0,
            -17,
            36,
            18,
            0xE8F7FB
        )
        .setStrokeStyle(
            2,
            0x41C0F0
        );

        // Núcleo
        const core = this.scene.add.circle(
            0,
            -17,
            6,
            0x41C0F0
        );

        // Indicadores
        const lightLeft = this.scene.add.circle(
            -14,
            2,
            3,
            0x7A2C8F
        );

        const lightRight = this.scene.add.circle(
            14,
            2,
            3,
            0x7A2C8F
        );

        // Brazo izquierdo
        const armLeft = this.scene.add.rectangle(
            -34,
            -2,
            12,
            5,
            0x00557F
        );

        // Brazo derecho
        const armRight = this.scene.add.rectangle(
            34,
            -2,
            12,
            5,
            0x00557F
        );

        this.visual = this.scene.add.container(
            this.x,
            this.y,
            [
                glow,
                base,
                machine,
                panel,
                core,
                lightLeft,
                lightRight,
                armLeft,
                armRight
            ]
        );

        this.glow = glow;
        this.core = core;

        this.visual.setDepth(4);

        // Pulso suave de la máquina
        this.scene.tweens.add({
            targets: this.glow,
            scale: 1.18,
            alpha: 0.03,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    createTrigger() {

        this.trigger = this.scene.add.zone(
            this.x,
            this.y - 10,
            75,
            85
        );

        this.scene.physics.add.existing(
            this.trigger,
            true
        );
    }

    createPrompt() {

        this.prompt = this.scene.add.text(
            this.x,
            this.y - 58,
            "E  REPARAR",
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

        if (!this.trigger || this.isRepairing) {
            return;
        }

        const playerNear =
            this.scene.physics.overlap(
                player,
                this.trigger
            );

        // Máquina ya reparada
        if (this.isActivated) {
            return;
        }

        // Mostrar u ocultar el mensaje
        this.prompt.setVisible(playerNear);

        if (
            playerNear &&
            interactPressed
        ) {

            this.activate(player);
        }
    }

    activate(player) {

        if (this.isActivated || this.isRepairing) {
            return;
        }

        this.isRepairing = true;

        this.prompt.setVisible(false);

        // El científico se detiene mientras trabaja
        player.setVelocityX(0);

        // Mensaje de reparación
        const repairText = this.scene.add.text(
            this.x,
            this.y - 72,
            "REPARANDO...",
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

        // Efecto de reparación del núcleo
        this.scene.tweens.add({
            targets: this.core,
            scale: 1.4,
            alpha: 0.4,
            duration: 200,
            yoyo: true,
            repeat: 4,
            ease: "Sine.easeInOut"
        });

        // Pequeña vibración de la máquina
        this.scene.tweens.add({
            targets: this.visual,
            x: this.x + 2,
            duration: 80,
            yoyo: true,
            repeat: 5,
            ease: "Sine.easeInOut"
        });

        // Finalizar reparación
        this.scene.time.delayedCall(
            1200,
            () => {

                this.isRepairing = false;
                this.isActivated = true;

                this.scene.setCheckpoint(
                    this.x,
                    this.y - 55
                );

                repairText.destroy();

                this.showActivationEffect();
            }
        );
    }

    showActivationEffect() {

        this.core.setFillStyle(
            0x41C0F0
        );

        this.scene.tweens.add({
            targets: this.core,
            scale: 1.5,
            alpha: 0.3,
            duration: 250,
            yoyo: true,
            repeat: 2
        });

        const message = this.scene.add.text(
            this.x,
            this.y - 72,
            "✓ RESGUARDO ACTIVADO",
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
            targets: message,
            y: this.y - 98,
            alpha: 0,
            duration: 1800,
            onComplete: () => {
                message.destroy();
            }
        });

        this.scene.tweens.add({
            targets: this.visual,
            scale: 1.08,
            duration: 250,
            yoyo: true
        });
    }

    getObject() {

        return this.trigger;
    }
}