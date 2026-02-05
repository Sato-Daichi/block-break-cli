export interface GameConfig {
  initialLives: number;
  gameSpeed: number;
  paddleWidth: number;
  paddleSpeed: number;
}

export const defaultConfig: GameConfig = {
  initialLives: 3,
  gameSpeed: 80,
  paddleWidth: 10,
  paddleSpeed: 3,
};

export function getConfig(): GameConfig {
  return { ...defaultConfig };
}
