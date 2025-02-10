import 'phaser'
export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.image('Background_main', 'assets/images/Background-main.png');
        this.load.image('Background', 'assets/images/Background.png');
        this.load.image('Board', 'assets/images/Board.png');
        this.load.image('ImgX', 'assets/images/X.png');
        this.load.image('ImgO', 'assets/images/O.png');
        this.load.image('Home', 'assets/images/Home.png')
        this.load.image('Particle', 'assets/images/Particle.png');
        this.load.image('Play', 'assets/images/Play.png');
        this.load.image('Reload', 'assets/images/Reload.png');
        this.load.audio('Music', 'assets/sounds/Music.mp3');
        this.load.audio('Tap', 'assets/sounds/Tap.mp3');
        this.load.audio('Win', 'assets/sounds/Win.mp3');
    }

    create() {
        this.scene.start('Game');
    }
}
