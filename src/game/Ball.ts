export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  char: string;
  active: boolean;

  constructor(paddleX: number, paddleY: number, paddleWidth: number) {
    this.x = paddleX + Math.floor(paddleWidth / 2);
    this.y = paddleY - 1;
    this.dx = 1;
    this.dy = -1;
    this.char = '●';
    this.active = false;
  }

  launch(): void {
    this.active = true;
    this.dx = Math.random() > 0.5 ? 1 : -1;
    this.dy = -1;
  }

  move(): void {
    if (!this.active) return;
    this.x += this.dx;
    this.y += this.dy;
  }

  reflectX(): void {
    this.dx = -this.dx;
  }

  reflectY(): void {
    this.dy = -this.dy;
  }

  reset(paddleX: number, paddleY: number, paddleWidth: number): void {
    this.x = paddleX + Math.floor(paddleWidth / 2);
    this.y = paddleY - 1;
    this.dx = 1;
    this.dy = -1;
    this.active = false;
  }

  followPaddle(paddleX: number, paddleY: number, paddleWidth: number): void {
    if (!this.active) {
      this.x = paddleX + Math.floor(paddleWidth / 2);
      this.y = paddleY - 1;
    }
  }
}
