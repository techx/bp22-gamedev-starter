import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  static SPEED = 100;
  static HEIGHT = 64;
  left = true;

  constructor(scene, x, y, _texture, frame) {
    super(scene, x, y, 'enemy', frame);

    this.createAnimations();

    const aspectRatio = this.displayWidth / this.displayHeight;
    this.setDisplaySize(aspectRatio * Enemy.HEIGHT, Enemy.HEIGHT);

    this.play('enemy-idle', true);
  }

  createAnimations() {
    this.anims.create({
      key: 'enemy-idle',
      frames: this.anims.generateFrameNames(
        'enemy',
        {
          prefix: 'enemy-',
          suffix: ".png",
          zeroPad: 2,
          frames: [5]
        }
      ),
      frameRate: 20
    });

    this.anims.create({
      key: 'enemy-left',
      frames: this.anims.generateFrameNames(
        'enemy',
        {
          prefix: 'enemy-',
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
      key: 'enemy-right',
      frames: this.anims.generateFrameNames(
        'enemy',
        {
          prefix: 'enemy-',
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


  turnAround() {
    this.left = !this.left;
  }

  update() {
    super.update();

    if (this.left) {
      this.setVelocityX(-Enemy.SPEED);
      this.play('enemy-left', true);
    } else {
      this.setVelocityX(Enemy.SPEED);
      this.play('enemy-right', true);
    }
  }
}