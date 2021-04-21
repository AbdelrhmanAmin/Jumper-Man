import Phaser from 'phaser';
import InputScene from '../scenes/Input';
import 'jest-expect-subclass';

test('InputScene should be a subclass of Phaser.Scene', () => {
  expect(InputScene).toBeSubclassOf(Phaser.Scene);
});