import { Point, Line, Triangle } from "./core";
import { TriangleCanvas, TriangleCanvasConfig } from "./trianglecanvas";
import {
  checkIntersection,
  distanceBetweenPoints,
  distanceFromPointToLine,
  mergePointWithLine,
  mergePointWithLinePoints,
  mergePointWithPoint,
} from "./calculation";

export class InputTriangleCanvasConfig extends TriangleCanvasConfig {
  public mergeRadius: number = 50;

  public constructor(init?: Partial<InputTriangleCanvasConfig>) {
    super(init);
    Object.assign(this, init);
  }
}

class DrawAction {
  line: Line;
  ipoints: Point[];
}
export class InputTriangleCanvas extends TriangleCanvas {
  lines: Line[] = [];
  intersectionPoints: [Point[]] = [[]];
  cancelledActions: DrawAction[] = [];

  mousePos: Point = new Point(0, 0);
  selectedPoint: Point | null;

  constructor(public config: InputTriangleCanvasConfig) {
    super(config as TriangleCanvasConfig);
    this.runUserEvents();
  }

  public clearAll() {
    this.clearCanvas();
    this.lines = [];
    this.intersectionPoints = [[]];
    this.cancelledActions = [];
  }

  public undo() {
    if (this.lines.length == 0) return;
    this.cancelledActions.push({
      line: this.lines.pop(),
      ipoints:
        this.intersectionPoints.length > 0 ? this.intersectionPoints.pop() : [],
    });
    this.redraw();
  }

  public redo() {
    if (this.cancelledActions.length == 0) return;
    let savedAction = this.cancelledActions.pop();
    this.lines.push(savedAction.line);
    if (savedAction.ipoints.length > 0)
      this.intersectionPoints.push(savedAction.ipoints);
    this.redraw();
  }

  private updateMousePos(e: PointerEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    this.mousePos.x = e.clientX - rect.left;
    this.mousePos.y = e.clientY - rect.top;
  }

  private mergePointWithIntersectionPoints(point: Point): boolean {
    if (
      mergePointWithPoint(
        point,
        this.intersectionPoints.reduce((accum, item) => {
          accum.push(...item);
          return accum;
        }, []),
        this.config.mergeRadius
      )
    )
      return true;
    return false;
  }

  private mergePointWithGrid(point: Point): boolean {
    let size = this.config.gridCellSize;
    let cx = Math.floor(point.x / size);
    let cy = Math.floor(point.y / size);
    let startPoint = new Point(cx * size, cy * size);
    let gridPoints = [
      startPoint,
      new Point(startPoint.x + this.config.gridCellSize, startPoint.y),
      new Point(startPoint.x, startPoint.y + this.config.gridCellSize),
      new Point(
        startPoint.x + this.config.gridCellSize,
        startPoint.y + this.config.gridCellSize
      ),
    ];
    if (mergePointWithPoint(point, gridPoints, this.config.gridCellSize))
      return true;
    return false;
  }

  private addIntersectionPoint(line: Line) {
    let points: Point[] = [];
    for (let withLine of this.lines) {
      let point = checkIntersection(line, withLine);
      if (point != null) points.push(point);
    }
    if (points.length > 0) {
      this.intersectionPoints.push(points);
    }
  }

  private correctPointPos(point: Point) {
    let res = false;
    if (!res) {
      res = this.mergePointWithIntersectionPoints(point);
    }
    if (!res) {
      res = mergePointWithLinePoints(
        point,
        this.lines,
        this.config.mergeRadius * 2
      );
    }
    if (!res) {
      res = mergePointWithLine(point, this.lines, this.config.mergeRadius * 2);
    }
    if (!res && this.config.useGrid) {
      res = this.mergePointWithGrid(point);
    }
  }

  private correctMousePoint() {
    this.correctPointPos(this.mousePos);
  }

  private correctSelectedPoint() {
    let point = new Point(this.mousePos.x, this.mousePos.y);
    this.correctPointPos(point);
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
    for (let ipoints of this.intersectionPoints) {
      for (let point of ipoints) {
        this.drawPoint(point);
      }
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
    let line = new Line(this.selectedPoint.clone(), this.mousePos.clone());
    this.addIntersectionPoint(line);
    this.lines.push(line);
    this.selectedPoint = null;
    this.redraw();
  };
}
