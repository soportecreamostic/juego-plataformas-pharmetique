// ==========================================
// ESTACIÓN INTERACTIVA DE APRENDIZAJE
// ==========================================

export default class KnowledgeStation {

    constructor(scene, x, y, data) {

        this.scene = scene;
        this.x = x;
        this.y = y;

        this.title = data.title;
        this.content = data.content;
        this.reward = data.reward;
        this.onKnowledgeEarned = data.onKnowledgeEarned;
        this.isMobile = this.scene.registry.get("deviceMode") === "mobile";

        this.isDiscovered = false;
        this.panelIsOpen = false;

        this.createWorldVisual();
        this.createTrigger();
        this.createPanel();
    }


    // ======================================
    // ESTACIÓN VISIBLE EN EL NIVEL
    // ======================================

    createWorldVisual() {

        const base = this.scene.add.rectangle(
            0,
            48,
            84,
            16,
            0x00557F
        );

        const cabinet = this.scene.add.rectangle(
            0,
            0,
            58,
            96,
            0xFFFFFF
        ).setStrokeStyle(3, 0x8DDEE9);

        const screen = this.scene.add.rectangle(
            0,
            -16,
            42,
            30,
            0x00557F
        );

        const scienceSymbol = this.scene.add.text(
            0,
            -16,
            "✦",
            {
                fontFamily: "Arial",
                fontSize: "22px",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);

        const stationName = this.scene.add.text(
            0,
            23,
            this.title,
            {
                fontFamily: "Arial",
                fontSize: "11px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);

        this.visual = this.scene.add.container(
            this.x,
            this.y
        ).add([
            base,
            cabinet,
            screen,
            scienceSymbol,
            stationName
        ]).setDepth(1);

        const promptBackground = this.scene.add.rectangle(
            0,
            0,
            112,
            28,
            0x00557F,
            0.95
        );

        this.promptText = this.scene.add.text(
            0,
            0,
            "E  CONOCER",
            {
                fontFamily: "Arial",
                fontSize: "12px",
                fontStyle: "bold",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);

            this.prompt = this.scene.add.container(
            this.x,
            this.y - 78,
        [   promptBackground, this.promptText]
            ).setDepth(3).setVisible(false);

        this.completedBadge = this.scene.add.text(
            this.x,
            this.y - 78,
            "APRENDIDO",
            {
                fontFamily: "Arial",
                fontSize: "11px",
                fontStyle: "bold",
                color: "#00557F",
                backgroundColor: "#FFFFFF",
                padding: {
                    x: 8,
                    y: 5
                }
            }
        ).setOrigin(0.5).setDepth(3).setVisible(false);
    }


    // ======================================
    // ZONA QUE DETECTA AL JUGADOR
    // ======================================

    createTrigger() {

        this.trigger = this.scene.add.zone(
            this.x,
            this.y + 8,
            96,
            112
        );

        this.scene.physics.add.existing(
            this.trigger,
            true
        );
    }


    // ======================================
    // PANEL EDUCATIVO EN PANTALLA
    // ======================================

    createPanel() {

        const overlay = this.scene.add.rectangle(
            0,
            0,
            800,
            450,
            0x003B58,
            0.72
        );

        const card = this.scene.add.rectangle(
            0,
            0,
            590,
            330,
            0xFFFFFF
        ).setStrokeStyle(4, 0x8DDEE9);

        const accent = this.scene.add.rectangle(
            -273,
            0,
            12,
            330,
            0x41C0F0
        );

        const heading = this.scene.add.text(
            -230,
            -124,
            "ESTACIÓN DE CONOCIMIENTO",
            {
                fontFamily: "Arial",
                fontSize: "14px",
                fontStyle: "bold",
                color: "#00557F"
            }
        );

        const title = this.scene.add.text(
            -230,
            -88,
            this.title,
            {
                fontFamily: "Arial",
                fontSize: "31px",
                fontStyle: "bold",
                color: "#00557F"
            }
        );

        const content = this.scene.add.text(
            -230,
            -26,
            this.content,
            {
                fontFamily: "Arial",
                fontSize: this.isMobile ? "14px" : "15px",
                color: "#17364A",
                lineSpacing: 5,
                wordWrap: {
                    width: 450
                }
            }
        );

        const rewardBackground = this.scene.add.rectangle(
            -125,
            94,
            210,
            34,
            0xE7F8FB
        ).setStrokeStyle(2, 0x41C0F0);

        const rewardText = this.scene.add.text(
            -125,
            94,
            `CONOCIMIENTO +${this.reward}`,
            {
                fontFamily: "Arial",
                fontSize: "14px",
                fontStyle: "bold",
                color: "#00557F"
            }
        ).setOrigin(0.5);

        const closeBackground = this.scene.add.rectangle(
            0,
            0,
            166,
            34,
            0x00557F
        ).setStrokeStyle(2, 0x8DDEE9);

        const closeHint = this.scene.add.text(
            0,
            0,
            this.isMobile ? "TOCA PARA CERRAR" : "E · CERRAR",
            {
                fontFamily: "Arial",
                fontSize: this.isMobile ? "11px" : "13px",
                fontStyle: "bold",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);

        this.closeButton = this.scene.add.container(
            194,
            116,
            [closeBackground, closeHint]
        ).setSize(166, 34).setInteractive({
            useHandCursor: true
        });

        this.closeButton.on("pointerdown", () => {

            if (this.panelIsOpen) {

                this.closePanel();
            }
        });

        this.panel = this.scene.add.container(
            400,
            225,
            [
                overlay,
                card,
                accent,
                heading,
                title,
                content,
                rewardBackground,
                rewardText,
                this.closeButton
            ]
        ).setDepth(100).setScrollFactor(
            0,
            0,
            true
        ).setVisible(false);
    }


    // ======================================
    // INTERACCIÓN EN CADA FRAME
    // ======================================

    update(player, interactPressed) {

    const playerIsNear = this.scene.physics.overlap(
        player,
        this.trigger
    );

    this.promptText.setText(
    this.isDiscovered ?
        "E  REVISAR" :
        "E  CONOCER"
    );

    this.prompt.setVisible(
        playerIsNear &&
        !this.panelIsOpen
    );

    if (!interactPressed) {
        return;
    }

    if (this.panelIsOpen) {
        this.closePanel();
        return;
    }

    if (playerIsNear) {
        this.openPanel();
    }
    }


    // ======================================
    // ABRIR Y CERRAR EL CONTENIDO
    // ======================================

    openPanel() {

    this.panelIsOpen = true;

    this.panel.setVisible(true);
    this.prompt.setVisible(false);

    if (!this.isDiscovered) {

        this.isDiscovered = true;

        this.completedBadge.setVisible(true);

        this.onKnowledgeEarned(this.reward);
    }
    }


    closePanel() {

        this.panelIsOpen = false;
        this.panel.setVisible(false);
    }


    isReading() {

        return this.panelIsOpen;
    }
}
