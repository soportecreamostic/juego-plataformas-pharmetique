export default class Platform {

    constructor(scene, x, y, width, height = 20) {

        this.scene = scene;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.create();
    }


    create() {

        this.platform = this.scene.physics.add.staticImage(
            this.x,
            this.y,
            null
        );

        this.platform
            .setDisplaySize(this.width, this.height)
            .refreshBody();

        // El cuerpo físico se mantiene invisible. La plataforma
        // se dibuja aparte para tener un estilo de laboratorio.
        this.platform.setVisible(false);

        const shadow = this.scene.add.rectangle(
            0,
            4,
            this.width,
            this.height,
            0x003B58,
            0.14
        );

        const body = this.scene.add.rectangle(
            0,
            0,
            this.width,
            this.height,
            0x00557F
        ).setStrokeStyle(2, 0x41C0F0);

        const topLine = this.scene.add.rectangle(
            0,
            (-this.height / 2) + 4,
            this.width,
            Math.min(8, this.height),
            0x8DDEE9
        );

        this.visual = this.scene.add.container(
            this.x,
            this.y,
            [shadow, body, topLine]
        ).setDepth(0);
    }


    getObject() {

        return this.platform;
    }
}
