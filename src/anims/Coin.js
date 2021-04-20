import Phaser from 'phaser';

const createCoinAnims = (anims = Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'idle',
    frames: anims.generateFrameNames('coin', {
      prefix: 'goldCoin',
      suffix: '.png',
      end: 9,
    }),
    frameRate: 8,
    repeat: -1,
  });
};
export default createCoinAnims;