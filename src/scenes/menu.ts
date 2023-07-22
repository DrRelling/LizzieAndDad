import sharedAssets from '../assets/shared/*.png';
import { InputSource } from '../enums/input-source.enum';
import { GameConfig } from '../interfaces/game-config.interface';
import { BaseScene } from './baseScene';

export class MenuScene extends BaseScene {
  private player1Input = InputSource.KEYBOARD;
  private player2Input = InputSource.NONE;

  private controllerNames = [
    'Not joined',
    'Keyboard',
    'Controller 1',
    'Controller 2',
  ];

  constructor() {
    super('menu');
  }

  public preload(): void {
    this.load.image('background', sharedAssets.background);
    this.load.image('title', sharedAssets.title);
  }

  public create(): void {
    super.create();

    this.add.image(this.midX, this.midY, 'background');
    this.add.image(this.midX, 60, 'title');

    const player1InputBtn = this.add
      .text(
        this.midX,
        this.midY,
        'Player 1: ' + this.controllerNames[this.player1Input]
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const newInputSource = this._getNextInputSource(this.player1Input);
        if (this.player1Input !== newInputSource) {
          this.player1Input = newInputSource;
          player1InputBtn.setText(
            'Player 1: ' + this.controllerNames[this.player1Input]
          );
        }
      });

    const player2InputBtn = this.add
      .text(
        this.midX,
        this.midY + 50,
        'Player 2: ' + this.controllerNames[this.player2Input]
      )
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        const newInputSource = this._getNextInputSource(
          this.player2Input,
          true
        );
        if (this.player2Input !== newInputSource) {
          this.player2Input = newInputSource;
          player2InputBtn.setText(
            'Player 2: ' + this.controllerNames[this.player2Input]
          );
        }
      });

    this.add
      .text(this.midX, this.midY + 100, 'Start')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._startGame());
  }

  private _startGame(): void {
    this.scene.start('game', {
      player1Input: this.player1Input,
      player2Input: this.player2Input,
    } as GameConfig);
  }

  private _getNextInputSource(
    currentInput: InputSource,
    includeNone = false
  ): InputSource {
    if (currentInput === InputSource.NONE) {
      return InputSource.KEYBOARD;
    }

    if (
      currentInput === InputSource.KEYBOARD &&
      this.controllers.length === 0 &&
      includeNone
    ) {
      return InputSource.NONE;
    }

    if (currentInput === InputSource.KEYBOARD && this.controllers.length > 0) {
      return InputSource.CONTROLLER1;
    }

    if (
      currentInput === InputSource.CONTROLLER1 &&
      this.controllers.length === 1 &&
      includeNone
    ) {
      return InputSource.NONE;
    }

    if (
      currentInput === InputSource.CONTROLLER1 &&
      this.controllers.length === 1 &&
      !includeNone
    ) {
      return InputSource.KEYBOARD;
    }

    if (
      currentInput === InputSource.CONTROLLER1 &&
      this.controllers.length > 1
    ) {
      return InputSource.CONTROLLER2;
    }

    if (currentInput === InputSource.CONTROLLER2 && includeNone) {
      return InputSource.NONE;
    }

    if (currentInput === InputSource.CONTROLLER2 && !includeNone) {
      return InputSource.KEYBOARD;
    }

    return currentInput;
  }
}
