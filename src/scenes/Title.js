import Phaser from 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const board = document.getElementById('score');
    board.style.display = 'none';
    this.sound.pauseOnBlur = false;
    this.model = this.sys.game.globals.model;
    this.game.sound.stopAll();
    if (this.model.soundOn === true) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
    this.gameButton = new Button(this, 400, 200, 'btn-default', 'btn-hover', 'Play', 'Input');
    this.gameButton = new Button(this, 400, 300, 'btn-default', 'btn-hover', 'Options', 'Options');
    this.gameButton = new Button(this, 400, 400, 'btn-default', 'btn-hover', 'Scoreboard', 'Score');
  }
}