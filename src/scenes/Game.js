import 'phaser';
import Align from "../util/align";
import scoreSystem from '../score/API';
import { createBoyAnims } from '../anims/Boy'
import { createCoinAnims } from '../anims/Coin'
let gameOptions = {
  // platform speed range, in pixels per second
  platformSpeedRange: [300, 300],

  // mountain speed, in pixels per second
  mountainSpeed: 80,

  // spawn range, how far should be the rightmost platform from the right edge
  // before next platform spawns, in pixels
  spawnRange: [80, 300],

  // platform width range, in pixels
  platformSizeRange: [120, 300],

  // a height range between rightmost platform and next platform to be spawned
  platformHeightRange: [-5, 5],

  // a scale to be multiplied by platformHeightRange
  platformHeighScale: 20,

  // platform max and min height, as screen height ratio
  platformVerticalLimit: [0.4, 0.8],

  // player gravity
  playerGravity: 900,

  // player jump force
  jumpForce: 400,

  // player starting X position
  playerStartPosition: 150,

  // consecutive jumps allowed
  jumps: 2,

  // % of probability a coin appears on the platform

  // % of probability a coin appears on the platform
  coinPercent: 75,

  // % of probability a fire appears on the platform
  spikePercent: 50
};
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms++;
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      let newRatio = platformWidth / platform.displayWidth;
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    }
    else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
      platform.setDepth(2);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
      if (this.coinPool.getLength()) {
        let coin = this.coinPool.getFirst();
        coin.x = posX;
        coin.y = posY - 90;
        coin.alpha = 1;
        coin.active = true;
        coin.visible = true;
        this.coinPool.remove(coin);
      }
      else {
        let coin = this.physics.add.sprite(posX, posY - 90, "coin").setScale(2);
        coin.setImmovable(true);
        coin.setVelocityX(platform.body.velocity.x);
        coin.anims.play("idle");
        coin.setDepth(2);
        this.coinGroup.add(coin);
      }
    }
    if (platformWidth > 250 && this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.spikePercent) {
        if (this.spikePool.getLength()) {
          let spike = this.spikePool.getFirst();
          spike.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth - 5);
          spike.y = posY - 32;
          spike.alpha = 1;
          spike.active = true;
          spike.visible = true;
          this.spikePool.remove(spike);
        }
        else {
          let spike = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth - 5), posY - 32, "spikes");
          spike.setImmovable(true);
          spike.setVelocityX(platform.body.velocity.x);
          spike.setSize(8, 2, true)
          spike.setDepth(2);
          this.spikeGroup.add(spike);
        }
      }
    }
  }

  createParallax(scene, count, texture, scrollFactor, scale) {
    let x = 0;
    for (let i = 0; i < count; ++i) {
      const img = scene.add.image(x, scene.scale.height, texture).setOrigin(0, 1).setScrollFactor(scrollFactor).setScale(scale)
      x += img.width
    }
  }
  jump() {
    if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)) {
      this.jump_s.play()
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
        this.player.anims.play('walk')
      }
      this.player.anims.play('jump', true);
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
      this.player.anims.stop()
    }
  }
  create() {
    this.score = 0;
    this.scoreText = this.add.text(100, 70, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    }).setDepth(3);
    this.jump_s = this.sound.add('jump')
    createBoyAnims(this.anims)
    createCoinAnims(this.anims)
    this.game.sound.stopAll()
    let music = this.sound.add('gameMusic');
    // music.play({ loop: true })
    let bg = this.add.image(0, 0, 'sky').setScrollFactor(0)
    this.createParallax(this, 3, 'mountain-far', 0.25, 2.5)
    this.createParallax(this, 3, 'mountains', 0.5, (2, 1.5))
    this.createParallax(this, 4, 'trees-far', 1, (2, 2))
    this.createParallax(this, 6, 'trees', 1.25, (2, 1))
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

      // once a firecamp is removed, it's added to the pool
      removeCallback: function (spike) {
        spike.scene.spikePool.add(spike)
      }
    });

    // fire pool
    this.spikePool = this.add.group({

      // once a fire is removed from the pool, it's added to the active fire group
      removeCallback: function (spike) {
        spike.scene.spikeGroup.add(spike)
      }
    });
    this.coinGroup = this.add.group({

      // once a coin is removed, it's added to the pool
      removeCallback: function (coin) {
        coin.scene.coinPool.add(coin)
      }
    });

    // coin pool
    this.coinPool = this.add.group({

      // once a coin is removed from the pool, it's added to the active coins group
      removeCallback: function (coin) {
        coin.scene.coinGroup.add(coin)
      }
    });
    this.addedPlatforms = 0;
    this.player = this.physics.add.sprite(gameOptions.playerStartPosition, this.sys.scale.height * 0.7, 'boy');
    this.player.setGravityY(900);
    this.addPlatform(this.sys.scale.width, this.sys.scale.width / 2, this.sys.scale.height * gameOptions.platformVerticalLimit[1]);
    this.platformCollider = this.physics.add.collider(this.player, this.platformGroup, function () {
      if (!this.player.anims.isPlaying) {
        this.player.anims.play('walk');
      }
    }, null, this);
    this.physics.add.overlap(this.player, this.spikeGroup, () => {
      this.player.tint = 0xff0000
      this.player.body.setVelocityY(-200);
      this.player.setImmovable(true)
      this.physics.world.removeCollider(this.platformCollider);

    }, null, this);
    this.physics.add.overlap(this.player, this.coinGroup, function (player, coin) {
      this.playerJumps = 0
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);
      this.coinGroup.killAndHide(coin);
      this.coinGroup.remove(coin);
    }, null, this);
    bg.displayHeight = this.sys.game.config.height;
    bg.scaleX = bg.scaleY
    Align.center(bg, this)
    this.cursors = this.input.keyboard.createCursorKeys()
    this.input.keyboard.on("keydown-SPACE", this.jump, this);
  }
  update() {
    this.scoreText.setScrollFactor(0, 0)
    if (this.player.y > (this.sys.scale.height - this.player.height)) {
      scoreSystem.scorer(this.score);
      scoreSystem.postScores()
      this.score = 0;
      this.scene.start("Score");
    }
    this.player.x = gameOptions.playerStartPosition;
    // recycling platforms
    // recycling platforms
    let minDistance = this.sys.scale.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      let platformDistance = this.sys.scale.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < - platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    this.spikeGroup.getChildren().forEach(function (spike) {
      if (spike.x < - spike.displayWidth / 2) {
        this.spikeGroup.killAndHide(spike);
        this.spikeGroup.remove(spike);
      }
    }, this);
    // recycling coins
    this.coinGroup.getChildren().forEach(function (coin) {
      if (coin.x < - coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);
    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
      let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
      let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      let minPlatformHeight = this.sys.scale.height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight = this.sys.scale.height * gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, this.sys.scale.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
};
