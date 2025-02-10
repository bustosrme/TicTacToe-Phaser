import 'phaser'
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.image('Background_main', 'assets/Background-main.png');
        this.load.image('Background', 'assets/Background.png');
        this.load.image('Board', 'assets/Board.png');
        this.load.image('ImgX', 'assets/X.png');
        this.load.image('ImgO', 'assets/O.png');
        this.load.image('Home', 'assets/Home.png')
        this.load.image('Particle', 'assets/Particle.png');
        this.load.image('Play', 'assets/Play.png');
        this.load.image('Reload', 'assets/Reload.png');
        this.load.audio('Tap', 'assets/Tap.mp3');
        this.load.audio('Win', 'assets/Win.mp3');
    }

    create() {
        this.scene.start('Main');
    }
}
