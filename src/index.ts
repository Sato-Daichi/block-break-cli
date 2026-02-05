import { Menu, MenuOption } from './ui/Menu';
import { Game } from './game/Game';
import { ScoreBoard } from './ui/ScoreBoard';
import { HighScoreManager } from './utils/HighScore';

class App {
  private highScoreManager: HighScoreManager;

  constructor() {
    this.highScoreManager = new HighScoreManager();
  }

  start(): void {
    this.showMenu();
  }

  private showMenu(): void {
    const menu = new Menu();
    menu.show((option: MenuOption) => {
      menu.destroy();

      switch (option) {
        case 'start':
          this.startGame();
          break;
        case 'highscore':
          this.showHighScores();
          break;
        case 'quit':
          process.exit(0);
      }
    });
  }

  private startGame(): void {
    const game = new Game();
    game.start((_score: number, _level: number) => {
      // Game ended, return to menu
      setTimeout(() => this.showMenu(), 100);
    });
  }

  private showHighScores(): void {
    const scoreBoard = new ScoreBoard();
    const scores = this.highScoreManager.getScores();
    scoreBoard.show(scores, () => {
      scoreBoard.destroy();
      setTimeout(() => this.showMenu(), 100);
    });
  }
}

// Start the application
const app = new App();
app.start();
