class Point {
  constructor(public x: number, public y: number) {}

  public clone(): Point {
    return new Point(this.x, this.y);
  }
}

class Line {
  constructor(public start: Point, public end: Point) {}
}

class Triangle {
  constructor(public p1: Point, public p2: Point, public p3: Point) {}
}

class DrawingServiceConfig {
  constructor(
    public color: string,
    public lineWidth: number,
    public canvasId: string,
    public canvasClearBtnId: string | null
  ) {}
}

class DrawingService {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  lines: Line[] = [];

  mousePos: Point = new Point(0, 0);
  selectedPoint: Point | null;

  constructor(public config: DrawingServiceConfig) {
    this.canvasElement = document.getElementById(
      config.canvasId
    ) as HTMLCanvasElement;
    this.ctx = this.canvasElement.getContext("2d") as CanvasRenderingContext2D;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    this.runUserEvents();
  }

  private updateMousePos(e: PointerEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    this.mousePos.x = e.clientX - rect.left;
    this.mousePos.y = e.clientY - rect.top;
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
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.config.color;
      this.ctx.lineWidth = this.config.lineWidth;
      this.ctx.moveTo(line.start.x, line.start.y);
      this.ctx.lineTo(line.end.x, line.end.y);
      this.ctx.stroke();
      this.ctx.beginPath();
    }
  }

  private runUserEvents() {
    let canvas = this.canvasElement;

    canvas.addEventListener("pointerdown", this.pointerdownEventHandler, false);
    canvas.addEventListener("pointerup", this.pointerupEventHandler, false);
    canvas.addEventListener("pointercancel", () => {}, false);
    canvas.addEventListener("pointermove", this.pointermoveEventHandler, false);

    document
      .getElementById(this.config.canvasClearBtnId)
      ?.addEventListener("click", this.clearEventHandler);
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
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.config.color;
      this.ctx.lineWidth = this.config.lineWidth;
      this.ctx.moveTo(this.selectedPoint.x, this.selectedPoint.y);
      this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
      this.ctx.stroke();
      this.ctx.beginPath();
    }
  };

  private pointerdownEventHandler = (e: PointerEvent) => {
    this.updateMousePos(e);
    this.selectedPoint = new Point(this.mousePos.x, this.mousePos.y);
  };

  private pointerupEventHandler = (e: PointerEvent) => {
    if (this.selectedPoint == null) return;
    this.lines.push(
      new Line(this.selectedPoint.clone(), this.mousePos.clone())
    );
    this.redraw();
    this.selectedPoint = null;
  };
}

new DrawingService(new DrawingServiceConfig("black", 2, "canvas", "clear"));
