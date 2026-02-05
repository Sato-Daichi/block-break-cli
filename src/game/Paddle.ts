export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  minX: number;
  maxX: number;

  constructor(screenWidth: number, screenHeight: number) {
    this.width = 10;
    this.height = 1;
    this.x = Math.floor((screenWidth - this.width) / 2);
    this.y = screenHeight - 3;
    this.speed = 3;
    this.minX = 1;
    this.maxX = screenWidth - this.width - 1;
  }

  moveLeft(): void {
    this.x = Math.max(this.minX, this.x - this.speed);
  }

  moveRight(): void {
    this.x = Math.min(this.maxX, this.x + this.speed);
  }

  reset(screenWidth: number, screenHeight: number): void {
    this.x = Math.floor((screenWidth - this.width) / 2);
    this.y = screenHeight - 3;
  }

  getChar(): string {
    return '='.repeat(this.width);
  }
}
