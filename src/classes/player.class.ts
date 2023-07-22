import Phaser from 'phaser';
import { InputSource } from '../enums/input-source.enum';

export class Player {
  public canJump: boolean = false;
  public inputSource: InputSource;
  public playerNumber: number;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(playerNumber: number, inputSource: InputSource) {
    this.playerNumber = playerNumber;
    this.inputSource = inputSource;
  }
}
