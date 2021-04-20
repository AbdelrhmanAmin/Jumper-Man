import Phaser from 'phaser';
import GameScene from '../scenes/Game';
import 'jest-expect-subclass';

test('GameScene should be a subclass of Phaser.Scene', () => {
  expect(GameScene).toBeSubclassOf(Phaser.Scene);
});