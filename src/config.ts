import { CatsScene } from './scenes/cats';
import { MenuScene } from './scenes/menu';
import { SplashScene } from './scenes/splash';

export const config: Phaser.Types.Core.GameConfig = {
  width: 1280,
  height: 900,
  backgroundColor: 0xffffff,
  parent: 'game',
  scene: [
    SplashScene,
    MenuScene,
    CatsScene,
  ],
  audio: {
    disableWebAudio: true,
  },  
  input: {
    gamepad: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
};
