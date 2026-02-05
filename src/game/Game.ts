import { Screen } from '../ui/Screen';
import { Paddle } from './Paddle';
import { Ball } from './Ball';
import { BlockManager } from './Block';
import { LevelManager } from './Level';
import { HighScoreManager } from '../utils/HighScore';
import { getConfig } from '../utils/Config';

export type GameState = 'waiting' | 'playing' | 'paused' | 'gameover' | 'levelcomplete' | 'gamecomplete';

export class Game {
  private screen: Screen;
  private paddle: Paddle;
  private ball: Ball;
  private blockManager: BlockManager;
  private levelManager: LevelManager;
  private highScoreManager: HighScoreManager;

  private score: number = 0;
  private lives: number;
  private state: GameState = 'waiting';
  private gameLoop: NodeJS.Timeout | null = null;
  private onGameEnd: ((score: number, level: number) => void) | null = null;

  constructor() {
    const config = getConfig();
    this.screen = new Screen();
    this.paddle = new Paddle(this.screen.getGameWidth(), this.screen.getGameHeight());
    this.ball = new Ball(this.paddle.x, this.paddle.y, this.paddle.width);
    this.blockManager = new BlockManager();
    this.levelManager = new LevelManager();
    this.highScoreManager = new HighScoreManager();
    this.lives = config.initialLives;

    this.setupControls();
  }

  private setupControls(): void {
    this.screen.onKey(['left', 'a'], () => {
      this.paddle.moveLeft();
      this.ball.followPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
    });

    this.screen.onKey(['right', 'd'], () => {
      this.paddle.moveRight();
      this.ball.followPaddle(this.paddle.x, this.paddle.y, this.paddle.width);
    });

    this.screen.onKey(['space'], () => {
      if (this.state === 'waiting') {
        this.ball.launch();
        this.state = 'playing';
      } else if (this.state === 'paused') {
        this.state = 'playing';
      } else if (this.state === 'playing') {
        this.state = 'paused';
      } else if (this.state === 'levelcomplete') {
        this.nextLevel();
      }
    });

    this.screen.onKey(['q', 'C-c'], () => {
      this.stop();
      if (this.onGameEnd) {
        this.onGameEnd(this.score, this.levelManager.currentLevel);
      }
    });
  }

  start(callback: (score: number, level: number) => void): void {
    this.onGameEnd = callback;
    this.reset();
    this.blockManager.createLevel(this.levelManager.currentLevel, this.screen.getGameWidth());
    this.gameLoop = setInterval(() => this.update(), getConfig().gameSpeed);
  }

  private reset(): void {
    const config = getConfig();
    this.score = 0;
    this.lives = config.initialLives;
    this.state = 'waiting';
    this.levelManager.reset();
    this.paddle.reset(this.screen.getGameWidth(), this.screen.getGameHeight());
    this.ball.reset(this.paddle.x, this.paddle.y, this.paddle.width);
  }

  private resetBall(): void {
    this.paddle.reset(this.screen.getGameWidth(), this.screen.getGameHeight());
    this.ball.reset(this.paddle.x, this.paddle.y, this.paddle.width);
    this.state = 'waiting';
  }

  private nextLevel(): void {
    if (this.levelManager.nextLevel()) {
      this.blockManager.createLevel(this.levelManager.currentLevel, this.screen.getGameWidth());
      this.resetBall();
    } else {
      this.state = 'gamecomplete';
    }
  }

  private update(): void {
    if (this.state === 'playing') {
      this.ball.move();
      this.checkCollisions();
    }
    this.render();
  }

  private checkCollisions(): void {
    const gameWidth = this.screen.getGameWidth();
    const gameHeight = this.screen.getGameHeight();

    // Wall collisions
    if (this.ball.x <= 1 || this.ball.x >= gameWidth - 1) {
      this.ball.reflectX();
      this.ball.x = Math.max(1, Math.min(gameWidth - 1, this.ball.x));
    }

    if (this.ball.y <= 1) {
      this.ball.reflectY();
      this.ball.y = 1;
    }

    // Bottom - lose life
    if (this.ball.y >= gameHeight - 1) {
      this.lives--;
      if (this.lives <= 0) {
        this.state = 'gameover';
        this.highScoreManager.addScore(this.score, this.levelManager.currentLevel);
      } else {
        this.resetBall();
      }
      return;
    }

    // Paddle collision
    if (
      this.ball.y === this.paddle.y - 1 &&
      this.ball.x >= this.paddle.x &&
      this.ball.x < this.paddle.x + this.paddle.width
    ) {
      this.ball.reflectY();
      // Add angle based on where ball hits paddle
      const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
      if (hitPos < 0.3) {
        this.ball.dx = -Math.abs(this.ball.dx);
      } else if (hitPos > 0.7) {
        this.ball.dx = Math.abs(this.ball.dx);
      }
    }

    // Block collision
    const hitBlock = this.blockManager.checkCollision(this.ball.x, this.ball.y);
    if (hitBlock) {
      const destroyed = hitBlock.hit();
      if (destroyed) {
        this.score += hitBlock.points;
      }
      this.ball.reflectY();

      if (this.blockManager.allDestroyed()) {
        this.state = 'levelcomplete';
      }
    }
  }

  private render(): void {
    this.screen.clear();

    // Draw game objects
    this.screen.drawBlocks(this.blockManager.blocks);
    this.screen.drawPaddle(this.paddle);
    this.screen.drawBall(this.ball);

    // Draw status messages
    if (this.state === 'waiting') {
      this.screen.showMessage('Press SPACE to launch!', 'cyan');
    } else if (this.state === 'paused') {
      this.screen.showMessage('PAUSED - Press SPACE to continue', 'yellow');
    } else if (this.state === 'gameover') {
      this.screen.showMessage('GAME OVER - Press Q to exit', 'red');
    } else if (this.state === 'levelcomplete') {
      this.screen.showMessage(`Level ${this.levelManager.currentLevel} Complete! Press SPACE`, 'green');
    } else if (this.state === 'gamecomplete') {
      this.screen.showMessage('CONGRATULATIONS! You beat all levels!', 'magenta');
    }

    // Update status bar
    this.screen.updateStatus(
      this.score,
      this.lives,
      this.levelManager.currentLevel,
      this.highScoreManager.getHighScore()
    );

    this.screen.render();
  }

  stop(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.screen.destroy();
  }
}
