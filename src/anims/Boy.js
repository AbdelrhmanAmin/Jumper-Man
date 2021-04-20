import Phaser from 'phaser';

const createBoyAnims = (anims = Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'walk',
    frames: anims.generateFrameNames('boy', {
      prefix: 'p1_walk0',
      suffix: '.png',
      end: 5,
    }),
    frameRate: 8,
  });

  anims.create({
    key: 'jump',
    frames: [{ key: 'boy', frame: 0 }],
    frameRate: 8,
  });
};
export default createBoyAnims;