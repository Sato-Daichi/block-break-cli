import * as blessed from 'blessed';
import { Paddle } from '../game/Paddle';
import { Ball } from '../game/Ball';
import { Block } from '../game/Block';

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
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Block Break CLI',
    });

    this.width = (this.screen.width as number) || 80;
    this.height = (this.screen.height as number) - 3 || 24;

    this.gameBox = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: this.height,
      border: {
        type: 'line',
      },
      style: {
        border: {
          fg: 'white',
        },
      },
    });

    this.statusBox = blessed.box({
      top: this.height,
      left: 0,
      width: '100%',
      height: 3,
      content: '',
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue',
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
    return (this.gameBox.width as number) - 2;
  }

  getGameHeight(): number {
    return (this.gameBox.height as number) - 2;
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
      `Score: ${score}  |  Lives: ${hearts}  |  Level: ${level}  |  High Score: ${highScore}  |  [←/→] Move  [Space] Launch  [Q] Quit`
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
