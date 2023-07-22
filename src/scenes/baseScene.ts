import { Scene, Input } from 'phaser';
import { config } from '../config';

export abstract class BaseScene extends Scene {
  protected width: number;
  protected height: number;
  protected midX: number;
  protected midY: number;

  protected controllers: Input.Gamepad.Gamepad[] = [];

  constructor(sceneName: string) {
    super(sceneName);

    this.width = config.width as number;
    this.height = config.height as number;
    this.midX = this.width / 2;
    this.midY = this.height / 2;
  }

  protected create(): void {
    this.input.gamepad.once(
      'connected',
      (pad: Input.Gamepad.Gamepad) => {
        this.controllers.push(pad);
      },
      this
    );
  }
}
