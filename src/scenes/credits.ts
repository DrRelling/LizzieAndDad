import creditsAssets from '../assets/images/credits/*.png';
import sharedAssets from '../assets/images/shared/*.png';
import { BaseScene } from './baseScene';

export class CreditsScene extends BaseScene {
  constructor() {
    super('credits');
  }

  public preload(): void {
    this.load.image('background', sharedAssets.background);
    this.load.image('title', sharedAssets.title);
  }

  public create(): void {
    this.add.image(this.midX, this.midY, 'background');
    const titleImg = this.add.image(this.midX, -100, 'title');
    const authorsImg = this.add.image(this.midX, this.height + 62, 'authors');

    this.tweens
      .add({
        targets: titleImg,
        y: this.midY - 49,
        duration: 1500,
        delay: 500,
        ease: 'bounce.out',
      })
      .play();

    this.tweens
      .add({
        targets: authorsImg,
        y: this.midY + 30,
        duration: 1500,
        delay: 500,
        ease: 'bounce.out',
      })
      .play();

    this.input.on('pointerdown', () => this.scene.start('menu'));

    this.input.keyboard.on('keydown', () => this.scene.start('menu'));
  }
}
