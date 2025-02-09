import 'phaser';
import config from './config/config';
import MainScene from './scenes/MainScene';
import PreloadScene from './scenes/PreloadScene';

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
        this.scene.start('Preload');
    }
}

window.onload = () => {
    const game = new Game();
};