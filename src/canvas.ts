import { Point, Line, Triangle } from "./core";

export class TriangleCanvasConfig {
  constructor(
    public color: string,
    public lineWidth: number,
    public pointSize: number,
    public anchorRadius: number,
    public canvasId: string,
    public canvasClearBtnId: string | null
  ) {}
}

export class TriangleCanvas {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  lines: Line[] = [];

  mousePos: Point = new Point(0, 0);
  selectedPoint: Point | null;

  constructor(public config: TriangleCanvasConfig) {
    this.canvasElement = document.getElementById(
      config.canvasId
    ) as HTMLCanvasElement;
    this.ctx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
    this.runUserEvents();
  }

  private drawLine(from: Point, to: Point) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.config.color;
    this.ctx.lineWidth = this.config.lineWidth;
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawPoint(point: Point) {
    this.ctx.beginPath();
    let size = this.config.pointSize;
    this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private updateMousePos(e: PointerEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    this.mousePos.x = e.clientX - rect.left;
    this.mousePos.y = e.clientY - rect.top;
  }

  private anchorPointToPoint(
    point: Point,
    lines: Line[],
    radius: number
  ): boolean {
    let minPoint: Point | null = null;
    let minDist: number = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
      let distStart = Math.sqrt(
        (point.x - line.start.x) ** 2 + (point.y - line.start.y) ** 2
      );

      let distEnd = Math.sqrt(
        (point.x - line.end.x) ** 2 + (point.y - line.end.y) ** 2
      );

      if (Math.min(distStart, distEnd) < minDist) {
        minPoint = distStart < distEnd ? line.start : line.end;
        minDist = Math.min(distStart, distEnd);
      }
    }
    if (minPoint != null && minDist <= radius) {
      point.x = minPoint.x;
      point.y = minPoint.y;
      return true;
    }
    return false;
  }

  private calculateSelectedPoint() {
    let point = new Point(this.mousePos.x, this.mousePos.y);
    this.anchorPointToPoint(point, this.lines, this.config.anchorRadius);
    this.selectedPoint = point.clone();
  }

  private clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
  }

  private redraw() {
    for (let line of this.lines) {
      this.drawLine(line.start, line.end);
    }
    for (let line of this.lines) {
      this.drawPoint(line.start);
      this.drawPoint(line.end);
    }
  }

  private runUserEvents() {
    let canvas = this.canvasElement;

    canvas.addEventListener("pointerdown", this.pointerdownEventHandler, false);
    canvas.addEventListener("pointerup", this.pointerupEventHandler, false);
    canvas.addEventListener("pointercancel", () => {}, false);
    canvas.addEventListener("pointermove", this.pointermoveEventHandler, false);

    if (this.config.canvasClearBtnId != null) {
      document
        .getElementById(this.config.canvasClearBtnId)
        ?.addEventListener("click", this.clearEventHandler);
    }
  }

  private clearEventHandler = () => {
    this.clearCanvas();
    this.lines = [];
  };

  private pointermoveEventHandler = (e: PointerEvent) => {
    this.updateMousePos(e);
    this.clearCanvas();
    this.redraw();

    if (this.selectedPoint != null) {
      this.drawLine(this.selectedPoint, this.mousePos);
    }
  };

  private pointerdownEventHandler = (e: PointerEvent) => {
    this.updateMousePos(e);
    this.calculateSelectedPoint();
  };

  private pointerupEventHandler = (e: PointerEvent) => {
    if (this.selectedPoint == null) return;

    this.anchorPointToPoint(
      this.mousePos,
      this.lines,
      this.config.anchorRadius
    );
    this.lines.push(
      new Line(this.selectedPoint.clone(), this.mousePos.clone())
    );
    this.redraw();
    this.selectedPoint = null;
  };
}