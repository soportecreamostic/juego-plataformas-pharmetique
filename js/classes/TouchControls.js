// ==========================================
// CONTROLES TÁCTILES PARA MÓVIL
// ==========================================

export default class TouchControls {

    constructor(scene) {

        this.scene = scene;

        // ======================================
        // ESTADO DEL JUGADOR
        // ======================================

        this.state = {
            left: false,
            right: false,
            jump: false
        };


        // ======================================
        // POINTERS ACTIVOS
        // ======================================

        this.activePointers = {
            left: new Set(),
            right: new Set(),
            jump: new Set()
        };


        // ======================================
        // INTERACCIÓN
        // ======================================

        this.interactRequested = false;
        this.interactButton = null;


        // ======================================
        // STICK
        // ======================================

        this.joystickPointerId = null;
        this.joystickRadius = 52;
        this.joystickKnobRadius = 25;


        // ======================================
        // POINTERS MÚLTIPLES
        // ======================================

        this.scene.input.addPointer(2);


        // ======================================
        // CREAR CONTROLES
        // ======================================

        this.createButtons();


        // ======================================
        // COMPROBAR QUE LA CLASE CARGÓ
        // ======================================

        console.log(
            "TouchControls CARGADO"
        );


        // ======================================
        // EVENTOS
        // ======================================

        this.scene.input.on(
            "pointermove",
            this.handlePointerMove,
            this
        );

        this.scene.input.on(
            "pointerup",
            this.releasePointer,
            this
        );

        this.scene.input.on(
            "pointerout",
            this.releasePointer,
            this
        );


        // ======================================
        // ACTUALIZACIÓN AUTOMÁTICA DEL BOTÓN E
        // ======================================

        this.scene.events.on(
            "update",
            this.updateInteractionButton,
            this
        );
    }


    // ==========================================
    // CREAR CONTROLES
    // ==========================================

    createButtons() {

        this.scene.input.on(
            "pointerup",
            this.releasePointer,
            this
        );

        // Stick
        this.createJoystick(
            95,
            386
        );


        // Salto
        this.createControlButton(
            650,
            386,
            "↑",
            "jump",
            0x00557F,
            "#FFFFFF"
        );


        // Interacción
        this.createControlButton(
            730,
            386,
            "E",
            "interact",
            0x7A2C8F,
            "#FFFFFF"
        );
    }

    updateInteractionButton() {

        if (
            !this.interactButton ||
            !this.scene
        ) {
            return;
        }

        const interactionAvailable =
            this.scene.children.list.some(
                (object) =>
                    object.prompt &&
                    object.prompt.visible
            );

        this.interactButton.setVisible(
            interactionAvailable
        );

        if (interactionAvailable) {

            this.interactButton.setInteractive({
                useHandCursor: true
            });

        } else {

            this.interactButton.disableInteractive();
        }
    }

    setInteractAvailable(available) {

        if (!this.interactButton) {
            return;
        }

        this.interactButton.setVisible(
            available
        );

        if (!available) {
            this.interactRequested = false;
            this.interactButton.disableInteractive();
        } else {
            this.interactButton.setInteractive({
                useHandCursor: true
            });
        }
    }


    // ==========================================
    // STICK ANALÓGICO
    // ==========================================

    createJoystick(x, y) {

        const baseOuter =
            this.scene.add.circle(
                0,
                0,
                52,
                0x00557F,
                0.25
            );

        baseOuter.setStrokeStyle(
            3,
            0x41C0F0,
            0.95
        );


        const baseInner =
            this.scene.add.circle(
                0,
                0,
                39,
                0xFFFFFF,
                0.88
            );

        baseInner.setStrokeStyle(
            2,
            0x41C0F0,
            0.9
        );


        const centerLine =
            this.scene.add.rectangle(
                0,
                0,
                58,
                5,
                0x41C0F0,
                0.28
            );


        const knob =
            this.scene.add.circle(
                0,
                0,
                25,
                0x41C0F0,
                0.95
            );

        knob.setStrokeStyle(
            3,
            0xFFFFFF,
            0.95
        );


        const knobCenter =
            this.scene.add.circle(
                0,
                0,
                7,
                0xFFFFFF,
                0.9
            );


        this.joystick =
            this.scene.add.container(
                x,
                y,
                [
                    baseOuter,
                    baseInner,
                    centerLine,
                    knob,
                    knobCenter
                ]
            )
            .setSize(104, 104)
            .setScrollFactor(0)
            .setDepth(70)
            .setInteractive();


        this.joystickX = x;

        this.joystickY = y;

        this.joystickKnob = knob;


        this.joystick.on(
            "pointerdown",
            (pointer) => {

                this.joystickPointerId =
                    pointer.id;

                this.updateJoystick(
                    pointer
                );
            }
        );


        this.joystickKnob.x = 0;
    }


    // ==========================================
    // MOVIMIENTO DEL STICK
    // ==========================================

    handlePointerMove(pointer) {

        if (
            this.joystickPointerId !==
            pointer.id
        ) {
            return;
        }

        this.updateJoystick(
            pointer
        );
    }


    updateJoystick(pointer) {

        const localX =
            pointer.x -
            this.joystickX;


        // Solo movimiento horizontal
        const clampedX =
            Phaser.Math.Clamp(
                localX,
                -35,
                35
            );


        this.joystickKnob.x =
            clampedX;


        const threshold =
            10;


        this.state.left =
            false;

        this.state.right =
            false;


        if (
            clampedX <
            -threshold
        ) {

            this.state.left =
                true;

        } else if (
            clampedX >
            threshold
        ) {

            this.state.right =
                true;
        }
    }


    // ==========================================
    // BOTONES
    // ==========================================

    createControlButton(
        x,
        y,
        label,
        action,
        backgroundColor,
        textColor
    ) {

        const background =
            this.scene.add.circle(
                0,
                0,
                29,
                backgroundColor,
                0.92
            );

        background.setStrokeStyle(
            3,
            0x41C0F0,
            0.95
        );


        const text =
            this.scene.add.text(
                0,
                0,
                label,
                {
                    fontFamily: "Arial",
                    fontSize:
                        action === "interact"
                            ? "21px"
                            : "25px",
                    fontStyle: "bold",
                    color: textColor
                }
            )
                .setOrigin(0.5);


        const button =
            this.scene.add.container(
                x,
                y,
                [
                    background,
                    text
                ]
            )
                .setSize(58, 58)
                .setScrollFactor(0)
                .setDepth(70)
                .setInteractive({
                    useHandCursor: true
                });


        // ======================================
        // BOTÓN E COMIENZA OCULTO
        // ======================================

        if (
            action === "interact"
        ) {

            this.interactButton =
                button;

            this.interactButton.setVisible(
                false
            );

            this.interactButton.input.enabled =
                false;
        }


        // ======================================
        // PRESIONAR BOTÓN
        // ======================================

        button.on(
            "pointerdown",
            (pointer) => {

                if (
                    action === "interact"
                ) {

                    console.log(
                        "TOQUE REAL AL BOTÓN E"
                    );

                    if (
                        !this.interactButton ||
                        !this.interactButton.visible
                    ) {
                        return;
                    }

                    this.interactRequested =
                        true;

                    button.setScale(
                        0.92
                    );

                    return;
                }


                this.activePointers[
                    action
                ].add(
                    pointer.id
                );


                this.updateState(
                    action
                );


                button.setScale(
                    0.92
                );
            }
        );


        // ======================================
        // SOLTAR BOTÓN
        // ======================================

        button.on(
            "pointerup",
            (pointer) => {

                this.activePointers[
                    action
                ]?.delete(
                    pointer.id
                );


                this.updateState(
                    action
                );


                button.setScale(
                    1
                );
            }
        );


        // ======================================
        // SALIR DEL BOTÓN
        // ======================================

        button.on(
            "pointerout",
            (pointer) => {

                this.activePointers[
                    action
                ]?.delete(
                    pointer.id
                );


                this.updateState(
                    action
                );


                button.setScale(
                    1
                );
            }
        );


        // ======================================
        // DEVOLVER EL BOTÓN
        // ======================================

        return button;
    }


    // ==========================================
    // ACTUALIZAR ESTADO
    // ==========================================

    updateState(action) {

        if (
            action === "interact"
        ) {
            return;
        }


        this.state[action] =
            this.activePointers[
                action
            ].size > 0;
    }


    // ==========================================
    // DETECTAR INTERACCIÓN AUTOMÁTICAMENTE
    // ==========================================

    updateInteractionButton() {

        if (
            !this.interactButton
        ) {
            return;
        }


        let interactionAvailable =
            false;


        // ======================================
        // BUSCAR OBJETOS CON PROMPT VISIBLE
        // ======================================

        const sceneObjects =
            this.scene.children.list;


        for (
            const object of sceneObjects
        ) {

            // ----------------------------------
            // OBJETO DIRECTO
            // ----------------------------------

            if (
                object.prompt &&
                object.prompt.visible
            ) {

                interactionAvailable =
                    true;

                break;
            }


            // ----------------------------------
            // OBJETO DENTRO DE UNA CLASE
            // ----------------------------------

            if (
                object.trigger &&
                object.prompt &&
                object.prompt.visible
            ) {

                interactionAvailable =
                    true;

                break;
            }
        }


        // ======================================
        // ACTUALIZAR BOTÓN E
        // ======================================

        this.setInteractAvailable(
            interactionAvailable
        );
    }


    // ==========================================
    // MOSTRAR / OCULTAR E
    // ==========================================

    setInteractAvailable(
        available
    ) {

        if (
            !this.interactButton
        ) {
            return;
        }


        if (available) {

            this.interactButton.setVisible(
                true
            );

            this.interactButton.setInteractive(
                new Phaser.Geom.Rectangle(
                    -29,
                    -29,
                    58,
                    58
                ),
                Phaser.Geom.Rectangle.Contains
            );

            this.interactButton.input.enabled =
                true;

        } else {

            this.interactButton.setVisible(
                false
            );

            this.interactButton.input.enabled =
                false;

            this.interactButton.setScale(
                1
            );
        }
    }


    // ==========================================
    // LIBERAR POINTER
    // ==========================================

    releasePointer(pointer) {

        // --------------------------------------
        // STICK
        // --------------------------------------

        if (
            this.joystickPointerId ===
            pointer.id
        ) {

            this.joystickPointerId =
                null;


            this.joystickKnob.x =
                0;


            this.state.left =
                false;


            this.state.right =
                false;
        }


        // --------------------------------------
        // BOTONES
        // --------------------------------------

        Object.keys(
            this.activePointers
        ).forEach(
            (action) => {

                this.activePointers[
                    action
                ].delete(
                    pointer.id
                );


                this.updateState(
                    action
                );
            }
        );
    }


    // ==========================================
    // CONTROLES PARA PLAYER
    // ==========================================

    getPlayerControls() {

        return {

            left: {
                isDown:
                    this.state.left
            },

            right: {
                isDown:
                    this.state.right
            },

            up: {
                isDown:
                    this.state.jump
            }

        };
    }


    // ==========================================
    // CONSUMIR INTERACCIÓN
    // ==========================================

    consumeInteract() {

        const requested =
            this.interactRequested;


        console.log(
            "consumeInteract:",
            requested
        );


        this.interactRequested =
            false;


        return requested;
    }


    // ==========================================
    // DESTRUIR
    // ==========================================

    destroy() {

        this.scene.events.off(
            "update",
            this.updateInteractionButton,
            this
        );


        this.scene.input.off(
            "pointermove",
            this.handlePointerMove,
            this
        );


        this.scene.input.off(
            "pointerup",
            this.releasePointer,
            this
        );


        this.scene.input.off(
            "pointerout",
            this.releasePointer,
            this
        );
    }
}