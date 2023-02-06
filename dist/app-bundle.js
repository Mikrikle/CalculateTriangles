/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/calculation.ts":
/*!****************************!*\
  !*** ./src/calculation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkIntersection": () => (/* binding */ checkIntersection),
/* harmony export */   "distanceBetweenPoints": () => (/* binding */ distanceBetweenPoints),
/* harmony export */   "distanceFromPointToLine": () => (/* binding */ distanceFromPointToLine),
/* harmony export */   "linesToTriangle": () => (/* binding */ linesToTriangle),
/* harmony export */   "mergePointWithLine": () => (/* binding */ mergePointWithLine),
/* harmony export */   "mergePointWithLinePoints": () => (/* binding */ mergePointWithLinePoints),
/* harmony export */   "mergePointWithPoint": () => (/* binding */ mergePointWithPoint)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");

function linesToTriangle(l1, l2, l3) {
    let hpoints = [l1.start, l1.end, l2.start, l2.end, l3.start, l3.end];
    hpoints = hpoints.filter((value, index, self) => index === self.findIndex((p) => (0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(p, value)));
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
    return new _core__WEBPACK_IMPORTED_MODULE_0__.Triangle(hpoints[0], hpoints[1], hpoints[2]);
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
function distanceBetweenPoints(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}
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
    return { point: new _core__WEBPACK_IMPORTED_MODULE_0__.Point(xx, yy), distace: Math.sqrt(dx * dx + dy * dy) };
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
            return new _core__WEBPACK_IMPORTED_MODULE_0__.Point(pointxx, pointyy);
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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Point": () => (/* binding */ Point),
/* harmony export */   "Triangle": () => (/* binding */ Triangle),
/* harmony export */   "isLinesEqual": () => (/* binding */ isLinesEqual),
/* harmony export */   "isPointsEqual": () => (/* binding */ isPointsEqual),
/* harmony export */   "isTrianglesEqual": () => (/* binding */ isTrianglesEqual)
/* harmony export */ });
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
function isPointsEqual(a, b, alpha = 1) {
    return Math.abs(a.x - b.x) <= alpha && Math.abs(a.y - b.y) <= alpha;
}
function isLinesEqual(a, b, alpha = 1) {
    return ((isPointsEqual(a.start, b.start, alpha) && isPointsEqual(a.end, b.end, alpha)) ||
        (isPointsEqual(a.end, b.start, alpha) && isPointsEqual(a.start, b.end, alpha)));
}
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


/***/ }),

/***/ "./src/inputtrianglecanvas.ts":
/*!************************************!*\
  !*** ./src/inputtrianglecanvas.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InputTriangleCanvas": () => (/* binding */ InputTriangleCanvas),
/* harmony export */   "InputTriangleCanvasConfig": () => (/* binding */ InputTriangleCanvasConfig)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "./src/core.ts");
/* harmony import */ var _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");
/* harmony import */ var _calculation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./calculation */ "./src/calculation.ts");



class InputTriangleCanvasConfig extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        this.mergeRadius = 50;
        Object.assign(this, init);
    }
}
class DrawAction {
}
class InputTriangleCanvas extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_1__.TriangleCanvas {
    constructor(config) {
        super(config);
        this.config = config;
        this.lines = [];
        this.intersectionPoints = [[]];
        this.cancelledActions = [];
        this.mousePos = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(0, 0);
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
            let line = new _core__WEBPACK_IMPORTED_MODULE_0__.Line(this.selectedPoint.clone(), this.mousePos.clone());
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
        if ((0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, this.intersectionPoints.reduce((accum, item) => {
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
        let startPoint = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(cx * size, cy * size);
        let gridPoints = [
            startPoint,
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x + this.config.gridCellSize, startPoint.y),
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x, startPoint.y + this.config.gridCellSize),
            new _core__WEBPACK_IMPORTED_MODULE_0__.Point(startPoint.x + this.config.gridCellSize, startPoint.y + this.config.gridCellSize),
        ];
        if ((0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithPoint)(point, gridPoints, this.config.gridCellSize))
            return true;
        return false;
    }
    addIntersectionPoint(line) {
        let points = [];
        for (let withLine of this.lines) {
            let point = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.checkIntersection)(line, withLine);
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
            res = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLinePoints)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res) {
            res = (0,_calculation__WEBPACK_IMPORTED_MODULE_2__.mergePointWithLine)(point, this.lines, this.config.mergeRadius * 2);
        }
        if (!res && this.config.useGrid) {
            res = this.mergePointWithGrid(point);
        }
    }
    correctMousePoint() {
        this.correctPointPos(this.mousePos);
    }
    correctSelectedPoint() {
        let point = new _core__WEBPACK_IMPORTED_MODULE_0__.Point(this.mousePos.x, this.mousePos.y);
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


/***/ }),

/***/ "./src/outputtrianglecanvas.ts":
/*!*************************************!*\
  !*** ./src/outputtrianglecanvas.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OutputTriangleCanvas": () => (/* binding */ OutputTriangleCanvas),
/* harmony export */   "OutputTriangleCanvasConfig": () => (/* binding */ OutputTriangleCanvasConfig)
/* harmony export */ });
/* harmony import */ var _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./trianglecanvas */ "./src/trianglecanvas.ts");

class OutputTriangleCanvasConfig extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__.TriangleCanvasConfig {
    constructor(init) {
        super(init);
        Object.assign(this, init);
    }
}
class OutputTriangleCanvas extends _trianglecanvas__WEBPACK_IMPORTED_MODULE_0__.TriangleCanvas {
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


/***/ }),

/***/ "./src/trianglecanvas.ts":
/*!*******************************!*\
  !*** ./src/trianglecanvas.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorGenerator": () => (/* binding */ ColorGenerator),
/* harmony export */   "TriangleCanvas": () => (/* binding */ TriangleCanvas),
/* harmony export */   "TriangleCanvasConfig": () => (/* binding */ TriangleCanvasConfig)
/* harmony export */ });
class ColorGenerator {
    constructor(generate) {
        this.generate = generate;
    }
}
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
        this.ctx.lineCap = "round";
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
        if (!from || !to)
            return;
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
        if (!point)
            return;
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
        if (!triangle)
            return;
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".app-bundle.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inputtrianglecanvas */ "./src/inputtrianglecanvas.ts");
/* harmony import */ var _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./outputtrianglecanvas */ "./src/outputtrianglecanvas.ts");


let calculator;
const calculatorLoading = document.getElementById("loading");
const calculateworker = new Worker(new URL(/* worker import */ __webpack_require__.p + __webpack_require__.u("src_workers_calc_worker_ts"), __webpack_require__.b));
calculateworker.onmessage = (message) => {
    calculator = message.data;
    drawOutputCanvas();
    drawTrianglesSelector();
    outputCanvas.canvasElement.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
    calculatorLoading.style.visibility = "hidden";
};
const canvas = new _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__.InputTriangleCanvas(new _inputtrianglecanvas__WEBPACK_IMPORTED_MODULE_0__.InputTriangleCanvasConfig({
    color: "white",
    lineWidth: 2,
    pointSize: 8,
    canvasId: "canvas",
    mergeRadius: 25,
    useGrid: true,
    gridCellSize: 40,
    gridLineWidth: 20,
}));
let showTriangleIndex = 0;
const trianglesSelector = document.getElementById("triangles-selector");
const outputCanvas = new _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__.OutputTriangleCanvas(new _outputtrianglecanvas__WEBPACK_IMPORTED_MODULE_1__.OutputTriangleCanvasConfig({
    color: "black",
    lineWidth: 2,
    pointSize: 4,
    canvasId: "triangles",
}));
function drawOutputCanvas() {
    outputCanvas.clearCanvas();
    outputCanvas.drawLines(calculator.lines, "grey", 1);
    outputCanvas.drawPoints(calculator.points, "gray", 5);
    outputCanvas.drawTriangle(calculator.triangles[showTriangleIndex], "red", 4);
}
function drawTrianglesSelector() {
    if (trianglesSelector && calculator.triangles.length > 0) {
        trianglesSelector.textContent = `${showTriangleIndex + 1} / ${calculator.triangles.length}`;
    }
}
document.getElementById("clear")?.addEventListener("click", () => {
    canvas.clearAll();
    outputCanvas.clearCanvas();
    if (trianglesSelector) {
        trianglesSelector.textContent = "0 / 0";
    }
});
document.getElementById("btn-prev")?.addEventListener("click", () => {
    if (showTriangleIndex > 0)
        showTriangleIndex--;
    drawOutputCanvas();
    drawTrianglesSelector();
});
document.getElementById("btn-next")?.addEventListener("click", () => {
    if (showTriangleIndex < calculator.triangles.length - 1)
        showTriangleIndex++;
    drawOutputCanvas();
    drawTrianglesSelector();
});
document.getElementById("calc")?.addEventListener("click", () => {
    calculatorLoading.style.visibility = "visible";
    calculateworker.postMessage(canvas.lines);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRSxJQUFJLGlCQUFpQixHQUFHLENBQUM7UUFBRSxpQkFBaUIsRUFBRSxDQUFDO0lBQy9DLGdCQUFnQixFQUFFLENBQUM7SUFDbkIscUJBQXFCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUNsRSxJQUFJLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUM7UUFBRSxpQkFBaUIsRUFBRSxDQUFDO0lBQzdFLGdCQUFnQixFQUFFLENBQUM7SUFDbkIscUJBQXFCLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUM5RCxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUMvQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtJQUM5RCxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDOUQsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NhbGN1bGF0aW9uLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9pbnB1dHRyaWFuZ2xlY2FudmFzLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9vdXRwdXR0cmlhbmdsZWNhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvdHJpYW5nbGVjYW52YXMudHMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9nZXQgamF2YXNjcmlwdCBjaHVuayBmaWxlbmFtZSIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBQb2ludCxcclxuICBMaW5lLFxyXG4gIFRyaWFuZ2xlLFxyXG4gIGlzUG9pbnRzRXF1YWxcclxufSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbGluZXNUb1RyaWFuZ2xlKGwxOiBMaW5lLCBsMjogTGluZSwgbDM6IExpbmUpOiBUcmlhbmdsZSB8IG51bGwge1xyXG4gIGxldCBocG9pbnRzID0gW2wxLnN0YXJ0LCBsMS5lbmQsIGwyLnN0YXJ0LCBsMi5lbmQsIGwzLnN0YXJ0LCBsMy5lbmRdO1xyXG4gIGhwb2ludHMgPSBocG9pbnRzLmZpbHRlcihcclxuICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgocCkgPT4gaXNQb2ludHNFcXVhbChwLCB2YWx1ZSkpXHJcbiAgKTtcclxuICBpZiAoaHBvaW50cy5sZW5ndGggIT0gMykgcmV0dXJuIG51bGw7XHJcblxyXG4gIHZhciBhID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwxLnN0YXJ0LCBsMS5lbmQpO1xyXG4gIHZhciBiID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwyLnN0YXJ0LCBsMi5lbmQpO1xyXG4gIHZhciBjID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGwzLnN0YXJ0LCBsMy5lbmQpO1xyXG5cclxuICBpZiAoYSA+IGIgKyBjIHx8IGIgPiBhICsgYyB8fCBjID4gYSArIGIpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IHAgPSAoYSArIGIgKyBjKSAvIDI7XHJcbiAgbGV0IFMgPSAocCAqIChwIC0gYSkgKiAocCAtIGIpICogKHAgLSBjKSkgKiogMC41O1xyXG4gIGlmIChpc05hTihTKSB8fCBNYXRoLmFicyhTKSA8PSAxKSByZXR1cm4gbnVsbDtcclxuICByZXR1cm4gbmV3IFRyaWFuZ2xlKGhwb2ludHNbMF0sIGhwb2ludHNbMV0sIGhwb2ludHNbMl0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhQb2ludChcclxuICBwb2ludDogUG9pbnQsXHJcbiAgcG9pbnRzOiBQb2ludFtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgdG9Qb2ludCBvZiBwb2ludHMpIHtcclxuICAgIGxldCBkaXN0YWNlID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCB0b1BvaW50KTtcclxuICAgIGlmIChkaXN0YWNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gZGlzdGFjZTtcclxuICAgICAgbWluUG9pbnQgPSB0b1BvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMoXHJcbiAgcG9pbnQ6IFBvaW50LFxyXG4gIGxpbmVzOiBMaW5lW10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCBsaW5lIG9mIGxpbmVzKSB7XHJcbiAgICBsZXQgZGlzdFN0YXJ0ID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLnN0YXJ0KTtcclxuICAgIGxldCBkaXN0RW5kID0gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHBvaW50LCBsaW5lLmVuZCk7XHJcblxyXG4gICAgaWYgKE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCkgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pblBvaW50ID0gZGlzdFN0YXJ0IDwgZGlzdEVuZCA/IGxpbmUuc3RhcnQgOiBsaW5lLmVuZDtcclxuICAgICAgbWluRGlzdCA9IE1hdGgubWluKGRpc3RTdGFydCwgZGlzdEVuZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBwZCA9IGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKHBvaW50LCBsaW5lKTtcclxuICAgIGlmIChwZC5kaXN0YWNlIDwgbWluRGlzdCkge1xyXG4gICAgICBtaW5EaXN0ID0gcGQuZGlzdGFjZTtcclxuICAgICAgbWluUG9pbnQgPSBwZC5wb2ludDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKHAxOiBQb2ludCwgcDI6IFBvaW50KTogbnVtYmVyIHtcclxuICByZXR1cm4gTWF0aC5zcXJ0KChwMS54IC0gcDIueCkgKiogMiArIChwMS55IC0gcDIueSkgKiogMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUZyb21Qb2ludFRvTGluZShcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZTogTGluZVxyXG4pOiB7IHBvaW50OiBQb2ludDsgZGlzdGFjZTogbnVtYmVyIH0ge1xyXG4gIGNvbnN0IEEgPSBwb2ludC54IC0gbGluZS5zdGFydC54O1xyXG4gIGNvbnN0IEIgPSBwb2ludC55IC0gbGluZS5zdGFydC55O1xyXG4gIGNvbnN0IEMgPSBsaW5lLmVuZC54IC0gbGluZS5zdGFydC54O1xyXG4gIGNvbnN0IEQgPSBsaW5lLmVuZC55IC0gbGluZS5zdGFydC55O1xyXG5cclxuICBsZXQgZG90ID0gQSAqIEMgKyBCICogRDtcclxuICBsZXQgbGVuX3NxID0gQyAqIEMgKyBEICogRDtcclxuICBsZXQgcGFyYW0gPSAtMTtcclxuICBpZiAobGVuX3NxICE9IDApIHtcclxuICAgIHBhcmFtID0gZG90IC8gbGVuX3NxO1xyXG4gIH1cclxuICBsZXQgeHggPSAwO1xyXG4gIGxldCB5eSA9IDA7XHJcblxyXG4gIGlmIChwYXJhbSA8IDApIHtcclxuICAgIHh4ID0gbGluZS5zdGFydC54O1xyXG4gICAgeXkgPSBsaW5lLnN0YXJ0Lnk7XHJcbiAgfSBlbHNlIGlmIChwYXJhbSA+IDEpIHtcclxuICAgIHh4ID0gbGluZS5lbmQueDtcclxuICAgIHl5ID0gbGluZS5lbmQueTtcclxuICB9IGVsc2Uge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0LnggKyBwYXJhbSAqIEM7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueSArIHBhcmFtICogRDtcclxuICB9XHJcblxyXG4gIGxldCBkeCA9IHBvaW50LnggLSB4eDtcclxuICBsZXQgZHkgPSBwb2ludC55IC0geXk7XHJcblxyXG4gIHJldHVybiB7IHBvaW50OiBuZXcgUG9pbnQoeHgsIHl5KSwgZGlzdGFjZTogTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KSB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJbnRlcnNlY3Rpb24obGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICBsZXQgY2hlY2tlZFBvaW50cyA9IFtsaW5lMS5zdGFydCwgbGluZTEuZW5kLCBsaW5lMi5zdGFydCwgbGluZTIuZW5kXTtcclxuICBsZXQgQTogbnVtYmVyLCBCOiBudW1iZXIsIEM6IG51bWJlcjtcclxuICBsZXQgcG9pbnR4eDogbnVtYmVyLCBwb2ludHl5OiBudW1iZXI7XHJcblxyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5zdGFydCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMiwgbGluZTEuZW5kKSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUyLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUxLCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTIuZW5kO1xyXG5cclxuICByZXR1cm4gVGVtcENoZWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGlzUG9pbnRPbkxpbmUobDogTGluZSwgYzogUG9pbnQpOiBib29sZWFuIHtcclxuICAgIGxldCBwMSA9IGwuc3RhcnQ7XHJcbiAgICBsZXQgcDIgPSBsLmVuZDtcclxuXHJcbiAgICBsZXQgZHgxID0gcDIueCAtIHAxLng7XHJcbiAgICBsZXQgZHkxID0gcDIueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IGR4ID0gYy54IC0gcDEueDtcclxuICAgIGxldCBkeSA9IGMueSAtIHAxLnk7XHJcblxyXG4gICAgbGV0IFMgPSBkeDEgKiBkeSAtIGR4ICogZHkxO1xyXG4gICAgbGV0IGFiID0gTWF0aC5zcXJ0KGR4MSAqIGR4MSArIGR5MSAqIGR5MSk7XHJcbiAgICBsZXQgaCA9IFMgLyBhYjtcclxuICAgIHJldHVybiBNYXRoLmFicyhoKSA8IDAuMTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIFZFSyhheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXggKiBieSAtIGJ4ICogYXk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDcm9zc2luZ0NoZWNrKHAxOiBQb2ludCwgcDI6IFBvaW50LCBwMzogUG9pbnQsIHA0OiBQb2ludCkge1xyXG4gICAgbGV0IHYxLCB2MiwgdjMsIHY0O1xyXG5cclxuICAgIHYxID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDEueCAtIHAzLngsIHAxLnkgLSBwMy55KTtcclxuICAgIHYyID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDIueCAtIHAzLngsIHAyLnkgLSBwMy55KTtcclxuICAgIHYzID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDMueCAtIHAxLngsIHAzLnkgLSBwMS55KTtcclxuICAgIHY0ID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDQueCAtIHAxLngsIHA0LnkgLSBwMS55KTtcclxuICAgIGlmICh2MSAqIHYyIDwgMCAmJiB2MyAqIHY0IDwgMCkgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEVxdWF0aW9uT2ZUaGVMaW5lKHAxOiBQb2ludCwgcDI6IFBvaW50KSB7XHJcbiAgICBBID0gcDIueSAtIHAxLnk7XHJcbiAgICBCID0gcDEueCAtIHAyLng7XHJcbiAgICBDID0gLXAxLnggKiAocDIueSAtIHAxLnkpICsgcDEueSAqIChwMi54IC0gcDEueCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbnRlcnNlY3Rpb25YKFxyXG4gICAgYTE6IG51bWJlcixcclxuICAgIGIxOiBudW1iZXIsXHJcbiAgICBjMTogbnVtYmVyLFxyXG4gICAgYTI6IG51bWJlcixcclxuICAgIGIyOiBudW1iZXIsXHJcbiAgICBjMjogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBsZXQgZCwgZHgsIHBvaW50eDtcclxuICAgIGQgPSBhMSAqIGIyIC0gYjEgKiBhMjtcclxuICAgIGR4ID0gLWMxICogYjIgKyBiMSAqIGMyO1xyXG4gICAgcG9pbnR4ID0gZHggLyBkO1xyXG4gICAgcmV0dXJuIHBvaW50eDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblkoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeSwgcG9pbnR5O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHkgPSAtYTEgKiBjMiArIGMxICogYTI7XHJcbiAgICBwb2ludHkgPSBkeSAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVGVtcENoZWNrKCk6IFBvaW50IHwgbnVsbCB7XHJcbiAgICBpZiAoXHJcbiAgICAgIENyb3NzaW5nQ2hlY2soXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1swXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzFdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMl0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1szXVxyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgbGV0IGExLCBiMSwgYzEsIGEyLCBiMiwgYzI7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMF0sIGNoZWNrZWRQb2ludHNbMV0pO1xyXG4gICAgICBhMSA9IEE7XHJcbiAgICAgIGIxID0gQjtcclxuICAgICAgYzEgPSBDO1xyXG4gICAgICBFcXVhdGlvbk9mVGhlTGluZShjaGVja2VkUG9pbnRzWzJdLCBjaGVja2VkUG9pbnRzWzNdKTtcclxuICAgICAgYTIgPSBBO1xyXG4gICAgICBiMiA9IEI7XHJcbiAgICAgIGMyID0gQztcclxuICAgICAgcG9pbnR4eCA9IEludGVyc2VjdGlvblgoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHBvaW50eXkgPSBJbnRlcnNlY3Rpb25ZKGExLCBiMSwgYzEsIGEyLCBiMiwgYzIpO1xyXG4gICAgICByZXR1cm4gbmV3IFBvaW50KHBvaW50eHgsIHBvaW50eXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50c0VxdWFsKGE6IFBvaW50LCBiOiBQb2ludCwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gTWF0aC5hYnMoYS54IC0gYi54KSA8PSBhbHBoYSAmJiBNYXRoLmFicyhhLnkgLSBiLnkpIDw9IGFscGhhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMaW5lc0VxdWFsKGE6IExpbmUsIGI6IExpbmUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIChpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuZW5kLCBiLmVuZCwgYWxwaGEpKSB8fFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuZW5kLCBhbHBoYSkpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoYTogVHJpYW5nbGUsIGI6IFRyaWFuZ2xlLCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIGxldCBlcXVhbHMgPSAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIHJldHVybiBlcXVhbHMgPT09IDM7XHJcbn0iLCJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcbmltcG9ydCB7IFRyaWFuZ2xlQ2FudmFzLCBUcmlhbmdsZUNhbnZhc0NvbmZpZyB9IGZyb20gXCIuL3RyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgY2hlY2tJbnRlcnNlY3Rpb24sXHJcbiAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzLFxyXG4gIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lLFxyXG4gIG1lcmdlUG9pbnRXaXRoTGluZSxcclxuICBtZXJnZVBvaW50V2l0aExpbmVQb2ludHMsXHJcbiAgbWVyZ2VQb2ludFdpdGhQb2ludCxcclxufSBmcm9tIFwiLi9jYWxjdWxhdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0VHJpYW5nbGVDYW52YXNDb25maWcgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhc0NvbmZpZyB7XHJcbiAgcHVibGljIG1lcmdlUmFkaXVzOiBudW1iZXIgPSA1MDtcclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKGluaXQ/OiBQYXJ0aWFsPElucHV0VHJpYW5nbGVDYW52YXNDb25maWc+KSB7XHJcbiAgICBzdXBlcihpbml0KTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW5pdCk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBEcmF3QWN0aW9uIHtcclxuICBsaW5lOiBMaW5lO1xyXG4gIGlwb2ludHM6IFBvaW50W107XHJcbn1cclxuZXhwb3J0IGNsYXNzIElucHV0VHJpYW5nbGVDYW52YXMgZXh0ZW5kcyBUcmlhbmdsZUNhbnZhcyB7XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGludGVyc2VjdGlvblBvaW50czogW1BvaW50W11dID0gW1tdXTtcclxuICBjYW5jZWxsZWRBY3Rpb25zOiBEcmF3QWN0aW9uW10gPSBbXTtcclxuXHJcbiAgbW91c2VQb3M6IFBvaW50ID0gbmV3IFBvaW50KDAsIDApO1xyXG4gIHNlbGVjdGVkUG9pbnQ6IFBvaW50IHwgbnVsbDtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICAgIHRoaXMucnVuVXNlckV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsZWFyQWxsKCkge1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5saW5lcyA9IFtdO1xyXG4gICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMgPSBbW11dO1xyXG4gICAgdGhpcy5jYW5jZWxsZWRBY3Rpb25zID0gW107XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdW5kbygpIHtcclxuICAgIGlmICh0aGlzLmxpbmVzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICB0aGlzLmNhbmNlbGxlZEFjdGlvbnMucHVzaCh7XHJcbiAgICAgIGxpbmU6IHRoaXMubGluZXMucG9wKCksXHJcbiAgICAgIGlwb2ludHM6XHJcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMubGVuZ3RoID4gMCA/IHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnBvcCgpIDogW10sXHJcbiAgICB9KTtcclxuICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVkbygpIHtcclxuICAgIGlmICh0aGlzLmNhbmNlbGxlZEFjdGlvbnMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgIGxldCBzYXZlZEFjdGlvbiA9IHRoaXMuY2FuY2VsbGVkQWN0aW9ucy5wb3AoKTtcclxuICAgIHRoaXMubGluZXMucHVzaChzYXZlZEFjdGlvbi5saW5lKTtcclxuICAgIGlmIChzYXZlZEFjdGlvbi5pcG9pbnRzLmxlbmd0aCA+IDApXHJcbiAgICAgIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzLnB1c2goc2F2ZWRBY3Rpb24uaXBvaW50cyk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVNb3VzZVBvcyhlOiBQb2ludGVyRXZlbnQpIHtcclxuICAgIGNvbnN0IHJlY3QgPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnggPSBlLmNsaWVudFggLSByZWN0LmxlZnQ7XHJcbiAgICB0aGlzLm1vdXNlUG9zLnkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VQb2ludFdpdGhJbnRlcnNlY3Rpb25Qb2ludHMocG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIG1lcmdlUG9pbnRXaXRoUG9pbnQoXHJcbiAgICAgICAgcG9pbnQsXHJcbiAgICAgICAgdGhpcy5pbnRlcnNlY3Rpb25Qb2ludHMucmVkdWNlKChhY2N1bSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgYWNjdW0ucHVzaCguLi5pdGVtKTtcclxuICAgICAgICAgIHJldHVybiBhY2N1bTtcclxuICAgICAgICB9LCBbXSksXHJcbiAgICAgICAgdGhpcy5jb25maWcubWVyZ2VSYWRpdXNcclxuICAgICAgKVxyXG4gICAgKVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbWVyZ2VQb2ludFdpdGhHcmlkKHBvaW50OiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHNpemUgPSB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemU7XHJcbiAgICBsZXQgY3ggPSBNYXRoLmZsb29yKHBvaW50LnggLyBzaXplKTtcclxuICAgIGxldCBjeSA9IE1hdGguZmxvb3IocG9pbnQueSAvIHNpemUpO1xyXG4gICAgbGV0IHN0YXJ0UG9pbnQgPSBuZXcgUG9pbnQoY3ggKiBzaXplLCBjeSAqIHNpemUpO1xyXG4gICAgbGV0IGdyaWRQb2ludHMgPSBbXHJcbiAgICAgIHN0YXJ0UG9pbnQsXHJcbiAgICAgIG5ldyBQb2ludChzdGFydFBvaW50LnggKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUsIHN0YXJ0UG9pbnQueSksXHJcbiAgICAgIG5ldyBQb2ludChzdGFydFBvaW50LngsIHN0YXJ0UG9pbnQueSArIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSksXHJcbiAgICAgIG5ldyBQb2ludChcclxuICAgICAgICBzdGFydFBvaW50LnggKyB0aGlzLmNvbmZpZy5ncmlkQ2VsbFNpemUsXHJcbiAgICAgICAgc3RhcnRQb2ludC55ICsgdGhpcy5jb25maWcuZ3JpZENlbGxTaXplXHJcbiAgICAgICksXHJcbiAgICBdO1xyXG4gICAgaWYgKG1lcmdlUG9pbnRXaXRoUG9pbnQocG9pbnQsIGdyaWRQb2ludHMsIHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZSkpXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhZGRJbnRlcnNlY3Rpb25Qb2ludChsaW5lOiBMaW5lKSB7XHJcbiAgICBsZXQgcG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgICBmb3IgKGxldCB3aXRoTGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIGxldCBwb2ludCA9IGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUsIHdpdGhMaW5lKTtcclxuICAgICAgaWYgKHBvaW50ICE9IG51bGwpIHBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgIH1cclxuICAgIGlmIChwb2ludHMubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmludGVyc2VjdGlvblBvaW50cy5wdXNoKHBvaW50cyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvcnJlY3RQb2ludFBvcyhwb2ludDogUG9pbnQpIHtcclxuICAgIGxldCByZXMgPSBmYWxzZTtcclxuICAgIGlmICghcmVzKSB7XHJcbiAgICAgIHJlcyA9IHRoaXMubWVyZ2VQb2ludFdpdGhJbnRlcnNlY3Rpb25Qb2ludHMocG9pbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyZXMpIHtcclxuICAgICAgcmVzID0gbWVyZ2VQb2ludFdpdGhMaW5lUG9pbnRzKFxyXG4gICAgICAgIHBvaW50LFxyXG4gICAgICAgIHRoaXMubGluZXMsXHJcbiAgICAgICAgdGhpcy5jb25maWcubWVyZ2VSYWRpdXMgKiAyXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcykge1xyXG4gICAgICByZXMgPSBtZXJnZVBvaW50V2l0aExpbmUocG9pbnQsIHRoaXMubGluZXMsIHRoaXMuY29uZmlnLm1lcmdlUmFkaXVzICogMik7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJlcyAmJiB0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHJlcyA9IHRoaXMubWVyZ2VQb2ludFdpdGhHcmlkKHBvaW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdE1vdXNlUG9pbnQoKSB7XHJcbiAgICB0aGlzLmNvcnJlY3RQb2ludFBvcyh0aGlzLm1vdXNlUG9zKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29ycmVjdFNlbGVjdGVkUG9pbnQoKSB7XHJcbiAgICBsZXQgcG9pbnQgPSBuZXcgUG9pbnQodGhpcy5tb3VzZVBvcy54LCB0aGlzLm1vdXNlUG9zLnkpO1xyXG4gICAgdGhpcy5jb3JyZWN0UG9pbnRQb3MocG9pbnQpO1xyXG4gICAgdGhpcy5zZWxlY3RlZFBvaW50ID0gcG9pbnQuY2xvbmUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVkcmF3KCkge1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd0xpbmUobGluZS5zdGFydCwgbGluZS5lbmQpO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgbGluZSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1BvaW50KGxpbmUuc3RhcnQpO1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChsaW5lLmVuZCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpcG9pbnRzIG9mIHRoaXMuaW50ZXJzZWN0aW9uUG9pbnRzKSB7XHJcbiAgICAgIGZvciAobGV0IHBvaW50IG9mIGlwb2ludHMpIHtcclxuICAgICAgICB0aGlzLmRyYXdQb2ludChwb2ludCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcnVuVXNlckV2ZW50cygpIHtcclxuICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCB0aGlzLnBvaW50ZXJkb3duRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLnBvaW50ZXJ1cEV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyY2FuY2VsXCIsICgpID0+IHt9LCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMucG9pbnRlcm1vdmVFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcm1vdmVFdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jbGVhckNhbnZhcygpO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZFBvaW50ICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZSh0aGlzLnNlbGVjdGVkUG9pbnQsIHRoaXMubW91c2VQb3MpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcmRvd25FdmVudEhhbmRsZXIgPSAoZTogUG9pbnRlckV2ZW50KSA9PiB7XHJcbiAgICB0aGlzLnVwZGF0ZU1vdXNlUG9zKGUpO1xyXG4gICAgdGhpcy5jb3JyZWN0U2VsZWN0ZWRQb2ludCgpO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcG9pbnRlcnVwRXZlbnRIYW5kbGVyID0gKGU6IFBvaW50ZXJFdmVudCkgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRQb2ludCA9PSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jb3JyZWN0TW91c2VQb2ludCgpO1xyXG4gICAgbGV0IGxpbmUgPSBuZXcgTGluZSh0aGlzLnNlbGVjdGVkUG9pbnQuY2xvbmUoKSwgdGhpcy5tb3VzZVBvcy5jbG9uZSgpKTtcclxuICAgIHRoaXMuYWRkSW50ZXJzZWN0aW9uUG9pbnQobGluZSk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XHJcbiAgICB0aGlzLnNlbGVjdGVkUG9pbnQgPSBudWxsO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHtcclxuICBDb2xvckdlbmVyYXRvcixcclxuICBUcmlhbmdsZUNhbnZhcyxcclxuICBUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi90cmlhbmdsZWNhbnZhc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnIGV4dGVuZHMgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIHN1cGVyKGluaXQpO1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbml0KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBPdXRwdXRUcmlhbmdsZUNhbnZhcyBleHRlbmRzIFRyaWFuZ2xlQ2FudmFzIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29uZmlnOiBPdXRwdXRUcmlhbmdsZUNhbnZhc0NvbmZpZykge1xyXG4gICAgc3VwZXIoY29uZmlnIGFzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3TGluZXMoXHJcbiAgICBsaW5lczogTGluZVtdLFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgdGhpcy5kcmF3TGluZShsaW5lLnN0YXJ0LCBsaW5lLmVuZCwgY29sb3IsIGxpbmVXaWR0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhd1BvaW50cyhcclxuICAgIHBvaW50czogUG9pbnRbXSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIHBvaW50U2l6ZTogbnVtYmVyID0gdGhpcy5jb25maWcucG9pbnRTaXplXHJcbiAgKSB7XHJcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQocG9pbnQsIGNvbG9yLCBwb2ludFNpemUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdUcmlhbmdsZXMoXHJcbiAgICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10sXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IHRoaXMuY29uZmlnLmxpbmVXaWR0aFxyXG4gICkge1xyXG4gICAgZm9yIChsZXQgdHJpYW5nbGUgb2YgdHJpYW5nbGVzKSB7XHJcbiAgICAgIHRoaXMuZHJhd1RyaWFuZ2xlKHRyaWFuZ2xlLCBjb2xvciwgbGluZVdpZHRoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnQsIExpbmUsIFRyaWFuZ2xlIH0gZnJvbSBcIi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbG9yR2VuZXJhdG9yIHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2VuZXJhdGU6ICgpID0+IHN0cmluZykge31cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWFuZ2xlQ2FudmFzQ29uZmlnIHtcclxuICBwdWJsaWMgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID1cclxuICAgIFwiIzAwMDAwMFwiO1xyXG4gIHB1YmxpYyBsaW5lV2lkdGg6IG51bWJlciA9IDM7XHJcbiAgcHVibGljIHBvaW50U2l6ZTogbnVtYmVyID0gNTtcclxuICBwdWJsaWMgY2FudmFzSWQ6IHN0cmluZyA9IFwiY2FudmFzXCI7XHJcblxyXG4gIHB1YmxpYyB1c2VHcmlkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGdyaWRDb2xvcjogc3RyaW5nID0gXCIjNTA1MDUwXCI7XHJcbiAgcHVibGljIGdyaWRMaW5lV2lkdGg6IG51bWJlciA9IDE7XHJcbiAgcHVibGljIGdyaWRDZWxsU2l6ZTogbnVtYmVyID0gNDA7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihpbml0PzogUGFydGlhbDxUcmlhbmdsZUNhbnZhc0NvbmZpZz4pIHtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW5pdCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICBvblJlc2l6ZSA9IChlOiBVSUV2ZW50KSA9PiB7XHJcbiAgICBsZXQgdGVtcCA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0XHJcbiAgICApO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LndpZHRoID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldFdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodCA9IHRoaXMuY2FudmFzRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB0aGlzLmN0eC5wdXRJbWFnZURhdGEodGVtcCwgMCwgMCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGNvbmZpZzogVHJpYW5nbGVDYW52YXNDb25maWcpIHtcclxuICAgIHRoaXMuY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBjb25maWcuY2FudmFzSWRcclxuICAgICkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGggPSB0aGlzLmNhbnZhc0VsZW1lbnQub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0ID0gdGhpcy5jYW52YXNFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25SZXNpemUsIGZhbHNlKTtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXNFbGVtZW50LmdldENvbnRleHQoXCIyZFwiLCB7XHJcbiAgICAgIHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSxcclxuICAgIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHRoaXMuY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XHJcblxyXG4gICAgaWYgKHRoaXMuY29uZmlnLnVzZUdyaWQpIHtcclxuICAgICAgdGhpcy5kcmF3R3JpZCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdHcmlkKFxyXG4gICAgY29sb3I6IHN0cmluZyA9IHRoaXMuY29uZmlnLmdyaWRDb2xvcixcclxuICAgIHNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLmdyaWRDZWxsU2l6ZVxyXG4gICkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gMTtcclxuXHJcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGg7IHggKz0gc2l6ZSkge1xyXG4gICAgICB0aGlzLmN0eC5tb3ZlVG8oeCArIDAuNSwgMCk7XHJcbiAgICAgIHRoaXMuY3R4LmxpbmVUbyh4ICsgMC41LCB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSB0aGlzLmNhbnZhc0VsZW1lbnQuaGVpZ2h0OyB5ICs9IHNpemUpIHtcclxuICAgICAgdGhpcy5jdHgubW92ZVRvKDAsIHkgKyAwLjUpO1xyXG4gICAgICB0aGlzLmN0eC5saW5lVG8odGhpcy5jYW52YXNFbGVtZW50LndpZHRoLCB5ICsgMC41KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3TGluZShcclxuICAgIGZyb206IFBvaW50LFxyXG4gICAgdG86IFBvaW50LFxyXG4gICAgY29sb3I6IHN0cmluZyB8IENhbnZhc0dyYWRpZW50IHwgQ2FudmFzUGF0dGVybiB8IENvbG9yR2VuZXJhdG9yID0gdGhpc1xyXG4gICAgICAuY29uZmlnLmNvbG9yLFxyXG4gICAgbGluZVdpZHRoOiBudW1iZXIgPSB0aGlzLmNvbmZpZy5saW5lV2lkdGhcclxuICApIHtcclxuICAgIGlmICghZnJvbSB8fCAhdG8pIHJldHVybjtcclxuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgQ29sb3JHZW5lcmF0b3IpXHJcbiAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IGxpbmVXaWR0aDtcclxuICAgIHRoaXMuY3R4Lm1vdmVUbyhmcm9tLngsIGZyb20ueSk7XHJcbiAgICB0aGlzLmN0eC5saW5lVG8odG8ueCwgdG8ueSk7XHJcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3UG9pbnQoXHJcbiAgICBwb2ludDogUG9pbnQsXHJcbiAgICBjb2xvcjogc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQgfCBDYW52YXNQYXR0ZXJuIHwgQ29sb3JHZW5lcmF0b3IgPSB0aGlzXHJcbiAgICAgIC5jb25maWcuY29sb3IsXHJcbiAgICBwb2ludFNpemU6IG51bWJlciA9IHRoaXMuY29uZmlnLnBvaW50U2l6ZVxyXG4gICkge1xyXG4gICAgaWYgKCFwb2ludCkgcmV0dXJuO1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvckdlbmVyYXRvcikgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3IuZ2VuZXJhdGUoKTtcclxuICAgIGVsc2UgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBsZXQgc2l6ZSA9IHBvaW50U2l6ZTtcclxuICAgIHRoaXMuY3R4LmZpbGxSZWN0KHBvaW50LnggLSBzaXplIC8gMiwgcG9pbnQueSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdUcmlhbmdsZShcclxuICAgIHRyaWFuZ2xlOiBUcmlhbmdsZSxcclxuICAgIGNvbG9yOiBzdHJpbmcgfCBDYW52YXNHcmFkaWVudCB8IENhbnZhc1BhdHRlcm4gfCBDb2xvckdlbmVyYXRvciA9IHRoaXNcclxuICAgICAgLmNvbmZpZy5jb2xvcixcclxuICAgIGxpbmVXaWR0aDogbnVtYmVyID0gdGhpcy5jb25maWcubGluZVdpZHRoXHJcbiAgKSB7XHJcbiAgICBpZiAoIXRyaWFuZ2xlKSByZXR1cm47XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yR2VuZXJhdG9yKSB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvci5nZW5lcmF0ZSgpO1xyXG4gICAgZWxzZSB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xyXG4gICAgdGhpcy5jdHgubW92ZVRvKHRyaWFuZ2xlLnAxLngsIHRyaWFuZ2xlLnAxLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAyLngsIHRyaWFuZ2xlLnAyLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAzLngsIHRyaWFuZ2xlLnAzLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRyaWFuZ2xlLnAxLngsIHRyaWFuZ2xlLnAxLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2xlYXJDYW52YXMoKSB7XHJcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoXHJcbiAgICAgIDAsXHJcbiAgICAgIDAsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC53aWR0aCxcclxuICAgICAgdGhpcy5jYW52YXNFbGVtZW50LmhlaWdodFxyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLmNvbmZpZy51c2VHcmlkKSB7XHJcbiAgICAgIHRoaXMuZHJhd0dyaWQoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gXCJcIiArIGNodW5rSWQgKyBcIi5hcHAtYnVuZGxlLmpzXCI7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJpbXBvcnQge1xyXG4gIElucHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgSW5wdXRUcmlhbmdsZUNhbnZhc0NvbmZpZyxcclxufSBmcm9tIFwiLi9pbnB1dHRyaWFuZ2xlY2FudmFzXCI7XHJcbmltcG9ydCB7XHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXMsXHJcbiAgT3V0cHV0VHJpYW5nbGVDYW52YXNDb25maWcsXHJcbn0gZnJvbSBcIi4vb3V0cHV0dHJpYW5nbGVjYW52YXNcIjtcclxuXHJcbmxldCBjYWxjdWxhdG9yOiBhbnk7XHJcbmNvbnN0IGNhbGN1bGF0b3JMb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nXCIpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuY29uc3QgY2FsY3VsYXRld29ya2VyID0gbmV3IFdvcmtlcihuZXcgVVJMKFwiLi93b3JrZXJzL2NhbGMud29ya2VyLnRzXCIsIGltcG9ydC5tZXRhLnVybCkpO1xyXG5jYWxjdWxhdGV3b3JrZXIub25tZXNzYWdlID0gKG1lc3NhZ2UpID0+IHtcclxuICBjYWxjdWxhdG9yID0gbWVzc2FnZS5kYXRhO1xyXG5cclxuICBkcmF3T3V0cHV0Q2FudmFzKCk7XHJcbiAgZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCk7XHJcbiAgb3V0cHV0Q2FudmFzLmNhbnZhc0VsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXHJcbiAgICBibG9jazogXCJlbmRcIixcclxuICB9KTtcclxuICBjYWxjdWxhdG9yTG9hZGluZy5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxufTtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzKFxyXG4gIG5ldyBJbnB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDgsXHJcbiAgICBjYW52YXNJZDogXCJjYW52YXNcIixcclxuICAgIG1lcmdlUmFkaXVzOiAyNSxcclxuICAgIHVzZUdyaWQ6IHRydWUsXHJcbiAgICBncmlkQ2VsbFNpemU6IDQwLFxyXG4gICAgZ3JpZExpbmVXaWR0aDogMjAsXHJcbiAgfSlcclxuKTtcclxuXHJcbmxldCBzaG93VHJpYW5nbGVJbmRleCA9IDA7XHJcbmNvbnN0IHRyaWFuZ2xlc1NlbGVjdG9yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0cmlhbmdsZXMtc2VsZWN0b3JcIikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xyXG5jb25zdCBvdXRwdXRDYW52YXMgPSBuZXcgT3V0cHV0VHJpYW5nbGVDYW52YXMoXHJcbiAgbmV3IE91dHB1dFRyaWFuZ2xlQ2FudmFzQ29uZmlnKHtcclxuICAgIGNvbG9yOiBcImJsYWNrXCIsXHJcbiAgICBsaW5lV2lkdGg6IDIsXHJcbiAgICBwb2ludFNpemU6IDQsXHJcbiAgICBjYW52YXNJZDogXCJ0cmlhbmdsZXNcIixcclxuICB9KVxyXG4pO1xyXG5cclxuZnVuY3Rpb24gZHJhd091dHB1dENhbnZhcygpIHtcclxuICBvdXRwdXRDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICBvdXRwdXRDYW52YXMuZHJhd0xpbmVzKGNhbGN1bGF0b3IubGluZXMsIFwiZ3JleVwiLCAxKTtcclxuICBvdXRwdXRDYW52YXMuZHJhd1BvaW50cyhjYWxjdWxhdG9yLnBvaW50cywgXCJncmF5XCIsIDUpO1xyXG4gIG91dHB1dENhbnZhcy5kcmF3VHJpYW5nbGUoY2FsY3VsYXRvci50cmlhbmdsZXNbc2hvd1RyaWFuZ2xlSW5kZXhdLCBcInJlZFwiLCA0KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCl7XHJcbiAgaWYodHJpYW5nbGVzU2VsZWN0b3IgJiYgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoID4gMCl7XHJcbiAgICB0cmlhbmdsZXNTZWxlY3Rvci50ZXh0Q29udGVudCA9IGAke3Nob3dUcmlhbmdsZUluZGV4ICsgMX0gLyAke2NhbGN1bGF0b3IudHJpYW5nbGVzLmxlbmd0aH1gO1xyXG4gIH1cclxufVxyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbGVhclwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMuY2xlYXJBbGwoKTtcclxuICBvdXRwdXRDYW52YXMuY2xlYXJDYW52YXMoKTtcclxuICBpZih0cmlhbmdsZXNTZWxlY3Rvcil7XHJcbiAgICB0cmlhbmdsZXNTZWxlY3Rvci50ZXh0Q29udGVudCA9IFwiMCAvIDBcIjtcclxuICB9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidG4tcHJldlwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZiAoc2hvd1RyaWFuZ2xlSW5kZXggPiAwKSBzaG93VHJpYW5nbGVJbmRleC0tO1xyXG4gIGRyYXdPdXRwdXRDYW52YXMoKTtcclxuICBkcmF3VHJpYW5nbGVzU2VsZWN0b3IoKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnRuLW5leHRcIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYgKHNob3dUcmlhbmdsZUluZGV4IDwgY2FsY3VsYXRvci50cmlhbmdsZXMubGVuZ3RoIC0gMSkgc2hvd1RyaWFuZ2xlSW5kZXgrKztcclxuICBkcmF3T3V0cHV0Q2FudmFzKCk7XHJcbiAgZHJhd1RyaWFuZ2xlc1NlbGVjdG9yKCk7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYWxjXCIpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGNhbGN1bGF0b3JMb2FkaW5nLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuICBjYWxjdWxhdGV3b3JrZXIucG9zdE1lc3NhZ2UoY2FudmFzLmxpbmVzKTtcclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZG9cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgY2FudmFzLnJlZG8oKTtcclxufSk7XHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidW5kb1wiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBjYW52YXMudW5kbygpO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9