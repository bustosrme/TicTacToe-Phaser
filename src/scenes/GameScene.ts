import 'phaser';
import config from '../config/config';

interface SceneData {
    buttonPressed: string;
}

export default class GameScene extends Phaser.Scene {

    board: (string | null)[][];
    checking: Boolean;
    counter: number;
    currentPlayer: string;

    constructor() {
        super('Game');
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.checking = false;
        this.counter = 0;
        this.currentPlayer = '';
    }

    init(data: SceneData) {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.counter = 0;
        this.currentPlayer = '';
        if (!data.buttonPressed) {
            this.scene.stop('Game');
            this.scene.start('Main');
        }
        this.currentPlayer = data.buttonPressed;
    }

    create() {
        const { width, height } = config
        const cellSize = 103

        const background = this.add.image(width / 2, height / 2, 'Background');

        const title = this.add.text(width / 2, height / 8, 'Turno del jugador', {
            fontSize: '48px',
            fontFamily: 'Monserrat',
            color: '#000000',
            align: 'center',
            wordWrap: { width: width - 100, useAdvancedWrap: true }
        });
        title.setOrigin(0.5, 0.5);

        let imgCurrentPlayer = this.add.sprite(width / 2, height / 4, `Img${this.currentPlayer}`)
            .setScale(0.15);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * cellSize + 76
                const y = row * cellSize + 360;

                const cell = this.add.rectangle(x, y, cellSize, cellSize, 0xFFFFFF)
                    .setInteractive()

                cell.on('pointerdown', async () => {
                    await this.handleCellClick(row, col, x, y);
                    imgCurrentPlayer.setTexture(`Img${this.currentPlayer}`)
                });
            }
        }

        const board = this.add.image(width / 2, 463, 'Board')
            .setScale(0.5);

    }

    handleCellClick(row: number, col: number, x: number, y: number) {
        if (this.board[row][col] !== null || this.checking) {
            return;
        }
        this.sound.play('Tap')
        this.board[row][col] = this.currentPlayer;

        const img = this.add.image(x, y - 50, `Img${this.currentPlayer}`)
            .setScale(0.2);

        this.tweens.add({
            targets: img,
            y: y,
            duration: 500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                this.checkWinner();
            }
        });
        this.counter++;
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    checkWinner() {
        this.checking = true;
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                this.finishGame(this.board[i][0]);
                return;
            }
            if (this.board[0][i] && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                this.finishGame(this.board[0][i]);
                return;
            }
        }
        if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            this.finishGame(this.board[0][0]);
            return;
        }
        if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            this.finishGame(this.board[0][2]);
            return;
        }

        if (this.counter === 9) {
            this.finishGame(null)
            return
        }
        this.checking = false;
    }

    finishGame(winner: string | null) {
        this.checking = false;
        this.sound.play('Win');
        
        this.scene.stop('Game');
        this.scene.start('Winner', { winner });
    }
}
