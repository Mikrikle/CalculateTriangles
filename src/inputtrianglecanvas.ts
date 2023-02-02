import { Point, Line, Triangle, distanceBetween } from "./core";
import { TriangleCanvas, TriangleCanvasConfig } from "./trianglecanvas";

export class InputTriangleCanvasConfig extends TriangleCanvasConfig {
  public anchorRadius: number = 50;

  public constructor(init?: Partial<InputTriangleCanvasConfig>) {
    super(init);
    Object.assign(this, init);
  }

}

export class InputTriangleCanvas extends TriangleCanvas {
  lines: Line[] = [];

  mousePos: Point = new Point(0, 0);
  selectedPoint: Point | null;

  constructor(public config: InputTriangleCanvasConfig) {
    super(config as TriangleCanvasConfig);
    this.runUserEvents();
  }

  public clearAll() {
    this.clearCanvas();
    this.lines = [];
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
      let distStart = distanceBetween(point, line.start);
      let distEnd = distanceBetween(point, line.end);

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

  private redraw() {
    this.clearCanvas();
    if(this.config.useGrid)
      this.drawGrid();
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
  }

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
    this.selectedPoint = null;
    this.redraw();
  };
}
