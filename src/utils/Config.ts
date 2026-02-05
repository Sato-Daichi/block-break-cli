export interface GameConfig {
  initialLives: number;
  gameSpeed: number;
  paddleWidth: number;
  paddleSpeed: number;
  maxLevel: number;
  gameWidth: number;
  gameHeight: number;
}

export const defaultConfig: GameConfig = {
  initialLives: 3,
  gameSpeed: 80,
  paddleWidth: 10,
  paddleSpeed: 3,
  maxLevel: 10,
  gameWidth: 60,
  gameHeight: 24,
};

let currentConfig: GameConfig = { ...defaultConfig };

export function setConfig(config: Partial<GameConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function getConfig(): GameConfig {
  return { ...currentConfig };
}

export function resetConfig(): void {
  currentConfig = { ...defaultConfig };
}
