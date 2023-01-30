class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
class DrawingServiceConfig {
    constructor(color, lineWidth, pointSize, canvasId, canvasClearBtnId) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.pointSize = pointSize;
        this.canvasId = canvasId;
        this.canvasClearBtnId = canvasClearBtnId;
    }
}
class DrawingService {
    constructor(config) {
        this.config = config;
        this.lines = [];
        this.mousePos = new Point(0, 0);
        this.clearEventHandler = () => {
            this.clearCanvas();
            this.lines = [];
        };
        this.pointermoveEventHandler = (e) => {
            this.updateMousePos(e);
            this.clearCanvas();
            this.redraw();
            if (this.selectedPoint != null) {
                this.drawLine(this.selectedPoint, this.mousePos);
            }
        };
        this.pointerdownEventHandler = (e) => {
            this.updateMousePos(e);
            this.selectedPoint = new Point(this.mousePos.x, this.mousePos.y);
        };
        this.pointerupEventHandler = (e) => {
            if (this.selectedPoint == null)
                return;
            this.lines.push(new Line(this.selectedPoint.clone(), this.mousePos.clone()));
            this.redraw();
            this.selectedPoint = null;
        };
        this.canvasElement = document.getElementById(config.canvasId);
        this.ctx = this.canvasElement.getContext("2d");
        this.runUserEvents();
    }
    drawLine(from, to) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.color;
        this.ctx.lineWidth = this.config.lineWidth;
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawPoint(point) {
        this.ctx.beginPath();
        let size = this.config.pointSize;
        this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    updateMousePos(e) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }
    redraw() {
        for (let line of this.lines) {
            this.drawLine(line.start, line.end);
        }
        for (let line of this.lines) {
            this.drawPoint(line.start);
            this.drawPoint(line.end);
        }
    }
    runUserEvents() {
        let canvas = this.canvasElement;
        canvas.addEventListener("pointerdown", this.pointerdownEventHandler, false);
        canvas.addEventListener("pointerup", this.pointerupEventHandler, false);
        canvas.addEventListener("pointercancel", () => { }, false);
        canvas.addEventListener("pointermove", this.pointermoveEventHandler, false);
        document
            .getElementById(this.config.canvasClearBtnId)
            ?.addEventListener("click", this.clearEventHandler);
    }
}
new DrawingService(new DrawingServiceConfig("black", 2, 4, "canvas", "clear"));
//# sourceMappingURL=app.js.map