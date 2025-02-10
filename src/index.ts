import 'phaser';
import config from './config/config';
import MainScene from './scenes/MainScene';
import PreloadScene from './scenes/PreloadScene';
import SelectScene from './scenes/SelectScene';
import GameScene from './scenes/GameScene';
import WinnerScene from './scenes/WinnerScene';

if (module.hot) {
    module.hot.accept(function () {
        location.reload();
    });
}

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add('Preload', PreloadScene)
        this.scene.add('Main', MainScene);
        this.scene.add('Select', SelectScene);
        this.scene.add('Game', GameScene);
        this.scene.add('Winner', WinnerScene);
        this.scene.start('Preload');
    }
}

window.onload = () => {
    const game = new Game();
};