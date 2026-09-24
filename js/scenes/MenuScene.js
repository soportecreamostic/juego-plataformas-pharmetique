// ==========================================
// PORTADA DEL MUNDO PHARMETIQUE
// ==========================================

export default class MenuScene extends Phaser.Scene {

    constructor() {

        super("MenuScene");
    }

    preload() {

        this.load.image(
            "portadaPharmetique",
            "assets/images/portada-pharmetique.png"
        );
    }


    create() {

        const { width, height } = this.scale;

        // Detectamos una sugerencia inicial, pero el jugador puede
        // cambiarla antes de comenzar la aventura.
        this.deviceMode = this.sys.game.device.os.desktop ?
            "desktop" :
            "mobile";

        
        this.createBackground(width, height);
        this.createDeviceSelector(width);
        this.createStartButton(width);

        this.input.keyboard.once(
            "keydown-ENTER",
            this.startAdventure,
            this
        );
    }


    // ======================================
    // FORMAS Y NODOS DEL UNIVERSO VISUAL
    // ======================================

    createBackground(width, height) {

        this.cameras.main.setBackgroundColor("#E7F8FB");

        const background = this.add.image(
            width / 2,
            height / 2,
            "portadaPharmetique"
        );

        background.setDisplaySize(
            width,
            height
        );

        background.setDepth(-10);
    }


    // ======================================
    // IDENTIDAD DE LA PORTADA
    // ======================================

    createTitle(width) {

        this.add.text(
            width / 2,
            40,
            "PHARMETIQUE",
            {
                fontFamily: "Arial",
                fontSize: "43px",
                fontStyle: "bold",
                color: "#00557F",
                letterSpacing: 3
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            76,
            "LABS",
            {
                fontFamily: "Arial",
                fontSize: "17px",
                fontStyle: "bold",
                color: "#41C0F0",
                letterSpacing: 8
            }
        ).setOrigin(0.5);

        this.add.text(
            width / 2,
            108,
            "Más vida. Mejor vida.",
            {
                fontFamily: "Arial",
                fontSize: "20px",
                fontStyle: "italic",
                color: "#17364A"
            }
        ).setOrigin(0.5);
    }


    // ======================================
    // PRESENTACIÓN DEL MODO AVENTURA
    // ======================================

    createAdventureCard(width) {

        this.add.rectangle(
            width / 2,
            185,
            620,
            100,
            0xFFFFFF,
            0.92
        ).setStrokeStyle(3, 0x8DDEE9);

        this.add.rectangle(
            (width / 2) - 292,
            185,
            10,
            100,
            0x41C0F0
        );

        this.add.text(
            (width / 2) - 254,
            140,
            "MODO AVENTURA",
            {
                fontFamily: "Arial",
                fontSize: "21px",
                fontStyle: "bold",
                color: "#00557F"
            }
        );

        this.add.text(
            (width / 2) - 254,
            169,
            "Explora el mundo Pharmetique y descubre sus territorios de \nconocimiento mientras avanzas.",
            {
                fontFamily: "Arial",
                fontSize: "14px",
                color: "#17364A",
                lineSpacing: 7
            }
        );

        this.add.text(
            width / 2,
            220,
            "CIENCIA  ·  TECNOLOGÍA  ·  INNOVACIÓN  ·  VIDA",
            {
                fontFamily: "Arial",
                fontSize: "12px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);
    }


    // ======================================
    // ELECCIÓN DE DISPOSITIVO
    // ======================================

    createDeviceSelector(width) {

        this.add.text(
            width / 2,
            249,
            "ELIGE CÓMO VAS A JUGAR",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);

        this.deviceButtons = {};

        this.createDeviceButton(
            (width / 2) - 112,
            286,
            "COMPUTADOR",
            "desktop"
        );

        this.createDeviceButton(
            (width / 2) + 112,
            286,
            "MÓVIL",
            "mobile"
        );

        this.updateDeviceButtons();
    }


    createDeviceButton(x, y, label, mode) {

        const background = this.add.rectangle(
            0,
            0,
            202,
            44,
            0xFFFFFF
        ).setStrokeStyle(2, 0xb91d73);

        const text = this.add.text(
            0,
            0,
            label,
            {
                fontFamily: "Arial",
                fontSize: "14px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);

        const button = this.add.container(
            x,
            y,
            [background, text]
        ).setSize(202, 44).setInteractive({
            useHandCursor: true
        });

        button.on("pointerdown", () => {

            this.deviceMode = mode;
            this.updateDeviceButtons();
        });

        this.deviceButtons[mode] = {
            button,
            background,
            text
        };
    }


    updateDeviceButtons() {

        Object.entries(this.deviceButtons).forEach(([mode, button]) => {

            const selected = mode === this.deviceMode;

            button.background.setFillStyle(
                selected ? 0x00557F : 0xFFFFFF
            );

            button.text.setColor(
                selected ? "#FFFFFF" : "#00557F"
            );

            button.button.setScale(selected ? 1.03 : 1);
        });
    }


    // ======================================
    // BOTÓN PRINCIPAL INTERACTIVO
    // ======================================

    createStartButton(width) {

        const shadow = this.add.rectangle(
            4,
            5,
            286,
            60,
            0x003B58,
            0.18
        );

        const buttonBackground = this.add.rectangle(
            0,
            0,
            286,
            60,
            0x00557F
        ).setStrokeStyle(2, 0x8DDEE9);

        const label = this.add.text(
            0,
            0,
            "INICIAR AVENTURA",
            {
                fontFamily: "Arial",
                fontSize: "18px",
                fontStyle: "bold",
                color: "#FFFFFF",
                letterSpacing: 1
            }
        ).setOrigin(0.5);

        const button = this.add.container(
            width / 2,
            355,
            [shadow, buttonBackground, label]
        ).setSize(286, 60).setInteractive({
            useHandCursor: true
        });

        button.on("pointerover", () => {

            button.setScale(1.04);
            buttonBackground.setFillStyle(0x007DAE);
        });

        button.on("pointerout", () => {

            button.setScale(1);
            buttonBackground.setFillStyle(0x00557F);
        });

        button.on("pointerdown", () => {

            this.startAdventure();
        });

        this.tweens.add({
            targets: button,
            scale: 1.025,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        this.add.text(
            width / 2,
            418,
            "Haz clic o presiona ENTER para comenzar",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                color: "#17364A"
            }
        ).setOrigin(0.5);
    }


    startAdventure() {

        this.registry.set(
            "deviceMode",
            this.deviceMode
        );

        this.scene.start(
            "ControlsScene"
        );
    }
}
