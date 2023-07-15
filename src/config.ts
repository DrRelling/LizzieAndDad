import { CatsScene } from './scenes/cats';

export const config = {
  width: 800,
  height: 600,
  backgroundColor: 0xffffff,
  scene: CatsScene,
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
