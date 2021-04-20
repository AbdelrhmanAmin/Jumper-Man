import Phaser from 'phaser';
import scoreSystem from '../score/API';
import { Align } from '../util/align';

export default class InputScene extends Phaser.Scene {
  constructor() {
    super('Input');
  }

  create() {
    const catbg = this.add.image(0, 0, 'catbg');
    Align.scaleToGameW(catbg, 1.5, this);
    Align.center(catbg, this);
    this.add.text(280, 100, "Enter your cat's name", {
      color: '#5d1512', fontFamily: 'Arial', fontSize: '24px ', fontWeight: '900',
    });
    const element = document.getElementById('form');
    element.style.display = 'flex';
    element.addEventListener('click', (event) => {
      if (event.target.name === 'submit') {
        const user = document.getElementById('user');
        if (user.value !== '') {
          element.style.display = 'none';
          scoreSystem.namer(user.value);
          this.scene.start('Game');
        }
      }
    });
  }
}