import Phaser from 'phaser';
import OptionsScene from '../scenes/Options';
import 'jest-expect-subclass';

test('OptionsScene should be a subclass of Phaser.Scene', () => {
  expect(OptionsScene).toBeSubclassOf(Phaser.Scene);
});