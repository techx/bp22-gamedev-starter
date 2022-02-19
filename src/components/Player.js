import Phaser from 'phaser';

const BASE_SPEED = 200;
const DASH_SPEED = 1800;
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

    this.damageTime = 0;
    this.damaging = false;

    this.jumpFrames = 0
    this.dashImages = [];
    this.dashSteps = 0;
    this.canDash = true;
  }

  createProperties() {
    this.setCollideWorldBounds(true);
    this.setScale(1.2);
    this.body.setBounce(0.2);
    this.body.setGravityY(GRAVITY);
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt);

    if (this.damaging) {
      this.damageTime += dt;

      if (this.damageTime >= 250) {
        this.setTint(0xffffff);
        this.damageTime = 0;
        this.damaging = false;
      }
    }
  }

  handleDamage() {
    // Don't damage the player if they are mid dash
    if (this.dashSteps > 0) {
      return;
    }

    if (this.damaging) {
      return;
    }

    this.damaging = true;

    const dir = this.body.velocity
      .normalize()
      .negate()
      .scale(500);

    this.setVelocity(dir.x, dir.y);
    this.setTint(0xff0000);
    this.damageTime = 0;
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
    if (this.damaging) {
      return;
    }

    if (this.dashSteps == 0) {
      if (cursors.left.isDown) {
        this.setVelocityX(-BASE_SPEED);
        this.lastDirectionX = -1;
        this.anims.play('player-left', true);
      } else if (cursors.right.isDown) {
        this.setVelocityX(BASE_SPEED);
        this.lastDirectionX = 1;
        this.anims.play('player-right', true);
      } else {
        this.setVelocityX(0);
        this.anims.play('player-idle', true);
      }

      if (cursors.shift.isDown && this.canDash) {
        this.dashSteps = 20;
        this.canDash = false
      }
    }

    if (this.dashSteps > 0) {
      const speed = Math.max(DASH_SPEED * (this.dashSteps / 20.0), BASE_SPEED);
      this.setVelocityX(speed * this.lastDirectionX);
      if (this.dashSteps % 2 == 0) {
        const afterImage = this.scene.add.sprite(this.x, this.y, 'player');
        afterImage.displayWidth = this.displayWidth;
        afterImage.displayHeight = this.displayHeight;
        afterImage.anims.setCurrentFrame(this.anims.currentFrame);
        afterImage.setAlpha(0.5);
        afterImage.ticks = 0;
        this.dashImages.push(afterImage);
      }
      this.dashSteps--;
    }
    for (let image of this.dashImages) {
      image.ticks++;
      if (image.ticks > 12) {
        image.destroy();
        image.deleted = true;
      }
    }
    this.dashImages = this.dashImages.filter((image) => !image.deleted);

    this.jumpFrames--;
    if (this.body.onFloor()) {
      if (this.dashSteps <= 0) {
        this.canDash = true;
      }
      this.jumpFrames = 10;
    }

    if (this.jumpFrames > 0 && cursors.up.isDown) {
      this.setVelocityY(-JUMP_VELOCITY);
    }
  }
}