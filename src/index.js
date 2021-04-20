import 'phaser';
import BootScene from './scenes/Boot';
import PreloaderScene from './scenes/Preloader';
import TitleScene from './scenes/Title';
import GameScene from './scenes/Game';
import InputScene from './scenes/Input';
import ScoreScene from './scenes/ScoreBoard';

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: { y: 300 },
          debug: false,
        },
      },
    });
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Input', InputScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Score', ScoreScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();