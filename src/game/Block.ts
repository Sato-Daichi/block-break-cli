export interface BlockConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  hits: number;
}

export class Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  hitsRequired: number;
  currentHits: number;
  destroyed: boolean;

  constructor(config: BlockConfig) {
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.points = config.points;
    this.hitsRequired = config.hits;
    this.currentHits = 0;
    this.destroyed = false;
  }

  hit(): boolean {
    this.currentHits++;
    if (this.currentHits >= this.hitsRequired) {
      this.destroyed = true;
      return true;
    }
    return false;
  }

  getChar(): string {
    return '#'.repeat(this.width);
  }

  containsPoint(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x < this.x + this.width &&
      y >= this.y &&
      y < this.y + this.height
    );
  }
}

export class BlockManager {
  blocks: Block[];

  constructor() {
    this.blocks = [];
  }

  createLevel(level: number, screenWidth: number): void {
    this.blocks = [];
    const blockWidth = 6;
    const blockHeight = 1;
    const padding = 1;
    const startY = 3;
    const rows = Math.min(3 + level, 8);
    const cols = Math.floor((screenWidth - 4) / (blockWidth + padding));
    const startX = Math.floor((screenWidth - cols * (blockWidth + padding)) / 2);

    const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta'];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const block = new Block({
          x: startX + col * (blockWidth + padding),
          y: startY + row * (blockHeight + padding),
          width: blockWidth,
          height: blockHeight,
          color: colors[row % colors.length],
          points: (rows - row) * 10,
          hits: row < 2 && level > 2 ? 2 : 1,
        });
        this.blocks.push(block);
      }
    }
  }

  getActiveBlocks(): Block[] {
    return this.blocks.filter((b) => !b.destroyed);
  }

  checkCollision(ballX: number, ballY: number): Block | null {
    for (const block of this.getActiveBlocks()) {
      if (block.containsPoint(ballX, ballY)) {
        return block;
      }
    }
    return null;
  }

  allDestroyed(): boolean {
    return this.getActiveBlocks().length === 0;
  }
}
