// ==========================================
// PANTALLA DE CONTROLES
// PHARMETIQUE LABS
// ==========================================

export default class ControlsScene extends Phaser.Scene {

    constructor() {

        super("ControlsScene");
    }


    // ==========================================
    // CREATE
    // ==========================================

    create() {

        const { width, height } = this.scale;

        // Recuperar el modo seleccionado
        this.deviceMode =
            this.registry.get("deviceMode") || "desktop";

        this.createBackground(
            width,
            height
        );

        this.createHeader(
            width
        );

        // Mostrar controles según el dispositivo
        if (this.deviceMode === "mobile") {

            this.createMobileControls(
                width,
                height
            );

        }
        else {

            this.createDesktopControls(
                width,
                height
            );
        }

        this.createContinueButton(
            width,
            height
        );

        // ENTER también permite continuar
        this.input.keyboard.once(
            "keydown-ENTER",
            this.continueAdventure,
            this
        );
    }


    // ==========================================
    // FONDO
    // ==========================================

    createBackground(width, height) {

        this.cameras.main.setBackgroundColor(
            "#E7F8FB"
        );

        const shapes =
            this.add.graphics();

        shapes.fillStyle(
            0x8DDEE9,
            0.20
        );

        shapes.fillCircle(
            70,
            70,
            140
        );

        shapes.fillCircle(
            width - 50,
            height - 20,
            170
        );

        shapes.fillStyle(
            0x41C0F0,
            0.12
        );

        shapes.fillCircle(
            width - 100,
            80,
            100
        );

        shapes.fillCircle(
            100,
            height - 70,
            80
        );
    }


    // ==========================================
    // ENCABEZADO
    // ==========================================

    createHeader(width) {

        this.add.text(
            width / 2,
            48,
            "¿CÓMO SE JUEGA?",
            {
                fontFamily: "Arial",
                fontSize: "30px",
                fontStyle: "bold",
                color: "#00557F",
                letterSpacing: 2
            }
        ).setOrigin(0.5);


        const modeText =
            this.deviceMode === "mobile"
                ? "MODO MÓVIL"
                : "MODO COMPUTADOR";


        this.add.text(
            width / 2,
            88,
            modeText,
            {
                fontFamily: "Arial",
                fontSize: "15px",
                fontStyle: "bold",
                color: "#7A2C8F",
                letterSpacing: 2
            }
        ).setOrigin(0.5);


        this.add.text(
            width / 2,
            118,
            "Aprende los controles antes de comenzar la aventura",
            {
                fontFamily: "Arial",
                fontSize: "14px",
                color: "#17364A"
            }
        ).setOrigin(0.5);
    }


    // ==========================================
    // CONTROLES DE COMPUTADOR
    // ==========================================

    createDesktopControls(width, height) {

        // Panel

        this.add.rectangle(
            width / 2,
            245,
            620,
            190,
            0xFFFFFF,
            0.94
        ).setStrokeStyle(
            2,
            0x8DDEE9
        );


        // MOVER

        this.createKey(
            width / 2 - 150,
            210,
            "←"
        );

        this.createKey(
            width / 2 - 80,
            210,
            "→"
        );

        this.add.text(
            width / 2 - 115,
            260,
            "MOVER",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // SALTAR

        this.createKey(
            width / 2 + 40,
            210,
            "↑"
        );

        this.add.text(
            width / 2 + 40,
            260,
            "SALTAR",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // INTERACTUAR

        this.createKey(
            width / 2 + 145,
            210,
            "E",
            58
        );

        this.add.text(
            width / 2 + 145,
            260,
            "INTERACTUAR",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // Separador

        this.add.rectangle(
            width / 2,
            302,
            500,
            1,
            0x8DDEE9,
            0.5
        );


        this.add.text(
            width / 2,
            360,
            "Explora, interactúa y descubre todo lo que Pharmetique tiene preparado.",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                color: "#17364A"
            }
        ).setOrigin(0.5);
    }


    // ==========================================
    // TECLA DE COMPUTADOR
    // ==========================================

    createKey(
        x,
        y,
        label,
        size = 54
    ) {

        this.add.rectangle(
            x + 3,
            y + 4,
            size,
            size,
            0x003B58,
            0.16
        ).setOrigin(0.5);


        this.add.rectangle(
            x,
            y,
            size,
            size,
            0xFFFFFF
        ).setStrokeStyle(
            3,
            0x00557F
        );


        this.add.text(
            x,
            y,
            label,
            {
                fontFamily: "Arial",
                fontSize:
                    label === "E"
                        ? "22px"
                        : "28px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);
    }


    // ==========================================
    // CONTROLES MÓVILES
    // ==========================================

    createMobileControls(width, height) {

        // Panel

        this.add.rectangle(
            width / 2,
            245,
            620,
            190,
            0xFFFFFF,
            0.94
        ).setStrokeStyle(
            2,
            0x8DDEE9
        );


        // JOYSTICK

        const joystickX =
            width / 2 - 155;

        const joystickY =
            230;


        this.add.circle(
            joystickX,
            joystickY,
            50,
            0x00557F,
            0.15
        ).setStrokeStyle(
            3,
            0x00557F
        );


        this.add.circle(
            joystickX,
            joystickY,
            24,
            0x41C0F0,
            1
        ).setStrokeStyle(
            3,
            0xFFFFFF
        );


        this.add.text(
            joystickX,
            302,
            "MOVER",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // SALTO

        const jumpX =
            width / 2 + 10;


        this.add.circle(
            jumpX,
            joystickY,
            31,
            0x00557F
        ).setStrokeStyle(
            3,
            0xFFFFFF
        );


        this.add.text(
            jumpX,
            joystickY,
            "↑",
            {
                fontFamily: "Arial",
                fontSize: "30px",
                fontStyle: "bold",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);


        this.add.text(
            jumpX,
            302,
            "SALTAR",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // INTERACTUAR

        const interactX =
            width / 2 + 145;


        this.add.circle(
            interactX,
            joystickY,
            31,
            0x7A2C8F
        ).setStrokeStyle(
            3,
            0xFFFFFF
        );


        this.add.text(
            interactX,
            joystickY,
            "E",
            {
                fontFamily: "Arial",
                fontSize: "21px",
                fontStyle: "bold",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);


        this.add.text(
            interactX,
            302,
            "INTERACTUAR",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);


        // TEXTO

        this.add.text(
            width / 2,
            360,
            "Usa el joystick para moverte y los botones para interactuar.",
            {
                fontFamily: "Arial",
                fontSize: "13px",
                color: "#17364A"
            }
        ).setOrigin(0.5);
    }


    // ==========================================
    // BOTÓN CONTINUAR
    // ==========================================

    createContinueButton(
        width,
        height
    ) {

        // ======================================
        // SOMBRA
        // ======================================

        const shadow =
            this.add.rectangle(
                4,
                5,
                286,
                54,
                0x003B58,
                0.18
            );


        // ======================================
        // FONDO DEL BOTÓN
        // ======================================

        const background =
            this.add.rectangle(
                0,
                0,
                286,
                54,
                0x00557F
            ).setStrokeStyle(
                2,
                0x8DDEE9
            );


        // ======================================
        // TEXTO
        // ======================================

        const label =
            this.add.text(
                0,
                0,
                "CONTINUAR",
                {
                    fontFamily: "Arial",
                    fontSize: "17px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    letterSpacing: 2
                }
            ).setOrigin(0.5);


        // ======================================
        // CONTENEDOR
        // ======================================

        const button =
            this.add.container(
                width / 2,
                406,
                [
                    shadow,
                    background,
                    label
                ]
            );


        // ======================================
        // ÁREA INTERACTIVA
        // ======================================

        button.setSize(
            286,
            54
        );

        button.setInteractive({
            useHandCursor: true
        });


        // ======================================
        // HOVER
        // ======================================

        button.on(
            "pointerover",
            () => {

                background.setFillStyle(
                    0x007DAE
                );

                button.setScale(
                    1.04
                );
            }
        );


        // ======================================
        // SALIR
        // ======================================

        button.on(
            "pointerout",
            () => {

                background.setFillStyle(
                    0x00557F
                );

                button.setScale(
                    1
                );
            }
        );


        // ======================================
        // PRESIONAR
        // ======================================

        button.on(
            "pointerdown",
            () => {

                this.continueAdventure();
            }
        );
    }


    // ==========================================
    // CONTINUAR HACIA MUNDO 1
    // ==========================================

    continueAdventure() {

        this.scene.start(
            "AdventureScene"
        );
    }
}