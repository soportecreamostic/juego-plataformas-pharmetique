import Player from "../classes/player.js";
import Platform from "../classes/Platform.js";
import KnowledgeStation from "../classes/KnowledgeStation.js";
import TouchControls from "../classes/TouchControls.js";
import Capsule from "../classes/capsule.js";
import Enemy from "../classes/Enemy.js";
import Checkpoint from "../classes/Checkpoint.js";
import LabConsole from "../classes/LabConsole.js";
import PowerBlock from "../classes/PowerBlock.js";

// ==========================================
// MUNDO 1 · EL LABORATORIO
// Recorrido principal de Pharmetique
// ==========================================

export default class AdventureScene extends Phaser.Scene {

    constructor() {
        super("AdventureScene");
    }

    preload() {

        if (!this.textures.exists("player")) {

            this.load.spritesheet(
                "player",
                "assets/sprites/player-pharmetique.png",
                {
                    frameWidth: 64,
                    frameHeight: 64
                }
            );
        }
    }

    create() {

        this.deviceMode =
            this.registry.get("deviceMode") || "desktop";

        this.isMobile =
            this.deviceMode === "mobile";

        this.worldWidth = 3000;
        this.worldHeight = 450;

        this.isGameOver = false;
        this.finalSequenceStarted = false;
        this.checkpointPosition = null;

        this.physics.world.setBounds(
            0,
            0,
            this.worldWidth,
            this.worldHeight
        );

        this.createLabBackground();
        this.createPlatforms();
        this.createMovingPlatforms();

        this.createPlayer();

        this.createKnowledgeHud();
        this.createHealthHud();

        this.createKnowledgeStations();
        this.createCapsules();
        this.createPowerBlocks();
        this.createEnemies();
        this.createCheckpoints();
        this.createLabConsole();

        this.createCamera();
        this.createCollisions();
        this.createControls();

        this.showWorldIntro();
    }


    // ======================================
    // AMBIENTE DEL LABORATORIO
    // ======================================

    createLabBackground() {

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

        // Halos suaves para mantener el laboratorio
        // luminoso sin competir con el recorrido.
        background.fillStyle(
            0x8DDEE9,
            0.12
        );

        background.fillCircle(250, 90, 175);
        background.fillCircle(980, 330, 220);
        background.fillCircle(1880, 90, 190);
        background.fillCircle(2500, 330, 230);
        background.fillCircle(2860, 90, 170);

        // Paneles verticales muy sutiles.
        const panelXs = [
            720,
            1425,
            1760,
            2235,
            2700
        ];

        panelXs.forEach((x) => {

            background.lineStyle(
                2,
                0x41C0F0,
                0.12
            );

            background.lineBetween(
                x,
                145,
                x,
                385
            );

            background.fillStyle(
                0xFFFFFF,
                0.14
            );

            background.fillRect(
                x + 12,
                160,
                140,
                200
            );
        });

        // Red molecular decorativa.
        background.lineStyle(
            2,
            0x41C0F0,
            0.16
        );

        for (
            let x = 80;
            x < this.worldWidth;
            x += 320
        ) {

            background.lineBetween(
                x,
                68,
                x + 105,
                118
            );

            background.lineBetween(
                x + 105,
                118,
                x + 190,
                72
            );

            background.fillStyle(
                0x41C0F0,
                0.24
            );

            background.fillCircle(
                x,
                68,
                5
            );

            background.fillCircle(
                x + 105,
                118,
                7
            );

            background.fillCircle(
                x + 190,
                72,
                5
            );
        }

        // Nombres de sector, discretos y alineados.
        const labels = [
            [360, "ENTRADA"],
            [1080, "CIENCIA"],
            [1585, "TRANSFERENCIA"],
            [2050, "TECNOLOGÍA"],
            [2460, "PRUEBAS"],
            [2860, "CONSOLA CENTRAL"]
        ];

        labels.forEach(([x, label]) => {

            this.add.text(
                x,
                150,
                label,
                {
                    fontFamily: "Arial",
                    fontSize: "11px",
                    fontStyle: "bold",
                    color: "#00557F"
                }
            )
            .setOrigin(0.5)
            .setAlpha(0.34)
            .setDepth(-1);
        });

        // Línea de suelo ambiental.
        background.lineStyle(
            2,
            0x41C0F0,
            0.10
        );

        background.lineBetween(
            0,
            414,
            this.worldWidth,
            414
        );

        background.setDepth(-2);
    }


    // ======================================
    // PLATAFORMAS
    // ======================================

    createPlatforms() {

        this.platforms = [

            // ==================================
            // 1. ENTRADA SEGURA
            // ==================================

            new Platform(
                this,
                350,
                430,
                700,
                40
            ),

            // ==================================
            // 2. ASCENSO DE CIENCIA
            // ==================================

            new Platform(
                this,
                790,
                350,
                170,
                20
            ),

            new Platform(
                this,
                980,
                285,
                150,
                20
            ),

            new Platform(
                this,
                1120,
                220,
                130,
                20
            ),

            // Plataforma ancha para estabilizar el aterrizaje
            // y presentar el primer dron.
            new Platform(
                this,
                1325,
                330,
                300,
                20
            ),

            // ==================================
            // 3. TRANSFERENCIA
            // ==================================

            // Deja un vacío real entre ambos módulos.
            new Platform(
                this,
                1890,
                330,
                260,
                20
            ),

            // ==================================
            // 4. MÓDULO DE TECNOLOGÍA
            // ==================================

            new Platform(
                this,
                2140,
                270,
                170,
                20
            ),

            new Platform(
                this,
                2320,
                330,
                180,
                20
            ),

            new Platform(
                this,
                2480,
                270,
                140,
                20
            ),

            new Platform(
                this,
                2610,
                210,
                140,
                20
            ),

            // ==================================
            // 5. TRAMO FINAL
            // ==================================

            new Platform(
                this,
                2840,
                330,
                470,
                40
            )
        ];
    }


    // ======================================
    // PLATAFORMA MÓVIL
    // Solo vive dentro del gran vacío de
    // transferencia. No cruza plataformas.
    // ======================================

    createMovingPlatforms() {

        this.movingPlatforms = [];

        // Una sola plataforma móvil, usada exclusivamente
        // para cruzar el vacío entre los dos módulos.
        const platform =
            this.add.rectangle(
                1665,
                330,
                120,
                18,
                0x00557F
            )
            .setStrokeStyle(
                2,
                0x41C0F0
            )
            .setDepth(1);

        this.physics.add.existing(
            platform
        );

        platform.body.setAllowGravity(
            false
        );

        platform.body.setImmovable(
            true
        );

        this.movingPlatforms.push({
            object: platform,
            distance: 70,
            speed: 0.0012,
            phase: 0
        });
    }


    updateMovingPlatforms() {

        if (!this.movingPlatforms) {
            return;
        }

        this.movingPlatforms.forEach((data) => {

            const platform = data.object;

            if (
                !platform ||
                !platform.body
            ) {
                return;
            }

            const phase =
                this.time.now *
                data.speed +
                data.phase;

            const velocityX =
                Math.cos(phase) *
                data.distance *
                data.speed *
                1000;

            platform.body.setVelocityX(
                velocityX
            );

            platform.body.setVelocityY(0);
            platform.body.setAllowGravity(false);
        });
    }


    // ======================================
    // JUGADOR
    // ======================================

    createPlayer() {

        this.player =
            new Player(
                this,
                150,
                350
            );

        this.player.setDepth(
            10
        );

        this.startPosition = {
            x: this.player.x,
            y: this.player.y
        };
    }


    // ======================================
    // CÁMARA
    // ======================================

    createCamera() {

        this.cameras.main.setBounds(
            0,
            0,
            this.worldWidth,
            this.worldHeight
        );

        this.cameras.main.startFollow(
            this.player,
            true,
            0.08,
            0.08
        );
    }


    // ======================================
    // COLISIONES
    // ======================================

    createCollisions() {

        // ----------------------------------
        // PLATAFORMAS ESTÁTICAS
        // ----------------------------------

        this.platforms.forEach((platform) => {

            this.physics.add.collider(
                this.player,
                platform.getObject()
            );
        });

        // ----------------------------------
        // PLATAFORMA MÓVIL
        // ----------------------------------

        this.movingPlatforms.forEach((platform) => {

            this.physics.add.collider(
                this.player,
                platform.object
            );
        });

        // ----------------------------------
        // POWERBLOCKS
        // ----------------------------------
        // El bloque SÍ es sólido. El jugador no puede
        // atravesarlo. Su propia clase decide si el contacto
        // corresponde a un golpe desde abajo y activa la recompensa.

        this.powerBlocks.forEach((powerBlock) => {

            this.physics.add.collider(
                this.player,
                powerBlock.getObject(),
                () => {

                    powerBlock.hit(
                        this.player
                    );
                }
            );
        });
    }


    // ======================================
    // DETECCIÓN DE POWERBLOCK
    // ======================================




    // ======================================
    // HUD DE CONOCIMIENTO
    // ======================================

    createKnowledgeHud() {

        this.knowledge = 0;


        this.add.text(
            24,
            18,
            "MUNDO 1 · EL LABORATORIO",
            {
                fontFamily: "Arial",
                fontSize: "14px",
                fontStyle: "bold",
                color: "#00557F"
            }
        )
        .setScrollFactor(0)
        .setDepth(20);


        this.knowledgeText =
            this.add.text(
                24,
                48,
                "CONOCIMIENTO 0",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    fontStyle: "bold",
                    color: "#00557F",
                    backgroundColor: "#FFFFFF",
                    padding: {
                        x: 12,
                        y: 8
                    }
                }
            )
            .setScrollFactor(0)
            .setDepth(20);


        this.createReturnButton();


        const tutorial =
            this.add.text(
                400,
                this.isMobile
                    ? 330
                    : 418,
                this.isMobile
                    ? "Usa los botones para moverte y toca E para interactuar."
                    : "Explora, aprende y usa E para interactuar.",
                {
                    fontFamily: "Arial",
                    fontSize:
                        this.isMobile
                            ? "13px"
                            : "14px",
                    color: "#17364A",
                    backgroundColor: "#FFFFFF",
                    padding: {
                        x: 12,
                        y: 6
                    }
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(20);


        this.tweens.add({
            targets: tutorial,
            alpha: 0,
            delay: 5000,
            duration: 900
        });
    }


    // ======================================
    // HUD DE SALUD
    // ======================================

    createHealthHud() {

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
            );


        this.healthText
            .setScrollFactor(0)
            .setDepth(50);
    }


    // ======================================
    // BOTÓN PORTADA
    // ======================================

    createReturnButton() {

        const background =
            this.add.rectangle(
                0,
                0,
                this.isMobile
                    ? 96
                    : 118,
                30,
                0xFFFFFF,
                0.94
            )
            .setStrokeStyle(
                2,
                0x8DDEE9
            );


        const text =
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
                    background,
                    text
                ]
            )
            .setSize(
                this.isMobile
                    ? 96
                    : 118,
                30
            )
            .setScrollFactor(0)
            .setDepth(20)
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


    // ======================================
    // ESTACIONES DE CONOCIMIENTO
    // ======================================

    createKnowledgeStations() {

        this.knowledgeStations = [

            new KnowledgeStation(
                this,
                430,
                355,
                {
                    title: "CIENCIA",
                    content:
                        "El BrandBook presenta a Pharmetique Labs desde los territorios de ciencia, tecnología e innovación, con la vida como eje. Su promesa es: \"Más vida. Mejor vida.\"",
                    reward: 1,
                    onKnowledgeEarned:
                        this.addKnowledge.bind(this)
                }
            ),

            new KnowledgeStation(
                this,
                1970,
                265,
                {
                    title: "TECNOLOGÍA",
                    content:
                        "El BrandBook sitúa la tecnología entre los territorios de Pharmetique. Su fundamento incluye calidad, valores, tecnología de punta y mejores prácticas.",
                    reward: 1,
                    onKnowledgeEarned:
                        this.addKnowledge.bind(this)
                }
            )
        ];
    }


    // ======================================
    // CÁPSULAS
    // ======================================

    createCapsules() {

        this.capsules = [];
    }


    activateCapsulePower(
        type,
        duration
    ) {

        if (
            type === "science"
        ) {

            this.player.activateSuperJump(
                duration
            );
        }


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
                110,
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
            .setDepth(50);


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


    // ======================================
    // POWERBLOCKS
    // ======================================

    createPowerBlocks() {

        this.powerBlocks = [

            // Bloque 1: premio científico.
            // Queda alto sobre la entrada para que el salto
            // desde abajo sea claro y visualmente evidente.
            new PowerBlock(
                this,
                610,
                235,
                {
                    rewardType: "science",
                    duration: 10000
                }
            ),

            // Bloque 2: premio tecnológico.
            new PowerBlock(
                this,
                1850,
                225,
                {
                    rewardType: "technology",
                    duration: 10000
                }
            )
        ];
    }


    // ======================================
    // ENEMIGOS
    // ======================================

    createEnemies() {

        this.enemies = [


            // Primer desafío tecnológico.
            new Enemy(
                this,
                1260,
                275,
                {
                    speed: 65,
                    damage: 1,
                    patrolDistance: 150
                }
            ),

            new Enemy(
                this,
                2625,
                155,
                {
                    speed: 75,
                    damage: 1,
                    patrolDistance: 45
                }
            )
        ];
    }


    // ======================================
    // CHECKPOINTS
    // ======================================

    createCheckpoints() {

        this.checkpoints = [

            new Checkpoint(
                this,
                800,
                500,
                {
                    label: "PUNTO DE RESGUARDO 01"
                }
            ),

            new Checkpoint(
                this,
                2320,
                300,
                {
                    label: "PUNTO DE RESGUARDO 02"
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


        console.log(
            `🟢 Checkpoint guardado: ${x}, ${y}`
        );
    }


    // ======================================
    // CONSOLA CENTRAL
    // ======================================

    createLabConsole() {

        this.labConsole =
            new LabConsole(
                this,
                2860,
                280,
                {
                    title: "CONSOLA CENTRAL"
                }
            );
    }


    checkFinalSequence() {

        if (
            this.finalSequenceStarted ||
            !this.labConsole ||
            !this.labConsole.isActivated
        ) {
            return;
        }

        this.finalSequenceStarted = true;

        this.player.setVelocity(
            0,
            0
        );

        if (this.player.body) {
            this.player.body.enable = false;
        }

        if (this.touchControls) {
            this.touchControls.setInteractAvailable(false);
        }

        this.showFinalQuiz();
    }

    showFinalQuiz() {

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                0.94
            )
                .setScrollFactor(0)
                .setDepth(120);


        const title =
            this.add.text(
                400,
                100,
                "VERIFICACIÓN DE CONOCIMIENTO",
                {
                    fontFamily: "Arial",
                    fontSize: "25px",
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
                160,
                "¿Cuál es la promesa de Pharmetique?",
                {
                    fontFamily: "Arial",
                    fontSize: "21px",
                    fontStyle: "bold",
                    color: "#FFFFFF",
                    align: "center",
                    wordWrap: {
                        width: 650
                    }
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);


        const options = [
            {
                text: "A · Más vida. Mejor vida.",
                correct: true
            },
            {
                text: "B · Ciencia para todos.",
                correct: false
            },
            {
                text: "C · Innovación sin límites.",
                correct: false
            },
            {
                text: "D · Salud para una nueva era.",
                correct: false
            }
        ];

        const buttons = [];

        options.forEach(
            (option, index) => {

                const y =
                    225 + (index * 46);

                const button =
                    this.add.text(
                        400,
                        y,
                        option.text,
                        {
                            fontFamily: "Arial",
                            fontSize: "16px",
                            fontStyle: "bold",
                            color: "#00557F",
                            backgroundColor: "#FFFFFF",
                            padding: {
                                x: 18,
                                y: 10
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
                    "pointerdown",
                    () => {

                        if (option.correct) {

                            overlay.destroy();
                            title.destroy();
                            question.destroy();

                            options.forEach(
                                (_, optionIndex) => {

                                    if (
                                        buttons[optionIndex]
                                    ) {
                                        buttons[
                                            optionIndex
                                        ].destroy();
                                    }
                                }
                            );

                            this.showFinalWorldTransition();

                        } else {

                            this.showQuizFailure();
                        }
                    }
                );


                buttons.push(button);
            }
        );
    }

    showQuizFailure() {

        const message =
            this.add.text(
                400,
                395,
                "RESPUESTA INCORRECTA · REINICIANDO EL LABORATORIO...",
                {
                    fontFamily: "Arial",
                    fontSize: "15px",
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
            1200,
            () => {

                message.destroy();

                this.scene.restart();
            }
        );
    }


    showFinalWorldTransition() {

        const overlay =
            this.add.rectangle(
                400,
                225,
                800,
                450,
                0x00557F,
                1
            )
                .setScrollFactor(0)
                .setDepth(120);


        const title =
            this.add.text(
                400,
                190,
                "ACCESO DESBLOQUEADO",
                {
                    fontFamily: "Arial",
                    fontSize: "30px",
                    fontStyle: "bold",
                    color: "#FFFFFF"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);


        const subtitle =
            this.add.text(
                400,
                240,
                "TECNOLOGÍA · SIGUIENTE MUNDO",
                {
                    fontFamily: "Arial",
                    fontSize: "16px",
                    fontStyle: "bold",
                    color: "#8DDEE9"
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(121);


        this.time.delayedCall(
            1800,
            () => {

                this.scene.start(
                    "TechnologyScene"
                );
            }
        );
    }


    // ======================================
    // DERROTA
    // ======================================

    handlePlayerDefeat() {

        if (
            this.isGameOver ||
            this.finalSequenceStarted
        ) {
            return;
        }


        this.isGameOver = true;


        this.player.setVelocity(
            0,
            0
        );


        if (this.player.body) {

            this.player.body.enable =
                false;
        }


        this.enemies.forEach(
            (enemy) => {

                enemy.isActive = false;
            }
        );


        const defeatOverlay =
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


        const defeatTitle =
            this.add.text(
                400,
                180,
                "EXPERIMENTO INTERRUMPIDO",
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


        const defeatText =
            this.add.text(
                400,
                230,
                "Regresando al punto de resguardo...",
                {
                    fontFamily: "Arial",
                    fontSize: "18px",
                    color: "#FFFFFF"
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(101);


        this.time.delayedCall(
            1200,
            () => {

                defeatOverlay.destroy();
                defeatTitle.destroy();
                defeatText.destroy();

                this.respawnPlayer();
            }
        );
    }


    // ======================================
    // RESPAWN
    // ======================================

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


        if (this.player.body) {

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

                    enemy.isActive = true;
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


    // ======================================
    // SALUD
    // ======================================

    updateHealthHud() {

        let hearts = "";


        for (
            let i = 0;
            i < this.player.maxHealth;
            i++
        ) {

            if (
                i < this.player.health
            ) {

                hearts += "❤️ ";

            } else {

                hearts += "🖤 ";
            }
        }


        this.healthText.setText(
            hearts.trim()
        );
    }


    // ======================================
    // CONOCIMIENTO
    // ======================================

    addKnowledge(points) {

        this.knowledge +=
            points;


        this.knowledgeText.setText(
            `CONOCIMIENTO ${this.knowledge}`
        );
    }


    // ======================================
    // CONTROLES
    // ======================================

    createControls() {

        this.cursors =
            this.input.keyboard
                .createCursorKeys();


        this.interactKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );


        if (this.isMobile) {

            this.touchControls =
                new TouchControls(this);
        }


        this.input.keyboard.on(
            "keydown-ESC",
            this.returnToMenu,
            this
        );
    }


    // ======================================
    // BOTÓN E EN MOBILE
    // ======================================

    updateMobileInteractionButton() {

        if (
            !this.touchControls ||
            !this.player
        ) {
            return;
        }


        let interactionAvailable =
            false;


        // Estaciones.
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


        // Checkpoints.
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


        // Consola.
        if (
            !interactionAvailable &&
            this.labConsole &&
            this.labConsole.trigger
        ) {

            interactionAvailable =
                !this.labConsole.isActivated &&
                this.physics.overlap(
                    this.player,
                    this.labConsole.trigger
                );
        }


        this.touchControls
            .setInteractAvailable(
                interactionAvailable
            );
    }


    // ======================================
    // UPDATE
    // ======================================

    update() {

        this.updateMovingPlatforms();

        this.updateMobileInteractionButton();



        const keyboardInteract =
            Phaser.Input.Keyboard.JustDown(
                this.interactKey
            );


        const touchInteract =
            this.touchControls
                ? this.touchControls
                    .consumeInteract()
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


        this.labConsole.update(
            this.player,
            interactPressed
        );


        this.checkpoints.forEach(
            (checkpoint) => {

                checkpoint.update(
                    this.player,
                    interactPressed
                );
            }
        );


        this.checkFinalSequence();


        const isReadingAStation =
            this.knowledgeStations.some(
                (station) =>
                    station.isReading()
            );


        this.enemies.forEach(
            (enemy) => {

                enemy.update(
                    this.player,
                    !isReadingAStation &&
                    !this.finalSequenceStarted
                );
            }
        );


        if (
            isReadingAStation ||
            this.finalSequenceStarted
        ) {

            this.player.setVelocityX(
                0
            );

            this.updateHealthHud();

            return;
        }


        const movementControls =
            this.touchControls
                ? this.touchControls
                    .getPlayerControls()
                : this.cursors;


        this.player.update(
            movementControls
        );


        this.updateHealthHud();
    }


    // ======================================
    // INTRO DEL MUNDO
    // ======================================

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
                "MUNDO 1",
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
                216,
                "EL LABORATORIO",
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
                262,
                "Explora · descubre · aprende · avanza",
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
            delay: 1100,
            duration: 850,
            ease: "Cubic.easeOut",
            onComplete: () => {

                overlay.destroy();
                title.destroy();
                subtitle.destroy();
                description.destroy();
            }
        });
    }


    // ======================================
    // REGRESAR
    // ======================================

    returnToMenu() {

        this.touchControls?.destroy();

        this.scene.start(
            "MenuScene"
        );
    }
}
