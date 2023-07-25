import images from '../assets/images/game/*.png';
import sounds from '../assets/sounds/game/*.mp3';
import level from '../levels/level1.json';
import { GameConfig } from '../interfaces/game-config.interface';
import { Player } from '../classes/player.class';
import { BaseScene } from './baseScene';
import { InputSource } from '../enums/input-source.enum';

export class CatsScene extends BaseScene {
  private _score = 0;
  private _player1: Player;
  private _player2: Player = null;

  private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private _wasd: any;

  private _platforms: Phaser.Physics.Arcade.StaticGroup;
  private _collectibles: Phaser.Physics.Arcade.Group;
  private _scoreText: Phaser.GameObjects.Text;

  private _playerVelocityX = 160;
  private _playerVelocityY = -330;

  constructor() {
    super('game');
  }

  public init(data: GameConfig): void {
    console.log(data);
    if (data.player1Input == null) {
      data = { player1Input: 1, player2Input: 0 };
    }

    this._player1 = new Player(1, data.player1Input);

    if (data.player2Input !== 0) {
      this._player2 = new Player(2, data.player2Input);
    }
  }

  public preload(): void {
    this.load.audio('collect', sounds.meow, { instances: 2 });
    this.load.audio('jump', sounds.boing, { instances: 2 });
    this.load.image('cat1', images.cat1);
    this.load.image('cat2', images.cat2);

    this.load.audio('music', sounds.house);
    level.images.forEach((img) => this.load.image(img, images[img]));
  }

  public create(): void {
    this.sound.add('collect');
    this.sound.add('jump');
    this.sound.add('music').play({ loop: true });

    this._createPlatforms();
    this._createCollectibles();

    this._createPlayer(this._player1);
    if (this._player2 != null) {
      this._createPlayer(this._player2);
    }

    this._cursors = this.input.keyboard.createCursorKeys();
    this._wasd = this.input.keyboard.addKeys('W,A,S,D');

    this._scoreText = this.add.text(16, 16, 'Stars: 0', {
      fontSize: '32px',
      color: '#000',
    });
  }

  public update(): void {
    this._updatePlayer(this._player1);
    if (this._player2 != null) {
      this._updatePlayer(this._player2);
    }
  }

  private _updatePlayer(player: Player): void {
    if (player.sprite.body.touching.down) {
      player.canJump = true;
    }

    let xVelocity = 0;
    let yVelocity = 0;

    if (player.inputSource === InputSource.KEYBOARD1) {
      if (this._cursors.left.isDown) {
        xVelocity = -this._playerVelocityX;
      } else if (this._cursors.right.isDown) {
        xVelocity = this._playerVelocityX;
      }
      if (this._cursors.up.isDown) {
        yVelocity = this._playerVelocityY;
      }
    } else if (player.inputSource === InputSource.KEYBOARD2) {
      if (this._wasd.A.isDown) {
        xVelocity = -this._playerVelocityX;
      } else if (this._wasd.D.isDown) {
        xVelocity = this._playerVelocityX;
      }
      if (this._wasd.W.isDown) {
        yVelocity = this._playerVelocityY;
      }
    } else if (
      player.inputSource === InputSource.CONTROLLER1 ||
      player.inputSource === InputSource.CONTROLLER2
    ) {
      const padIdx = player.inputSource - 2;
      const pad = this.input.gamepad.getPad(padIdx);
      if (pad.A && player.canJump) {
        yVelocity = this._playerVelocityY;
      }
      if (pad.axes.length > 0) {
        const axisH = pad.axes[0].getValue();
        if (Math.abs(axisH) > 0.3) {
          xVelocity = this._playerVelocityX * axisH;
        }
      }
    }

    if (xVelocity < 0) {
      player.sprite.flipX = true;
    } else {
      player.sprite.flipX = false;
    }
    player.sprite.setVelocityX(xVelocity);

    if (yVelocity < 0 && player.canJump) {
      this.sound.play('jump', { seek: 0.35 });
      player.canJump = false;
      player.sprite.setVelocityY(yVelocity);
    }
  }

  private _createPlatforms(): void {
    this._platforms = this.physics.add.staticGroup();
    this._platforms.create(level.ground.x, level.ground.y, 'ground');
    level.platforms.forEach((p) => this._platforms.create(p.x, p.y, p.img));
  }

  private _createCollectibles(): void {
    this._collectibles = this.physics.add.group();
    level.stars.forEach((s) => this._collectibles.create(s.x, s.y, s.img));

    this.physics.add.collider(this._collectibles, this._platforms);
  }

  private _createPlayer(player: Player) {
    const startPos = level.playerStart[player.playerNumber - 1];
    player.sprite = this.physics.add.sprite(
      startPos.x,
      startPos.y,
      'cat' + player.playerNumber
    );
    player.sprite.setBounce(0.3);
    player.sprite.setCollideWorldBounds(true);
    this.physics.add.collider(player.sprite, this._platforms);

    if (this._player1 != null && this._player2 != null) {
      this.physics.add.collider(this._player1.sprite, this._player2.sprite);
    }

    this.physics.add.overlap(
      player.sprite,
      this._collectibles,
      (_, star) => {
        this.sound.play('collect', { seek: 0.35 });
        star.destroy();
        this._score += 1;
        this._scoreText.setText('Stars: ' + this._score);
      },
      null,
      this
    );
  }
}
