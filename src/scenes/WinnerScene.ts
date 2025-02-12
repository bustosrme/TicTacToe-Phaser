import 'phaser';
import config from '../config/config';

interface SceneData {
    winner: string | null;
}

export default class WinnerScene extends Phaser.Scene {
    title: string
    winner: string | null

    constructor() {
        super('Winner');
        this.title = 'Empate';
        this.winner = null;
    }

    init(data: SceneData) {
        if (data?.winner) {
            this.title = 'Ganador';
            this.winner = data.winner;
        }
    }

    create() {
        const { width, height } = config;

        // Add background image
        const background = this.add.image(width / 2, height / 2, 'Background');

        // Add particle effects
        this.add.particles(0, -50, 'Particle', {
            x: { min: 0, max: width },
            speed: { min: 50, max: 100 },
            angle: { min: 0, max: 360 },
            gravityY: 200,
            lifespan: 5000,
            quantity: 2,
            frequency: 100,
            scale: { start: 0.1, end: 0 },
        });

        let graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);

        let padding = 20;
        let textWidth = width - 100;
        let textHeight = 150;

        // Draw rounded rectangle for title
        graphics.fillRoundedRect(50 - padding, 50 - padding, textWidth + padding * 2, textHeight + padding * 2, 20)
            .setPosition(0, this.winner ? 25 : 0);

        const title = this.add.text(width / 2, height / 7, this.title, {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#000000',
            align: 'center',
        });
        title.setOrigin(0.5, 0);

        // Add winner image if there's a winner
        if (this.winner) {
            let imgWinner = this.add.image(width / 2, 2 * height / 7, `Img${this.winner}`)
                .setScale(0.15);
        }

        // Add background for buttons
        let backgroundButton1 = this.add.graphics();
        backgroundButton1.fillStyle(0xFFFFFF, 1);
        backgroundButton1.fillRoundedRect(30, 430, 120, 120, 20);

        let backgroundButton2 = this.add.graphics();
        backgroundButton2.fillStyle(0xFFFFFF, 1);
        backgroundButton2.fillRoundedRect(212, 430, 120, 120, 20);

        // Add home button
        const buttonHome = this.add.image(width / 4, height / 1.3, 'Home')
            .setScale(0.035)
            .setInteractive();
        // Add reload button
        const buttonReload = this.add.image((3 * width) / 4, height / 1.3, 'Reload')
            .setScale(0.15)
            .setInteractive();

        // Home button hover effect
        buttonHome.on('pointerover', () => {
            buttonHome.setScale(0.045);
        });

        buttonHome.on('pointerout', () => {
            buttonHome.setScale(0.035);
        });
        // Home button click event
        buttonHome.on('pointerdown', () => {
            this.handleClick('Main');
        });

        // Reload button hover effect
        buttonReload.on('pointerover', () => {
            buttonReload.setScale(0.20);
        });

        buttonReload.on('pointerout', () => {
            buttonReload.setScale(0.15);
        });
        // Reload button click event
        buttonReload.on('pointerdown', () => {
            this.handleClick('Select');
        });
    }

    handleClick(next: string) {
        this.sound.play('Tap'); // Play tap sound
        this.scene.stop('Winner'); // Stop current scene
        this.scene.start(next); // Start next scene
    }
}