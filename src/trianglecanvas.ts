import { Point, Line, Triangle, distanceBetween } from "./core";

export class ColorGenerator {
  constructor(public generate: () => string) {}
}

export class TriangleCanvasConfig {
  constructor(
    public color: string | CanvasGradient | CanvasPattern | ColorGenerator,
    public lineWidth: number,
    public pointSize: number,
    public canvasId: string
  ) {}
}

export class TriangleCanvas {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  onResize = (e: UIEvent) => {
    let temp = this.ctx.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;
    this.ctx.putImageData(temp, 0, 0);
  };

  constructor(public config: TriangleCanvasConfig) {
    this.canvasElement = document.getElementById(
      config.canvasId
    ) as HTMLCanvasElement;
    this.canvasElement.width = this.canvasElement.offsetWidth;
    this.canvasElement.height = this.canvasElement.offsetHeight;
    window.addEventListener("resize", this.onResize, false);
    this.ctx = this.canvasElement.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
  }

  public drawLine(
    from: Point,
    to: Point,
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    lineWidth: number = this.config.lineWidth
  ) {
    this.ctx.beginPath();
    if (color instanceof ColorGenerator)
      this.ctx.strokeStyle = color.generate();
    else this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
  }

  public drawPoint(
    point: Point,
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    pointSize: number = this.config.pointSize
  ) {
    this.ctx.beginPath();
    if (color instanceof ColorGenerator) this.ctx.fillStyle = color.generate();
    else this.ctx.fillStyle = color;
    let size = pointSize;
    this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    this.ctx.stroke();
  }

  public drawTriangle(
    triangle: Triangle,
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    lineWidth: number = this.config.lineWidth
  ) {
    this.ctx.beginPath();
    if (color instanceof ColorGenerator) this.ctx.fillStyle = color.generate();
    else this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.moveTo(triangle.p1.x, triangle.p1.y);
    this.ctx.lineTo(triangle.p2.x, triangle.p2.y);
    this.ctx.lineTo(triangle.p3.x, triangle.p3.y);
    this.ctx.lineTo(triangle.p1.x, triangle.p1.y);
    this.ctx.stroke();
  }

  public clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }
}
