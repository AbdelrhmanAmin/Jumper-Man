import Phaser from 'phaser';
import BootScene from '../scenes/Boot';
import 'jest-expect-subclass';

test('Bootscene should be a subclass of Phaser.Scene', () => {
  expect(BootScene).toBeSubclassOf(Phaser.Scene);
});