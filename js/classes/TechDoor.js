// ==========================================
// PUERTA TECNOLÓGICA
// ==========================================

export default class TechDoor {

    constructor(scene, x, y, data = {}) {

        this.scene = scene;

        this.x = x;
        this.y = y;

        this.width =
            data.width || 180;

        this.height =
            data.height || 250;

        this.isOpen = false;

        this.createVisual();

        this.createBody();
    }


    // ==========================================
    // APARIENCIA
    // ==========================================

    createVisual() {

        const frameColor =
            0x00557F;

        const accentColor =
            0x41C0F0;


        // Marco exterior
        const frame =
            this.scene.add.rectangle(
                0,
                0,
                this.width + 20,
                this.height + 20,
                0xE7F8FB
            )
            .setStrokeStyle(
                5,
                accentColor
            );


        // Panel izquierdo
        const leftDoor =
            this.scene.add.rectangle(
                -this.width / 4,
                0,
                this.width / 2 - 5,
                this.height,
                0x00557F
            )
            .setStrokeStyle(
                3,
                accentColor
            );


        // Panel derecho
        const rightDoor =
            this.scene.add.rectangle(
                this.width / 4,
                0,
                this.width / 2 - 5,
                this.height,
                0x00557F
            )
            .setStrokeStyle(
                3,
                accentColor
            );


        // Paneles interiores
        const leftInner =
            this.scene.add.rectangle(
                -this.width / 4,
                0,
                this.width / 2 - 28,
                this.height - 30,
                0x0A6A91
            );


        const rightInner =
            this.scene.add.rectangle(
                this.width / 4,
                0,
                this.width / 2 - 28,
                this.height - 30,
                0x0A6A91
            );


        // Línea central
        const centerLine =
            this.scene.add.rectangle(
                0,
                0,
                5,
                this.height - 25,
                accentColor
            );


        // Sensor superior
        const sensorFrame =
            this.scene.add.rectangle(
                0,
                -this.height / 2 - 16,
                70,
                22,
                0xFFFFFF
            )
            .setStrokeStyle(
                3,
                accentColor
            );


        const sensor =
            this.scene.add.circle(
                0,
                -this.height / 2 - 16,
                6,
                0x41C0F0
            );


        // Indicador de estado
        const statusLight =
            this.scene.add.circle(
                0,
                this.height / 2 - 18,
                7,
                0x41C0F0
            );


        this.visual =
            this.scene.add.container(
                this.x,
                this.y,
                [
                    frame,
                    leftDoor,
                    rightDoor,
                    leftInner,
                    rightInner,
                    centerLine,
                    sensorFrame,
                    sensor,
                    statusLight
                ]
            )
            .setDepth(1);


        this.leftDoor =
            leftDoor;

        this.rightDoor =
            rightDoor;

        this.leftInner =
            leftInner;

        this.rightInner =
            rightInner;

        this.centerLine =
            centerLine;

        this.sensor =
            sensor;

        this.statusLight =
            statusLight;


        // Pequeño pulso del sensor
        this.scene.tweens.add({

            targets: sensor,

            alpha: 0.35,

            scale: 1.2,

            duration: 850,

            yoyo: true,

            repeat: -1,

            ease: "Sine.easeInOut"
        });
    }


    // ==========================================
    // CUERPO FÍSICO
    // ==========================================

    createBody() {

        this.bodyObject =
            this.scene.add.rectangle(
                this.x,
                this.y,
                this.width,
                this.height,
                0x000000,
                0
            );


        this.scene.physics.add.existing(
            this.bodyObject,
            true
        );


        this.bodyObject.body.setSize(
            this.width,
            this.height
        );
    }


    // ==========================================
    // OBTENER CUERPO
    // ==========================================

    getObject() {

        return this.bodyObject;
    }


    // ==========================================
    // ABRIR PUERTA
    // ==========================================

    open() {

        if (this.isOpen) {
            return;
        }


        this.isOpen = true;


        // Desactivar la colisión
        if (
            this.bodyObject &&
            this.bodyObject.body
        ) {

            this.bodyObject.body.enable =
                false;
        }


        // Actualizar indicador
        this.statusLight.setFillStyle(
            0x7A2C8F
        );


        this.sensor.setFillStyle(
            0x7A2C8F
        );


        // Abrir hojas
        this.scene.tweens.add({

            targets: this.leftDoor,

            x:
                -this.width * 0.62,

            duration: 500,

            ease: "Cubic.easeInOut"
        });


        this.scene.tweens.add({

            targets: this.leftInner,

            x:
                -this.width * 0.62,

            duration: 500,

            ease: "Cubic.easeInOut"
        });


        this.scene.tweens.add({

            targets: this.rightDoor,

            x:
                this.width * 0.62,

            duration: 500,

            ease: "Cubic.easeInOut"
        });


        this.scene.tweens.add({

            targets: this.rightInner,

            x:
                this.width * 0.62,

            duration: 500,

            ease: "Cubic.easeInOut"
        });


        this.scene.tweens.add({

            targets: this.centerLine,

            alpha: 0,

            duration: 250
        });


        this.scene.tweens.add({

            targets: this.sensor,

            scale: 1.5,

            alpha: 0.2,

            duration: 300,

            yoyo: true,

            repeat: 1
        });
    }
}