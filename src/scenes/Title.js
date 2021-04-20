import 'phaser';
import Button from '../Objects/Button';
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }
  create() {
    this.game.sound.stopAll()
    this.sound.pauseOnBlur = false
    // this.sound.add('bgMusic').play({ loop: true, volume: 0.3 })
    this.gameButton = new Button(this, 400, 200, 'btn-default', 'btn-hover', 'Play', 'Input');
  }
}