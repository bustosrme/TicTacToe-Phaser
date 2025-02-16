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
    timeLeft: number;
    timeLimit: number;

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
        this.timeLimit = 10;
        this.timeLeft = this.timeLimit;
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
        const cellSize = 83;

        this.add.image(width / 2, height / 2, 'Background');
        // Play background music
        this.sound.add('Music', { loop: true }).play();

        // Add background for the timer
        let graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(4 * width / 13, height / 10, 140, 50, 25)

        const titleTime = this.add.text(width / 2, height / 7, ``, {
            font: '500 36px Montserrat',
            color: '#000000',
        }).setOrigin(0.5);

        const title = this.add.text(width / 2, height / 3, ``, {
            font: 'Bold 36px Montserrat',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: width - 100, useAdvancedWrap: true }
        });
        title.setOrigin(0.5, 1);

        // Add timer event
        const timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
            args: [titleTime, title]
        });

        // Add graphics for the board background
        let backgroundGraphics = this.add.graphics();
        backgroundGraphics.fillStyle(0xFFFFFF, 1);
        backgroundGraphics.fillRoundedRect(width / 8, 7 * height / 15 - 3, cellSize * 3 + 20, cellSize * 3 + 20, 25)

        // Create the board cells
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * cellSize + 97
                const y = row * cellSize + 347;

                const cell = this.add.rectangle(x, y, cellSize, cellSize, 0xFFFFFF)
                    .setInteractive()

                cell.on('pointerdown', async () => {
                    await this.handleCellClick(row, col, x, y);
                });
            }
        }

        const board = this.add.image(width / 2, 430, 'Board')
            .setScale(0.4);
    }

    // Update the timer and switch player if time runs out
    updateTimer(titleTime: Phaser.GameObjects.Text, title: Phaser.GameObjects.Text) {
        this.timeLeft--;
        title.setText(`Turno del jugador ${this.currentPlayer}`)
        titleTime.setText(`0:0${this.timeLeft}`);

        if (this.timeLeft <= 0) {
            this.timeLeft = this.timeLimit;
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    handleCellClick(row: number, col: number, x: number, y: number) {
        // Check if the cell is already occupied or if a winner is being checked
        if (this.board[row][col] !== null || this.checking) {
            return;
        }
        this.sound.play('Tap')
        this.timeLeft = this.timeLimit;
        this.board[row][col] = this.currentPlayer;

        const img = this.add.image(x, y - 50, `Img${this.currentPlayer}`)
            .setScale(0.15);

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
        // Check rows and columns for a winner
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
        // Check diagonals for a winner
        if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            this.finishGame(this.board[0][0]);
            return;
        }
        if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            this.finishGame(this.board[0][2]);
            return;
        }

        // Check for a draw
        if (this.counter === 9) {
            this.finishGame(null)
            return
        }
        this.checking = false;
    }

    finishGame(winner: string | null) {
        // Handle the end of the game
        this.checking = false;
        this.sound.play('Win');
        this.sound.stopByKey('Music');

        this.scene.stop('Game');
        this.scene.start('Winner', { winner });
    }
}
