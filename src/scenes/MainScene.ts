import 'phaser';
import config from '../config/config';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('Main');
    }

    preload() {
        this.load.image('Background_main', 'assets/Background-main.png');
        this.load.image('Play', 'assets/Play.png');
        this.load.audio('Tap', 'assets/Tap.mp3');
    }

    create() {
        const { width, height } = config;

        const background = this.add.image(width / 2, height / 2, 'Background_main');

        const buttonPlay = this.add.image(width / 2, height / 1.2, 'Play')
            .setScale(0.10)
            .setInteractive();

        const title = this.add.text(width / 2, height / 3, 'TIC-TAC-TOE', {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        });
        title.setOrigin(0.5, 0.5);

        buttonPlay.on('pointerover', () => {
            buttonPlay.setScale(0.15);
        });

        buttonPlay.on('pointerout', () => {
            buttonPlay.setScale(0.10);
            this.sound.play('Tap');
            this.scene.stop('Main')
            this.scene.start('Select');  // Cambia a la escena del juego
        });
    }
}