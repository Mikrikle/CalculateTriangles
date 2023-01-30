/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculation.ts":
/*!****************************!*\
  !*** ./src/calculation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TrianglesCalculator = exports.TrianglesCalculatorConfig = void 0;
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
    var a = (0, core_1.distanceBetween)(l1.start, l1.end);
    var b = (0, core_1.distanceBetween)(l2.start, l2.end);
    var c = (0, core_1.distanceBetween)(l3.start, l3.end);
    if (a > b + c || b > a + c || c > a + b)
        return null;
    const p = (a + b + c) / 2;
    let S = (p * (p - a) * (p - b) * (p - c)) ** 0.5;
    if (isNaN(S) || Math.abs(S) <= 1)
        return null;
    return new core_1.Triangle(hpoints[0], hpoints[1], hpoints[2]);
}
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


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.distanceBetween = exports.isTrianglesEqual = exports.isLinesEqual = exports.isPointsEqual = exports.Triangle = exports.Line = exports.Point = void 0;
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
function distanceBetween(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
exports.distanceBetween = distanceBetween;


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
class InputTriangleCanvasConfig extends trianglecanvas_1.TriangleCanvasConfig {
    constructor(color, lineWidth, pointSize, canvasId, anchorRadius) {
        super(color, lineWidth, pointSize, canvasId);
        this.anchorRadius = anchorRadius;
    }
}
exports.InputTriangleCanvasConfig = InputTriangleCanvasConfig;
class InputTriangleCanvas extends trianglecanvas_1.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
        this.lines = [];
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
            this.calculateSelectedPoint();
        };
        this.pointerupEventHandler = (e) => {
            if (this.selectedPoint == null)
                return;
            this.anchorPointToPoint(this.mousePos, this.lines, this.config.anchorRadius);
            this.lines.push(new core_1.Line(this.selectedPoint.clone(), this.mousePos.clone()));
            this.redraw();
            this.selectedPoint = null;
        };
        this.runUserEvents();
    }
    clearAll() {
        this.clearCanvas();
        this.lines = [];
    }
    updateMousePos(e) {
        const rect = this.canvasElement.getBoundingClientRect();
        this.mousePos.x = e.clientX - rect.left;
        this.mousePos.y = e.clientY - rect.top;
    }
    anchorPointToPoint(point, lines, radius) {
        let minPoint = null;
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let line of lines) {
            let distStart = (0, core_1.distanceBetween)(point, line.start);
            let distEnd = (0, core_1.distanceBetween)(point, line.end);
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
    calculateSelectedPoint() {
        let point = new core_1.Point(this.mousePos.x, this.mousePos.y);
        this.anchorPointToPoint(point, this.lines, this.config.anchorRadius);
        this.selectedPoint = point.clone();
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
    constructor(color, lineWidth, pointSize, canvasId) {
        super(color, lineWidth, pointSize, canvasId);
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
    constructor(color, lineWidth, pointSize, canvasId) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.pointSize = pointSize;
        this.canvasId = canvasId;
    }
}
exports.TriangleCanvasConfig = TriangleCanvasConfig;
class TriangleCanvas {
    constructor(config) {
        this.config = config;
        this.canvasElement = document.getElementById(config.canvasId);
        this.ctx = this.canvasElement.getContext("2d");
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
let canvas = new inputtrianglecanvas_1.InputTriangleCanvas(new inputtrianglecanvas_1.InputTriangleCanvasConfig("black", 2, 4, "canvas", 30));
let connectionsCanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig(new trianglecanvas_1.ColorGenerator(() => "#" +
    ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6) +
    "50"), 3, 8, "connections"));
let showTriangleIndex = 0;
let trianglecanvas = new outputtrianglecanvas_1.OutputTriangleCanvas(new outputtrianglecanvas_1.OutputTriangleCanvasConfig("black", 2, 4, "triangles"));
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxHQUFHLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVMsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVU7UUFDekQsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFNBQVMsYUFBYSxDQUFDLEVBQVMsRUFBRSxFQUFTLEVBQUUsRUFBUyxFQUFFLEVBQVM7UUFDL0QsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFFbkIsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzdELEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMs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QUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQzlELFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFdkQsY0FBYyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNELGNBQWMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUc3RSxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUMxQyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUdsRCxRQUFRLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FDdkMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY2FsY3VsYXRpb24udHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NvcmUudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2lucHV0dHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL291dHB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy90cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIFBvaW50LFxyXG4gIExpbmUsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNQb2ludHNFcXVhbCxcclxuICBpc0xpbmVzRXF1YWwsXHJcbiAgaXNUcmlhbmdsZXNFcXVhbCxcclxuICBkaXN0YW5jZUJldHdlZW4sXHJcbn0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3JDb25maWcge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlc0NhbGN1bGF0b3Ige1xyXG4gIHBvaW50czogUG9pbnRbXSA9IFtdO1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuICBjb25uZWN0aW9uczogTGluZVtdID0gW107XHJcbiAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdID0gW107XHJcbiAgc2VnbWVudHNNYXA6IE1hcDxudW1iZXIsIFBvaW50W10+ID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcblxyXG4gIHB1YmxpYyBjYWxjKGxpbmVzOiBMaW5lW10pIHtcclxuICAgIHRoaXMubGluZXMgPSBsaW5lcztcclxuICAgIHRoaXMucmVjYWxjSW50ZXJzZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNDb25uZWN0aW9ucygpO1xyXG4gICAgdGhpcy5yZWNhbGNUcmlhbmdsZXMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjSW50ZXJzZWN0aW9ucygpIHtcclxuICAgIHRoaXMuc2VnbWVudHNNYXAgPSBuZXcgTWFwPG51bWJlciwgUG9pbnRbXT4oKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLnNldChpLCBbXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgbGluZTEgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKGxpbmUxLnN0YXJ0KTtcclxuICAgICAgdGhpcy5wb2ludHMucHVzaChsaW5lMS5lbmQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKT8ucHVzaChsaW5lMS5zdGFydCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpPy5wdXNoKGxpbmUxLmVuZCk7XHJcbiAgICAgIGZvciAobGV0IGxpbmUyIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgICBsZXQgaW50ZXJzZWN0aW9uUG9pbnQgPSBjaGVja0ludGVyc2VjdGlvbihsaW5lMSwgbGluZTIpO1xyXG4gICAgICAgIGlmIChpbnRlcnNlY3Rpb25Qb2ludCAhPSBudWxsKSB7XHJcbiAgICAgICAgICB0aGlzLnNlZ21lbnRzTWFwXHJcbiAgICAgICAgICAgIC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSlcclxuICAgICAgICAgICAgPy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTIpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5wb2ludHMucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb2ludHMgPSB0aGlzLnBvaW50cy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY0Nvbm5lY3Rpb25zKCkge1xyXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaW50ZXJzZWN0aW9uUG9pbnRzIG9mIHRoaXMuc2VnbWVudHNNYXAudmFsdWVzKCkpIHtcclxuICAgICAgZm9yIChsZXQgcDEgb2YgaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcDIgb2YgaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgICAgICBpZiAoIWlzUG9pbnRzRXF1YWwocDEsIHAyKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLnB1c2gobmV3IExpbmUocDEsIHAyKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb25uZWN0aW9ucyA9IHRoaXMuY29ubmVjdGlvbnMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgobCkgPT4gaXNMaW5lc0VxdWFsKGwsIHZhbHVlKSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY1RyaWFuZ2xlcygpIHtcclxuICAgIHRoaXMudHJpYW5nbGVzID0gW107XHJcbiAgICBmb3IgKGxldCBsMSBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgIGZvciAobGV0IGwyIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICBmb3IgKGxldCBsMyBvZiB0aGlzLmNvbm5lY3Rpb25zKSB7XHJcbiAgICAgICAgICBpZiAobDEgPT0gbDIgfHwgbDEgPT0gbDMgfHwgbDIgPT0gbDMpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgbGV0IHRyaWFuZ2xlID0gbGluZXNUb1RyaWFuZ2xlKGwxLCBsMiwgbDMpO1xyXG4gICAgICAgICAgaWYgKHRyaWFuZ2xlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXMucHVzaCh0cmlhbmdsZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnRyaWFuZ2xlcyA9IHRoaXMudHJpYW5nbGVzLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHQpID0+IGlzVHJpYW5nbGVzRXF1YWwodCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpbmVzVG9UcmlhbmdsZShsMTogTGluZSwgbDI6IExpbmUsIGwzOiBMaW5lKTogVHJpYW5nbGUgfCBudWxsIHtcclxuICBsZXQgaHBvaW50cyA9IFtsMS5zdGFydCwgbDEuZW5kLCBsMi5zdGFydCwgbDIuZW5kLCBsMy5zdGFydCwgbDMuZW5kXTtcclxuICBocG9pbnRzID0gaHBvaW50cy5maWx0ZXIoXHJcbiAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGlzUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICk7XHJcbiAgaWYgKGhwb2ludHMubGVuZ3RoICE9IDMpIHJldHVybiBudWxsO1xyXG5cclxuICB2YXIgYSA9IGRpc3RhbmNlQmV0d2VlbihsMS5zdGFydCwgbDEuZW5kKTtcclxuICB2YXIgYiA9IGRpc3RhbmNlQmV0d2VlbihsMi5zdGFydCwgbDIuZW5kKTtcclxuICB2YXIgYyA9IGRpc3RhbmNlQmV0d2VlbihsMy5zdGFydCwgbDMuZW5kKTtcclxuXHJcbiAgaWYgKGEgPiBiICsgYyB8fCBiID4gYSArIGMgfHwgYyA+IGEgKyBiKSByZXR1cm4gbnVsbDtcclxuICBjb25zdCBwID0gKGEgKyBiICsgYykgLyAyO1xyXG4gIGxldCBTID0gKHAgKiAocCAtIGEpICogKHAgLSBiKSAqIChwIC0gYykpICoqIDAuNTtcclxuICBpZiAoaXNOYU4oUykgfHwgTWF0aC5hYnMoUykgPD0gMSkgcmV0dXJuIG51bGw7XHJcbiAgcmV0dXJuIG5ldyBUcmlhbmdsZShocG9pbnRzWzBdLCBocG9pbnRzWzFdLCBocG9pbnRzWzJdKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2hlY2tJbnRlcnNlY3Rpb24obGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICBsZXQgY2hlY2tlZFBvaW50cyA9IFtsaW5lMS5zdGFydCwgbGluZTEuZW5kLCBsaW5lMi5zdGFydCwgbGluZTIuZW5kXTtcclxuICBsZXQgQTogbnVtYmVyLCBCOiBudW1iZXIsIEM6IG51bWJlcjtcclxuICBsZXQgcG9pbnR4eDogbnVtYmVyLCBwb2ludHl5OiBudW1iZXI7XHJcblxyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5zdGFydCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMiwgbGluZTEuZW5kKSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUyLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUxLCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTIuZW5kO1xyXG5cclxuICByZXR1cm4gVGVtcENoZWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGlzUG9pbnRPbkxpbmUobDogTGluZSwgYzogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBwMSA9IGwuc3RhcnQ7XHJcbiAgICBsZXQgcDIgPSBsLmVuZDtcclxuXHJcbiAgICBsZXQgZHgxID0gcDIueCAtIHAxLng7XHJcbiAgICBsZXQgZHkxID0gcDIueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IGR4ID0gYy54IC0gcDEueDtcclxuICAgIGxldCBkeSA9IGMueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IFMgPSBkeDEgKiBkeSAtIGR4ICogZHkxO1xyXG4gICAgbGV0IGFiID0gTWF0aC5zcXJ0KGR4MSAqIGR4MSArIGR5MSAqIGR5MSk7XHJcbiAgICBsZXQgaCA9IFMgLyBhYjtcclxuICAgIHJldHVybiBNYXRoLmFicyhoKSA8IDAuMTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFZFSyhheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXggKiBieSAtIGJ4ICogYXk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDcm9zc2luZ0NoZWNrKHAxOiBQb2ludCwgcDI6IFBvaW50LCBwMzogUG9pbnQsIHA0OiBQb2ludCkge1xyXG4gICAgbGV0IHYxLCB2MiwgdjMsIHY0O1xyXG5cclxuICAgIHYxID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDEueCAtIHAzLngsIHAxLnkgLSBwMy55KTtcclxuICAgIHYyID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDIueCAtIHAzLngsIHAyLnkgLSBwMy55KTtcclxuICAgIHYzID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDMueCAtIHAxLngsIHAzLnkgLSBwMS55KTtcclxuICAgIHY0ID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDQueCAtIHAxLngsIHA0LnkgLSBwMS55KTtcclxuICAgIGlmICh2MSAqIHYyIDwgMCAmJiB2MyAqIHY0IDwgMCkgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEVxdWF0aW9uT2ZUaGVMaW5lKHAxOiBQb2ludCwgcDI6IFBvaW50KSB7XHJcbiAgICBBID0gcDIueSAtIHAxLnk7XHJcbiAgICBCID0gcDEueCAtIHAyLng7XHJcbiAgICBDID0gLXAxLnggKiAocDIueSAtIHAxLnkpICsgcDEueSAqIChwMi54IC0gcDEueCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbnRlcnNlY3Rpb25YKFxyXG4gICAgYTE6IG51bWJlcixcclxuICAgIGIxOiBudW1iZXIsXHJcbiAgICBjMTogbnVtYmVyLFxyXG4gICAgYTI6IG51bWJlcixcclxuICAgIGIyOiBudW1iZXIsXHJcbiAgICBjMjogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBsZXQgZCwgZHgsIHBvaW50eDtcclxuICAgIGQgPSBhMSAqIGIyIC0gYjEgKiBhMjtcclxuICAgIGR4ID0gLWMxICogYjIgKyBiMSAqIGMyO1xyXG4gICAgcG9pbnR4ID0gZHggLyBkO1xyXG4gICAgcmV0dXJuIHBvaW50eDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblkoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeSwgcG9pbnR5O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHkgPSAtYTEgKiBjMiArIGMxICogYTI7XHJcbiAgICBwb2ludHkgPSBkeSAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVGVtcENoZWNrKCk6IFBvaW50IHwgbnVsbCB7XHJcbiAgICBpZiAoXHJcbiAgICAgIENyb3NzaW5nQ2hlY2soXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1swXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzFdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMl0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1szXVxyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgbGV0IGExLCBiMSwgYzEsIGEyLCBiMiwgYzI7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMF0sIGNoZWNrZWRQb2ludHNbMV0pO1xyXG4gICAgICBhMSA9IEE7XHJcbiAgICAgIGIxID0gQjtcclxuICAgICAgYzEgPSBDO1xyXG4gICAgICBFcXVhdGlvbk9mVGhlTGluZShjaGVja2VkUG9pbnRzWzJdLCBjaGVja2VkUG9pbnRzWzNdKTtcclxuICAgICAgYTIgPSBBO1xyXG4gICAgICBiMiA9IEI7XHJcbiAgICAgIGMyID0gQztcclxuICAgICAgcG9pbnR4eCA9IEludGVyc2VjdGlvblgoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHBvaW50eXkgPSBJbnRlcnNlY3Rpb25ZKGExLCBiMSwgYzEsIGEyLCBiMiwgYzIpO1xyXG4gICAgICByZXR1cm4gbmV3IFBvaW50KHBvaW50eHgsIHBvaW50eXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50c0VxdWFsKGE6IFBvaW50LCBiOiBQb2ludCwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gTWF0aC5hYnMoYS54IC0gYi54KSA8PSBhbHBoYSAmJiBNYXRoLmFicyhhLnkgLSBiLnkpIDw9IGFscGhhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMaW5lc0VxdWFsKGE6IExpbmUsIGI6IExpbmUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIChpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuZW5kLCBiLmVuZCwgYWxwaGEpKSB8fFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuZW5kLCBhbHBoYSkpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoYTogVHJpYW5nbGUsIGI6IFRyaWFuZ2xlLCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIGxldCBlcXVhbHMgPSAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIHJldHVybiBlcXVhbHMgPT09IDM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW4ocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUsIGRpc3RhbmNlQmV0d2VlbiB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVDYW52YXMsIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIH0gZnJvbSBcIi4vdHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyLFxyXG4gICAgcG9pbnRTaXplOiBudW1iZXIsXHJcbiAgICBjYW52YXNJZDogc3RyaW5nLFxyXG4gICAgcHVibGljIGFuY2hvclJhZGl1czogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBzdXBlcihjb2xvciwgbGluZVdpZHRoLCBwb2ludFNpemUsIGNhbnZhc0lkKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbnB1dFRyaWFuZ2xlQ2FudmFzIGV4dGVuZHMgVHJpYW5nbGVDYW52YXMge1xyXG4gIGxpbmVzOiBMaW5lW10gPSBbXTtcclxuXHJcbiAgbW91c2VQb3M6IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xyXG4gIHNlbGVjdGVkUG9pbnQ6IFBvaW50IHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICAgIHRoaXMucnVuVXNlckV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQWxsKCkge1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5saW5lcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNb3VzZVBvcyhlOiBQb2ludGVyRXZlbnQpIHtcclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYW5jaG9yUG9pbnRUb1BvaW50KFxyXG4gICAgcG9pbnQ6IFBvaW50LFxyXG4gICAgbGluZXM6IExpbmVbXSxcclxuICAgIHJhZGl1czogbnVtYmVyXHJcbiAgKTogYm9vbGVhbiB7XHJcbiAgICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW4ocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgICBsZXQgZGlzdEVuZCA9IGRpc3RhbmNlQmV0d2Vlbihwb2ludCwgbGluZS5lbmQpO1xyXG5cclxuICAgICAgaWYgKE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCkgPCBtaW5EaXN0KSB7XHJcbiAgICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICAgIG1pbkRpc3QgPSBNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZGl1cykge1xyXG4gICAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVTZWxlY3RlZFBvaW50KCkge1xyXG4gICAgbGV0IHBvaW50ID0gbmV3IFBvaW50KHRoaXMubW91c2VQb3MueCwgdGhpcy5tb3VzZVBvcy55KTtcclxuICAgIHRoaXMuYW5jaG9yUG9pbnRUb1BvaW50KHBvaW50LCB0aGlzLmxpbmVzLCB0aGlzLmNvbmZpZy5hbmNob3JSYWRpdXMpO1xyXG4gICAgdGhpcy5zZWxlY3RlZFBvaW50ID0gcG9pbnQuY2xvbmUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVkcmF3KCkge1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUobGluZS5zdGFydCwgbGluZS5lbmQpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuc3RhcnQpO1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJ1blVzZXJFdmVudHMoKSB7XHJcbiAgICBsZXQgY2FudmFzID0gdGhpcy5jYW52YXNFbGVtZW50O1xyXG5cclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgdGhpcy5wb2ludGVyZG93bkV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVydXBcIiwgdGhpcy5wb2ludGVydXBFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmNhbmNlbFwiLCAoKSA9PiB7fSwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLnBvaW50ZXJtb3ZlRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBvaW50ZXJtb3ZlRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgdGhpcy51cGRhdGVNb3VzZVBvcyhlKTtcclxuICAgIHRoaXMuY2xlYXJDYW52YXMoKTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUodGhpcy5zZWxlY3RlZFBvaW50LCB0aGlzLm1vdXNlUG9zKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBvaW50ZXJkb3duRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgdGhpcy51cGRhdGVNb3VzZVBvcyhlKTtcclxuICAgIHRoaXMuY2FsY3VsYXRlU2VsZWN0ZWRQb2ludCgpO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcnVwRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5hbmNob3JQb2ludFRvUG9pbnQoXHJcbiAgICAgIHRoaXMubW91c2VQb3MsXHJcbiAgICAgIHRoaXMubGluZXMsXHJcbiAgICAgIHRoaXMuY29uZmlnLmFuY2hvclJhZGl1c1xyXG4gICAgKTtcclxuICAgIHRoaXMubGluZXMucHVzaChcclxuICAgICAgbmV3IExpbmUodGhpcy5zZWxlY3RlZFBvaW50LmNsb25lKCksIHRoaXMubW91c2VQb3MuY2xvbmUoKSlcclxuICAgICk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgdGhpcy5zZWxlY3RlZFBvaW50ID0gbnVsbDtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSwgZGlzdGFuY2VCZXR3ZWVuIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyLFxyXG4gICAgY2FudmFzSWQ6IHN0cmluZ1xyXG4gICkge1xyXG4gICAgc3VwZXIoY29sb3IsIGxpbmVXaWR0aCwgcG9pbnRTaXplLCBjYW52YXNJZCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT3V0cHV0VHJpYW5nbGVDYW52YXMgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHN1cGVyKGNvbmZpZyBhcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd0xpbmVzKFxyXG4gICAgbGluZXM6IExpbmVbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUobGluZS5zdGFydCwgbGluZS5lbmQsIGNvbG9yLCBsaW5lV2lkdGgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludHMoXHJcbiAgICBwb2ludHM6IFBvaW50W10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBwb2ludFNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLnBvaW50U2l6ZVxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KHBvaW50LCBjb2xvciwgcG9pbnRTaXplKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3VHJpYW5nbGVzKFxyXG4gICAgdHJpYW5nbGVzOiBUcmlhbmdsZVtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGZvciAobGV0IHRyaWFuZ2xlIG9mIHRyaWFuZ2xlcykge1xyXG4gICAgICB0aGlzLmRyYXdUcmlhbmdsZSh0cmlhbmdsZSwgY29sb3IsIGxpbmVXaWR0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSwgZGlzdGFuY2VCZXR3ZWVuIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yR2VuZXJhdG9yIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2VuZXJhdGU6ICgpID0+IHN0cmluZykge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IsXHJcbiAgICBwdWJsaWMgbGluZVdpZHRoOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgY2FudmFzSWQ6IHN0cmluZ1xyXG4gICkge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBjYW52YXNFbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogVHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBjb25maWcuY2FudmFzSWRcclxuICAgICkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRDb250ZXh0KFwiMmRcIikgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdMaW5lKFxyXG4gICAgZnJvbTogUG9pbnQsXHJcbiAgICB0bzogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcilcclxuICAgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKGZyb20ueCwgZnJvbS55KTtcclxuICAgIHRoaXMuY3R4LmxpbmVUbyh0by54LCB0by55KTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdQb2ludChcclxuICAgIHBvaW50OiBQb2ludCxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgIGxldCBzaXplID0gcG9pbnRTaXplO1xyXG4gICAgdGhpcy5jdHguZmlsbFJlY3QocG9pbnQueCAtIHNpemUgLyAyLCBwb2ludC55IC0gc2l6ZSAvIDIsIHNpemUsIHNpemUpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1RyaWFuZ2xlKFxyXG4gICAgdHJpYW5nbGU6IFRyaWFuZ2xlLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yLmdlbmVyYXRlKCk7XHJcbiAgICBlbHNlIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBsaW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDIueCwgdHJpYW5nbGUucDIueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDMueCwgdHJpYW5nbGUucDMueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odHJpYW5nbGUucDEueCwgdHJpYW5nbGUucDEueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjbGVhckNhbnZhcygpIHtcclxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQge1xyXG4gIENvbG9yR2VuZXJhdG9yLFxyXG4gIFRyaWFuZ2xlQ2FudmFzLFxyXG4gIFRyaWFuZ2xlQ2FudmFzQ29uZmlnLFxyXG59IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7IFRyaWFuZ2xlc0NhbGN1bGF0b3IgfSBmcm9tIFwiLi9jYWxjdWxhdGlvblwiO1xyXG5pbXBvcnQge1xyXG4gIElucHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9pbnB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vb3V0cHV0dHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmxldCBjYW52YXMgPSBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyhcImJsYWNrXCIsIDIsIDQsIFwiY2FudmFzXCIsIDMwKVxyXG4pO1xyXG5cclxubGV0IGNvbm5lY3Rpb25zQ2FudmFzID0gbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyhcclxuICAgIG5ldyBDb2xvckdlbmVyYXRvcihcclxuICAgICAgKCkgPT5cclxuICAgICAgICBcIiNcIiArXHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgXCIwMDAwMFwiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMTYsIDYpKS50b1N0cmluZygxNilcclxuICAgICAgICApLnNsaWNlKC02KSArXHJcbiAgICAgICAgXCI1MFwiXHJcbiAgICApLFxyXG4gICAgMyxcclxuICAgIDgsXHJcbiAgICBcImNvbm5lY3Rpb25zXCJcclxuICApXHJcbik7XHJcblxyXG5sZXQgc2hvd1RyaWFuZ2xlSW5kZXggPSAwO1xyXG5sZXQgdHJpYW5nbGVjYW52YXMgPSBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKFwiYmxhY2tcIiwgMiwgNCwgXCJ0cmlhbmdsZXNcIilcclxuKTtcclxuXHJcbmxldCBjYWxjdWxhdG9yID0gbmV3IFRyaWFuZ2xlc0NhbGN1bGF0b3IoKTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2xlYXJcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FudmFzLmNsZWFyQWxsKCk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLXByZXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKHNob3dUcmlhbmdsZUluZGV4ID4gMCkgc2hvd1RyaWFuZ2xlSW5kZXgtLTtcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZXMoY2FsY3VsYXRvci50cmlhbmdsZXMsIFwiZ3JleVwiKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGUoY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLCBcInJlZFwiLCA0KTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLW5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKHNob3dUcmlhbmdsZUluZGV4IDwgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoIC0gMSkgc2hvd1RyaWFuZ2xlSW5kZXgrKztcclxuICB0cmlhbmdsZWNhbnZhcy5jbGVhckNhbnZhcygpO1xyXG4gIHRyaWFuZ2xlY2FudmFzLmRyYXdUcmlhbmdsZXMoY2FsY3VsYXRvci50cmlhbmdsZXMsIFwiZ3JleVwiKTtcclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGUoY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLCBcInJlZFwiLCA0KTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbGNcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FsY3VsYXRvci5jYWxjKGNhbnZhcy5saW5lcyk7XHJcbiAgY29ubmVjdGlvbnNDYW52YXMuZHJhd0xpbmVzKGNhbGN1bGF0b3IuY29ubmVjdGlvbnMpO1xyXG4gIGNvbm5lY3Rpb25zQ2FudmFzLmRyYXdQb2ludHMoY2FsY3VsYXRvci5wb2ludHMsIFwicmVkXCIpO1xyXG5cclxuICB0cmlhbmdsZWNhbnZhcy5kcmF3VHJpYW5nbGVzKGNhbGN1bGF0b3IudHJpYW5nbGVzLCBcImdyZXlcIik7XHJcbiAgdHJpYW5nbGVjYW52YXMuZHJhd1RyaWFuZ2xlKGNhbGN1bGF0b3IudHJpYW5nbGVzW3Nob3dUcmlhbmdsZUluZGV4XSwgXCJyZWRcIiwgNCk7XHJcblxyXG4gIChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJpYW5nbGVzLWNvdW50XCIpIGFzIEhUTUxTcGFuRWxlbWVudCB8IG51bGxcclxuICApLnRleHRDb250ZW50ID0gU3RyaW5nKGNhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aCk7XHJcblxyXG4gIChcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9pbnRzLWNvdW50XCIpIGFzIEhUTUxTcGFuRWxlbWVudCB8IG51bGxcclxuICApLnRleHRDb250ZW50ID0gU3RyaW5nKGNhbGN1bGF0b3IucG9pbnRzLmxlbmd0aCk7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=