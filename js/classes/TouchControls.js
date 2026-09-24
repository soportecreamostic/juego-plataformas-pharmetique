/**
 * TouchControls.js
 * Controles táctiles para Pharmetique
 *
 * Incluye:
 * - Joystick horizontal
 * - Botón de salto
 * - Botón de interacción E
 * - Soporte multitáctil
 * - Compatible con Player.js
 */

export default class TouchControls {

    constructor(scene) {

        this.scene = scene;

        // ==========================================
        // ESTADO DE LOS CONTROLES
        // ==========================================

        this.state = {
            left: false,
            right: false,
            jump: false
        };

        // Punteros activos por acción
        this.activePointers = {
            left: new Set(),
            right: new Set(),
            jump: new Set()
        };

        // Interacción
        this.interactRequested = false;
        this.interactButton = null;

        // Referencias de controles
        this.joystick = null;
        this.joystickBase = null;
        this.joystickKnob = null;
        this.jumpButton = null;

        this.buttons = [];

        // ==========================================
        // CONFIGURACIÓN DEL JOYSTICK
        // ==========================================

        this.joystickPointerId = null;

        this.joystickRadius = 52;
        this.joystickKnobRadius = 25;

        this.joystickCenterX = 0;
        this.joystickCenterY = 0;

        // ==========================================
        // MULTITÁCTIL
        // ==========================================

        this.scene.input.addPointer(2);

        // ==========================================
        // CREAR CONTROLES
        // ==========================================

        this.createControls();

        // ==========================================
        // EVENTOS GLOBALES
        // ==========================================

        this.scene.input.on(
            "pointermove",
            this.handlePointerMove,
            this
        );

        this.scene.input.on(
            "pointerup",
            this.handlePointerUp,
            this
        );

        this.scene.input.on(
            "pointerupoutside",
            this.handlePointerUp,
            this
        );

        console.log("TouchControls Pharmetique cargado");
    }


    // =========================================================
    // CREAR TODOS LOS CONTROLES
    // =========================================================

    createControls() {

        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        /*
         * Los controles se colocan tomando como referencia
         * el tamaño real del canvas.
         *
         * En un canvas 800x450:
         *
         * Joystick → 95, 386
         * Salto    → 650, 386
         * E        → 730, 386
         */

        const bottomY = height - 64;

        // Joystick
        this.createJoystick(
            95,
            bottomY
        );

        // Botón de salto
        this.jumpButton = this.createControlButton(
            width - 150,
            bottomY,
            "↑",
            "jump",
            0x00557F
        );

        // Botón de interacción
        this.interactButton = this.createControlButton(
            width - 70,
            bottomY,
            "E",
            "interact",
            0x7A2C8F
        );

        // La interacción comienza oculta
        this.setInteractAvailable(false);
    }


    // =========================================================
    // JOYSTICK
    // =========================================================

    createJoystick(x, y) {

        this.joystickCenterX = x;
        this.joystickCenterY = y;

        // Contenedor principal
        this.joystick = this.scene.add.container(x, y);

        this.joystick.setSize(
            this.joystickRadius * 2,
            this.joystickRadius * 2
        );

        this.joystick.setScrollFactor(0);
        this.joystick.setDepth(70);

        // ==========================================
        // BASE
        // ==========================================

        this.joystickBase = this.scene.add.circle(
            0,
            0,
            this.joystickRadius,
            0x00557F,
            0.88
        );

        this.joystickBase.setStrokeStyle(
            3,
            0x41C0F0,
            0.95
        );

        // ==========================================
        // CENTRO
        // ==========================================

        const center = this.scene.add.circle(
            0,
            0,
            8,
            0xFFFFFF,
            0.35
        );

        // ==========================================
        // PERILLA
        // ==========================================

        this.joystickKnob = this.scene.add.circle(
            0,
            0,
            this.joystickKnobRadius,
            0x41C0F0,
            0.95
        );

        this.joystickKnob.setStrokeStyle(
            3,
            0xFFFFFF,
            0.95
        );

        // ==========================================
        // AGREGAR ELEMENTOS
        // ==========================================

        this.joystick.add([
            this.joystickBase,
            center,
            this.joystickKnob
        ]);

        // Área táctil
        this.joystick.setInteractive();

        this.joystick.on(
            "pointerdown",
            this.handleJoystickDown,
            this
        );
    }


    // =========================================================
    // PRESIONAR JOYSTICK
    // =========================================================

    handleJoystickDown(pointer) {

        this.joystickPointerId = pointer.id;

        this.updateJoystick(pointer);

    }


    // =========================================================
    // MOVER JOYSTICK
    // =========================================================

    handlePointerMove(pointer) {

        if (
            this.joystickPointerId !== null &&
            pointer.id === this.joystickPointerId
        ) {
            this.updateJoystick(pointer);
        }
    }


    // =========================================================
    // ACTUALIZAR JOYSTICK
    // =========================================================

    updateJoystick(pointer) {

        if (!this.joystick) {
            return;
        }

        const dx =
            pointer.x -
            this.joystickCenterX;

        /*
         * El joystick de Pharmetique controla
         * únicamente el movimiento horizontal.
         */

        let knobX = dx;

        const maxDistance =
            this.joystickRadius -
            this.joystickKnobRadius;

        knobX = Phaser.Math.Clamp(
            knobX,
            -maxDistance,
            maxDistance
        );

        this.joystickKnob.x = knobX;

        // Zona muerta
        const deadZone = 10;

        if (knobX < -deadZone) {

            this.state.left = true;
            this.state.right = false;

        }
        else if (knobX > deadZone) {

            this.state.right = true;
            this.state.left = false;

        }
        else {

            this.state.left = false;
            this.state.right = false;
        }
    }


    // =========================================================
    // SOLTAR JOYSTICK
    // =========================================================

    releaseJoystick(pointerId) {

        if (
            this.joystickPointerId === pointerId
        ) {

            this.joystickPointerId = null;

            this.joystickKnob.x = 0;

            this.state.left = false;
            this.state.right = false;
        }
    }


    // =========================================================
    // BOTONES
    // =========================================================

    createControlButton(
        x,
        y,
        label,
        action,
        backgroundColor
    ) {

        const button = this.scene.add.container(
            x,
            y
        );

        button.setSize(58, 58);

        button.setScrollFactor(0);
        button.setDepth(70);

        // ==========================================
        // CÍRCULO
        // ==========================================

        const circle = this.scene.add.circle(
            0,
            0,
            29,
            backgroundColor,
            0.92
        );

        circle.setStrokeStyle(
            3,
            0xFFFFFF,
            0.85
        );

        // ==========================================
        // TEXTO
        // ==========================================

        const text = this.scene.add.text(
            0,
            0,
            label,
            {
                fontFamily: "Arial",
                fontSize: action === "jump"
                    ? "30px"
                    : "22px",
                fontStyle: "bold",
                color: "#FFFFFF"
            }
        );

        text.setOrigin(0.5);

        // ==========================================
        // AGREGAR
        // ==========================================

        button.add([
            circle,
            text
        ]);

        button.setInteractive();

        // ==========================================
        // PRESIONAR
        // ==========================================

        button.on(
            "pointerdown",
            pointer => {

                if (action === "interact") {

                    this.interactRequested = true;

                }
                else {

                    this.activePointers[action].add(
                        pointer.id
                    );

                    this.updateActionState(action);
                }

                button.setScale(0.92);
            }
        );

        // ==========================================
        // SOLTAR
        // ==========================================

        button.on(
            "pointerup",
            pointer => {

                if (action !== "interact") {

                    this.activePointers[action].delete(
                        pointer.id
                    );

                    this.updateActionState(action);
                }

                button.setScale(1);
            }
        );

        // ==========================================
        // SALIR DEL BOTÓN
        // ==========================================

        button.on(
            "pointerout",
            pointer => {

                if (action !== "interact") {

                    this.activePointers[action].delete(
                        pointer.id
                    );

                    this.updateActionState(action);
                }

                button.setScale(1);
            }
        );

        // ==========================================
        // SOLTAR FUERA
        // ==========================================

        button.on(
            "pointerupoutside",
            pointer => {

                if (action !== "interact") {

                    this.activePointers[action].delete(
                        pointer.id
                    );

                    this.updateActionState(action);
                }

                button.setScale(1);
            }
        );

        this.buttons.push(button);

        return button;
    }


    // =========================================================
    // ACTUALIZAR ESTADO DE UNA ACCIÓN
    // =========================================================

    updateActionState(action) {

        this.state[action] =
            this.activePointers[action].size > 0;
    }


    // =========================================================
    // SOLTAR CUALQUIER PUNTERO
    // =========================================================

    handlePointerUp(pointer) {

        // Joystick
        this.releaseJoystick(pointer.id);

        // Botones
        for (const action of [
            "left",
            "right",
            "jump"
        ]) {

            if (
                this.activePointers[action].has(
                    pointer.id
                )
            ) {

                this.activePointers[action].delete(
                    pointer.id
                );

                this.updateActionState(action);
            }
        }
    }


    // =========================================================
    // BOTÓN DE INTERACCIÓN
    // =========================================================

    setInteractAvailable(available) {

        if (!this.interactButton) {
            return;
        }

        if (available) {

            this.interactButton.setVisible(true);

            this.interactButton.input.enabled = true;

            this.interactButton.setScale(1);

        }
        else {

            this.interactButton.setVisible(false);

            if (this.interactButton.input) {
                this.interactButton.input.enabled = false;
            }

            this.interactRequested = false;

            this.interactButton.setScale(1);
        }
    }


    // =========================================================
    // CONSUMIR INTERACCIÓN
    // =========================================================

    consumeInteract() {

        const requested =
            this.interactRequested;

        this.interactRequested = false;

        return requested;
    }


    // =========================================================
    // CONTROLES PARA PLAYER.JS
    // =========================================================

    getPlayerControls() {

        return {

            left: {
                isDown: this.state.left
            },

            right: {
                isDown: this.state.right
            },

            up: {
                isDown: this.state.jump
            }
        };
    }


    // =========================================================
    // LIBERAR TODOS LOS CONTROLES
    // =========================================================

    releaseAll() {

        this.joystickPointerId = null;

        if (this.joystickKnob) {
            this.joystickKnob.x = 0;
        }

        this.state.left = false;
        this.state.right = false;
        this.state.jump = false;

        this.activePointers.left.clear();
        this.activePointers.right.clear();
        this.activePointers.jump.clear();

        this.interactRequested = false;

        for (const button of this.buttons) {
            button.setScale(1);
        }
    }


    // =========================================================
    // DESTRUIR CONTROLES
    // =========================================================

    destroy() {

        this.releaseAll();

        // Eventos globales
        this.scene.input.off(
            "pointermove",
            this.handlePointerMove,
            this
        );

        this.scene.input.off(
            "pointerup",
            this.handlePointerUp,
            this
        );

        this.scene.input.off(
            "pointerupoutside",
            this.handlePointerUp,
            this
        );

        // Destruir joystick
        if (this.joystick) {
            this.joystick.destroy();
        }

        // Destruir botones
        for (const button of this.buttons) {
            if (button) {
                button.destroy();
            }
        }

        // Limpiar referencias
        this.joystick = null;
        this.joystickBase = null;
        this.joystickKnob = null;

        this.jumpButton = null;
        this.interactButton = null;

        this.buttons = [];
    }
}