import { Point, Line, Triangle } from "./core";
import { TriangleCanvas, TriangleCanvasConfig } from "./trianglecanvas";
import { distanceBetweenPoints, distanceFromPointToLine } from "./calculation";

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

  private mergePointWithPoint(point: Point, lines: Line[]): boolean {
    let minPoint: Point | null = null;
    let minDist: number = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
      let distStart = distanceBetweenPoints(point, line.start);
      let distEnd = distanceBetweenPoints(point, line.end);

      if (Math.min(distStart, distEnd) < minDist) {
        minPoint = distStart < distEnd ? line.start : line.end;
        minDist = Math.min(distStart, distEnd);
      }
    }
    if (minPoint != null && minDist <= this.config.anchorRadius) {
      point.x = minPoint.x;
      point.y = minPoint.y;
      return true;
    }
    return false;
  }

  private mergePointWithLine(point: Point, lines: Line[]): boolean {
    let minPoint: Point | null = null;
    let minDist: number = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
      let pd = distanceFromPointToLine(point, line);
      if (pd.distace < minDist) {
        minDist = pd.distace;
        minPoint = pd.point;
      }
    }
    if (minPoint != null && minDist <= this.config.anchorRadius) {
      point.x = minPoint.x;
      point.y = minPoint.y;
      return true;
    }
    return false;
  }

  private correctMousePoint(){
    if(!this.mergePointWithPoint(this.mousePos, this.lines)){
      this.mergePointWithLine(this.mousePos, this.lines);
    }
  }

  private correctSelectedPoint() {
    let point = new Point(this.mousePos.x, this.mousePos.y);
    if(!this.mergePointWithPoint(point, this.lines)){
      this.mergePointWithLine(point, this.lines);
    }
    this.selectedPoint = point.clone();
  }

  private redraw() {
    this.clearCanvas();
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
    this.correctSelectedPoint();
  };

  private pointerupEventHandler = (e: PointerEvent) => {
    if (this.selectedPoint == null) return;

    this.correctMousePoint();
    this.lines.push(
      new Line(this.selectedPoint.clone(), this.mousePos.clone())
    );
    this.selectedPoint = null;
    this.redraw();
  };
}
