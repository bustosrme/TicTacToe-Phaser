import 'phaser';
import config from '../config/config';

interface SceneData {
    buttonPressed: string;
}

export default class GameScene extends Phaser.Scene {

    board: (string | null)[][];
    checking: boolean;
    counter: number;
    currentPlayer: string;
    timeLeft: number;
    timeLimit: number;
    timerEvent?: Phaser.Time.TimerEvent;
    music?: Phaser.Sound.BaseSound;
    titleTime?: Phaser.GameObjects.Text;
    title?: Phaser.GameObjects.Text;

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
        this.checking = false;
        this.timeLeft = this.timeLimit;
        if (!data.buttonPressed) {
            this.scene.stop('Game');
            this.scene.start('Main');
            return;
        }
        this.currentPlayer = data.buttonPressed;
    }

    create() {
        const { width, height } = config;
        const cellSize = 83;

        this.add.image(width / 2, height / 2, 'Background');
        this.music = this.sound.add('Music', { loop: true });
        this.music.play();

        // Add background for the timer
        let graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 1);
        graphics.fillRoundedRect(4 * width / 13, height / 10, 140, 50, 25);

        this.titleTime = this.add.text(width / 2, height / 7, '', {
            font: '500 36px Montserrat',
            color: '#000000',
        }).setOrigin(0.5);

        this.title = this.add.text(width / 2, height / 3, '', {
            font: 'Bold 36px Montserrat',
            color: '#FFFFFF',
            align: 'center',
            wordWrap: { width: width - 100, useAdvancedWrap: true }
        }).setOrigin(0.5, 1);

        this.updateTurnDisplay();

        // Add timer event
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Add graphics for the board background
        let backgroundGraphics = this.add.graphics();
        backgroundGraphics.fillStyle(0xFFFFFF, 1);
        backgroundGraphics.fillRoundedRect(width / 8, 7 * height / 15 - 3, cellSize * 3 + 20, cellSize * 3 + 20, 25);

        // Create the board cells
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const x = col * cellSize + 97;
                const y = row * cellSize + 347;

                const cell = this.add.rectangle(x, y, cellSize, cellSize, 0xFFFFFF)
                    .setInteractive();

                cell.on('pointerdown', () => {
                    this.handleCellClick(row, col, x, y);
                });
            }
        }

        this.add.image(width / 2, 430, 'Board')
            .setScale(0.4);
    }

    // Update the timer and switch player if time runs out
    updateTimer() {
        if (this.checking) {
            return;
        }

        this.timeLeft--;

        if (this.timeLeft <= 0) {
            this.switchPlayer();
            return;
        }

        this.updateTurnDisplay();
    }

    handleCellClick(row: number, col: number, x: number, y: number) {
        // Check if the cell is already occupied or if a winner is being checked
        if (this.board[row][col] !== null || this.checking) {
            return;
        }
        this.checking = true;
        this.sound.play('Tap');
        this.board[row][col] = this.currentPlayer;

        const img = this.add.image(x, y - 50, `Img${this.currentPlayer}`)
            .setScale(0.15);

        this.tweens.add({
            targets: img,
            y: y,
            duration: 500,
            ease: 'Bounce.easeOut',
            onComplete: () => {
                if (!this.checkWinner()) {
                    this.switchPlayer();
                    this.checking = false;
                }
            }
        });
        this.counter++;
    }

    checkWinner(): boolean {
        // Check rows and columns for a winner
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                this.finishGame(this.board[i][0]);
                return true;
            }
            if (this.board[0][i] && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                this.finishGame(this.board[0][i]);
                return true;
            }
        }
        // Check diagonals for a winner
        if (this.board[0][0] && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            this.finishGame(this.board[0][0]);
            return true;
        }
        if (this.board[0][2] && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            this.finishGame(this.board[0][2]);
            return true;
        }

        // Check for a draw
        if (this.counter === 9) {
            this.finishGame(null);
            return true;
        }
        return false;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.timeLeft = this.timeLimit;
        this.updateTurnDisplay();
    }

    updateTurnDisplay() {
        const formattedTime = this.timeLeft < 10 ? `0${this.timeLeft}` : `${this.timeLeft}`;
        this.title?.setText(`Turno del jugador ${this.currentPlayer}`);
        this.titleTime?.setText(`0:${formattedTime}`);
    }

    finishGame(winner: string | null) {
        // Handle the end of the game
        this.checking = true;
        this.timerEvent?.remove(false);
        this.timerEvent = undefined;
        if (winner) {
            this.sound.play('Win');
        }
        this.music?.stop();
        this.music?.destroy();
        this.music = undefined;

        this.scene.stop('Game');
        this.scene.start('Winner', { winner });
    }
}
