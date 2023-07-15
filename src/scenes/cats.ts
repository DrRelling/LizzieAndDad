import Phaser from 'phaser';
import assets from '../assets/*.png';
import level from '../levels/level1.json';

export class CatsScene extends Phaser.Scene {
  private score = 0;
  private player1: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private canJump = false;
  private playerVelocityX = 160;
  private playerVelocityY = -330;

  public preload(): void {
    this.load.image('cat1', assets.cat1);
    level.images.forEach((img) => this.load.image(img, assets[img]));
  }

  public create(): void {
    const platforms = this._createPlatforms();
    this._createPlayer(platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    const stars = this._createStars(platforms);

    const scoreText = this.add.text(16, 16, 'Stars: 0', {
      fontSize: '32px',
      color: '#000',
    });

    this.physics.add.overlap(
      this.player1,
      stars,
      (_, star) => {
        star.destroy();
        this.score += 1;
        scoreText.setText('Stars: ' + this.score);
      },
      null,
      this
    );

    this.input.gamepad.once(
      'connected',
      (pad: Phaser.Input.Gamepad.Gamepad) => {
        console.log('connected', pad.id);
      },
      this
    );
  }

  public update(): void {
    if (this.player1.body.touching.down) {
      this.canJump = true;
    }

    let xVelocity = 0;
    let yVelocity = 0;

    if (this.input.gamepad.total > 0) {
      const pad = this.input.gamepad.getPad(0);
      if (pad.A && this.canJump) {
        yVelocity = this.playerVelocityY;
      }
      if (pad.axes.length > 0) {
        const axisH = pad.axes[0].getValue();
        if (Math.abs(axisH) > 0.3) {
          xVelocity = this.playerVelocityX * axisH;
        }
      }
    } else {
      if (this.cursors.left.isDown) {
        xVelocity = -this.playerVelocityX;
      } else if (this.cursors.right.isDown) {
        xVelocity = this.playerVelocityX;
      }
      if (this.cursors.up.isDown) {
        yVelocity = this.playerVelocityY;
      }
    }

    if (xVelocity < 0) {
      this.player1.flipX = true;
    } else {
      this.player1.flipX = false;
    }
    this.player1.setVelocityX(xVelocity);

    if (yVelocity < 0 && this.canJump) {
      this.canJump = false;
      this.player1.setVelocityY(yVelocity);
    }
  }

  private _createPlatforms(): Phaser.Physics.Arcade.StaticGroup {
    const platforms = this.physics.add.staticGroup();
    platforms.create(level.ground.x, level.ground.y, 'ground');
    level.platforms.forEach((p) => platforms.create(p.x, p.y, p.img));
    return platforms;
  }

  private _createPlayer(platforms: Phaser.Physics.Arcade.StaticGroup) {
    this.player1 = this.physics.add.sprite(380, 500, 'cat1');
    this.player1.setBounce(0.3);
    this.player1.setCollideWorldBounds(true);
    this.physics.add.collider(this.player1, platforms);
  }

  private _createStars(platforms: Phaser.Physics.Arcade.StaticGroup) {
    const stars = this.physics.add.group();
    level.stars.forEach((s) => stars.create(s.x, s.y, s.img));

    this.physics.add.collider(stars, platforms);
    return stars;
  }
}
