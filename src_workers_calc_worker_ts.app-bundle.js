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
/* harmony export */   "isLinesParallel": () => (/* binding */ isLinesParallel),
/* harmony export */   "isLinesPartsOfOneLine": () => (/* binding */ isLinesPartsOfOneLine),
/* harmony export */   "isPointOnLine": () => (/* binding */ isPointOnLine),
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
function isLinesPartsOfOneLine(line1, line2) {
    if (!isLinesParallel(line1, line2))
        return null;
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(line1.start, line2.start))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.end, line2.end);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(line1.end, line2.end))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.start, line2.start);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(line1.start, line2.end))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.end, line2.start);
    if ((0,_core__WEBPACK_IMPORTED_MODULE_0__.isPointsEqual)(line1.end, line2.start))
        return new _core__WEBPACK_IMPORTED_MODULE_0__.Line(line1.start, line2.end);
    return null;
}
function isLinesParallel(line1, line2) {
    let k1 = Math.atan((line1.end.y - line1.start.y) / (line1.end.x - line1.start.x));
    let k2 = Math.atan((line2.end.y - line2.start.y) / (line2.end.x - line2.start.x));
    return Math.abs(k1 - k2) <= 0.1;
}
function isPointOnLine(line, point) {
    return (Math.abs(distanceBetweenPoints(line.start, point) +
        distanceBetweenPoints(line.end, point) -
        distanceBetweenPoints(line.end, line.start)) <= 0.1);
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/workers/calc.worker.ts ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _calculation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../calculation */ "./src/calculation.ts");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core */ "./src/core.ts");


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
        this.recalcLines();
        this.recalcIntersections();
        this.recalcConnections();
        this.recalcTriangles();
    }
    recalcLines() {
        for (let line1 of this.lines) {
            for (let line2 of this.lines) {
                if (line1 == line2)
                    continue;
                let line = (0,_calculation__WEBPACK_IMPORTED_MODULE_0__.isLinesPartsOfOneLine)(line1, line2);
                if (line && this.lines.findIndex((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.isLinesEqual)(l, line)) === -1)
                    this.lines.push(line);
            }
        }
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
                if (line1 == line2)
                    continue;
                let intersectionPoint = (0,_calculation__WEBPACK_IMPORTED_MODULE_0__.checkIntersection)(line1, line2);
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
        this.points = this.points.filter((value, index, self) => index === self.findIndex((p) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.isPointsEqual)(p, value)));
    }
    recalcConnections() {
        this.connections = [];
        for (let intersectionPoints of this.segmentsMap.values()) {
            for (let p1 of intersectionPoints) {
                for (let p2 of intersectionPoints) {
                    if (!(0,_core__WEBPACK_IMPORTED_MODULE_1__.isPointsEqual)(p1, p2)) {
                        this.connections.push(new _core__WEBPACK_IMPORTED_MODULE_1__.Line(p1, p2));
                    }
                }
            }
        }
        this.connections = this.connections.filter((value, index, self) => index === self.findIndex((l) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.isLinesEqual)(l, value)));
    }
    recalcTriangles() {
        this.triangles = [];
        for (let l1 of this.connections) {
            for (let l2 of this.connections) {
                for (let l3 of this.connections) {
                    if (l1 == l2 || l1 == l3 || l2 == l3)
                        continue;
                    let triangle = (0,_calculation__WEBPACK_IMPORTED_MODULE_0__.linesToTriangle)(l1, l2, l3);
                    if (triangle != null) {
                        this.triangles.push(triangle);
                    }
                }
            }
        }
        this.triangles = this.triangles.filter((value, index, self) => index === self.findIndex((t) => (0,_core__WEBPACK_IMPORTED_MODULE_1__.isTrianglesEqual)(t, value)));
    }
}
const calculator = new TrianglesCalculator();
self.onmessage = (message) => {
    calculator.calc(message.data);
    self.postMessage({
        result: calculator.triangles.length,
        lines: calculator.lines,
        points: calculator.points,
        connections: calculator.connections,
        triangles: calculator.triangles
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfY2FsY193b3JrZXJfdHMuYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBOEQ7QUFFdkQsU0FBUyxlQUFlLENBQUMsRUFBUSxFQUFFLEVBQVEsRUFBRSxFQUFRO0lBQzFELElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FDdEIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLENBQ3JCLEtBQUssS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxvREFBYSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUMzRCxDQUFDO0lBQ0YsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUVyQyxJQUFJLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRCxJQUFJLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVoRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3JELE1B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Q0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NhbGN1bGF0aW9uLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jb3JlLnRzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy93b3JrZXJzL2NhbGMud29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSwgaXNQb2ludHNFcXVhbCB9IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW5lc1RvVHJpYW5nbGUobDE6IExpbmUsIGwyOiBMaW5lLCBsMzogTGluZSk6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbbDEuc3RhcnQsIGwxLmVuZCwgbDIuc3RhcnQsIGwyLmVuZCwgbDMuc3RhcnQsIGwzLmVuZF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDEuc3RhcnQsIGwxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDIuc3RhcnQsIGwyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDMuc3RhcnQsIGwzLmVuZCk7XHJcblxyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKSAqKiAwLjU7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IE1hdGguYWJzKFMpIDw9IDEpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLnBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgcG9pbnQ6IFBvaW50OyBkaXN0YWNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgQSA9IHBvaW50LnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgQiA9IHBvaW50LnkgLSBsaW5lLnN0YXJ0Lnk7XHJcbiAgY29uc3QgQyA9IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgRCA9IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0Lnk7XHJcblxyXG4gIGxldCBkb3QgPSBBICogQyArIEIgKiBEO1xyXG4gIGxldCBsZW5fc3EgPSBDICogQyArIEQgKiBEO1xyXG4gIGxldCBwYXJhbSA9IC0xO1xyXG4gIGlmIChsZW5fc3EgIT0gMCkge1xyXG4gICAgcGFyYW0gPSBkb3QgLyBsZW5fc3E7XHJcbiAgfVxyXG4gIGxldCB4eCA9IDA7XHJcbiAgbGV0IHl5ID0gMDtcclxuXHJcbiAgaWYgKHBhcmFtIDwgMCkge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0Lng7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueTtcclxuICB9IGVsc2UgaWYgKHBhcmFtID4gMSkge1xyXG4gICAgeHggPSBsaW5lLmVuZC54O1xyXG4gICAgeXkgPSBsaW5lLmVuZC55O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueCArIHBhcmFtICogQztcclxuICAgIHl5ID0gbGluZS5zdGFydC55ICsgcGFyYW0gKiBEO1xyXG4gIH1cclxuXHJcbiAgbGV0IGR4ID0gcG9pbnQueCAtIHh4O1xyXG4gIGxldCBkeSA9IHBvaW50LnkgLSB5eTtcclxuXHJcbiAgcmV0dXJuIHsgcG9pbnQ6IG5ldyBQb2ludCh4eCwgeXkpLCBkaXN0YWNlOiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzUGFydHNPZk9uZUxpbmUobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogTGluZSB8IG51bGwge1xyXG4gIGlmICghaXNMaW5lc1BhcmFsbGVsKGxpbmUxLCBsaW5lMikpIHJldHVybiBudWxsO1xyXG5cclxuICBpZiAoaXNQb2ludHNFcXVhbChsaW5lMS5zdGFydCwgbGluZTIuc3RhcnQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLmVuZCwgbGluZTIuZW5kKTtcclxuXHJcbiAgaWYgKGlzUG9pbnRzRXF1YWwobGluZTEuZW5kLCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLnN0YXJ0LCBsaW5lMi5zdGFydCk7XHJcblxyXG4gIGlmIChpc1BvaW50c0VxdWFsKGxpbmUxLnN0YXJ0LCBsaW5lMi5lbmQpKVxyXG4gICAgcmV0dXJuIG5ldyBMaW5lKGxpbmUxLmVuZCwgbGluZTIuc3RhcnQpO1xyXG5cclxuICBpZiAoaXNQb2ludHNFcXVhbChsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0KSlcclxuICAgIHJldHVybiBuZXcgTGluZShsaW5lMS5zdGFydCwgbGluZTIuZW5kKTtcclxuXHJcbiAgcmV0dXJuIG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzUGFyYWxsZWwobGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogYm9vbGVhbiB7XHJcbiAgbGV0IGsxID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUxLmVuZC55IC0gbGluZTEuc3RhcnQueSkgLyAobGluZTEuZW5kLnggLSBsaW5lMS5zdGFydC54KVxyXG4gICk7XHJcbiAgbGV0IGsyID0gTWF0aC5hdGFuKFxyXG4gICAgKGxpbmUyLmVuZC55IC0gbGluZTIuc3RhcnQueSkgLyAobGluZTIuZW5kLnggLSBsaW5lMi5zdGFydC54KVxyXG4gICk7XHJcbiAgcmV0dXJuIE1hdGguYWJzKGsxIC0gazIpIDw9IDAuMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRPbkxpbmUobGluZTogTGluZSwgcG9pbnQ6IFBvaW50KTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIE1hdGguYWJzKFxyXG4gICAgICBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZS5zdGFydCwgcG9pbnQpICtcclxuICAgICAgICBkaXN0YW5jZUJldHdlZW5Qb2ludHMobGluZS5lbmQsIHBvaW50KSAtXHJcbiAgICAgICAgZGlzdGFuY2VCZXR3ZWVuUG9pbnRzKGxpbmUuZW5kLCBsaW5lLnN0YXJ0KVxyXG4gICAgKSA8PSAwLjFcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tJbnRlcnNlY3Rpb24obGluZTE6IExpbmUsIGxpbmUyOiBMaW5lKTogUG9pbnQgfCBudWxsIHtcclxuICBsZXQgY2hlY2tlZFBvaW50cyA9IFtsaW5lMS5zdGFydCwgbGluZTEuZW5kLCBsaW5lMi5zdGFydCwgbGluZTIuZW5kXTtcclxuICBsZXQgQTogbnVtYmVyLCBCOiBudW1iZXIsIEM6IG51bWJlcjtcclxuICBsZXQgcG9pbnR4eDogbnVtYmVyLCBwb2ludHl5OiBudW1iZXI7XHJcblxyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5zdGFydCkpIHJldHVybiBsaW5lMS5zdGFydDtcclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMiwgbGluZTEuZW5kKSkgcmV0dXJuIGxpbmUxLmVuZDtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLnN0YXJ0KSkgcmV0dXJuIGxpbmUyLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUxLCBsaW5lMi5lbmQpKSByZXR1cm4gbGluZTIuZW5kO1xyXG5cclxuICByZXR1cm4gVGVtcENoZWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIFZFSyhheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXggKiBieSAtIGJ4ICogYXk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBDcm9zc2luZ0NoZWNrKHAxOiBQb2ludCwgcDI6IFBvaW50LCBwMzogUG9pbnQsIHA0OiBQb2ludCkge1xyXG4gICAgbGV0IHYxLCB2MiwgdjMsIHY0O1xyXG5cclxuICAgIHYxID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDEueCAtIHAzLngsIHAxLnkgLSBwMy55KTtcclxuICAgIHYyID0gVkVLKHA0LnggLSBwMy54LCBwNC55IC0gcDMueSwgcDIueCAtIHAzLngsIHAyLnkgLSBwMy55KTtcclxuICAgIHYzID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDMueCAtIHAxLngsIHAzLnkgLSBwMS55KTtcclxuICAgIHY0ID0gVkVLKHAyLnggLSBwMS54LCBwMi55IC0gcDEueSwgcDQueCAtIHAxLngsIHA0LnkgLSBwMS55KTtcclxuICAgIGlmICh2MSAqIHYyIDwgMCAmJiB2MyAqIHY0IDwgMCkgcmV0dXJuIHRydWU7XHJcbiAgICBlbHNlIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEVxdWF0aW9uT2ZUaGVMaW5lKHAxOiBQb2ludCwgcDI6IFBvaW50KSB7XHJcbiAgICBBID0gcDIueSAtIHAxLnk7XHJcbiAgICBCID0gcDEueCAtIHAyLng7XHJcbiAgICBDID0gLXAxLnggKiAocDIueSAtIHAxLnkpICsgcDEueSAqIChwMi54IC0gcDEueCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBJbnRlcnNlY3Rpb25YKFxyXG4gICAgYTE6IG51bWJlcixcclxuICAgIGIxOiBudW1iZXIsXHJcbiAgICBjMTogbnVtYmVyLFxyXG4gICAgYTI6IG51bWJlcixcclxuICAgIGIyOiBudW1iZXIsXHJcbiAgICBjMjogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICBsZXQgZCwgZHgsIHBvaW50eDtcclxuICAgIGQgPSBhMSAqIGIyIC0gYjEgKiBhMjtcclxuICAgIGR4ID0gLWMxICogYjIgKyBiMSAqIGMyO1xyXG4gICAgcG9pbnR4ID0gZHggLyBkO1xyXG4gICAgcmV0dXJuIHBvaW50eDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblkoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeSwgcG9pbnR5O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHkgPSAtYTEgKiBjMiArIGMxICogYTI7XHJcbiAgICBwb2ludHkgPSBkeSAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR5O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVGVtcENoZWNrKCk6IFBvaW50IHwgbnVsbCB7XHJcbiAgICBpZiAoXHJcbiAgICAgIENyb3NzaW5nQ2hlY2soXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1swXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzFdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMl0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1szXVxyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgbGV0IGExLCBiMSwgYzEsIGEyLCBiMiwgYzI7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMF0sIGNoZWNrZWRQb2ludHNbMV0pO1xyXG4gICAgICBhMSA9IEE7XHJcbiAgICAgIGIxID0gQjtcclxuICAgICAgYzEgPSBDO1xyXG4gICAgICBFcXVhdGlvbk9mVGhlTGluZShjaGVja2VkUG9pbnRzWzJdLCBjaGVja2VkUG9pbnRzWzNdKTtcclxuICAgICAgYTIgPSBBO1xyXG4gICAgICBiMiA9IEI7XHJcbiAgICAgIGMyID0gQztcclxuICAgICAgcG9pbnR4eCA9IEludGVyc2VjdGlvblgoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHBvaW50eXkgPSBJbnRlcnNlY3Rpb25ZKGExLCBiMSwgYzEsIGEyLCBiMiwgYzIpO1xyXG4gICAgICByZXR1cm4gbmV3IFBvaW50KHBvaW50eHgsIHBvaW50eXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1BvaW50c0VxdWFsKGE6IFBvaW50LCBiOiBQb2ludCwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gTWF0aC5hYnMoYS54IC0gYi54KSA8PSBhbHBoYSAmJiBNYXRoLmFicyhhLnkgLSBiLnkpIDw9IGFscGhhO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNMaW5lc0VxdWFsKGE6IExpbmUsIGI6IExpbmUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIChcclxuICAgIChpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuZW5kLCBiLmVuZCwgYWxwaGEpKSB8fFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuc3RhcnQsIGFscGhhKSAmJiBpc1BvaW50c0VxdWFsKGEuc3RhcnQsIGIuZW5kLCBhbHBoYSkpXHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVHJpYW5nbGVzRXF1YWwoYTogVHJpYW5nbGUsIGI6IFRyaWFuZ2xlLCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIGxldCBlcXVhbHMgPSAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIGVxdWFscyArPVxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAxLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMiwgYWxwaGEpIHx8XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDMsIGFscGhhKVxyXG4gICAgICA/IDFcclxuICAgICAgOiAwO1xyXG4gIHJldHVybiBlcXVhbHMgPT09IDM7XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IGNoZWNrSW50ZXJzZWN0aW9uLCBpc0xpbmVzUGFydHNPZk9uZUxpbmUsIGxpbmVzVG9UcmlhbmdsZSB9IGZyb20gXCIuLi9jYWxjdWxhdGlvblwiO1xyXG5pbXBvcnQge1xyXG4gIExpbmUsXHJcbiAgUG9pbnQsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNMaW5lc0VxdWFsLFxyXG4gIGlzUG9pbnRzRXF1YWwsXHJcbiAgaXNUcmlhbmdsZXNFcXVhbCxcclxufSBmcm9tIFwiLi4vY29yZVwiO1xyXG5cclxuY2xhc3MgVHJpYW5nbGVzQ2FsY3VsYXRvciB7XHJcbiAgcG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGNvbm5lY3Rpb25zOiBMaW5lW10gPSBbXTtcclxuICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10gPSBbXTtcclxuICBzZWdtZW50c01hcDogTWFwPG51bWJlciwgUG9pbnRbXT4gPSBuZXcgTWFwPG51bWJlciwgUG9pbnRbXT4oKTtcclxuXHJcbiAgcHVibGljIGNhbGMobGluZXM6IExpbmVbXSkge1xyXG4gICAgdGhpcy5saW5lcyA9IGxpbmVzO1xyXG4gICAgdGhpcy5yZWNhbGNMaW5lcygpO1xyXG4gICAgdGhpcy5yZWNhbGNJbnRlcnNlY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY0Nvbm5lY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY1RyaWFuZ2xlcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNMaW5lcygpIHtcclxuICAgIGZvcihsZXQgbGluZTEgb2YgdGhpcy5saW5lcyl7XHJcbiAgICAgIGZvcihsZXQgbGluZTIgb2YgdGhpcy5saW5lcyl7XHJcbiAgICAgICAgaWYobGluZTEgPT0gbGluZTIpIGNvbnRpbnVlO1xyXG4gICAgICAgIGxldCBsaW5lID0gaXNMaW5lc1BhcnRzT2ZPbmVMaW5lKGxpbmUxLCBsaW5lMik7XHJcbiAgICAgICAgaWYobGluZSAmJiB0aGlzLmxpbmVzLmZpbmRJbmRleCgobCk9PmlzTGluZXNFcXVhbChsLCBsaW5lKSkgPT09IC0xKVxyXG4gICAgICAgICAgdGhpcy5saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlY2FsY0ludGVyc2VjdGlvbnMoKSB7XHJcbiAgICB0aGlzLnNlZ21lbnRzTWFwID0gbmV3IE1hcDxudW1iZXIsIFBvaW50W10+KCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5zZXQoaSwgW10pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIGZvciAobGV0IGxpbmUxIG9mIHRoaXMubGluZXMpIHtcclxuICAgICAgdGhpcy5wb2ludHMucHVzaChsaW5lMS5zdGFydCk7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnNlZ21lbnRzTWFwLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKT8ucHVzaChsaW5lMS5lbmQpO1xyXG4gICAgICBmb3IgKGxldCBsaW5lMiBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgICAgaWYobGluZTEgPT0gbGluZTIpIGNvbnRpbnVlO1xyXG4gICAgICAgIGxldCBpbnRlcnNlY3Rpb25Qb2ludCA9IGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUxLCBsaW5lMik7XHJcbiAgICAgICAgaWYgKGludGVyc2VjdGlvblBvaW50ICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcFxyXG4gICAgICAgICAgICAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMikpXHJcbiAgICAgICAgICAgID8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBvaW50cyA9IHRoaXMucG9pbnRzLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGlzUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjQ29ubmVjdGlvbnMoKSB7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICBmb3IgKGxldCBpbnRlcnNlY3Rpb25Qb2ludHMgb2YgdGhpcy5zZWdtZW50c01hcC52YWx1ZXMoKSkge1xyXG4gICAgICBmb3IgKGxldCBwMSBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICBmb3IgKGxldCBwMiBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICAgIGlmICghaXNQb2ludHNFcXVhbChwMSwgcDIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChuZXcgTGluZShwMSwgcDIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChsKSA9PiBpc0xpbmVzRXF1YWwobCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjVHJpYW5nbGVzKCkge1xyXG4gICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGwxIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgZm9yIChsZXQgbDIgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICAgIGZvciAobGV0IGwzIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICAgIGlmIChsMSA9PSBsMiB8fCBsMSA9PSBsMyB8fCBsMiA9PSBsMykgY29udGludWU7XHJcbiAgICAgICAgICBsZXQgdHJpYW5nbGUgPSBsaW5lc1RvVHJpYW5nbGUobDEsIGwyLCBsMyk7XHJcbiAgICAgICAgICBpZiAodHJpYW5nbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKHRyaWFuZ2xlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudHJpYW5nbGVzID0gdGhpcy50cmlhbmdsZXMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgodCkgPT4gaXNUcmlhbmdsZXNFcXVhbCh0LCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5zZWxmLm9ubWVzc2FnZSA9IChtZXNzYWdlOiBNZXNzYWdlRXZlbnQ8TGluZVtdPikgPT4ge1xyXG4gIGNhbGN1bGF0b3IuY2FsYyhtZXNzYWdlLmRhdGEpO1xyXG4gIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgcmVzdWx0OiBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgsXHJcbiAgICBsaW5lczogY2FsY3VsYXRvci5saW5lcyxcclxuICAgIHBvaW50czogY2FsY3VsYXRvci5wb2ludHMsXHJcbiAgICBjb25uZWN0aW9uczogY2FsY3VsYXRvci5jb25uZWN0aW9ucyxcclxuICAgIHRyaWFuZ2xlczogY2FsY3VsYXRvci50cmlhbmdsZXNcclxuICB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9