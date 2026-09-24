import Player from "../classes/player.js";
import Platform from "../classes/Platform.js";
import KnowledgeStation from "../classes/KnowledgeStation.js";
import TouchControls from "../classes/TouchControls.js";
import Capsule from "../classes/capsule.js";
import Enemy from "../classes/Enemy.js";
import Checkpoint from "../classes/Checkpoint.js";
import TechSwitch from "../classes/TechSwitch.js";
import TechDoor from "../classes/TechDoor.js";
import PowerBlock from "../classes/PowerBlock.js";

export default class TechnologyScene extends Phaser.Scene {

    constructor() {
        super("TechnologyScene");
    }

    preload() {
        if (this.textures.exists("player")) {
            return;
        }

        this.load.spritesheet(
            "player",
            "assets/sprites/player-pharmetique.png",
            {
                frameWidth: 64,
                frameHeight: 64
            }
        );
    }

    create() {

        this.deviceMode =
            this.registry.get("deviceMode") || "desktop";

        this.isMobile =
            this.deviceMode === "mobile";

        this.worldWidth = 3400;
        this.worldHeight = 450;

        this.isGameOver = false;
        this.checkpointPosition = null;
        this.systemOnline = false;

        this.finalQuizOpen = false;
        this.finalSequenceStarted = false;
        this.finalQuizButtons = [];

        this.world3Ready = false;
        this.world3AccessShown = false;

        this.physics.world.setBounds(
            0,
            0,
            this.worldWidth,
            this.worldHeight
        );

        this.createBackground();
        this.createPlatforms();
        this.createPlayer();

        this.createHud();
        this.createKnowledgeStations();
        this.createCapsules();
        this.createPowerBlocks();
        this.createPowerBlockSensors();

        this.createEnemies();
        this.createCheckpoints();

        this.createTechnologyPuzzle();
        this.createTechnologyCore();
        this.createWorld3Trigger();

        this.createCamera();
        this.createCollisions();
        this.createControls();

        this.showWorldIntro();
    }

    // ==========================================
    // FONDO
    // ==========================================

    createBackground() {

        this.cameras.main.setBackgroundColor(
            "#E7F8FB"
        );

        const background =
            this.add.graphics();

        background.fillStyle(
            0xE7F8FB,
            1
        );

        background.fillRect(
            0,
            0,
            this.worldWidth,
            this.worldHeight
        );

        background.fillStyle(
            0x7A2C8F,
            0.05
        );

        [
            [420, 100, 180],
            [1380, 95, 210],
            [2350, 90, 210],
            [3180, 110, 180]
        ].forEach(([x, y, radius]) => {
            background.fillCircle(
                x,
                y,
                radius
            );
        });

        background.fillStyle(
            0x41C0F0,
            0.07
        );

        [
            [760, 340, 210],
            [1800, 330, 190],
            [2700, 330, 220]
        ].forEach(([x, y, radius]) => {
            background.fillCircle(
                x,
                y,
                radius
            );
        });

        for (
            let x = 100;
            x < this.worldWidth;
            x += 340
        ) {

            const panel =
                this.add.rectangle(
                    x,
                    210,
                    220,
                    135,
                    0xFFFFFF,
                    0.28
                );

            panel.setStrokeStyle(
                2,
                0x8DDEE9,
                0.35
            );
        }

        background.lineStyle(
            2,
            0x41C0F0,
            0.22
        );

        for (
            let x = 40;
            x < this.worldWidth;
            x += 280
        ) {

            background.lineBetween(
                x,
                70,
                x + 90,
                120
            );

            background.lineBetween(
                x + 90,
                120,
                x + 180,
                72
            );

            background.fillStyle(
                0x41C0F0,
                0.28
            );

            background.fillCircle(
                x,
                70,
                5
            );

            background.fillCircle(
                x + 90,
                120,
                7
            );

            background.fillCircle(
                x + 180,
                72,
                5
            );
        }

        for (
            let x = 100;
            x < this.worldWidth;
            x += 520
        ) {

            this.add.rectangle(
                x,
                150,
                250,
                5,
                0x00557F,
                0.12
            );

            this.add.circle(
                x + 125,
                150,
                6,
                0x7A2C8F,
                0.30
            );
        }

        background.lineStyle(
            2,
            0x41C0F0,
            0.12
        );

        background.lineBetween(
            0,
            414,
            this.worldWidth,
            414
        );

        background.setDepth(-2);
    }

    // ==========================================
    // PLATAFORMAS
    // ==========================================

    createPlatforms() {

        this.platforms = [

            // Inicio
            new Platform(
                this,
                300,
                430,
                600,
                40
            ),

            // Ascenso para alcanzar el primer bloque
            new Platform(
                this,
                690,
                355,
                180,
                20
            ),

            // Plataforma amplia debajo del PowerBlock
            new Platform(
                this,
                1010,
                353,
                180,
                20
            ),

            // Escalera superior
            new Platform(
                this,
                1150,
                260,
                140,
                20
            ),

            new Platform(
                this,
                1480,
                320,
                220,
                20
            ),

            // Plataforma de salida del puente móvil
            new Platform(
                this,
                1800,
                320,
                240,
                20
            ),

            // Área tecnológica
            new Platform(
                this,
                2000,
                265,
                160,
                20
            ),

            new Platform(
                this,
                2150,
                320,
                220,
                20
            ),

            new Platform(
                this,
                2320,
                260,
                150,
                20
            ),

            new Platform(
                this,
                2460,
                205,
                140,
                20
            ),

            new Platform(
                this,
                2610,
                270,
                160,
                20
            ),

            // Llegada al tramo final
            new Platform(
                this,
                2770,
                330,
                180,
                20
            ),

            // Gran plataforma final
            new Platform(
                this,
                3080,
                395,
                640,
                40
            )
        ];
    }

    // ==========================================
    // JUGADOR
    // ==========================================

    createPlayer() {

        this.player =
            new Player(
                this,
                120,
                350
            );

        this.player.setDepth(
            10
        );

        this.player.setCollideWorldBounds(
            true
        );

        this.startPosition = {
            x: this.player.x,
            y: this.player.y
        };
    }

    // ==========================================
    // HUD
    // ==========================================

    createHud() {

        this.titleText =
            this.add.text(
                20,
                20,
                "MUNDO 2 · TECNOLOGÍA",
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    fontStyle: "bold",
                    color: "#00557F"
                }
            )
            .setScrollFactor(0)
            .setDepth(50);

        this.objectiveText =
            this.add.text(
                20,
                48,
                "Domina la tecnología y activa el sistema.",
                {
                    fontFamily: "Arial",
                    fontSize: "13px",
                    color: "#17364A"
                }
            )
            .setScrollFactor(0)
            .setDepth(50);

        this.knowledgeText =
            this.add.text(
                20,
                75,
                "CONOCIMIENTO 0",
                {
                    fontFamily: "Arial",
                    fontSize: "13px",
                    fontStyle: "bold",
                    color: "#00557F",
                    backgroundColor: "#FFFFFF",
                    padding: {
                        x: 8,
                        y: 5
                    }
                }
            )
            .setScrollFactor(0)
            .setDepth(50);

        this.healthText =
            this.add.text(
                560,
                20,
                "❤️ ❤️ ❤️",
                {
                    fontFamily: "Arial",
                    fontSize: "24px",
                    fontStyle: "bold"
                }
            )
            .setScrollFactor(0)
            .setDepth(50);

        const returnBackground =
            this.add.rectangle(
                0,
                0,
                118,
                30,
                0xFFFFFF,
                0.94
            )
            .setStrokeStyle(
                2,
                0x8DDEE9
            );

        const returnText =
            this.add.text(
                0,
                0,
                this.isMobile
                    ? "PORTADA"
                    : "ESC · PORTADA",
                {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontStyle: "bold",
                    color: "#00557F"
                }
            )
            .setOrigin(0.5);

        this.returnButton =
            this.add.container(
                738,
                27,
                [
                    returnBackground,
                    returnText
                ]
            )
            .setSize(
                118,
                30
            )
            .setScrollFactor(0)
            .setDepth(50)
            .setInteractive({
                useHandCursor: true
            });

        this.returnButton.on(
            "pointerdown",
            () => {
                this.returnToMenu();
            }
        );
    }

    updateHealthHud() {

        let hearts = "";

        for (
            let i = 0;
            i < this.player.maxHealth;
            i++
        ) {

            hearts +=
                i < this.player.health
                    ? "❤️ "
                    : "🖤 ";
        }

        this.healthText.setText(
            hearts.trim()
        );
    }

    updateKnowledgeHud() {

        this.knowledgeText.setText(
            `CONOCIMIENTO ${this.knowledge}`
        );
    }

    // ==========================================
    // ESTACIONES
    // ==========================================

    createKnowledgeStations() {

        this.knowledge = 0;

        this.knowledgeStations = [

            new KnowledgeStation(
                this,
                690,
                300,
                {
                    title: "TECNOLOGÍA",
                    content:
                        "La tecnología conecta la ciencia con soluciones que permiten investigar, desarrollar y transformar conocimiento en nuevas posibilidades para la vida.",
                    reward: 1,

                    onKnowledgeEarned:
                        (amount) => {

                            this.knowledge +=
                                amount;

                            this.updateKnowledgeHud();
                        }
                }
            ),

            new KnowledgeStation(
                this,
                1795,
                265,
                {
                    title: "TECNOLOGÍA Y VIDA",
                    content:
                        "La tecnología forma parte del territorio de Pharmetique y acompaña el trabajo científico, la innovación y la búsqueda de una mejor calidad de vida.",
                    reward: 1,

                    onKnowledgeEarned:
                        (amount) => {

                            this.knowledge +=
                                amount;

                            this.updateKnowledgeHud();
                        }
                }
            )
        ];
    }

    // ==========================================
    // CÁPSULAS
    // ==========================================

    createCapsules() {
        this.capsules = [];
    }

    activateCapsulePower(
        type,
        duration
    ) {

        if (
            type === "technology"
        ) {

            this.player.activateSpeedBoost(
                duration
            );
        }
    }

    showPowerMessage(
        title,
        duration
    ) {

        const message =
            this.add.text(
                400,
                115,
                title,
                {
                    fontFamily: "Arial",
                    fontSize: "24px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    backgroundColor: "#00557F",
                    padding: {
                        x: 18,
                        y: 12
                    }
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(60);

        this.tweens.add({
            targets: message,
            alpha: 0,
            y: 80,
            delay: 1800,
            duration: 700,
            onComplete: () => {
                message.destroy();
            }
        });
    }

    // ==========================================
    // POWERBLOCK
    // ==========================================

    createPowerBlocks() {

        this.powerBlocks = [

            new PowerBlock(
                this,
                1150,
                155,
                {
                    rewardType: "technology",
                    duration: 10000
                }
            )
        ];
    }

    createPowerBlockSensors() {

        this.powerBlockSensors = [];

        this.powerBlocks.forEach(
            (powerBlock) => {

                const body =
                    powerBlock.getObject()?.body;

                if (!body) {
                    return;
                }

                const sensor =
                    this.add.zone(
                        body.center.x,
                        body.bottom + 20,
                        body.width + 24,
                        34
                    );

                this.physics.add.existing(
                    sensor,
                    true
                );

                this.powerBlockSensors.push({
                    block: powerBlock,
                    sensor: sensor
                });
            }
        );
    }

    updatePowerBlockSensors() {

        if (
            !this.player ||
            !this.player.body ||
            !this.powerBlockSensors
        ) {
            return;
        }

        this.powerBlockSensors.forEach(
            (data) => {

                const block =
                    data.block;

                if (
                    !block ||
                    block.isUsed ||
                    !data.sensor
                ) {
                    return;
                }

                const playerIsRising =
                    this.player.body.velocity.y < -20;

                const touchingSensor =
                    this.physics.overlap(
                        this.player,
                        data.sensor
                    );

                if (
                    playerIsRising &&
                    touchingSensor
                ) {

                    // El bloque permanece sólido.
                    // El sensor detecta el ascenso antes
                    // de que el cuerpo quede detenido.
                    if (
                        typeof block.activate ===
                        "function"
                    ) {

                        block.activate();

                    } else if (
                        typeof block.hit ===
                        "function"
                    ) {

                        block.hit(
                            this.player
                        );
                    }

                    data.sensor.destroy();
                    data.sensor = null;
                }
            }
        );
    }

    // ==========================================
    // ENEMIGOS
    // ==========================================

    createEnemies() {

        this.enemies = [

            new Enemy(
                this,
                1580,
                265,
                {
                    speed: 55,
                    damage: 1,
                    patrolDistance: 70
                }
            ),

            new Enemy(
                this,
                2450,
                185,
                {
                    speed: 65,
                    damage: 1,
                    patrolDistance: 65
                }
            )
        ];
    }

    // ==========================================
    // CHECKPOINTS
    // ==========================================

    createCheckpoints() {

        this.checkpoints = [

            new Checkpoint(
                this,
                1320,
                285,
                {
                    label:
                        "ESTACIÓN DE RESGUARDO 01"
                }
            ),

            new Checkpoint(
                this,
                2790,
                295,
                {
                    label:
                        "ESTACIÓN DE RESGUARDO 02"
                }
            )
        ];
    }

    setCheckpoint(
        x,
        y
    ) {

        this.checkpointPosition = {
            x: x,
            y: y
        };
    }

    // ==========================================
    // PUZZLE TECNOLÓGICO
    // ==========================================

    createTechnologyPuzzle() {

        this.systemOnline =
            false;

        this.techSwitch =
            new TechSwitch(
                this,
                2180,
                265,
                {
                    label:
                        "ACTIVAR SISTEMA",

                    onActivate:
                        () => {

                            this.systemOnline =
                                true;

                            this.objectiveText.setText(
                                "Sistema en línea. Alcanza el núcleo tecnológico."
                            );
                        }
                }
            );

        // La puerta queda al final del recorrido,
        // después de la máquina central.
        this.techDoor =
            new TechDoor(
                this,
                3260,
                285,
                {
                    width: 180,
                    height: 220
                }
            );

        if (
            this.techDoor.visual
        ) {

            this.techDoor.visual.setDepth(
                1
            );
        }
    }

    // ==========================================
    // NÚCLEO TECNOLÓGICO
    // ==========================================

    createTechnologyCore() {

        this.coreX = 2980;
        this.coreY = 310;

        const glow =
            this.add.circle(
                0,
                0,
                65,
                0x7A2C8F,
                0.09
            );

        const base =
            this.add.rectangle(
                0,
                32,
                110,
                16,
                0x00557F
            );

        const machine =
            this.add.rectangle(
                0,
                0,
                70,
                92,
                0xFFFFFF
            )
            .setStrokeStyle(
                3,
                0x7A2C8F
            );

        const screen =
            this.add.rectangle(
                0,
                -24,
                46,
                28,
                0xE7F8FB
            )
            .setStrokeStyle(
                2,
                0x7A2C8F
            );

        const core =
            this.add.circle(
                0,
                -24,
                9,
                0x7A2C8F
            );

        const light1 =
            this.add.circle(
                -18,
                18,
                4,
                0x7A2C8F
            );

        const light2 =
            this.add.circle(
                0,
                18,
                4,
                0x7A2C8F
            );

        const light3 =
            this.add.circle(
                18,
                18,
                4,
                0x7A2C8F
            );

        this.technologyCoreVisual =
            this.add.container(
                this.coreX,
                this.coreY,
                [
                    glow,
                    base,
                    machine,
                    screen,
                    core,
                    light1,
                    light2,
                    light3
                ]
            )
            .setDepth(6);

        this.technologyCore =
            this.add.zone(
                this.coreX,
                this.coreY,
                100,
                105
            );

        this.physics.add.existing(
            this.technologyCore,
            true
        );

        this.corePrompt =
            this.add.text(
                this.coreX,
                this.coreY - 72,
                "E  VERIFICAR SISTEMA",
                {
                    fontFamily: "Arial",
                    fontSize: "13px",
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

        this.coreActivated =
            false;

        this.tweens.add({
            targets: glow,
            scale: 1.22,
            alpha: 0.03,
            duration: 950,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    createWorld3Trigger() {

        this.world3Trigger =
            this.add.zone(
                3260,
                285,
                150,
                190
            );

        this.physics.add.existing(
            this.world3Trigger,
            true
        );
    }

    updateTechnologyCore(
        interactPressed
    ) {

        if (
            this.coreActivated ||
            this.finalQuizOpen
        ) {
            return;
        }

        if (
            !this.systemOnline
        ) {

            this.corePrompt.setVisible(
                false
            );

            return;
        }

        const playerNear =
            this.physics.overlap(
                this.player,
                this.technologyCore
            );

        this.corePrompt.setVisible(
            playerNear
        );

        if (
            playerNear &&
            interactPressed
        ) {

            this.activateTechnologyCore();
        }
    }

    activateTechnologyCore() {

        if (
            this.finalQuizOpen ||
            this.finalSequenceStarted
        ) {
            return;
        }

        this.coreActivated =
            true;

        this.corePrompt.setVisible(
            false
        );

        this.player.setVelocity(
            0,
            0
        );

        if (this.player.body) {
            this.player.body.enable =
                false;
        }

        this.showFinalQuiz();
    }

    // ==========================================
    // PREGUNTA FINAL
    // ==========================================

    showFinalQuiz() {

        this.finalQuizOpen =
            true;

        this.finalQuizButtons = [];

        this.world3Ready = false;
        this.world3AccessShown = false;

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                0.97
            )
            .setScrollFactor(0)
            .setDepth(120);

        const title =
            this.add.text(
                400,
                76,
                "VERIFICACIÓN DE CONOCIMIENTO",
                {
                    fontFamily: "Arial",
                    fontSize: "23px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(121);

        const question =
            this.add.text(
                400,
                125,
                "¿Cómo se relaciona la tecnología con la ciencia\nsegún lo aprendido en este mundo?",
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    align: "center"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(121);

        const options = [

            {
                text:
                    "A · Conecta la ciencia con soluciones que\ntransforman conocimiento en posibilidades para la vida.",
                correct:
                    true
            },

            {
                text:
                    "B · Reemplaza completamente el trabajo científico.",
                correct:
                    false
            },

            {
                text:
                    "C · Solo sirve para aumentar la velocidad del jugador.",
                correct:
                    false
            },

            {
                text:
                    "D · Se utiliza únicamente en las máquinas del laboratorio.",
                correct:
                    false
            }
        ];

        options.forEach(
            (option, index) => {

                const button =
                    this.add.text(
                        400,
                        205 + index * 52,
                        option.text,
                        {
                            fontFamily: "Arial",
                            fontSize: "12.5px",
                            fontStyle: "bold",
                            color: "#00557F",
                            backgroundColor: "#FFFFFF",
                            padding: {
                                x: 14,
                                y: 9
                            },
                            align: "center"
                        }
                    )
                    .setOrigin(0.5)
                    .setScrollFactor(0)
                    .setDepth(121)
                    .setInteractive({
                        useHandCursor: true
                    });

                button.on(
                    "pointerover",
                    () => {
                        button.setScale(
                            1.03
                        );
                    }
                );

                button.on(
                    "pointerout",
                    () => {
                        button.setScale(
                            1
                        );
                    }
                );

                button.on(
                    "pointerdown",
                    () => {

                        this.resolveFinalQuiz(
                            option.correct,
                            overlay,
                            title,
                            question
                        );
                    }
                );

                this.finalQuizButtons.push(
                    button
                );
            }
        );
    }

    resolveFinalQuiz(
        correct,
        overlay,
        title,
        question
    ) {

        if (
            !this.finalQuizOpen
        ) {
            return;
        }

        if (
            correct
        ) {

            this.finalQuizOpen =
                false;

            this.finalQuizButtons.forEach(
                (button) => {
                    button.disableInteractive();
                }
            );

            const success =
                this.add.text(
                    400,
                    390,
                    "✓ RESPUESTA CORRECTA · SISTEMA DESBLOQUEADO",
                    {
                        fontFamily: "Arial",
                        fontSize: "14px",
                        fontStyle: "bold",
                        color: "#FFFFFF",
                        backgroundColor: "#7A2C8F",
                        padding: {
                            x: 14,
                            y: 9
                        }
                    }
                )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(125);

            this.time.delayedCall(
                900,
                () => {

                    overlay.destroy();
                    title.destroy();
                    question.destroy();

                    this.finalQuizButtons.forEach(
                        (button) => {
                            button.destroy();
                        }
                    );

                    success.destroy();

                    if (
                        this.player.body
                    ) {
                        this.player.body.enable =
                            true;
                    }

                    this.techDoor.open();

                    if (this.techDoor.getObject()?.body) {
                        this.techDoor.getObject().body.enable = false;
                    }

                    this.finalSequenceStarted = true;

                    this.world3Ready = true;
                }
            );

        } else {

            this.showQuizFailure();
        }
    }

    showQuizFailure() {

        if (
            !this.finalQuizOpen
        ) {
            return;
        }

        this.finalQuizOpen =
            false;

        this.finalQuizButtons.forEach(
            (button) => {
                button.disableInteractive();
            }
        );

        const failure =
            this.add.text(
                400,
                390,
                "✕ RESPUESTA INCORRECTA · REINICIANDO EL MUNDO",
                {
                    fontFamily: "Arial",
                    fontSize: "14px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    backgroundColor: "#7A2C8F",
                    padding: {
                        x: 14,
                        y: 9
                    }
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(125);

        this.time.delayedCall(
            1100,
            () => {

                failure.destroy();

                this.scene.restart();
            }
        );
    }

    // ==========================================
    // ACCESO A MUNDO 3
    // ==========================================

    showWorld3Access() {

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x173f6e,
                1
            )
                .setScrollFactor(0)
                .setDepth(120);

        const title =
            this.add.text(
                400,
                175,
                "MUNDO 3",
                {
                    fontFamily: "Arial",
                    fontSize: "20px",
                    fontStyle: "bold",
                    color: "#8DDEE9"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);

        const subtitle =
            this.add.text(
                400,
                220,
                "INNOVACIÓN",
                {
                    fontFamily: "Arial",
                    fontSize: "38px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);

        const continueText =
            this.add.text(
                400,
                285,
                "CONTINUARÁ...",
                {
                    fontFamily: "Arial",
                    fontSize: "22px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);

        const message =
            this.add.text(
                400,
                335,
                "La aventura continúa en el siguiente mundo.",
                {
                    fontFamily: "Arial",
                    fontSize: "14px",
                    color: "#8DDEE9"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);
    }

    // ==========================================
    // CÁMARA
    // ==========================================

    createCamera() {

        this.cameras.main.setBounds(
            0,
            0,
            this.worldWidth,
            450
        );

        this.cameras.main.startFollow(
            this.player,
            true,
            0.08,
            0.08
        );
    }

    // ==========================================
    // COLISIONES
    // ==========================================

    createCollisions() {

        this.platforms.forEach(
            (platform) => {

                this.physics.add.collider(
                    this.player,
                    platform.getObject()
                );
            }
        );

        // PowerBlock sólido
        this.powerBlocks.forEach(
            (powerBlock) => {

                this.physics.add.collider(
                    this.player,
                    powerBlock.getObject()
                );
            }
        );

        // Puerta final
        this.physics.add.collider(
            this.player,
            this.techDoor.getObject()
        );
    }

    // ==========================================
    // CONTROLES
    // ==========================================

    createControls() {

        this.cursors =
            this.input.keyboard.createCursorKeys();

        this.interactKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );

        if (
            this.isMobile
        ) {

            this.touchControls =
                new TouchControls(
                    this
                );
        }

        this.input.keyboard.on(
            "keydown-ESC",
            () => {
                this.returnToMenu();
            },
            this
        );
    }

    updateMobileInteractionButton() {

        if (
            !this.touchControls ||
            !this.player
        ) {
            return;
        }

        if (
            this.finalQuizOpen
        ) {

            this.touchControls.setInteractAvailable(
                false
            );

            return;
        }

        let interactionAvailable =
            false;

        if (
            this.knowledgeStations
        ) {

            interactionAvailable =
                this.knowledgeStations.some(
                    (station) =>
                        station.trigger &&
                        this.physics.overlap(
                            this.player,
                            station.trigger
                        ) &&
                        !station.panelIsOpen
                );
        }

        if (
            !interactionAvailable &&
            this.checkpoints
        ) {

            interactionAvailable =
                this.checkpoints.some(
                    (checkpoint) =>
                        checkpoint.trigger &&
                        !checkpoint.isActivated &&
                        !checkpoint.isRepairing &&
                        this.physics.overlap(
                            this.player,
                            checkpoint.trigger
                        )
                );
        }

        if (
            !interactionAvailable &&
            this.techSwitch &&
            this.techSwitch.trigger
        ) {

            interactionAvailable =
                !this.techSwitch.isActivated &&
                this.physics.overlap(
                    this.player,
                    this.techSwitch.trigger
                );
        }

        if (
            !interactionAvailable &&
            this.technologyCore &&
            this.systemOnline &&
            !this.coreActivated
        ) {

            interactionAvailable =
                this.physics.overlap(
                    this.player,
                    this.technologyCore
                );
        }

        this.touchControls.setInteractAvailable(
            interactionAvailable
        );
    }

    // ==========================================
    // DERROTA / RESPAWN
    // ==========================================

    handlePlayerDefeat() {

        if (
            this.isGameOver ||
            this.finalQuizOpen ||
            this.finalSequenceStarted
        ) {
            return;
        }

        this.isGameOver =
            true;

        this.player.setVelocity(
            0,
            0
        );

        if (
            this.player.body
        ) {

            this.player.body.enable =
                false;
        }

        this.enemies.forEach(
            (enemy) => {
                enemy.isActive =
                    false;
            }
        );

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                0.72
            )
            .setScrollFactor(0)
            .setDepth(100);

        const title =
            this.add.text(
                400,
                180,
                "SISTEMA INTERRUMPIDO",
                {
                    fontFamily: "Arial",
                    fontSize: "28px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        const text =
            this.add.text(
                400,
                230,
                "Regresando al último punto de resguardo...",
                {
                    fontFamily: "Arial",
                    fontSize: "17px",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);

        this.time.delayedCall(
            1200,
            () => {

                overlay.destroy();
                title.destroy();
                text.destroy();

                this.respawnPlayer();
            }
        );
    }

    respawnPlayer() {

        const respawnX =
            this.checkpointPosition
                ? this.checkpointPosition.x
                : this.startPosition.x;

        const respawnY =
            this.checkpointPosition
                ? this.checkpointPosition.y
                : this.startPosition.y;

        this.player.setPosition(
            respawnX,
            respawnY
        );

        if (
            this.player.body
        ) {

            this.player.body.enable =
                true;

            this.player.body.reset(
                respawnX,
                respawnY
            );
        }

        this.player.health =
            this.player.maxHealth;

        this.player.isInvulnerable =
            true;

        this.player.setAlpha(
            1
        );

        this.player.setVelocity(
            0,
            0
        );

        this.player.play(
            "idle",
            true
        );

        this.enemies.forEach(
            (enemy) => {

                if (
                    typeof enemy.reset ===
                    "function"
                ) {

                    enemy.reset();

                } else {

                    enemy.isActive =
                        true;
                }
            }
        );

        this.isGameOver =
            false;

        this.updateHealthHud();

        this.time.delayedCall(
            1500,
            () => {

                this.player.isInvulnerable =
                    false;

                this.player.setAlpha(
                    1
                );
            }
        );
    }

    // ==========================================
    // INTRO
    // ==========================================

    showWorldIntro() {

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                0.86
            )
            .setScrollFactor(0)
            .setDepth(90);

        const title =
            this.add.text(
                400,
                172,
                "MUNDO 2",
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    fontStyle: "bold",
                    color: "#8DDEE9"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(91);

        const subtitle =
            this.add.text(
                400,
                215,
                "TECNOLOGÍA",
                {
                    fontFamily: "Arial",
                    fontSize: "34px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(91);

        const description =
            this.add.text(
                400,
                263,
                "Automatización · velocidad · control",
                {
                    fontFamily: "Arial",
                    fontSize: "15px",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(91);

        this.tweens.add({
            targets: [
                overlay,
                title,
                subtitle,
                description
            ],
            alpha: 0,
            delay: 1000,
            duration: 800,
            ease: "Cubic.easeOut",
            onComplete: () => {

                overlay.destroy();
                title.destroy();
                subtitle.destroy();
                description.destroy();
            }
        });
    }

    // ==========================================
    // UPDATE
    // ==========================================

    update() {

        if (
            this.finalQuizOpen
        ) {

            this.updateHealthHud();

            return;
        }

        this.updatePowerBlockSensors();
        this.updateMobileInteractionButton();

        const keyboardInteract =
            Phaser.Input.Keyboard.JustDown(
                this.interactKey
            );

        const touchInteract =
            this.touchControls
                ? this.touchControls.consumeInteract()
                : false;

        const interactPressed =
            keyboardInteract ||
            touchInteract;

        this.knowledgeStations.forEach(
            (station) => {

                station.update(
                    this.player,
                    interactPressed
                );
            }
        );

        this.capsules.forEach(
            (capsule) => {

                capsule.update(
                    this.player
                );
            }
        );

        this.checkpoints.forEach(
            (checkpoint) => {

                checkpoint.update(
                    this.player,
                    interactPressed
                );
            }
        );

        this.techSwitch.update(
            this.player,
            interactPressed
        );

        this.updateTechnologyCore(
            interactPressed
        );

        if (
            this.world3Ready &&
            !this.world3AccessShown &&
            this.physics.overlap(
                this.player,
                this.world3Trigger
            )
        ) {
            this.world3AccessShown = true;
            this.showWorld3Access();
        }

        const isReadingAStation =
            this.knowledgeStations.some(
                (station) =>
                    station.isReading()
            );

        if (
            isReadingAStation
        ) {

            this.player.setVelocityX(
                0
            );

            this.updateHealthHud();

            return;
        }

        this.enemies.forEach(
            (enemy) => {

                enemy.update(
                    this.player,
                    !this.isGameOver &&
                    !this.finalSequenceStarted
                );
            }
        );

        const movementControls =
            this.touchControls
                ? this.touchControls.getPlayerControls()
                : this.cursors;

        this.player.update(
            movementControls
        );

        this.updateHealthHud();
    }

    // ==========================================
    // MENÚ
    // ==========================================

    returnToMenu() {

        this.touchControls?.destroy();

        this.scene.start(
            "MenuScene"
        );
    }
}
