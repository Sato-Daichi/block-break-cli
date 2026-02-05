export interface LevelConfig {
  level: number;
  ballSpeed: number;
  paddleSpeed: number;
  rows: number;
}

export class LevelManager {
  currentLevel: number;
  maxLevel: number;

  constructor() {
    this.currentLevel = 1;
    this.maxLevel = 10;
  }

  getConfig(): LevelConfig {
    return {
      level: this.currentLevel,
      ballSpeed: Math.min(50 + this.currentLevel * 5, 100),
      paddleSpeed: 3,
      rows: Math.min(3 + this.currentLevel, 8),
    };
  }

  nextLevel(): boolean {
    if (this.currentLevel < this.maxLevel) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  reset(): void {
    this.currentLevel = 1;
  }

  isMaxLevel(): boolean {
    return this.currentLevel >= this.maxLevel;
  }
}
