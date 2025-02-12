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
            this.winner = data.winner
        }
    }

    create() {
        const { width, height } = config;

        const background = this.add.image(width / 2, height / 2, 'Background');

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

        graphics.fillRoundedRect(50 - padding, 50 - padding, textWidth + padding * 2, textHeight + padding * 2, 20)
            .setPosition(0, this.winner ? 25 : 0)

        const title = this.add.text(width / 2, height / 7, this.title, {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#000000',
            align: 'center',
        });
        title.setOrigin(0.5, 0);

        if (this.winner) {
            let imgWinner = this.add.image(width / 2, 2 * height / 7, `Img${this.winner}`)
                .setScale(0.15);
        }

        let backgroundButton1 = this.add.graphics();
        backgroundButton1.fillStyle(0xFFFFFF, 1);
        backgroundButton1.fillRoundedRect(30, 430, 120, 120, 20);

        let backgroundButton2 = this.add.graphics();
        backgroundButton2.fillStyle(0xFFFFFF, 1);
        backgroundButton2.fillRoundedRect(212, 430, 120, 120, 20);

        const buttonHome = this.add.image(width / 4, height / 1.3, 'Home')
            .setScale(0.035)
            .setInteractive();
        const buttonReload = this.add.image((3 * width) / 4, height / 1.3, 'Reload')
            .setScale(0.15)
            .setInteractive();

        buttonHome.on('pointerover', () => {
            buttonHome.setScale(0.045);
        });

        buttonHome.on('pointerout', () => {
            buttonHome.setScale(0.035);
        });
        buttonHome.on('pointerdown', () => {
            this.handleClick('Main');
        });

        buttonReload.on('pointerover', () => {
            buttonReload.setScale(0.20);
        });

        buttonReload.on('pointerout', () => {
            buttonReload.setScale(0.15);
        });
        buttonReload.on('pointerdown', () => {
            this.handleClick('Select')
        });
    }

    handleClick(next: string) {
        this.sound.play('Tap');
        this.scene.stop('Winner');
        this.scene.start(next);
    }
}