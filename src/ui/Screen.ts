import * as blessed from 'blessed';
import { Paddle } from '../game/Paddle';
import { Ball } from '../game/Ball';
import { Block } from '../game/Block';
import { getConfig } from '../utils/Config';

interface DrawElement {
  element: blessed.Widgets.BoxElement;
}

export class Screen {
  screen: blessed.Widgets.Screen;
  gameBox: blessed.Widgets.BoxElement;
  statusBox: blessed.Widgets.BoxElement;
  width: number;
  height: number;
  private elements: DrawElement[] = [];
  private messageBox: blessed.Widgets.BoxElement | null = null;

  constructor() {
    const config = getConfig();

    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Block Break CLI',
    });

    // Use fixed size from config
    this.width = config.gameWidth;
    this.height = config.gameHeight;

    this.gameBox = blessed.box({
      top: 'center',
      left: 'center',
      width: this.width + 2, // +2 for border
      height: this.height + 2, // +2 for border
      border: {
        type: 'line',
      },
      style: {
        border: {
          fg: 'cyan',
        },
      },
    });

    this.statusBox = blessed.box({
      top: '50%+' + Math.floor(this.height / 2 + 2),
      left: 'center',
      width: this.width + 2,
      height: 3,
      content: '',
      tags: true,
      border: {
        type: 'line',
      },
      style: {
        fg: 'white',
        border: {
          fg: 'gray',
        },
      },
      padding: {
        left: 1,
        right: 1,
      },
    });

    this.screen.append(this.gameBox);
    this.screen.append(this.statusBox);
  }

  getGameWidth(): number {
    return this.width;
  }

  getGameHeight(): number {
    return this.height;
  }

  clear(): void {
    // Remove all dynamic elements
    for (const item of this.elements) {
      item.element.detach();
    }
    this.elements = [];

    if (this.messageBox) {
      this.messageBox.detach();
      this.messageBox = null;
    }
  }

  drawPaddle(paddle: Paddle): void {
    const element = blessed.box({
      parent: this.gameBox,
      top: paddle.y,
      left: paddle.x,
      width: paddle.width,
      height: 1,
      content: paddle.getChar(),
      style: {
        fg: 'white',
        bold: true,
      },
    });
    this.elements.push({ element });
  }

  drawBall(ball: Ball): void {
    const element = blessed.box({
      parent: this.gameBox,
      top: ball.y,
      left: ball.x,
      width: 1,
      height: 1,
      content: ball.char,
      style: {
        fg: 'yellow',
        bold: true,
      },
    });
    this.elements.push({ element });
  }

  drawBlock(block: Block): void {
    if (!block.destroyed) {
      const element = blessed.box({
        parent: this.gameBox,
        top: block.y,
        left: block.x,
        width: block.width,
        height: 1,
        content: block.getChar(),
        style: {
          fg: block.color,
        },
      });
      this.elements.push({ element });
    }
  }

  drawBlocks(blocks: Block[]): void {
    for (const block of blocks) {
      this.drawBlock(block);
    }
  }

  updateStatus(score: number, lives: number, level: number, highScore: number): void {
    const hearts = '{red-fg}' + '♥'.repeat(lives) + '{/red-fg}';
    this.statusBox.setContent(
      `Score: ${score}  |  Lives: ${hearts}  |  Level: ${level}  |  Hi: ${highScore}`
    );
  }

  showMessage(message: string, color: string = 'white'): void {
    const centerX = Math.floor(this.getGameWidth() / 2 - message.length / 2);
    const centerY = Math.floor(this.getGameHeight() / 2);

    this.messageBox = blessed.box({
      parent: this.gameBox,
      top: centerY,
      left: centerX,
      width: message.length,
      height: 1,
      content: message,
      style: {
        fg: color,
        bold: true,
      },
    });
  }

  render(): void {
    this.screen.render();
  }

  onKey(keys: string | string[], callback: () => void): void {
    this.screen.key(keys, callback);
  }

  destroy(): void {
    this.screen.destroy();
  }
}
