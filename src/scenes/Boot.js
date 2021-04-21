import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bg', 'assets/bg.jpg');
  }

  create() {
    this.scene.start('Preloader');
  }
}