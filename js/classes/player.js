export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {

        super(scene, x, y, "player", 0);

        // ==================================
        // AGREGAR JUGADOR A LA ESCENA
        // ==================================

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // El jugador siempre se dibuja por delante
        // de puertas y elementos del escenario.
        this.setDepth(10);


        // ==================================
        // TAMAÑO DEL PERSONAJE
        // ==================================

        this.setDisplaySize(60, 60);


        // ==================================
        // CONFIGURACIÓN FÍSICA
        // ==================================

        this.setCollideWorldBounds(true);

        // ==================================
        // CONFIGURACIÓN DE CAÍDA
        // ==================================

        const worldBounds = this.scene.physics.world.bounds;

        this.scene.physics.world.setBounds(
            worldBounds.x,
            worldBounds.y,
            worldBounds.width,
            Math.max(
                worldBounds.height,
                this.scene.scale.height + 250
            )
        );

        this.fallDeathY =
            this.scene.scale.height + 60;


        // ==================================
        // CONFIGURACIÓN DEL MOVIMIENTO
        // ==================================

        this.normalSpeed = 200;
        this.speed = this.normalSpeed;

        this.normalJumpForce = 450;
        this.jumpForce = this.normalJumpForce;

        this.hasSuperJump = false;
        this.hasSpeedBoost = false;

        this.maxHealth = 3;
        this.health = this.maxHealth;

        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1200;

        // ==================================
        // CREAR ANIMACIONES
        // ==================================

        this.createAnimations();
    }


    // ======================================
    // ANIMACIONES
    // ======================================

    createAnimations() {

    // Las animaciones pertenecen al administrador global de Phaser.
    // Si el jugador reinicia la aventura, ya existen y no deben
    // registrarse una segunda vez.
    if (this.scene.anims.exists("idle")) {

        return;
    }

    // ======================================
    // IDLE
    // ======================================

    this.scene.anims.create({

        key: "idle",

        frames: this.scene.anims.generateFrameNumbers(
            "player",
            {
                start: 0,
                end: 1
            }
        ),

        frameRate: 2,

        repeat: -1
    });


    // ======================================
    // WALK
    // ======================================

    this.scene.anims.create({

        key: "walk",

        frames: this.scene.anims.generateFrameNumbers(
            "player",
            {
                start: 2,
                end: 5
            }
        ),

        frameRate: 8,

        repeat: -1
    });


    // ======================================
    // JUMP
    // ======================================

    this.scene.anims.create({

        key: "jump",

        frames: this.scene.anims.generateFrameNumbers(
            "player",
            {
                start: 6,
                end: 7
            }
        ),

        frameRate: 4,

        repeat: -1
    });
    }


    // ======================================
    // ACTUALIZAR JUGADOR
    // ======================================

    // ======================================
    // HABILIDAD: SUPER SALTO
    // ======================================

    activateSuperJump(duration) {

        if (this.hasSuperJump) {
            return;
        }

        this.hasSuperJump = true;

        this.jumpForce = 650;

        this.scene.showPowerMessage(
            "🔬 SUPER SALTO",
            duration
        );

        this.scene.time.delayedCall(
            duration,
            () => {

                this.jumpForce = this.normalJumpForce;

                this.hasSuperJump = false;
            }
        );
    }
    
    // ======================================
    // HABILIDAD: VELOCIDAD
    // ======================================

    activateSpeedBoost(duration) {

        if (this.hasSpeedBoost) {
            return;
        }

        this.hasSpeedBoost = true;

        this.speed = 320;

        this.scene.showPowerMessage(
            "⚡ VELOCIDAD",
            duration
        );

        this.scene.time.delayedCall(
            duration,
            () => {

                this.speed = this.normalSpeed;

                this.hasSpeedBoost = false;
            }
        );
    }

    // ======================================
    // MUERTE POR CAÍDA
    // ======================================

    handleFallDeath() {

        if (
            this.scene.isGameOver ||
            !this.scene.handlePlayerDefeat
        ) {
            return;
        }

        this.health = 0;
        this.isInvulnerable = false;

        this.setVelocity(0, 0);

        this.scene.handlePlayerDefeat();
    }

    // ======================================
    // SALUD
    // ======================================

    takeDamage(amount = 1) {

        if (this.isInvulnerable) {
            return;
        }

        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }

        this.isInvulnerable = true;

        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: 5
        });

        console.log(
            `❤️ Salud: ${this.health}/${this.maxHealth}`
        );

        if (this.health <= 0) {

            this.setVelocity(0, 0);

            this.scene.handlePlayerDefeat();

            return;
        }

        this.scene.time.delayedCall(
            this.invulnerabilityDuration,
            () => {

                this.isInvulnerable = false;
                this.setAlpha(1);

            }
        );
    }

    update(cursors) {

    // ======================================
    // MOVIMIENTO IZQUIERDA
    // ======================================

    if (cursors.left.isDown) {

        this.setVelocityX(-this.speed);

        this.setFlipX(true);

        this.play("walk", true);
    }


    // ======================================
    // MOVIMIENTO DERECHA
    // ======================================

    else if (cursors.right.isDown) {

        this.setVelocityX(this.speed);

        this.setFlipX(false);

        this.play("walk", true);
    }


    // ======================================
    // SIN MOVIMIENTO
    // ======================================

    else {

        this.setVelocityX(0);

        this.play("idle", true);
    }


    // ======================================
    // SALTO
    // ======================================

    if (
        cursors.up.isDown &&
        this.body.blocked.down
    ) {

        this.setVelocityY(-this.jumpForce);
    }


    // ======================================
    // ANIMACIÓN DE SALTO
    // ======================================

    if (!this.body.blocked.down) {

        this.play("jump", true);
    }

        // ======================================
        // DETECTAR CAÍDA DEL ESCENARIO
        // ======================================

        if (
            this.y > this.fallDeathY &&
            !this.scene.isGameOver
        ) {

            this.handleFallDeath();

            return;
        }
    }
}
