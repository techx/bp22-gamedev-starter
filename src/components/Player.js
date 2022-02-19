import Phaser from 'phaser';

const BASE_SPEED = 200;
const HEIGHT = 64;
const JUMP_VELOCITY = 480;
const GRAVITY = 350;

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
    this.body.setBounce(0.2);
    this.body.setGravityY(GRAVITY);
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
      this.anims.play('player-left', true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(BASE_SPEED);
      this.anims.play('player-right', true);
    } else {
      this.setVelocityX(0);
      this.anims.play('player-idle', true);
    }

    if (cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(-JUMP_VELOCITY);
    }
  }
}