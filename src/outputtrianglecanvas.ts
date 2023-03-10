import { Point, Line, Triangle } from "./core";
import {
  ColorGenerator,
  TriangleCanvas,
  TriangleCanvasConfig,
} from "./trianglecanvas";

export class OutputTriangleCanvasConfig extends TriangleCanvasConfig {
  public constructor(init?: Partial<OutputTriangleCanvasConfig>) {
    super(init);
    Object.assign(this, init);
  }
}

export class OutputTriangleCanvas extends TriangleCanvas {
  constructor(public config: OutputTriangleCanvasConfig) {
    super(config as TriangleCanvasConfig);
  }

  public drawLines(
    lines: Line[],
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    lineWidth: number = this.config.lineWidth
  ) {
    for (let line of lines) {
      this.drawLine(line.start, line.end, color, lineWidth);
    }
  }

  public drawPoints(
    points: Point[],
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    pointSize: number = this.config.pointSize
  ) {
    for (let point of points) {
      this.drawPoint(point, color, pointSize);
    }
  }

  public drawTriangles(
    triangles: Triangle[],
    color: string | CanvasGradient | CanvasPattern | ColorGenerator = this
      .config.color,
    lineWidth: number = this.config.lineWidth
  ) {
    for (let triangle of triangles) {
      this.drawTriangle(triangle, color, lineWidth);
    }
  }
}
