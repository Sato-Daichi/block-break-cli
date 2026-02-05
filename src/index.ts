import { Menu, MenuOption } from './ui/Menu';
import { Game } from './game/Game';
import { ScoreBoard } from './ui/ScoreBoard';
import { HighScoreManager } from './utils/HighScore';
import { setConfig, getConfig, defaultConfig } from './utils/Config';

function parseArgs(): void {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--lives':
      case '-l':
        if (nextArg) {
          const lives = parseInt(nextArg, 10);
          if (!isNaN(lives) && lives > 0) {
            setConfig({ initialLives: lives });
          }
          i++;
        }
        break;

      case '--max-level':
      case '-m':
        if (nextArg) {
          const maxLevel = parseInt(nextArg, 10);
          if (!isNaN(maxLevel) && maxLevel > 0) {
            setConfig({ maxLevel });
          }
          i++;
        }
        break;

      case '--speed':
      case '-s':
        if (nextArg) {
          const speed = parseInt(nextArg, 10);
          if (!isNaN(speed) && speed > 0) {
            setConfig({ gameSpeed: speed });
          }
          i++;
        }
        break;

      case '--paddle-width':
      case '-w':
        if (nextArg) {
          const width = parseInt(nextArg, 10);
          if (!isNaN(width) && width > 0) {
            setConfig({ paddleWidth: width });
          }
          i++;
        }
        break;

      case '--paddle-speed':
      case '-p':
        if (nextArg) {
          const paddleSpeed = parseInt(nextArg, 10);
          if (!isNaN(paddleSpeed) && paddleSpeed > 0) {
            setConfig({ paddleSpeed });
          }
          i++;
        }
        break;

      case '--width':
        if (nextArg) {
          const gameWidth = parseInt(nextArg, 10);
          if (!isNaN(gameWidth) && gameWidth >= 40) {
            setConfig({ gameWidth });
          }
          i++;
        }
        break;

      case '--height':
        if (nextArg) {
          const gameHeight = parseInt(nextArg, 10);
          if (!isNaN(gameHeight) && gameHeight >= 20) {
            setConfig({ gameHeight });
          }
          i++;
        }
        break;

      case '--help':
      case '-h':
        showHelp();
        process.exit(0);

      case '--version':
      case '-v':
        console.log('block-break-cli v1.0.0');
        process.exit(0);
    }
  }
}

function showHelp(): void {
  console.log(`
block-break-cli - Terminal breakout game

Usage: block-break [options]

Options:
  -l, --lives <n>         Initial lives (default: ${defaultConfig.initialLives})
  -m, --max-level <n>     Maximum level (default: ${defaultConfig.maxLevel})
  -s, --speed <ms>        Game speed in ms, lower = faster (default: ${defaultConfig.gameSpeed})
  -w, --paddle-width <n>  Paddle width (default: ${defaultConfig.paddleWidth})
  -p, --paddle-speed <n>  Paddle movement speed (default: ${defaultConfig.paddleSpeed})
      --width <n>         Game area width (default: ${defaultConfig.gameWidth}, min: 40)
      --height <n>        Game area height (default: ${defaultConfig.gameHeight}, min: 20)
  -h, --help              Show this help
  -v, --version           Show version

Examples:
  block-break                     Start with default settings
  block-break --lives 5           Start with 5 lives
  block-break -l 5 -m 20          5 lives, 20 levels
  block-break --speed 50          Faster game speed
  block-break --width 80 --height 30   Larger game area
`);
}

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

// Parse command line arguments
parseArgs();

// Start the application
const app = new App();
app.start();
