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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3JjX3dvcmtlcnNfY2FsY193b3JrZXJfdHMuYXBwLWJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLZ0I7QUFFVCxTQUFTLGVBQWUsQ0FBQyxFQUFRLEVBQUUsRUFBUSxFQUFFLEVBQVE7SUFDMUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUN0QixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDckIsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLG9EQUFhLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQzNELENBQUM7SUFDRixJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRXJDLElBQUksQ0FBQyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxHQUFHLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWhELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDckQsTUFBTSxD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QUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNwQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDckIsS0FBSyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLHVEQUFnQixDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUM5RCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0FBRTdDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUE2QixFQUFFLEVBQUU7SUFDakQsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNmLE1BQU0sRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU07UUFDbkMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxLQUFLO1FBQ3ZCLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTTtRQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLFdBQVc7UUFDbkMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTO0tBQ2hDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NhbGN1bGF0ZXRyaWFuZ2xlcy8uL3NyYy9jYWxjdWxhdGlvbi50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvd29ya2Vycy9jYWxjLndvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIFBvaW50LFxyXG4gIExpbmUsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNQb2ludHNFcXVhbFxyXG59IGZyb20gXCIuL2NvcmVcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsaW5lc1RvVHJpYW5nbGUobDE6IExpbmUsIGwyOiBMaW5lLCBsMzogTGluZSk6IFRyaWFuZ2xlIHwgbnVsbCB7XHJcbiAgbGV0IGhwb2ludHMgPSBbbDEuc3RhcnQsIGwxLmVuZCwgbDIuc3RhcnQsIGwyLmVuZCwgbDMuc3RhcnQsIGwzLmVuZF07XHJcbiAgaHBvaW50cyA9IGhwb2ludHMuZmlsdGVyKFxyXG4gICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChwKSA9PiBpc1BvaW50c0VxdWFsKHAsIHZhbHVlKSlcclxuICApO1xyXG4gIGlmIChocG9pbnRzLmxlbmd0aCAhPSAzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgdmFyIGEgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDEuc3RhcnQsIGwxLmVuZCk7XHJcbiAgdmFyIGIgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDIuc3RhcnQsIGwyLmVuZCk7XHJcbiAgdmFyIGMgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMobDMuc3RhcnQsIGwzLmVuZCk7XHJcblxyXG4gIGlmIChhID4gYiArIGMgfHwgYiA+IGEgKyBjIHx8IGMgPiBhICsgYikgcmV0dXJuIG51bGw7XHJcbiAgY29uc3QgcCA9IChhICsgYiArIGMpIC8gMjtcclxuICBsZXQgUyA9IChwICogKHAgLSBhKSAqIChwIC0gYikgKiAocCAtIGMpKSAqKiAwLjU7XHJcbiAgaWYgKGlzTmFOKFMpIHx8IE1hdGguYWJzKFMpIDw9IDEpIHJldHVybiBudWxsO1xyXG4gIHJldHVybiBuZXcgVHJpYW5nbGUoaHBvaW50c1swXSwgaHBvaW50c1sxXSwgaHBvaW50c1syXSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVBvaW50V2l0aFBvaW50KFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBwb2ludHM6IFBvaW50W10sXHJcbiAgcmFkdWlzOiBudW1iZXJcclxuKTogYm9vbGVhbiB7XHJcbiAgbGV0IG1pblBvaW50OiBQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICBmb3IgKGxldCB0b1BvaW50IG9mIHBvaW50cykge1xyXG4gICAgbGV0IGRpc3RhY2UgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIHRvUG9pbnQpO1xyXG4gICAgaWYgKGRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBkaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHRvUG9pbnQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChtaW5Qb2ludCAhPSBudWxsICYmIG1pbkRpc3QgPD0gcmFkdWlzKSB7XHJcbiAgICBwb2ludC54ID0gbWluUG9pbnQueDtcclxuICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUG9pbnRXaXRoTGluZVBvaW50cyhcclxuICBwb2ludDogUG9pbnQsXHJcbiAgbGluZXM6IExpbmVbXSxcclxuICByYWR1aXM6IG51bWJlclxyXG4pOiBib29sZWFuIHtcclxuICBsZXQgbWluUG9pbnQ6IFBvaW50IHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IG1pbkRpc3Q6IG51bWJlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgIGxldCBkaXN0U3RhcnQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuc3RhcnQpO1xyXG4gICAgbGV0IGRpc3RFbmQgPSBkaXN0YW5jZUJldHdlZW5Qb2ludHMocG9pbnQsIGxpbmUuZW5kKTtcclxuXHJcbiAgICBpZiAoTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKSA8IG1pbkRpc3QpIHtcclxuICAgICAgbWluUG9pbnQgPSBkaXN0U3RhcnQgPCBkaXN0RW5kID8gbGluZS5zdGFydCA6IGxpbmUuZW5kO1xyXG4gICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWR1aXMpIHtcclxuICAgIHBvaW50LnggPSBtaW5Qb2ludC54O1xyXG4gICAgcG9pbnQueSA9IG1pblBvaW50Lnk7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VQb2ludFdpdGhMaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lczogTGluZVtdLFxyXG4gIHJhZHVpczogbnVtYmVyXHJcbik6IGJvb2xlYW4ge1xyXG4gIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICBsZXQgbWluRGlzdDogbnVtYmVyID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XHJcbiAgZm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xyXG4gICAgbGV0IHBkID0gZGlzdGFuY2VGcm9tUG9pbnRUb0xpbmUocG9pbnQsIGxpbmUpO1xyXG4gICAgaWYgKHBkLmRpc3RhY2UgPCBtaW5EaXN0KSB7XHJcbiAgICAgIG1pbkRpc3QgPSBwZC5kaXN0YWNlO1xyXG4gICAgICBtaW5Qb2ludCA9IHBkLnBvaW50O1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobWluUG9pbnQgIT0gbnVsbCAmJiBtaW5EaXN0IDw9IHJhZHVpcykge1xyXG4gICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICBwb2ludC55ID0gbWluUG9pbnQueTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW5Qb2ludHMocDE6IFBvaW50LCBwMjogUG9pbnQpOiBudW1iZXIge1xyXG4gIHJldHVybiBNYXRoLnNxcnQoKHAxLnggLSBwMi54KSAqKiAyICsgKHAxLnkgLSBwMi55KSAqKiAyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlRnJvbVBvaW50VG9MaW5lKFxyXG4gIHBvaW50OiBQb2ludCxcclxuICBsaW5lOiBMaW5lXHJcbik6IHsgcG9pbnQ6IFBvaW50OyBkaXN0YWNlOiBudW1iZXIgfSB7XHJcbiAgY29uc3QgQSA9IHBvaW50LnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgQiA9IHBvaW50LnkgLSBsaW5lLnN0YXJ0Lnk7XHJcbiAgY29uc3QgQyA9IGxpbmUuZW5kLnggLSBsaW5lLnN0YXJ0Lng7XHJcbiAgY29uc3QgRCA9IGxpbmUuZW5kLnkgLSBsaW5lLnN0YXJ0Lnk7XHJcblxyXG4gIGxldCBkb3QgPSBBICogQyArIEIgKiBEO1xyXG4gIGxldCBsZW5fc3EgPSBDICogQyArIEQgKiBEO1xyXG4gIGxldCBwYXJhbSA9IC0xO1xyXG4gIGlmIChsZW5fc3EgIT0gMCkge1xyXG4gICAgcGFyYW0gPSBkb3QgLyBsZW5fc3E7XHJcbiAgfVxyXG4gIGxldCB4eCA9IDA7XHJcbiAgbGV0IHl5ID0gMDtcclxuXHJcbiAgaWYgKHBhcmFtIDwgMCkge1xyXG4gICAgeHggPSBsaW5lLnN0YXJ0Lng7XHJcbiAgICB5eSA9IGxpbmUuc3RhcnQueTtcclxuICB9IGVsc2UgaWYgKHBhcmFtID4gMSkge1xyXG4gICAgeHggPSBsaW5lLmVuZC54O1xyXG4gICAgeXkgPSBsaW5lLmVuZC55O1xyXG4gIH0gZWxzZSB7XHJcbiAgICB4eCA9IGxpbmUuc3RhcnQueCArIHBhcmFtICogQztcclxuICAgIHl5ID0gbGluZS5zdGFydC55ICsgcGFyYW0gKiBEO1xyXG4gIH1cclxuXHJcbiAgbGV0IGR4ID0gcG9pbnQueCAtIHh4O1xyXG4gIGxldCBkeSA9IHBvaW50LnkgLSB5eTtcclxuXHJcbiAgcmV0dXJuIHsgcG9pbnQ6IG5ldyBQb2ludCh4eCwgeXkpLCBkaXN0YWNlOiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0ludGVyc2VjdGlvbihsaW5lMTogTGluZSwgbGluZTI6IExpbmUpOiBQb2ludCB8IG51bGwge1xyXG4gIGxldCBjaGVja2VkUG9pbnRzID0gW2xpbmUxLnN0YXJ0LCBsaW5lMS5lbmQsIGxpbmUyLnN0YXJ0LCBsaW5lMi5lbmRdO1xyXG4gIGxldCBBOiBudW1iZXIsIEI6IG51bWJlciwgQzogbnVtYmVyO1xyXG4gIGxldCBwb2ludHh4OiBudW1iZXIsIHBvaW50eXk6IG51bWJlcjtcclxuXHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTIsIGxpbmUxLnN0YXJ0KSkgcmV0dXJuIGxpbmUxLnN0YXJ0O1xyXG4gIGlmIChpc1BvaW50T25MaW5lKGxpbmUyLCBsaW5lMS5lbmQpKSByZXR1cm4gbGluZTEuZW5kO1xyXG5cclxuICBpZiAoaXNQb2ludE9uTGluZShsaW5lMSwgbGluZTIuc3RhcnQpKSByZXR1cm4gbGluZTIuc3RhcnQ7XHJcbiAgaWYgKGlzUG9pbnRPbkxpbmUobGluZTEsIGxpbmUyLmVuZCkpIHJldHVybiBsaW5lMi5lbmQ7XHJcblxyXG4gIHJldHVybiBUZW1wQ2hlY2soKTtcclxuXHJcbiAgZnVuY3Rpb24gaXNQb2ludE9uTGluZShsOiBMaW5lLCBjOiBQb2ludCk6IGJvb2xlYW4ge1xyXG4gICAgbGV0IHAxID0gbC5zdGFydDtcclxuICAgIGxldCBwMiA9IGwuZW5kO1xyXG5cclxuICAgIGxldCBkeDEgPSBwMi54IC0gcDEueDtcclxuICAgIGxldCBkeTEgPSBwMi55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgZHggPSBjLnggLSBwMS54O1xyXG4gICAgbGV0IGR5ID0gYy55IC0gcDEueTtcclxuXHJcbiAgICBsZXQgUyA9IGR4MSAqIGR5IC0gZHggKiBkeTE7XHJcbiAgICBsZXQgYWIgPSBNYXRoLnNxcnQoZHgxICogZHgxICsgZHkxICogZHkxKTtcclxuICAgIGxldCBoID0gUyAvIGFiO1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKGgpIDwgMC4xO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gVkVLKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBheCAqIGJ5IC0gYnggKiBheTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIENyb3NzaW5nQ2hlY2socDE6IFBvaW50LCBwMjogUG9pbnQsIHAzOiBQb2ludCwgcDQ6IFBvaW50KSB7XHJcbiAgICBsZXQgdjEsIHYyLCB2MywgdjQ7XHJcblxyXG4gICAgdjEgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMS54IC0gcDMueCwgcDEueSAtIHAzLnkpO1xyXG4gICAgdjIgPSBWRUsocDQueCAtIHAzLngsIHA0LnkgLSBwMy55LCBwMi54IC0gcDMueCwgcDIueSAtIHAzLnkpO1xyXG4gICAgdjMgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwMy54IC0gcDEueCwgcDMueSAtIHAxLnkpO1xyXG4gICAgdjQgPSBWRUsocDIueCAtIHAxLngsIHAyLnkgLSBwMS55LCBwNC54IC0gcDEueCwgcDQueSAtIHAxLnkpO1xyXG4gICAgaWYgKHYxICogdjIgPCAwICYmIHYzICogdjQgPCAwKSByZXR1cm4gdHJ1ZTtcclxuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gRXF1YXRpb25PZlRoZUxpbmUocDE6IFBvaW50LCBwMjogUG9pbnQpIHtcclxuICAgIEEgPSBwMi55IC0gcDEueTtcclxuICAgIEIgPSBwMS54IC0gcDIueDtcclxuICAgIEMgPSAtcDEueCAqIChwMi55IC0gcDEueSkgKyBwMS55ICogKHAyLnggLSBwMS54KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIEludGVyc2VjdGlvblgoXHJcbiAgICBhMTogbnVtYmVyLFxyXG4gICAgYjE6IG51bWJlcixcclxuICAgIGMxOiBudW1iZXIsXHJcbiAgICBhMjogbnVtYmVyLFxyXG4gICAgYjI6IG51bWJlcixcclxuICAgIGMyOiBudW1iZXJcclxuICApIHtcclxuICAgIGxldCBkLCBkeCwgcG9pbnR4O1xyXG4gICAgZCA9IGExICogYjIgLSBiMSAqIGEyO1xyXG4gICAgZHggPSAtYzEgKiBiMiArIGIxICogYzI7XHJcbiAgICBwb2ludHggPSBkeCAvIGQ7XHJcbiAgICByZXR1cm4gcG9pbnR4O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gSW50ZXJzZWN0aW9uWShcclxuICAgIGExOiBudW1iZXIsXHJcbiAgICBiMTogbnVtYmVyLFxyXG4gICAgYzE6IG51bWJlcixcclxuICAgIGEyOiBudW1iZXIsXHJcbiAgICBiMjogbnVtYmVyLFxyXG4gICAgYzI6IG51bWJlclxyXG4gICkge1xyXG4gICAgbGV0IGQsIGR5LCBwb2ludHk7XHJcbiAgICBkID0gYTEgKiBiMiAtIGIxICogYTI7XHJcbiAgICBkeSA9IC1hMSAqIGMyICsgYzEgKiBhMjtcclxuICAgIHBvaW50eSA9IGR5IC8gZDtcclxuICAgIHJldHVybiBwb2ludHk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBUZW1wQ2hlY2soKTogUG9pbnQgfCBudWxsIHtcclxuICAgIGlmIChcclxuICAgICAgQ3Jvc3NpbmdDaGVjayhcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzBdLFxyXG4gICAgICAgIGNoZWNrZWRQb2ludHNbMV0sXHJcbiAgICAgICAgY2hlY2tlZFBvaW50c1syXSxcclxuICAgICAgICBjaGVja2VkUG9pbnRzWzNdXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICBsZXQgYTEsIGIxLCBjMSwgYTIsIGIyLCBjMjtcclxuICAgICAgRXF1YXRpb25PZlRoZUxpbmUoY2hlY2tlZFBvaW50c1swXSwgY2hlY2tlZFBvaW50c1sxXSk7XHJcbiAgICAgIGExID0gQTtcclxuICAgICAgYjEgPSBCO1xyXG4gICAgICBjMSA9IEM7XHJcbiAgICAgIEVxdWF0aW9uT2ZUaGVMaW5lKGNoZWNrZWRQb2ludHNbMl0sIGNoZWNrZWRQb2ludHNbM10pO1xyXG4gICAgICBhMiA9IEE7XHJcbiAgICAgIGIyID0gQjtcclxuICAgICAgYzIgPSBDO1xyXG4gICAgICBwb2ludHh4ID0gSW50ZXJzZWN0aW9uWChhMSwgYjEsIGMxLCBhMiwgYjIsIGMyKTtcclxuICAgICAgcG9pbnR5eSA9IEludGVyc2VjdGlvblkoYTEsIGIxLCBjMSwgYTIsIGIyLCBjMik7XHJcbiAgICAgIHJldHVybiBuZXcgUG9pbnQocG9pbnR4eCwgcG9pbnR5eSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFBvaW50IHtcclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgeDogbnVtYmVyLCBwdWJsaWMgeTogbnVtYmVyKSB7fVxyXG5cclxuICBwdWJsaWMgY2xvbmUoKTogUG9pbnQge1xyXG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBQb2ludCwgcHVibGljIGVuZDogUG9pbnQpIHt9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUcmlhbmdsZSB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHAxOiBQb2ludCwgcHVibGljIHAyOiBQb2ludCwgcHVibGljIHAzOiBQb2ludCkge31cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzUG9pbnRzRXF1YWwoYTogUG9pbnQsIGI6IFBvaW50LCBhbHBoYTogbnVtYmVyID0gMSk6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBNYXRoLmFicyhhLnggLSBiLngpIDw9IGFscGhhICYmIE1hdGguYWJzKGEueSAtIGIueSkgPD0gYWxwaGE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVzRXF1YWwoYTogTGluZSwgYjogTGluZSwgYWxwaGE6IG51bWJlciA9IDEpOiBib29sZWFuIHtcclxuICByZXR1cm4gKFxyXG4gICAgKGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5lbmQsIGIuZW5kLCBhbHBoYSkpIHx8XHJcbiAgICAoaXNQb2ludHNFcXVhbChhLmVuZCwgYi5zdGFydCwgYWxwaGEpICYmIGlzUG9pbnRzRXF1YWwoYS5zdGFydCwgYi5lbmQsIGFscGhhKSlcclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUcmlhbmdsZXNFcXVhbChhOiBUcmlhbmdsZSwgYjogVHJpYW5nbGUsIGFscGhhOiBudW1iZXIgPSAxKTogYm9vbGVhbiB7XHJcbiAgbGV0IGVxdWFscyA9IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDEsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAxLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMSwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDIsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAyLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMiwgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgZXF1YWxzICs9XHJcbiAgICBpc1BvaW50c0VxdWFsKGEucDMsIGIucDEsIGFscGhhKSB8fFxyXG4gICAgaXNQb2ludHNFcXVhbChhLnAzLCBiLnAyLCBhbHBoYSkgfHxcclxuICAgIGlzUG9pbnRzRXF1YWwoYS5wMywgYi5wMywgYWxwaGEpXHJcbiAgICAgID8gMVxyXG4gICAgICA6IDA7XHJcbiAgcmV0dXJuIGVxdWFscyA9PT0gMztcclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgY2hlY2tJbnRlcnNlY3Rpb24sIGxpbmVzVG9UcmlhbmdsZSB9IGZyb20gXCIuLi9jYWxjdWxhdGlvblwiO1xyXG5pbXBvcnQge1xyXG4gIExpbmUsXHJcbiAgUG9pbnQsXHJcbiAgVHJpYW5nbGUsXHJcbiAgaXNMaW5lc0VxdWFsLFxyXG4gIGlzUG9pbnRzRXF1YWwsXHJcbiAgaXNUcmlhbmdsZXNFcXVhbCxcclxufSBmcm9tIFwiLi4vY29yZVwiO1xyXG5cclxuY2xhc3MgVHJpYW5nbGVzQ2FsY3VsYXRvciB7XHJcbiAgcG9pbnRzOiBQb2ludFtdID0gW107XHJcbiAgbGluZXM6IExpbmVbXSA9IFtdO1xyXG4gIGNvbm5lY3Rpb25zOiBMaW5lW10gPSBbXTtcclxuICB0cmlhbmdsZXM6IFRyaWFuZ2xlW10gPSBbXTtcclxuICBzZWdtZW50c01hcDogTWFwPG51bWJlciwgUG9pbnRbXT4gPSBuZXcgTWFwPG51bWJlciwgUG9pbnRbXT4oKTtcclxuXHJcbiAgcHVibGljIGNhbGMobGluZXM6IExpbmVbXSkge1xyXG4gICAgdGhpcy5saW5lcyA9IGxpbmVzO1xyXG4gICAgdGhpcy5yZWNhbGNJbnRlcnNlY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY0Nvbm5lY3Rpb25zKCk7XHJcbiAgICB0aGlzLnJlY2FsY1RyaWFuZ2xlcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWNhbGNJbnRlcnNlY3Rpb25zKCkge1xyXG4gICAgdGhpcy5zZWdtZW50c01hcCA9IG5ldyBNYXA8bnVtYmVyLCBQb2ludFtdPigpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuc2V0KGksIFtdKTtcclxuICAgIH1cclxuICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICBmb3IgKGxldCBsaW5lMSBvZiB0aGlzLmxpbmVzKSB7XHJcbiAgICAgIHRoaXMucG9pbnRzLnB1c2gobGluZTEuc3RhcnQpO1xyXG4gICAgICB0aGlzLnBvaW50cy5wdXNoKGxpbmUxLmVuZCk7XHJcbiAgICAgIHRoaXMuc2VnbWVudHNNYXAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMSkpPy5wdXNoKGxpbmUxLnN0YXJ0KTtcclxuICAgICAgdGhpcy5zZWdtZW50c01hcC5nZXQodGhpcy5saW5lcy5pbmRleE9mKGxpbmUxKSk/LnB1c2gobGluZTEuZW5kKTtcclxuICAgICAgZm9yIChsZXQgbGluZTIgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICAgIGxldCBpbnRlcnNlY3Rpb25Qb2ludCA9IGNoZWNrSW50ZXJzZWN0aW9uKGxpbmUxLCBsaW5lMik7XHJcbiAgICAgICAgaWYgKGludGVyc2VjdGlvblBvaW50ICE9IG51bGwpIHtcclxuICAgICAgICAgIHRoaXMuc2VnbWVudHNNYXBcclxuICAgICAgICAgICAgLmdldCh0aGlzLmxpbmVzLmluZGV4T2YobGluZTEpKVxyXG4gICAgICAgICAgICA/LnB1c2goaW50ZXJzZWN0aW9uUG9pbnQpO1xyXG4gICAgICAgICAgdGhpcy5zZWdtZW50c01hcFxyXG4gICAgICAgICAgICAuZ2V0KHRoaXMubGluZXMuaW5kZXhPZihsaW5lMikpXHJcbiAgICAgICAgICAgID8ucHVzaChpbnRlcnNlY3Rpb25Qb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnBvaW50cy5wdXNoKGludGVyc2VjdGlvblBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnBvaW50cyA9IHRoaXMucG9pbnRzLmZpbHRlcihcclxuICAgICAgKHZhbHVlLCBpbmRleCwgc2VsZikgPT5cclxuICAgICAgICBpbmRleCA9PT0gc2VsZi5maW5kSW5kZXgoKHApID0+IGlzUG9pbnRzRXF1YWwocCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjQ29ubmVjdGlvbnMoKSB7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gW107XHJcbiAgICBmb3IgKGxldCBpbnRlcnNlY3Rpb25Qb2ludHMgb2YgdGhpcy5zZWdtZW50c01hcC52YWx1ZXMoKSkge1xyXG4gICAgICBmb3IgKGxldCBwMSBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICBmb3IgKGxldCBwMiBvZiBpbnRlcnNlY3Rpb25Qb2ludHMpIHtcclxuICAgICAgICAgIGlmICghaXNQb2ludHNFcXVhbChwMSwgcDIpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMucHVzaChuZXcgTGluZShwMSwgcDIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbm5lY3Rpb25zID0gdGhpcy5jb25uZWN0aW9ucy5maWx0ZXIoXHJcbiAgICAgICh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+XHJcbiAgICAgICAgaW5kZXggPT09IHNlbGYuZmluZEluZGV4KChsKSA9PiBpc0xpbmVzRXF1YWwobCwgdmFsdWUpKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVjYWxjVHJpYW5nbGVzKCkge1xyXG4gICAgdGhpcy50cmlhbmdsZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGwxIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgZm9yIChsZXQgbDIgb2YgdGhpcy5jb25uZWN0aW9ucykge1xyXG4gICAgICAgIGZvciAobGV0IGwzIG9mIHRoaXMuY29ubmVjdGlvbnMpIHtcclxuICAgICAgICAgIGlmIChsMSA9PSBsMiB8fCBsMSA9PSBsMyB8fCBsMiA9PSBsMykgY29udGludWU7XHJcbiAgICAgICAgICBsZXQgdHJpYW5nbGUgPSBsaW5lc1RvVHJpYW5nbGUobDEsIGwyLCBsMyk7XHJcbiAgICAgICAgICBpZiAodHJpYW5nbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlcy5wdXNoKHRyaWFuZ2xlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMudHJpYW5nbGVzID0gdGhpcy50cmlhbmdsZXMuZmlsdGVyKFxyXG4gICAgICAodmFsdWUsIGluZGV4LCBzZWxmKSA9PlxyXG4gICAgICAgIGluZGV4ID09PSBzZWxmLmZpbmRJbmRleCgodCkgPT4gaXNUcmlhbmdsZXNFcXVhbCh0LCB2YWx1ZSkpXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgY2FsY3VsYXRvciA9IG5ldyBUcmlhbmdsZXNDYWxjdWxhdG9yKCk7XHJcblxyXG5zZWxmLm9ubWVzc2FnZSA9IChtZXNzYWdlOiBNZXNzYWdlRXZlbnQ8TGluZVtdPikgPT4ge1xyXG4gIGNhbGN1bGF0b3IuY2FsYyhtZXNzYWdlLmRhdGEpO1xyXG4gIHNlbGYucG9zdE1lc3NhZ2Uoe1xyXG4gICAgcmVzdWx0OiBjYWxjdWxhdG9yLnRyaWFuZ2xlcy5sZW5ndGgsXHJcbiAgICBsaW5lczogY2FsY3VsYXRvci5saW5lcyxcclxuICAgIHBvaW50czogY2FsY3VsYXRvci5wb2ludHMsXHJcbiAgICBjb25uZWN0aW9uczogY2FsY3VsYXRvci5jb25uZWN0aW9ucyxcclxuICAgIHRyaWFuZ2xlczogY2FsY3VsYXRvci50cmlhbmdsZXNcclxuICB9KTtcclxufTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9