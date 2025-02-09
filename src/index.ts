import 'phaser';
import config from './config/config';
import MainScene from './scenes/MainScene';

if (module.hot) {
    module.hot.accept(function () {
        location.reload();
    });
}

class Game extends Phaser.Game {
    constructor() {
        super(config);
        this.scene.add('Main', MainScene);
        this.scene.start('Main');
    }
}

window.onload = () => {
    const game = new Game();
};