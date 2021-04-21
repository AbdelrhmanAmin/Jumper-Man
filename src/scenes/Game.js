import Phaser from 'phaser';
import { Align } from '../util/align';
import scoreSystem from '../score/API';
import createBoyAnims from '../anims/Boy';
import createCoinAnims from '../anims/Coin';
import gameOptions from '../Objects/gameOptions';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms += 1;
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, 'platform');
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0],
        gameOptions.platformSpeedRange[1]) * -1);
      platform.setDepth(2);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]);
    if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
      if (this.coinPool.getLength()) {
        const coin = this.coinPool.getFirst();
        coin.x = posX;
        coin.y = posY - 90;
        coin.alpha = 1;
        coin.active = true;
        coin.visible = true;
        this.coinPool.remove(coin);
      } else {
        const coin = this.physics.add.sprite(posX, posY - 90, 'coin').setScale(2);
        coin.setImmovable(true);
        coin.setVelocityX(platform.body.velocity.x);
        coin.anims.play('idle');
        coin.setDepth(2);
        this.coinGroup.add(coin);
      }
    }
    if (platformWidth > 250 && this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.spikePercent) {
        if (this.spikePool.getLength()) {
          const spike = this.spikePool.getFirst();
          spike.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth - 5);
          spike.y = posY - 32;
          spike.alpha = 1;
          spike.active = true;
          spike.visible = true;
          this.spikePool.remove(spike);
        } else {
          const spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth - 5), posY - 32, 'spikes');
          spike.setImmovable(true);
          spike.setVelocityX(platform.body.velocity.x);
          spike.setSize(8, 2, true);
          spike.setDepth(2);
          this.spikeGroup.add(spike);
        }
      }
    }
  }

  createParallax(scene, count, texture, scrollFactor, scale) {
    let x = 0;
    for (let i = 0; i < count; i += 1) {
      this.img = scene.add.image(x, scene.scale.height, texture)
        .setOrigin(0, 1)
        .setScrollFactor(scrollFactor)
        .setScale(scale);
      x += this.img.width;
    }
  }

  jump() {
    if (this.player.body.touching.down
      || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)) {
      this.jump_s.play();
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
        this.player.anims.play('walk');
      }
      this.player.anims.play('jump', true);
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps += 1;
      this.player.anims.stop();
    }
  }

  welcome() {
    this.space1.destroy();
    this.space2.destroy();
    this.space3.destroy();
    this.text1.destroy();
    this.text2.destroy();
    this.text3.destroy();
    this.text4.destroy();
  }

  preload() {
    this.time.addEvent({
      delay: 2000,
      callback: this.welcome,
      callbackScope: this,
      loop: false,
    });
  }

  create() {
    this.space1 = this.add.image(380, 169, 'spacebar').setDepth(5).setScale(0.5);
    this.text1 = this.add.text(100, 150, 'To jump, Press:', {
      fontSize: '24px',
      fill: '#000',
    }).setDepth(5);
    this.text2 = this.add.text(100, 250, 'To Double jump, Press:', {
      fontSize: '24px',
      fill: '#000',
    }).setDepth(5);
    this.space2 = this.add.image(380, 320, 'spacebar').setDepth(5).setScale(0.5);
    this.text3 = this.add.text(275, 300, '+', {
      fontSize: '50px',
      fill: '#000',
    }).setDepth(5);
    this.space3 = this.add.image(200, 320, 'spacebar').setDepth(5).setScale(0.5);
    this.text4 = this.add.text(200, 400, 'Easter Egg: You can do triple jump!', {
      fontSize: '12px',
      fill: '#FFF',
    }).setDepth(5);
    this.score = 0;
    this.scoreText = this.add.text(100, 70, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    }).setDepth(3);
    this.jump_s = this.sound.add('jump');
    createBoyAnims(this.anims);
    createCoinAnims(this.anims);
    this.game.sound.stopAll();
    const bg = this.add.image(0, 0, 'sky').setScrollFactor(0);
    this.createParallax(this, 3, 'mountain-far', 0.25, 2.5);
    this.createParallax(this, 3, 'mountains', 0.5, (2, 1.5));
    this.createParallax(this, 4, 'trees-far', 1, (2, 2));
    this.createParallax(this, 6, 'trees', 1.25, (2, 1));
    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });
    this.spikeGroup = this.add.group({
      removeCallback(spike) {
        spike.scene.spikePool.add(spike);
      },
    });
    this.spikePool = this.add.group({
      removeCallback(spike) {
        spike.scene.spikeGroup.add(spike);
      },
    });
    this.coinGroup = this.add.group({
      removeCallback(coin) {
        coin.scene.coinPool.add(coin);
      },
    });
    this.coinPool = this.add.group({
      removeCallback(coin) {
        coin.scene.coinGroup.add(coin);
      },
    });
    this.addedPlatforms = 0;
    this.player = this.physics.add.sprite(gameOptions.playerStartPosition, this.sys.scale.height * 0.7, 'boy');
    this.player.setGravityY(gameOptions.playerGravity);
    this.addPlatform(this.sys.scale.width, this.sys.scale.width / 2,
      this.sys.scale.height * gameOptions.platformVerticalLimit[1]);
    this.physics.add.collider(this.player, this.platform, () => { }, null, this);
    this.platformCollider = this.physics.add.collider(this.player, this.platformGroup,
      function f1() {
        if (!this.player.anims.isPlaying) {
          this.player.anims.play('walk');
        }
      }, null, this);
    this.physics.add.overlap(this.player, this.spikeGroup, () => {
      this.player.tint = 0xff0000;
      this.player.body.setVelocityY(-200);
      this.player.setImmovable(true);
      this.physics.world.removeCollider(this.platformCollider);
    }, null, this);
    this.physics.add.overlap(this.player, this.coinGroup, function f2(player, coin) {
      this.playerJumps = 0;
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      this.coinGroup.killAndHide(coin);
      this.coinGroup.remove(coin);
    }, null, this);
    bg.displayHeight = this.sys.game.config.height;
    bg.scaleX = bg.scaleY;
    Align.center(bg, this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', this.jump, this);
  }

  update() {
    this.scoreText.setScrollFactor(0, 0);
    if (this.player.y > (this.sys.scale.height - this.player.height)) {
      scoreSystem.scorer(this.score);
      scoreSystem.postScores();
      this.score = 0;
      this.scene.start('Title');
    }
    this.player.x = gameOptions.playerStartPosition;

    let minDistance = this.sys.scale.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function f3(platform) {
      const platformDistance = this.sys.scale.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    this.spikeGroup.getChildren().forEach(function f4(spike) {
      if (spike.x < -spike.displayWidth / 2) {
        this.spikeGroup.killAndHide(spike);
        this.spikeGroup.remove(spike);
      }
    }, this);
    this.coinGroup.getChildren().forEach(function f5(coin) {
      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);
    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]);
      const platformRandomHeight = gameOptions.platformHeighScale
        * Phaser.Math.Between(gameOptions.platformHeightRange[0],
          gameOptions.platformHeightRange[1]);
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight = this.sys.scale.height * gameOptions.platformVerticalLimit[0];
      const maxPlatformHeight = this.sys.scale.height * gameOptions.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap,
        minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth,
        this.sys.scale.width + nextPlatformWidth / 2,
        nextPlatformHeight);
    }
  }
}
