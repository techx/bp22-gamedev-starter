import Phaser from 'phaser';

const BASE_SPEED = 200;
const HEIGHT = 64;

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.createAnimations();
    this.createProperties();

    const aspectRatio = this.displayWidth / this.displayHeight;
    this.setDisplaySize(aspectRatio * HEIGHT, HEIGHT);

    this.play('player-idle');
  }

  createProperties() {
    this.setCollideWorldBounds(true);
    this.setScale(1.2);
    this.body.setAllowGravity(false);
  }

  createAnimations() {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          frames: [5]
        }
      ),
      frameRate: 20
    });

    this.anims.create({
      key: 'player-left',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          start: 1,
          end: 4
        }
      ),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'player-right',
      frames: this.anims.generateFrameNames(
        'player',
        {
          prefix: 'player-',
          suffix: ".png",
          zeroPad: 2,
          start: 6,
          end: 9
        }
      ),
      frameRate: 8,
      repeat: -1
    });
  }

  /**
   * Updates the player.
   * @param {Phaser.Types.Input.Keyboard.CursorKeys} cursors 
   */
  update(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-BASE_SPEED);
    } else if (cursors.right.isDown) {
      this.setVelocityX(BASE_SPEED);
    } else {
      this.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      this.setVelocityY(-BASE_SPEED);
    } else if (cursors.down.isDown) {
      this.setVelocityY(BASE_SPEED);
    } else {
      this.setVelocityY(0);
    }
  }
}