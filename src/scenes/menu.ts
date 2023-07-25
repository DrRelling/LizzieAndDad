import sharedAssets from '../assets/images/shared/*.png';
import menuAssets from '../assets/images/menu/*.png';
import { InputSource } from '../enums/input-source.enum';
import { GameConfig } from '../interfaces/game-config.interface';
import { BaseScene } from './baseScene';

export class MenuScene extends BaseScene {
  private _player1Input = InputSource.KEYBOARD1;
  private _player2Input = InputSource.NONE;

  private _controller1: Phaser.GameObjects.Image;
  private _controller2: Phaser.GameObjects.Image;

  private _controllerNames = [
    'Not joined',
    'Keyboard (Arrows)',
    'Keyboard (WASD)',
    'Controller 1',
    'Controller 2',
  ];

  constructor() {
    super('menu');
  }

  public preload(): void {
    this.load.image('background', sharedAssets.background);
    this.load.image('title', sharedAssets.title);
    this.load.image('controller', menuAssets.controller)
  }

  public create(): void {
    super.create();

    this.add.image(this.midX, this.midY, 'background');
    this.add.image(this.midX, 60, 'title');

    const player1InputBtn = this.add
      .text(
        this.midX,
        this.midY,
        'Player 1: ' + this._controllerNames[this._player1Input]
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const newInputSource = this._getNextInputSource(this._player1Input);
        if (this._player1Input !== newInputSource) {
          this._player1Input = newInputSource;
          player1InputBtn.setText(
            'Player 1: ' + this._controllerNames[this._player1Input]
          );
        }
      });

    const player2InputBtn = this.add
      .text(
        this.midX,
        this.midY + 50,
        'Player 2: ' + this._controllerNames[this._player2Input]
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const newInputSource = this._getNextInputSource(
          this._player2Input,
          true
        );
        if (this._player2Input !== newInputSource) {
          this._player2Input = newInputSource;
          player2InputBtn.setText(
            'Player 2: ' + this._controllerNames[this._player2Input]
          );
        }
      });

    this._controller1 = this.add.image((this.width / 3), this.height - 100, 'controller').setTint(0x333333);
    this._controller2 = this.add.image((this.width / 3) * 2, this.height - 100, 'controller');

    this.add
      .text(this.midX, this.midY + 100, 'Start')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._startGame());
  }

  private _startGame(): void {
    this.scene.start('game', {
      player1Input: this._player1Input,
      player2Input: this._player2Input,
    } as GameConfig);
  }

  private _getNextInputSource(
    currentInput: InputSource,
    includeNone = false
  ): InputSource {
    switch(currentInput) {
      case InputSource.NONE:
        return InputSource.KEYBOARD1;
      case InputSource.KEYBOARD1:
        return InputSource.KEYBOARD2
      case InputSource.KEYBOARD2:
        if (this.controllers.length > 0) {
          return InputSource.CONTROLLER1;
        } else if (!includeNone) {
          return InputSource.KEYBOARD1;
        } else {
          return InputSource.NONE;
        }
      case InputSource.CONTROLLER1:
        if (this.controllers.length > 1) {
          return InputSource.CONTROLLER2;
        } else if (!includeNone) {
          return InputSource.KEYBOARD1;
        } else {
          return InputSource.NONE;
        }
      case InputSource.CONTROLLER2:
        if (!includeNone) {
          return InputSource.KEYBOARD1;
        } else {
          return InputSource.NONE;
        }
      default:
        return InputSource.NONE;
    }
  }
}
