import 'phaser';
import config from '../config/config';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('Main');
    }

    create() {
        const { width, height } = config;

        // Add the background image to the center of the scene
        const background = this.add.image(width / 2, height / 2, 'Background_main');

        // Create a background for the play button
        const backgroundButton = this.add.graphics();
        backgroundButton.fillStyle(0xFFFFFF, 1);
        backgroundButton.fillRoundedRect(width / 4, 440, 180, 180, 90);

        const buttonPlay = this.add.image(width / 2, height / 1.2, 'Play')
            .setScale(0.10)
            .setInteractive();

        // Add the title text to the scene
        const title = this.add.text(width / 2, height / 3, 'TIC-TAC-TOE', {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        });
        title.setOrigin(0.5, 0.5); // Center the origin of the title text

        // Add pointerover event to scale up the play button
        buttonPlay.on('pointerover', () => {
            buttonPlay.setScale(0.15);
        });

        // Add pointerout event to scale down the play button
        buttonPlay.on('pointerout', () => {
            buttonPlay.setScale(0.10);
        });

        // Add pointerdown event to play a sound and switch scenes
        buttonPlay.on('pointerdown', () => {
            this.sound.play('Tap'); // Play tap sound
            this.scene.stop('Main'); // Stop the current scene
            this.scene.start('Select'); // Start the 'Select' scene
        });
    }
}