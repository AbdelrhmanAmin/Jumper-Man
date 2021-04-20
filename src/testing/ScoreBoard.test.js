import Phaser from 'phaser';
import ScoreBoard from '../scenes/ScoreBoard';
import 'jest-expect-subclass';

test('LeaderBoardScene should be a subclass of Phaser.Scene', () => {
  expect(ScoreBoard).toBeSubclassOf(Phaser.Scene);
});