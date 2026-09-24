export default class Enemy {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.startX = x;
        this.baseY = y;

        this.speed = data.speed || 60;
        this.damage = data.damage || 1;
        this.patrolDistance = data.patrolDistance || 120;

        this.direction = 1;

        this.leftLimit = this.startX - this.patrolDistance;
        this.rightLimit = this.startX + this.patrolDistance;

        this.isActive = true;

        this.createVisual();
        this.createBody();
    }

    createVisual() {

        const glow = this.scene.add.circle(
            0,
            0,
            26,
            0xE53935,
            0.18
        );

        const body = this.scene.add.circle(
            0,
            0,
            18,
            0x00557F
        );

        const core = this.scene.add.circle(
            0,
            0,
            7,
            0xFFFFFF
        );

        const lightLeft = this.scene.add.circle(
            -13,
            12,
            3,
            0x7A2C8F
        );

        const lightRight = this.scene.add.circle(
            13,
            12,
            3,
            0x7A2C8F
        );

        const armLeft = this.scene.add.rectangle(
            -25,
            0,
            10,
            4,
            0x00557F
        );

        const armRight = this.scene.add.rectangle(
            25,
            0,
            10,
            4,
            0x00557F
        );

        this.visual = this.scene.add.container(
            this.x,
            this.y,
            [
                glow,
                body,
                core,
                lightLeft,
                lightRight,
                armLeft,
                armRight
            ]
        );

        this.glow = glow;

        this.visual.setDepth(4);

        this.scene.tweens.add({
            targets: this.glow,
            scale: 1.2,
            alpha: 0.05,
            duration: 750,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    createBody() {

        this.bodyObject = this.scene.add.zone(
            this.x,
            this.y,
            48,
            42
        );

        this.scene.physics.add.existing(
            this.bodyObject
        );

        this.bodyObject.body.setSize(
            48,
            42
        );

        this.bodyObject.body.setAllowGravity(false);

        this.bodyObject.body.setImmovable(true);

        this.bodyObject.body.setCollideWorldBounds(true);
    }

    update(player, canDamage = true) {

        if (
            !this.isActive ||
            !this.bodyObject ||
            !this.bodyObject.body
        ) {
            return;
        }

        // -----------------------------
        // MOVIMIENTO HORIZONTAL
        // -----------------------------

        const delta =
            this.scene.game.loop.delta / 1000;

        this.bodyObject.x +=
            this.speed * this.direction * delta;

        // Cambiar dirección al llegar al límite izquierdo
        if (this.bodyObject.x <= this.leftLimit) {

            this.bodyObject.x = this.leftLimit;
            this.direction = 1;
        }

        // Cambiar dirección al llegar al límite derecho
        if (this.bodyObject.x >= this.rightLimit) {

            this.bodyObject.x = this.rightLimit;
            this.direction = -1;
        }

        // -----------------------------
        // MOVIMIENTO VERTICAL
        // -----------------------------

        const hoverOffset =
            Math.sin(this.scene.time.now * 0.004) * 8;

        this.bodyObject.y =
            this.baseY + hoverOffset;

        // -----------------------------
        // ACTUALIZAR CUERPO FÍSICO
        // -----------------------------

        this.bodyObject.body.updateFromGameObject();

        // -----------------------------
        // SINCRONIZAR VISUAL
        // -----------------------------

        this.visual.x = this.bodyObject.x;
        this.visual.y = this.bodyObject.y;

        this.visual.angle =
            this.direction === 1 ? 2 : -2;

        // -----------------------------
        // DETECTAR CONTACTO
        // -----------------------------

        if (
            canDamage &&
            this.scene.physics.overlap(
                player,
                this.bodyObject
            )
        ) {

            const playerIsFalling =
                player.body.velocity.y > 0;

            const playerIsAbove =
                player.body.bottom <= this.bodyObject.body.top + 12;

            if (
                playerIsFalling &&
                playerIsAbove
            ) {

                this.defeat(player);

            } else if (
                !player.isInvulnerable
            ) {

                this.hitPlayer(player);
            }
        }
    }

    defeat(player) {

        this.isActive = false;

        this.bodyObject.body.enable = false;

        this.visual.setVisible(false);

        player.setVelocityY(-300);
    }

    hitPlayer(player) {

        player.takeDamage(this.damage);

        if (player.health <= 0) {
            return;
        }

        const pushDirection =
            player.x < this.bodyObject.x ? -1 : 1;

        player.setVelocityX(
            pushDirection * 220
        );

        player.setVelocityY(-220);

        this.playHitEffect();
    }

    playHitEffect() {

        this.scene.tweens.add({
            targets: this.visual,
            alpha: 0.35,
            scale: 1.15,
            duration: 100,
            yoyo: true,
            repeat: 2,
            ease: "Quad.easeOut"
        });
    }

    reset() {

        this.direction = 1;

        this.bodyObject.setPosition(
            this.startX,
            this.baseY
        );

        this.bodyObject.body.enable = true;

        this.bodyObject.body.updateFromGameObject();

        this.visual.setPosition(
            this.startX,
            this.baseY
        );

        this.visual.setVisible(true);
        this.visual.setAlpha(1);
        this.visual.setScale(1);

        this.isActive = true;
    }

    getObject() {

        return this.bodyObject;
    }
}