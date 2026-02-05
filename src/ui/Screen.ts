import * as blessed from 'blessed';
import { Paddle } from '../game/Paddle';
import { Ball } from '../game/Ball';
import { Block } from '../game/Block';

export class Screen {
  screen: blessed.Widgets.Screen;
  gameBox: blessed.Widgets.BoxElement;
  statusBox: blessed.Widgets.BoxElement;
  width: number;
  height: number;

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
    this.gameBox.setContent('');
  }

  drawPaddle(paddle: Paddle): void {
    this.drawAt(paddle.x, paddle.y, paddle.getChar(), 'white');
  }

  drawBall(ball: Ball): void {
    this.drawAt(ball.x, ball.y, ball.char, 'yellow');
  }

  drawBlock(block: Block): void {
    if (!block.destroyed) {
      this.drawAt(block.x, block.y, block.getChar(), block.color);
    }
  }

  drawBlocks(blocks: Block[]): void {
    for (const block of blocks) {
      this.drawBlock(block);
    }
  }

  drawAt(x: number, y: number, text: string, color: string): void {
    const coloredText = `{${color}-fg}${text}{/${color}-fg}`;
    const existingContent = this.gameBox.getContent();
    const lines = existingContent.split('\n');

    while (lines.length <= y) {
      lines.push('');
    }

    const line = lines[y] || '';
    const paddedLine = line.padEnd(x, ' ');
    lines[y] = paddedLine.substring(0, x) + coloredText + paddedLine.substring(x + text.length);

    this.gameBox.setContent(lines.join('\n'));
  }

  updateStatus(score: number, lives: number, level: number, highScore: number): void {
    this.statusBox.setContent(
      `Score: ${score}  |  Lives: ${'❤'.repeat(lives)}  |  Level: ${level}  |  High Score: ${highScore}  |  [←/→] Move  [Space] Launch  [Q] Quit`
    );
  }

  showMessage(message: string, color: string = 'white'): void {
    const centerX = Math.floor(this.getGameWidth() / 2 - message.length / 2);
    const centerY = Math.floor(this.getGameHeight() / 2);
    this.drawAt(centerX, centerY, message, color);
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
