import 'phaser';

export default class ExampleScene extends Phaser.Scene {
    constructor() {
        super('Example');
    }

    preload() {
        this.load.image('Fondo', 'assets/Fondo.png');
    }

    create() {
        const Fondo = this.add.image(400, 250, 'Fondo');
    }
}