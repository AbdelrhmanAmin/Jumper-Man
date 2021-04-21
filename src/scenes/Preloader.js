import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.add.text(150, 200, 'If the game stuck at loading...Press F5', {
      fontSize: '24px',
      fill: '#FFF',
    }).setDepth(5);
    this.add.image(400, 200, 'bg');
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100, 10)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    this.load.image('platform', 'assets/stone.png');
    this.load.image('catbg', 'assets/catbg.png');
    this.load.image('scorebg', 'assets/scorebg.jpg');
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('sky', 'assets/layers/parallax-mountain-bg.png');
    this.load.image('mountain-far', 'assets/layers/parallax-mountain-montain-far.png');
    this.load.image('mountains', 'assets/layers/parallax-mountain-mountains.png');
    this.load.image('trees', 'assets/layers/parallax-mountain-trees.png');
    this.load.image('trees-far', 'assets/layers/parallax-mountain-foreground-trees.png');
    this.load.atlas('boy', './assets/player/spritesheet.png', './assets/player/spritesheet.json');
    this.load.atlas('coin', './assets/coin/spritesheet.png', './assets/coin/spritesheet.json');
    this.load.image('btn-default', 'assets/buttons/button-default.png');
    this.load.image('btn-hover', 'assets/buttons/button-hovered.png');
    this.load.image('btn1', 'assets/buttons/b1.png');
    this.load.image('btn2', 'assets/buttons/b2.png');
    this.load.image('spacebar', 'assets/buttons/spacebar.png');
    this.load.image('box', 'assets/ui/grey_box.png');
    this.load.image('checkedBox', 'assets/ui/blue_boxCheckmark.png');
    this.load.audio('bgMusic', ['assets/Sounds/lobby.mp3']);
    this.load.audio('gameMusic', ['assets/Sounds/Game.mp3']);
    this.load.audio('jump', ['assets/Sounds/jump.wav']);
    this.load.audio('pickup', ['assets/Sounds/pickup.wav']);
  }

  ready() {
    this.scene.start('Title');
    this.readyCount += 1;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}
