import 'phaser';
import config from '../config/config';

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super('Select');
    }

    create() {
        const { width, height } = config;

        const background = this.add.image(width / 2, height / 2, 'Background'); // Add background image

        let padding = 20;
        let textWidth = width - 100;
        let textHeight = 150;

        
        // Add white rounded rectangles for title and buttons
        let graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(50 - padding, 0 - padding, textWidth + padding * 2, textHeight + padding * 2, 20)
            .setPosition(0, 90);

        let backgroundButtonX = this.add.graphics();
        backgroundButtonX.fillStyle(0xFFFFFF, 1);
        backgroundButtonX.fillRoundedRect(30, 430, 120, 120, 20);

        let backgroundButtonY = this.add.graphics();
        backgroundButtonY.fillStyle(0xFFFFFF, 1);
        backgroundButtonY.fillRoundedRect(212, 430, 120, 120, 20);

        const title = this.add.text(width / 2, height / 4, '¿Quién juega primero?', {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#000000',
            align: 'center',
            wordWrap: { width: textWidth, useAdvancedWrap: true }
        });
        title.setOrigin(0.5, 0.5);

        // Add buttons to select X or O
        const buttonX = this.add.image(width / 4, height / 1.3, 'ImgX')
            .setScale(0.3)
            .setInteractive();

        const buttonO = this.add.image((3 * width) / 4, height / 1.3, 'ImgO')
            .setScale(0.3)
            .setInteractive();

        // Add hover effect for button X
        buttonX.on('pointerover', () => {
            buttonX.setScale(0.35);
        });

        // Remove hover effect for button X
        buttonX.on('pointerout', () => {
            buttonX.setScale(0.3);
        });

        // Handle click event for button X
        buttonX.on('pointerdown', () => {
            this.handleClick('X');
        });

        // Add hover effect for button O
        buttonO.on('pointerover', () => {
            buttonO.setScale(0.35);
        });

        // Remove hover effect for button O
        buttonO.on('pointerout', () => {
            buttonO.setScale(0.30);
        });

        // Handle click event for button O
        buttonO.on('pointerdown', () => {
            this.handleClick('O');
        });
    }

    // Handle button click event
    handleClick(button: string) {
        this.sound.play('Tap');
        this.scene.stop('Select');
        this.scene.start('Game', { buttonPressed: button });
    }
}