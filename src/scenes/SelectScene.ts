import 'phaser';
import config from '../config/config';

export default class SelectScene extends Phaser.Scene {
    constructor() {
        super('Select');
    }

    create() {
        const { width, height } = config;

        const background = this.add.image(width / 2, height / 2, 'Background');

        let padding = 20;
        let textWidth = width - 100
        let textHeight = 150;

        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.2);
        graphics.fillRoundedRect(50 - padding, 50 - padding, textWidth + padding * 2, textHeight + padding * 2, 20)
            .setPosition(0, 90)

        let backgroundButtonX = this.add.graphics();
        backgroundButtonX.fillStyle(0xFFFFFF, 1);
        backgroundButtonX.fillRoundedRect(30, 430, 120, 120, 20);

        let backgroundButtonY = this.add.graphics();
        backgroundButtonY.fillStyle(0xFFFFFF, 1);
        backgroundButtonY.fillRoundedRect(212, 430, 120, 120, 20);

        const title = this.add.text(width / 2, height / 3, '¿Quién juega primero?', {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#000000',
            align: 'center',
            wordWrap: { width: textWidth, useAdvancedWrap: true }
        });
        title.setOrigin(0.5, 0.5);

        const buttonX = this.add.image(width / 4, height / 1.3, 'ImgX')
            .setScale(0.3)
            .setInteractive();
        const buttonO = this.add.image((3 * width) / 4, height / 1.3, 'ImgO')
            .setScale(0.3)
            .setInteractive();

        buttonX.on('pointerover', () => {
            buttonX.setScale(0.35);
        });

        buttonX.on('pointerout', () => {
            buttonX.setScale(0.3);
        });
        buttonX.on('pointerdown', () => {
            this.handleClick('X')
        });

        buttonO.on('pointerover', () => {
            buttonO.setScale(0.35);
        });

        buttonO.on('pointerout', () => {
            buttonO.setScale(0.30);
        });
        buttonO.on('pointerdown', () => {
            this.handleClick('O')
        });
    }

    handleClick(button: string) {
        this.sound.play('Tap');
        this.scene.stop('Select');
        this.scene.start('Game', { buttonPressed: button });
    }
}