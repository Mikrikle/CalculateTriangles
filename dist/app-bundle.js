/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculation.ts":
/*!****************************!*\
  !*** ./src/calculation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIntersection = exports.distanceFromPointToLine = exports.distanceBetweenPoints = exports.mergePointWithLine = exports.mergePointWithLinePoints = exports.mergePointWithPoint = exports.TrianglesCalculator = exports.TrianglesCalculatorConfig = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
class TrianglesCalculatorConfig {
    constructor() { }
}
exports.TrianglesCalculatorConfig = TrianglesCalculatorConfig;
class TrianglesCalculator {
    constructor() {
        this.points = [];
        this.lines = [];
        this.connections = [];
        this.triangles = [];
        this.segmentsMap = new Map();
    }
    calc(lines) {
        this.lines = lines;
        this.recalcIntersections();
        this.recalcConnections();
        this.recalcTriangles();
    }
    recalcIntersections() {
        this.segmentsMap = new Map();
        for (let i = 0; i < this.lines.length; i++) {
            this.segmentsMap.set(i, []);
        }
        this.points = [];
        for (let line1 of this.lines) {
            this.points.push(line1.start);
            this.points.push(line1.end);
            this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.start);
            this.segmentsMap.get(this.lines.indexOf(line1))?.push(line1.end);
            for (let line2 of this.lines) {
                let intersectionPoint = checkIntersection(line1, line2);
                if (intersectionPoint != null) {
                    this.segmentsMap
                        .get(this.lines.indexOf(line1))
                        ?.push(intersectionPoint);
                    this.segmentsMap
                        .get(this.lines.indexOf(line2))
                        ?.push(intersectionPoint);
                    this.points.push(intersectionPoint);
                }
            }
        }
        this.points = this.points.filter((value, index, self) => index === self.findIndex((p) => (0, core_1.isPointsEqual)(p, value)));
    }
    recalcConnections() {
        this.connections = [];
        for (let intersectionPoints of this.segmentsMap.values()) {
            for (let p1 of intersectionPoints) {
                for (let p2 of intersectionPoints) {
                    if (!(0, core_1.isPointsEqual)(p1, p2)) {
                        this.connections.push(new core_1.Line(p1, p2));
                    }
                }
            }
        }
        this.connections = this.connections.filter((value, index, self) => index === self.findIndex((l) => (0, core_1.isLinesEqual)(l, value)));
    }
    recalcTriangles() {
        this.triangles = [];
        for (let l1 of this.connections) {
            for (let l2 of this.connections) {
                for (let l3 of this.connections) {
                    if (l1 == l2 || l1 == l3 || l2 == l3)
                        continue;
                    let triangle = linesToTriangle(l1, l2, l3);
                    if (triangle != null) {
                        this.triangles.push(triangle);
                    }
                }
            }
        }
        this.triangles = this.triangles.filter((value, index, self) => index === self.findIndex((t) => (0, core_1.isTrianglesEqual)(t, value)));
    }
}
exports.TrianglesCalculator = TrianglesCalculator;
function linesToTriangle(l1, l2, l3) {
    let hpoints = [l1.start, l1.end, l2.start, l2.end, l3.start, l3.end];
    hpoints = hpoints.filter((value, index, self) => index === self.findIndex((p) => (0, core_1.isPointsEqual)(p, value)));
    if (hpoints.length != 3)
        return null;
    var a = distanceBetweenPoints(l1.start, l1.end);
    var b = distanceBetweenPoints(l2.start, l2.end);
    var c = distanceBetweenPoints(l3.start, l3.end);
    if (a > b + c || b > a + c || c > a + b)
        return null;
    const p = (a + b + c) / 2;
    let S = (p * (p - a) * (p - b) * (p - c)) ** 0.5;
    if (isNaN(S) || Math.abs(S) <= 1)
        return null;
    return new core_1.Triangle(hpoints[0], hpoints[1], hpoints[2]);
}
function mergePointWithPoint(point, points, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let toPoint of points) {
        let distace = distanceBetweenPoints(point, toPoint);
        if (distace < minDist) {
            minDist = distace;
            minPoint = toPoint;
        }
    }
    if (minPoint != null && minDist <= raduis) {
        point.x = minPoint.x;
        point.y = minPoint.y;
        return true;
    }
    return false;
}
exports.mergePointWithPoint = mergePointWithPoint;
function mergePointWithLinePoints(point, lines, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
        let distStart = distanceBetweenPoints(point, line.start);
        let distEnd = distanceBetweenPoints(point, line.end);
        if (Math.min(distStart, distEnd) < minDist) {
            minPoint = distStart < distEnd ? line.start : line.end;
            minDist = Math.min(distStart, distEnd);
        }
    }
    if (minPoint != null && minDist <= raduis) {
        point.x = minPoint.x;
        point.y = minPoint.y;
        return true;
    }
    return false;
}
exports.mergePointWithLinePoints = mergePointWithLinePoints;
function mergePointWithLine(point, lines, raduis) {
    let minPoint = null;
    let minDist = Number.MAX_SAFE_INTEGER;
    for (let line of lines) {
        let pd = distanceFromPointToLine(point, line);
        if (pd.distace < minDist) {
            minDist = pd.distace;
            minPoint = pd.point;
        }
    }
    if (minPoint != null && minDist <= raduis) {
        point.x = minPoint.x;
        point.y = minPoint.y;
        return true;
    }
    return false;
}
exports.mergePointWithLine = mergePointWithLine;
function distanceBetweenPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
exports.distanceBetweenPoints = distanceBetweenPoints;
function distanceFromPointToLine(point, line) {
    const A = point.x - line.start.x;
    const B = point.y - line.start.y;
    const C = line.end.x - line.start.x;
    const D = line.end.y - line.start.y;
    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) {
        param = dot / len_sq;
    }
    let xx = 0;
    let yy = 0;
    if (param < 0) {
        xx = line.start.x;
        yy = line.start.y;
    }
    else if (param > 1) {
        xx = line.end.x;
        yy = line.end.y;
    }
    else {
        xx = line.start.x + param * C;
        yy = line.start.y + param * D;
    }
    let dx = point.x - xx;
    let dy = point.y - yy;
    return { point: new core_1.Point(xx, yy), distace: Math.sqrt(dx * dx + dy * dy) };
}
exports.distanceFromPointToLine = distanceFromPointToLine;
function checkIntersection(line1, line2) {
    let checkedPoints = [line1.start, line1.end, line2.start, line2.end];
    let A, B, C;
    let pointxx, pointyy;
    if (isPointOnLine(line2, line1.start))
        return line1.start;
    if (isPointOnLine(line2, line1.end))
        return line1.end;
    if (isPointOnLine(line1, line2.start))
        return line2.start;
    if (isPointOnLine(line1, line2.end))
        return line2.end;
    return TempCheck();
    function isPointOnLine(l, c) {
        let p1 = l.start;
        let p2 = l.end;
        let dx1 = p2.x - p1.x;
        let dy1 = p2.y - p1.y;
        let dx = c.x - p1.x;
        let dy = c.y - p1.y;
        let S = dx1 * dy - dx * dy1;
        let ab = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        let h = S / ab;
        return Math.abs(h) < 0.1;
    }
    function VEK(ax, ay, bx, by) {
        return ax * by - bx * ay;
    }
    function CrossingCheck(p1, p2, p3, p4) {
        let v1, v2, v3, v4;
        v1 = VEK(p4.x - p3.x, p4.y - p3.y, p1.x - p3.x, p1.y - p3.y);
        v2 = VEK(p4.x - p3.x, p4.y - p3.y, p2.x - p3.x, p2.y - p3.y);
        v3 = VEK(p2.x - p1.x, p2.y - p1.y, p3.x - p1.x, p3.y - p1.y);
        v4 = VEK(p2.x - p1.x, p2.y - p1.y, p4.x - p1.x, p4.y - p1.y);
        if (v1 * v2 < 0 && v3 * v4 < 0)
            return true;
        else
            return false;
    }
    function EquationOfTheLine(p1, p2) {
        A = p2.y - p1.y;
        B = p1.x - p2.x;
        C = -p1.x * (p2.y - p1.y) + p1.y * (p2.x - p1.x);
    }
    function IntersectionX(a1, b1, c1, a2, b2, c2) {
        let d, dx, pointx;
        d = a1 * b2 - b1 * a2;
        dx = -c1 * b2 + b1 * c2;
        pointx = dx / d;
        return pointx;
    }
    function IntersectionY(a1, b1, c1, a2, b2, c2) {
        let d, dy, pointy;
        d = a1 * b2 - b1 * a2;
        dy = -a1 * c2 + c1 * a2;
        pointy = dy / d;
        return pointy;
    }
    function TempCheck() {
        if (CrossingCheck(checkedPoints[0], checkedPoints[1], checkedPoints[2], checkedPoints[3])) {
            let a1, b1, c1, a2, b2, c2;
            EquationOfTheLine(checkedPoints[0], checkedPoints[1]);
            a1 = A;
            b1 = B;
            c1 = C;
            EquationOfTheLine(checkedPoints[2], checkedPoints[3]);
            a2 = A;
            b2 = B;
            c2 = C;
            pointxx = IntersectionX(a1, b1, c1, a2, b2, c2);
            pointyy = IntersectionY(a1, b1, c1, a2, b2, c2);
            return new core_1.Point(pointxx, pointyy);
        }
        else {
            return null;
        }
    }
}
exports.checkIntersection = checkIntersection;


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isTrianglesEqual = exports.isLinesEqual = exports.isPointsEqual = exports.Triangle = exports.Line = exports.Point = void 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
exports.Point = Point;
class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
exports.Line = Line;
class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}
exports.Triangle = Triangle;
function isPointsEqual(a, b, alpha = 1) {
    return Math.abs(a.x - b.x) <= alpha && Math.abs(a.y - b.y) <= alpha;
}
exports.isPointsEqual = isPointsEqual;
function isLinesEqual(a, b, alpha = 1) {
    return ((isPointsEqual(a.start, b.start, alpha) && isPointsEqual(a.end, b.end, alpha)) ||
        (isPointsEqual(a.end, b.start, alpha) && isPointsEqual(a.start, b.end, alpha)));
}
exports.isLinesEqual = isLinesEqual;
function isTrianglesEqual(a, b, alpha = 1) {
    let equals = 0;
    equals +=
        isPointsEqual(a.p1, b.p1, alpha) ||
            isPointsEqual(a.p1, b.p2, alpha) ||
            isPointsEqual(a.p1, b.p3, alpha)
            ? 1
            : 0;
    equals +=
        isPointsEqual(a.p2, b.p1, alpha) ||
            isPointsEqual(a.p2, b.p2, alpha) ||
            isPointsEqual(a.p2, b.p3, alpha)
            ? 1
            : 0;
    equals +=
        isPointsEqual(a.p3, b.p1, alpha) ||
            isPointsEqual(a.p3, b.p2, alpha) ||
            isPointsEqual(a.p3, b.p3, alpha)
            ? 1
            : 0;
    return equals === 3;
}
exports.isTrianglesEqual = isTrianglesEqual;


/***/ }),

/***/ "./src/inputtrianglecanvas.ts":
/*!************************************!*\
  !*** ./src/inputtrianglecanvas.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputTriangleCanvas = exports.InputTriangleCanvasConfig = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
const calculation_1 = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");
class InputTriangleCanvasConfig extends trianglecanvas_1.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        this.mergeRadius = 50;
        Object.assign(this, init);
    }
}
exports.InputTriangleCanvasConfig = InputTriangleCanvasConfig;
class DrawAction {
}
class InputTriangleCanvas extends trianglecanvas_1.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
        this.lines = [];
        this.intersectionPoints = [[]];
        this.cancelledActions = [];
        this.mousePos = new core_1.Point(0, 0);
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
            this.correctSelectedPoint();
        };
        this.pointerupEventHandler = (e) => {
            if (this.selectedPoint == null)
                return;
            this.correctMousePoint();
            let line = new core_1.Line(this.selectedPoint.clone(), this.mousePos.clone());
            this.addIntersectionPoint(line);
            this.lines.push(line);
            this.selectedPoint = null;
            this.redraw();
        };
        this.runUserEvents();
    }
    clearAll() {
        this.clearCanvas();
        this.lines = [];
        this.intersectionPoints = [[]];
        this.cancelledActions = [];
    }
    undo() {
        if (this.lines.length == 0)
            return;
        this.cancelledActions.push({
            line: this.lines.pop(),
            ipoints: this.intersectionPoints.length > 0 ? this.intersectionPoints.pop() : [],
        });
        this.redraw();
    }
    redo() {
        if (this.cancelledActions.length == 0)
            return;
        let savedAction = this.cancelledActions.pop();
        this.lines.push(savedAction.line);
        if (savedAction.ipoints.length > 0)
            this.intersectionPoints.push(savedAction.ipoints);
        this.redraw();
    }
    updateMousePos(e) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
    }
    mergePointWithIntersectionPoints(point) {
        if ((0, calculation_1.mergePointWithPoint)(point, this.intersectionPoints.reduce((accum, item) => {
            accum.push(...item);
            return accum;
        }, []), this.config.mergeRadius))
            return true;
        return false;
    }
    mergePointWithGrid(point) {
        let size = this.config.gridCellSize;
        let cx = Math.floor(point.x / size);
        let cy = Math.floor(point.y / size);
        let startPoint = new core_1.Point(cx * size, cy * size);
        let gridPoints = [
            startPoint,
            new core_1.Point(startPoint.x + this.config.gridCellSize, startPoint.y),
            new core_1.Point(startPoint.x, startPoint.y + this.config.gridCellSize),
            new core_1.Point(startPoint.x + this.config.gridCellSize, startPoint.y + this.config.gridCellSize),
        ];
        if ((0, calculation_1.mergePointWithPoint)(point, gridPoints, this.config.gridCellSize))
            return true;
        return false;
    }
    addIntersectionPoint(line) {
        let points = [];
        for (let withLine of this.lines) {
            let point = (0, calculation_1.checkIntersection)(line, withLine);
            if (point != null)
                points.push(point);
        }
        if (points.length > 0) {
            this.intersectionPoints.push(points);
        }
    }
    correctPointPos(point) {
        let res = false;
        if (!res) {
            res = this.mergePointWithIntersectionPoints(point);
        }
        if (!res) {
            res = (0, calculation_1.mergePointWithLinePoints)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res) {
            res = (0, calculation_1.mergePointWithLine)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res && this.config.useGrid) {
            res = this.mergePointWithGrid(point);
        }
    }
    correctMousePoint() {
        this.correctPointPos(this.mousePos);
    }
    correctSelectedPoint() {
        let point = new core_1.Point(this.mousePos.x, this.mousePos.y);
        this.correctPointPos(point);
        this.selectedPoint = point.clone();
    }
    redraw() {
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
    runUserEvents() {
        let canvas = this.canvasElement;
        canvas.addEventListener("pointerdown", this.pointerdownEventHandler, false);
        canvas.addEventListener("pointerup", this.pointerupEventHandler, false);
        canvas.addEventListener("pointercancel", () => { }, false);
        canvas.addEventListener("pointermove", this.pointermoveEventHandler, false);
    }
}
exports.InputTriangleCanvas = InputTriangleCanvas;


/***/ }),

/***/ "./src/outputtrianglecanvas.ts":
/*!*************************************!*\
  !*** ./src/outputtrianglecanvas.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutputTriangleCanvas = exports.OutputTriangleCanvasConfig = void 0;
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
class OutputTriangleCanvasConfig extends trianglecanvas_1.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        Object.assign(this, init);
    }
}
exports.OutputTriangleCanvasConfig = OutputTriangleCanvasConfig;
class OutputTriangleCanvas extends trianglecanvas_1.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
    }
    drawLines(lines, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        for (let line of lines) {
            this.drawLine(line.start, line.end, color, lineWidth);
        }
    }
    drawPoints(points, color = this
        .config.color, pointSize = this.config.pointSize) {
        for (let point of points) {
            this.drawPoint(point, color, pointSize);
        }
    }
    drawTriangles(triangles, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        for (let triangle of triangles) {
            this.drawTriangle(triangle, color, lineWidth);
        }
    }
}
exports.OutputTriangleCanvas = OutputTriangleCanvas;


/***/ }),

/***/ "./src/trianglecanvas.ts":
/*!*******************************!*\
  !*** ./src/trianglecanvas.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TriangleCanvas = exports.TriangleCanvasConfig = exports.ColorGenerator = void 0;
class ColorGenerator {
    constructor(generate) {
        this.generate = generate;
    }
}
exports.ColorGenerator = ColorGenerator;
class TriangleCanvasConfig {
    constructor(init) {
        this.color = "#000000";
        this.lineWidth = 3;
        this.pointSize = 5;
        this.canvasId = "canvas";
        this.useGrid = false;
        this.gridColor = "#505050";
        this.gridLineWidth = 1;
        this.gridCellSize = 40;
        Object.assign(this, init);
    }
}
exports.TriangleCanvasConfig = TriangleCanvasConfig;
class TriangleCanvas {
    constructor(config) {
        this.config = config;
        this.onResize = (e) => {
            let temp = this.ctx.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
            this.canvasElement.width = this.canvasElement.offsetWidth;
            this.canvasElement.height = this.canvasElement.offsetHeight;
            this.ctx.putImageData(temp, 0, 0);
        };
        this.canvasElement = document.getElementById(config.canvasId);
        this.canvasElement.width = this.canvasElement.offsetWidth;
        this.canvasElement.height = this.canvasElement.offsetHeight;
        window.addEventListener("resize", this.onResize, false);
        this.ctx = this.canvasElement.getContext("2d", {
            willReadFrequently: true,
        });
        this.ctx.lineCap = 'round';
        if (this.config.useGrid) {
            this.drawGrid();
        }
    }
    drawGrid(color = this.config.gridColor, size = this.config.gridCellSize) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= this.canvasElement.width; x += size) {
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, this.canvasElement.height);
        }
        for (let y = 0; y <= this.canvasElement.height; y += size) {
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(this.canvasElement.width, y + 0.5);
        }
        this.ctx.stroke();
    }
    drawLine(from, to, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.strokeStyle = color.generate();
        else
            this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }
    drawPoint(point, color = this
        .config.color, pointSize = this.config.pointSize) {
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.fillStyle = color.generate();
        else
            this.ctx.fillStyle = color;
        let size = pointSize;
        this.ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        this.ctx.stroke();
    }
    drawTriangle(triangle, color = this
        .config.color, lineWidth = this.config.lineWidth) {
        this.ctx.beginPath();
        if (color instanceof ColorGenerator)
            this.ctx.fillStyle = color.generate();
        else
            this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.moveTo(triangle.p1.x, triangle.p1.y);
        this.ctx.lineTo(triangle.p2.x, triangle.p2.y);
        this.ctx.lineTo(triangle.p3.x, triangle.p3.y);
        this.ctx.lineTo(triangle.p1.x, triangle.p1.y);
        this.ctx.stroke();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        if (this.config.useGrid) {
            this.drawGrid();
        }
    }
}
exports.TriangleCanvas = TriangleCanvas;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const trianglecanvas_1 = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
const calculation_1 = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");
const inputtrianglecanvas_1 = __webpack_require__(/*! ./inputtrianglecanvas */ "./src/inputtrianglecanvas.ts");
const outputtrianglecanvas_1 = __webpack_require__(/*! ./outputtrianglecanvas */ "./src/outputtrianglecanvas.ts");
let canvas = new inputtrianglecanvas_1.InputTriangleCanvas(new inputtrianglecanvas_1.InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    mergeRadius: 25,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20,
}));
let connectionsCanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig({
    color: new trianglecanvas_1.ColorGenerator(() => "#" +
        ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6) +
        "50"),
    lineWidth: 3,
    pointSize: 8,
    canvasId: "connections",
}));
let showTriangleIndex = 0;
let trianglecanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
}));
let calculator = new calculation_1.TrianglesCalculator();
document.getElementById("clear")?.addEventListener("click", () => {
    canvas.clearAll();
    connectionsCanvas.clearCanvas();
    trianglecanvas.clearCanvas();
});
document.getElementById("btn-prev")?.addEventListener("click", () => {
    if (showTriangleIndex > 0)
        showTriangleIndex--;
    trianglecanvas.clearCanvas();
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
});
document.getElementById("btn-next")?.addEventListener("click", () => {
    if (showTriangleIndex < calculator.triangles.length - 1)
        showTriangleIndex++;
    trianglecanvas.clearCanvas();
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
});
document.getElementById("calc")?.addEventListener("click", () => {
    calculator.calc(canvas.lines);
    connectionsCanvas.drawLines(calculator.connections);
    connectionsCanvas.drawPoints(calculator.points, "red");
    trianglecanvas.drawTriangles(calculator.triangles, "grey");
    trianglecanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
    document.getElementById("triangles-count").textContent = String(calculator.triangles.length);
    document.getElementById("points-count").textContent = String(calculator.points.length);
});
document.getElementById("redo")?.addEventListener("click", () => {
    canvas.redo();
});
document.getElementById("undo")?.addEventListener("click", () => {
    canvas.undo();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDOUIsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUV0QixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksWUFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQzdFLENBQUM7QUFqQ0QsMERBaUNDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsS0FBVyxFQUFFLEtBQVc7SUFDeEQsSUFBSSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVMsQ0FBQztJQUNwQyxJQUFJLE9BQWUsRUFBRSxPQUFlLENBQUM7SUFFckMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFFdEQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDMUQsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFBRSxPQUFPLEtBQUss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LE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jYWxjdWxhdGlvbi50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvaW5wdXR0cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvb3V0cHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL3RyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgUG9pbnQsXHJcbiAgTGluZSxcclxuICBUcmlhbmdsZSxcclxuICBpc1BvaW50c0VxdWFsLFxyXG4gIGlzTGluZXNFcXVhbCxcclxuICBpc1RyaWFuZ2xlc0VxdWFsLFxyXG59IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZXNDYWxjdWxhdG9yQ29uZmlnIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZXNDYWxjdWxhdG9yIHtcclxuICBwb2ludHM6IFBvaW50W10gPSBbXTtcclxuICBsaW5lczogTGluZVtdID0gW107XHJcbiAgY29ubmVjdGlvbnM6IExpbmVbXSA9IFtdO1xyXG4gIHRyaWFuZ2xlczogVHJpYW5nbGVbXSA9IFtdO1xyXG4gIHNlZ21lbnRzTWFwOiBNYXA8bnVtYmVyLCBQb2ludFtdPiA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG5cclxuICBwdWJsaWMgY2FsYyhsaW5lczogTGluZVtdKSB7XHJcbiAgICB0aGlzLmxpbmVzID0gbGluZXM7XHJcbiAgICB0aGlzLnJlY2FsY0ludGVyc2VjdGlvbnMoKTtcclxuICAgIHRoaXMucmVjYWxjQ29ubmVjdGlvbnMoKTtcclxuICAgIHRoaXMucmVjYWxjVHJpYW5nbGVzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY0ludGVyc2VjdGlvbnMoKSB7XHJcbiAgICB0aGlzLnNlZ21lbnRzTWFwID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5zZXQoaSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIGZvciAobGV0IGxpbmUxIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5wb2ludHMucHVzaChsaW5lMS5zdGFydCk7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKT8ucHVzaChsaW5lMS5lbmQpO1xyXG4gICAgICBmb3IgKGxldCBsaW5lMiBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgICAgbGV0IGludGVyc2VjdGlvblBvaW50ID0gY2hlY2tJbnRlcnNlY3Rpb24obGluZTEsIGxpbmUyKTtcclxuICAgICAgICBpZiAoaW50ZXJzZWN0aW9uUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcFxyXG4gICAgICAgICAgICAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpXHJcbiAgICAgICAgICAgID8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwXHJcbiAgICAgICAgICAgIC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUyKSlcclxuICAgICAgICAgICAgPy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICAgIHRoaXMucG9pbnRzLnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucG9pbnRzID0gdGhpcy5wb2ludHMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgocCkgPT4gaXNQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNDb25uZWN0aW9ucygpIHtcclxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGludGVyc2VjdGlvblBvaW50cyBvZiB0aGlzLnNlZ21lbnRzTWFwLnZhbHVlcygpKSB7XHJcbiAgICAgIGZvciAobGV0IHAxIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgIGZvciAobGV0IHAyIG9mIGludGVyc2VjdGlvblBvaW50cykge1xyXG4gICAgICAgICAgaWYgKCFpc1BvaW50c0VxdWFsKHAxLCBwMikpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKG5ldyBMaW5lKHAxLCBwMikpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY29ubmVjdGlvbnMgPSB0aGlzLmNvbm5lY3Rpb25zLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKGwpID0+IGlzTGluZXNFcXVhbChsLCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNUcmlhbmdsZXMoKSB7XHJcbiAgICB0aGlzLnRyaWFuZ2xlcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgbDEgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICBmb3IgKGxldCBsMiBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbDMgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICAgICAgaWYgKGwxID09IGwyIHx8IGwxID09IGwzIHx8IGwyID09IGwzKSBjb250aW51ZTtcclxuICAgICAgICAgIGxldCB0cmlhbmdsZSA9IGxpbmVzVG9UcmlhbmdsZShsMSwgbDIsIGwzKTtcclxuICAgICAgICAgIGlmICh0cmlhbmdsZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzLnB1c2godHJpYW5nbGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy50cmlhbmdsZXMgPSB0aGlzLnRyaWFuZ2xlcy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KCh0KSA9PiBpc1RyaWFuZ2xlc0VxdWFsKHQsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBsaW5lc1RvVHJpYW5nbGUobDE6IExpbmUsIGwyOiBMaW5lLCBsMzogTGluZSk6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbbDEuc3RhcnQsIGwxLmVuZCwgbDIuc3RhcnQsIGwyLmVuZCwgbDMuc3RhcnQsIGwzLmVuZF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDEuc3RhcnQsIGwxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDIuc3RhcnQsIGwyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDMuc3RhcnQsIGwzLmVuZCk7XHJcblxyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKSAqKiAwLjU7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IE1hdGguYWJzKFMpIDw9IDEpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLnBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgcG9pbnQ6IFBvaW50OyBkaXN0YWNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgQSA9IHBvaW50LnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgQiA9IHBvaW50LnkgLSBsaW5lLnN0YXJ0Lnk7XHJcbiAgY29uc3QgQyA9IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgRCA9IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0Lnk7XHJcblxyXG4gIGxldCBkb3QgPSBBICogQyArIEIgKiBEO1xyXG4gIGxldCBsZW5fc3EgPSBDICogQyArIEQgKiBEO1xyXG4gIGxldCBwYXJhbSA9IC0xO1xyXG4gIGlmIChsZW5fc3EgIT0gMCkge1xyXG4gICAgcGFyYW0gPSBkb3QgLyBsZW5fc3E7XHJcbiAgfVxyXG4gIGxldCB4eCA9IDA7XHJcbiAgbGV0IHl5ID0gMDtcclxuXHJcbiAgaWYgKHBhcmFtIDwgMCkge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0Lng7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueTtcclxuICB9IGVsc2UgaWYgKHBhcmFtID4gMSkge1xyXG4gICAgeHggPSBsaW5lLmVuZC54O1xyXG4gICAgeXkgPSBsaW5lLmVuZC55O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueCArIHBhcmFtICogQztcclxuICAgIHl5ID0gbGluZS5zdGFydC55ICsgcGFyYW0gKiBEO1xyXG4gIH1cclxuXHJcbiAgbGV0IGR4ID0gcG9pbnQueCAtIHh4O1xyXG4gIGxldCBkeSA9IHBvaW50LnkgLSB5eTtcclxuXHJcbiAgcmV0dXJuIHsgcG9pbnQ6IG5ldyBQb2ludCh4eCwgeXkpLCBkaXN0YWNlOiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gaXNQb2ludE9uTGluZShsOiBMaW5lLCBjOiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHAxID0gbC5zdGFydDtcclxuICAgIGxldCBwMiA9IGwuZW5kO1xyXG5cclxuICAgIGxldCBkeDEgPSBwMi54IC0gcDEueDtcclxuICAgIGxldCBkeTEgPSBwMi55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgZHggPSBjLnggLSBwMS54O1xyXG4gICAgbGV0IGR5ID0gYy55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgUyA9IGR4MSAqIGR5IC0gZHggKiBkeTE7XHJcbiAgICBsZXQgYWIgPSBNYXRoLnNxcnQoZHgxICogZHgxICsgZHkxICogZHkxKTtcclxuICAgIGxldCBoID0gUyAvIGFiO1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKGgpIDwgMC4xO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgY2xvbmUoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBQb2ludCwgcHVibGljIGVuZDogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHAxOiBQb2ludCwgcHVibGljIHAyOiBQb2ludCwgcHVibGljIHAzOiBQb2ludCkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRzRXF1YWwoYTogUG9pbnQsIGI6IFBvaW50LCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhhLnggLSBiLngpIDw9IGFscGhhICYmIE1hdGguYWJzKGEueSAtIGIueSkgPD0gYWxwaGE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzRXF1YWwoYTogTGluZSwgYjogTGluZSwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuZW5kLCBhbHBoYSkpIHx8XHJcbiAgICAoaXNQb2ludHNFcXVhbChhLmVuZCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5lbmQsIGFscGhhKSlcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmlhbmdsZXNFcXVhbChhOiBUcmlhbmdsZSwgYjogVHJpYW5nbGUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgbGV0IGVxdWFscyA9IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgcmV0dXJuIGVxdWFscyA9PT0gMztcclxufSIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVDYW52YXMsIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIH0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuaW1wb3J0IHtcclxuICBjaGVja0ludGVyc2VjdGlvbixcclxuICBkaXN0YW5jZUJldHdlZW5Qb2ludHMsXHJcbiAgZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUsXHJcbiAgbWVyZ2VQb2ludFdpdGhMaW5lLFxyXG4gIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyxcclxuICBtZXJnZVBvaW50V2l0aFBvaW50LFxyXG59IGZyb20gXCIuL2NhbGN1bGF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgbWVyZ2VSYWRpdXM6IG51bWJlciA9IDUwO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoaW5pdD86IFBhcnRpYWw8SW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIERyYXdBY3Rpb24ge1xyXG4gIGxpbmU6IExpbmU7XHJcbiAgaXBvaW50czogUG9pbnRbXTtcclxufVxyXG5leHBvcnQgY2xhc3MgSW5wdXRUcmlhbmdsZUNhbnZhcyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBsaW5lczogTGluZVtdID0gW107XHJcbiAgaW50ZXJzZWN0aW9uUG9pbnRzOiBbUG9pbnRbXV0gPSBbW11dO1xyXG4gIGNhbmNlbGxlZEFjdGlvbnM6IERyYXdBY3Rpb25bXSA9IFtdO1xyXG5cclxuICBtb3VzZVBvczogUG9pbnQgPSBuZXcgUG9pbnQoMCwgMCk7XHJcbiAgc2VsZWN0ZWRQb2ludDogUG9pbnQgfCBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gICAgdGhpcy5ydW5Vc2VyRXZlbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJBbGwoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLmxpbmVzID0gW107XHJcbiAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cyA9IFtbXV07XHJcbiAgICB0aGlzLmNhbmNlbGxlZEFjdGlvbnMgPSBbXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB1bmRvKCkge1xyXG4gICAgaWYgKHRoaXMubGluZXMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgIHRoaXMuY2FuY2VsbGVkQWN0aW9ucy5wdXNoKHtcclxuICAgICAgbGluZTogdGhpcy5saW5lcy5wb3AoKSxcclxuICAgICAgaXBvaW50czpcclxuICAgICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5sZW5ndGggPiAwID8gdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucG9wKCkgOiBbXSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWRvKCkge1xyXG4gICAgaWYgKHRoaXMuY2FuY2VsbGVkQWN0aW9ucy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgbGV0IHNhdmVkQWN0aW9uID0gdGhpcy5jYW5jZWxsZWRBY3Rpb25zLnBvcCgpO1xyXG4gICAgdGhpcy5saW5lcy5wdXNoKHNhdmVkQWN0aW9uLmxpbmUpO1xyXG4gICAgaWYgKHNhdmVkQWN0aW9uLmlwb2ludHMubGVuZ3RoID4gMClcclxuICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucHVzaChzYXZlZEFjdGlvbi5pcG9pbnRzKTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZU1vdXNlUG9zKGU6IFBvaW50ZXJFdmVudCkge1xyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMubW91c2VQb3MueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgIHRoaXMubW91c2VQb3MueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludDogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGlmIChcclxuICAgICAgbWVyZ2VQb2ludFdpdGhQb2ludChcclxuICAgICAgICBwb2ludCxcclxuICAgICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5yZWR1Y2UoKGFjY3VtLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICBhY2N1bS5wdXNoKC4uLml0ZW0pO1xyXG4gICAgICAgICAgcmV0dXJuIGFjY3VtO1xyXG4gICAgICAgIH0sIFtdKSxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1c1xyXG4gICAgICApXHJcbiAgICApXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtZXJnZVBvaW50V2l0aEdyaWQocG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgc2l6ZSA9IHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZTtcclxuICAgIGxldCBjeCA9IE1hdGguZmxvb3IocG9pbnQueCAvIHNpemUpO1xyXG4gICAgbGV0IGN5ID0gTWF0aC5mbG9vcihwb2ludC55IC8gc2l6ZSk7XHJcbiAgICBsZXQgc3RhcnRQb2ludCA9IG5ldyBQb2ludChjeCAqIHNpemUsIGN5ICogc2l6ZSk7XHJcbiAgICBsZXQgZ3JpZFBvaW50cyA9IFtcclxuICAgICAgc3RhcnRQb2ludCxcclxuICAgICAgbmV3IFBvaW50KHN0YXJ0UG9pbnQueCArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSwgc3RhcnRQb2ludC55KSxcclxuICAgICAgbmV3IFBvaW50KHN0YXJ0UG9pbnQueCwgc3RhcnRQb2ludC55ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplKSxcclxuICAgICAgbmV3IFBvaW50KFxyXG4gICAgICAgIHN0YXJ0UG9pbnQueCArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSxcclxuICAgICAgICBzdGFydFBvaW50LnkgKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemVcclxuICAgICAgKSxcclxuICAgIF07XHJcbiAgICBpZiAobWVyZ2VQb2ludFdpdGhQb2ludChwb2ludCwgZ3JpZFBvaW50cywgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplKSlcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEludGVyc2VjdGlvblBvaW50KGxpbmU6IExpbmUpIHtcclxuICAgIGxldCBwb2ludHM6IFBvaW50W10gPSBbXTtcclxuICAgIGZvciAobGV0IHdpdGhMaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgbGV0IHBvaW50ID0gY2hlY2tJbnRlcnNlY3Rpb24obGluZSwgd2l0aExpbmUpO1xyXG4gICAgICBpZiAocG9pbnQgIT0gbnVsbCkgcG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHBvaW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnB1c2gocG9pbnRzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFBvaW50UG9zKHBvaW50OiBQb2ludCkge1xyXG4gICAgbGV0IHJlcyA9IGZhbHNlO1xyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEludGVyc2VjdGlvblBvaW50cyhwb2ludCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5saW5lcyxcclxuICAgICAgICB0aGlzLmNvbmZpZy5tZXJnZVJhZGl1cyAqIDJcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IG1lcmdlUG9pbnRXaXRoTGluZShwb2ludCwgdGhpcy5saW5lcywgdGhpcy5jb25maWcubWVyZ2VSYWRpdXMgKiAyKTtcclxuICAgIH1cclxuICAgIGlmICghcmVzICYmIHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgcmVzID0gdGhpcy5tZXJnZVBvaW50V2l0aEdyaWQocG9pbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0TW91c2VQb2ludCgpIHtcclxuICAgIHRoaXMuY29ycmVjdFBvaW50UG9zKHRoaXMubW91c2VQb3MpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3JyZWN0U2VsZWN0ZWRQb2ludCgpIHtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludCh0aGlzLm1vdXNlUG9zLngsIHRoaXMubW91c2VQb3MueSk7XHJcbiAgICB0aGlzLmNvcnJlY3RQb2ludFBvcyhwb2ludCk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBwb2ludC5jbG9uZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWRyYXcoKSB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5zdGFydCk7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGlwb2ludHMgb2YgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgZm9yIChsZXQgcG9pbnQgb2YgaXBvaW50cykge1xyXG4gICAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5Vc2VyRXZlbnRzKCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzRWxlbWVudDtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMucG9pbnRlcmRvd25FdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMucG9pbnRlcnVwRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4ge30sIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5wb2ludGVybW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVybW92ZUV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludCwgdGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVyZG93bkV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNvcnJlY3RTZWxlY3RlZFBvaW50KCk7XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVydXBFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLmNvcnJlY3RNb3VzZVBvaW50KCk7XHJcbiAgICBsZXQgbGluZSA9IG5ldyBMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludC5jbG9uZSgpLCB0aGlzLm1vdXNlUG9zLmNsb25lKCkpO1xyXG4gICAgdGhpcy5hZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lKTtcclxuICAgIHRoaXMubGluZXMucHVzaChsaW5lKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IG51bGw7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgc3VwZXIoaW5pdCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGluaXQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICBzdXBlcihjb25maWcgYXMgVHJpYW5nbGVDYW52YXNDb25maWcpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lcyhcclxuICAgIGxpbmVzOiBMaW5lW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnRzKFxyXG4gICAgcG9pbnRzOiBQb2ludFtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5wb2ludFNpemVcclxuICApIHtcclxuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChwb2ludCwgY29sb3IsIHBvaW50U2l6ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlcyhcclxuICAgIHRyaWFuZ2xlczogVHJpYW5nbGVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCB0cmlhbmdsZSBvZiB0cmlhbmdsZXMpIHtcclxuICAgICAgdGhpcy5kcmF3VHJpYW5nbGUodHJpYW5nbGUsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29sb3JHZW5lcmF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBnZW5lcmF0ZTogKCkgPT4gc3RyaW5nKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPVxyXG4gICAgXCIjMDAwMDAwXCI7XHJcbiAgcHVibGljIGxpbmVXaWR0aDogbnVtYmVyID0gMztcclxuICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIgPSA1O1xyXG4gIHB1YmxpYyBjYW52YXNJZDogc3RyaW5nID0gXCJjYW52YXNcIjtcclxuXHJcbiAgcHVibGljIHVzZUdyaWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZ3JpZENvbG9yOiBzdHJpbmcgPSBcIiM1MDUwNTBcIjtcclxuICBwdWJsaWMgZ3JpZExpbmVXaWR0aDogbnVtYmVyID0gMTtcclxuICBwdWJsaWMgZ3JpZENlbGxTaXplOiBudW1iZXIgPSA0MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPFRyaWFuZ2xlQ2FudmFzQ29uZmlnPikge1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIG9uUmVzaXplID0gKGU6IFVJRXZlbnQpID0+IHtcclxuICAgIGxldCB0ZW1wID0gdGhpcy5jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHRoaXMuY3R4LnB1dEltYWdlRGF0YSh0ZW1wLCAwLCAwKTtcclxuICB9O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIGNvbmZpZy5jYW52YXNJZFxyXG4gICAgKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZSwgZmFsc2UpO1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIsIHtcclxuICAgICAgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlLFxyXG4gICAgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgdGhpcy5jdHgubGluZUNhcCA9ICdyb3VuZCc7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdHcmlkKFxyXG4gICAgY29sb3I6IHN0cmluZyA9IHRoaXMuY29uZmlnLmdyaWRDb2xvcixcclxuICAgIHNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gMTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7IHggKz0gc2l6ZSkge1xyXG4gICAgICB0aGlzLmN0eC5tb3ZlVG8oeCArIDAuNSwgMCk7XHJcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyh4ICsgMC41LCB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0OyB5ICs9IHNpemUpIHtcclxuICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHkgKyAwLjUpO1xyXG4gICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5jYW52YXNFbGVtZW50LndpZHRoLCB5ICsgMC41KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3TGluZShcclxuICAgIGZyb206IFBvaW50LFxyXG4gICAgdG86IFBvaW50LFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpXHJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgIHRoaXMuY3R4Lm1vdmVUbyhmcm9tLngsIGZyb20ueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odG8ueCwgdG8ueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnQoXHJcbiAgICBwb2ludDogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBwb2ludFNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLnBvaW50U2l6ZVxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcikgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBsZXQgc2l6ZSA9IHBvaW50U2l6ZTtcclxuICAgIHRoaXMuY3R4LmZpbGxSZWN0KHBvaW50LnggLSBzaXplIC8gMiwgcG9pbnQueSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdUcmlhbmdsZShcclxuICAgIHRyaWFuZ2xlOiBUcmlhbmdsZSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKHRyaWFuZ2xlLnAxLngsIHRyaWFuZ2xlLnAxLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAyLngsIHRyaWFuZ2xlLnAyLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAzLngsIHRyaWFuZ2xlLnAzLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAxLngsIHRyaWFuZ2xlLnAxLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJDYW52YXMoKSB7XHJcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodFxyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHtcclxuICBDb2xvckdlbmVyYXRvcixcclxuICBUcmlhbmdsZUNhbnZhcyxcclxuICBUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5pbXBvcnQgeyBUcmlhbmdsZXNDYWxjdWxhdG9yIH0gZnJvbSBcIi4vY2FsY3VsYXRpb25cIjtcclxuaW1wb3J0IHtcclxuICBJbnB1dFRyaWFuZ2xlQ2FudmFzLFxyXG4gIElucHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vaW5wdXR0cmlhbmdsZWNhbnZhc1wiO1xyXG5pbXBvcnQge1xyXG4gIE91dHB1dFRyaWFuZ2xlQ2FudmFzLFxyXG4gIE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL291dHB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5sZXQgY2FudmFzID0gbmV3IElucHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IElucHV0VHJpYW5nbGVDYW52YXNDb25maWcoe1xyXG4gICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgIGxpbmVXaWR0aDogMixcclxuICAgIHBvaW50U2l6ZTogOCxcclxuICAgIGNhbnZhc0lkOiBcImNhbnZhc1wiLFxyXG4gICAgbWVyZ2VSYWRpdXM6IDI1LFxyXG4gICAgdXNlR3JpZDogdHJ1ZSxcclxuICAgIGdyaWRDZWxsU2l6ZTogNDAsXHJcbiAgICBncmlkTGluZVdpZHRoOiAyMCxcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IGNvbm5lY3Rpb25zQ2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyh7XHJcbiAgICBjb2xvcjogbmV3IENvbG9yR2VuZXJhdG9yKFxyXG4gICAgICAoKSA9PlxyXG4gICAgICAgIFwiI1wiICtcclxuICAgICAgICAoXHJcbiAgICAgICAgICBcIjAwMDAwXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygxNiwgNikpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgICkuc2xpY2UoLTYpICtcclxuICAgICAgICBcIjUwXCJcclxuICAgICksXHJcbiAgICBsaW5lV2lkdGg6IDMsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjb25uZWN0aW9uc1wiLFxyXG4gIH0pXHJcbik7XHJcblxyXG5sZXQgc2hvd1RyaWFuZ2xlSW5kZXggPSAwO1xyXG5sZXQgdHJpYW5nbGVjYW52YXMgPSBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcImJsYWNrXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDQsXHJcbiAgICBjYW52YXNJZDogXCJ0cmlhbmdsZXNcIixcclxuICB9KVxyXG4pO1xyXG5cclxubGV0IGNhbGN1bGF0b3IgPSBuZXcgVHJpYW5nbGVzQ2FsY3VsYXRvcigpO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhclwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMuY2xlYXJBbGwoKTtcclxuICBjb25uZWN0aW9uc0NhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcHJldlwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZiAoc2hvd1RyaWFuZ2xlSW5kZXggPiAwKSBzaG93VHJpYW5nbGVJbmRleC0tO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmNsZWFyQ2FudmFzKCk7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlcyhjYWxjdWxhdG9yLnRyaWFuZ2xlcywgXCJncmV5XCIpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZShcclxuICAgIGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSxcclxuICAgIFwicmVkXCIsXHJcbiAgICA0XHJcbiAgKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLW5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKHNob3dUcmlhbmdsZUluZGV4IDwgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoIC0gMSkgc2hvd1RyaWFuZ2xlSW5kZXgrKztcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZXMoY2FsY3VsYXRvci50cmlhbmdsZXMsIFwiZ3JleVwiKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGUoXHJcbiAgICBjYWxjdWxhdG9yLnRyaWFuZ2xlc1tzaG93VHJpYW5nbGVJbmRleF0sXHJcbiAgICBcInJlZFwiLFxyXG4gICAgNFxyXG4gICk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxjXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbGN1bGF0b3IuY2FsYyhjYW52YXMubGluZXMpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmRyYXdMaW5lcyhjYWxjdWxhdG9yLmNvbm5lY3Rpb25zKTtcclxuICBjb25uZWN0aW9uc0NhbnZhcy5kcmF3UG9pbnRzKGNhbGN1bGF0b3IucG9pbnRzLCBcInJlZFwiKTtcclxuXHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlcyhjYWxjdWxhdG9yLnRyaWFuZ2xlcywgXCJncmV5XCIpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZShcclxuICAgIGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSxcclxuICAgIFwicmVkXCIsXHJcbiAgICA0XHJcbiAgKTtcclxuXHJcbiAgKFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlhbmdsZXMtY291bnRcIikgYXMgSFRNTFNwYW5FbGVtZW50IHwgbnVsbFxyXG4gICkudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoKTtcclxuXHJcbiAgKFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb2ludHMtY291bnRcIikgYXMgSFRNTFNwYW5FbGVtZW50IHwgbnVsbFxyXG4gICkudGV4dENvbnRlbnQgPSBTdHJpbmcoY2FsY3VsYXRvci5wb2ludHMubGVuZ3RoKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZG9cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FudmFzLnJlZG8oKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5kb1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMudW5kbygpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9