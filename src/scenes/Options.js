import Phaser from 'phaser';
import Button from '../Objects/Button';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    this.model = this.sys.game.globals.model;

    this.text = this.add.text(300, 100, 'Options', { fontSize: 40 });
    this.soundButton = this.add.image(200, 200, 'checkedBox');
    this.soundText = this.add.text(250, 190, 'Lobby Music Enabled', { fontSize: 24 });

    this.soundButton.setInteractive();

    this.soundButton.on('pointerdown', () => {
      this.model.soundOn = !this.model.soundOn;
      this.updateAudio();
    });

    this.menuButton = new Button(this, 400, 500, 'btn-default', 'btn-hover', 'Menu', 'Title');

    this.updateAudio();
  }

  updateAudio() {
    if (this.model.soundOn === false) {
      this.soundButton.setTexture('box');
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.soundButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }
  }
}
