/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas.ts":
/*!***********************!*\
  !*** ./src/canvas.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TriangleCanvas = exports.TriangleCanvasConfig = void 0;
const core_1 = __webpack_require__(/*! ./core */ "./src/core.ts");
class TriangleCanvasConfig {
    constructor(color, lineWidth, pointSize, anchorRadius, canvasId, canvasClearBtnId) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.pointSize = pointSize;
        this.anchorRadius = anchorRadius;
        this.canvasId = canvasId;
        this.canvasClearBtnId = canvasClearBtnId;
    }
}
exports.TriangleCanvasConfig = TriangleCanvasConfig;
class TriangleCanvas {
    constructor(config) {
        this.config = config;
        this.lines = [];
        this.mousePos = new core_1.Point(0, 0);
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
    anchorPointToPoint(point, lines, radius) {
        let minPoint = null;
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let line of lines) {
            let distStart = Math.sqrt((point.x - line.start.x) ** 2 + (point.y - line.start.y) ** 2);
            let distEnd = Math.sqrt((point.x - line.end.x) ** 2 + (point.y - line.end.y) ** 2);
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
        if (this.config.canvasClearBtnId != null) {
            document
                .getElementById(this.config.canvasClearBtnId)
                ?.addEventListener("click", this.clearEventHandler);
        }
    }
}
exports.TriangleCanvas = TriangleCanvas;


/***/ }),

/***/ "./src/core.ts":
/*!*********************!*\
  !*** ./src/core.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Triangle = exports.Line = exports.Point = void 0;
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
const canvas_1 = __webpack_require__(/*! ./canvas */ "./src/canvas.ts");
new canvas_1.TriangleCanvas(new canvas_1.TriangleCanvasConfig("black", 2, 4, 30, "canvas", "clear"));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7Ozs7QUNyQkEsd0VBQStEO0FBRS9ELElBQUksdUJBQWMsQ0FDaEIsSUFBSSw2QkFBb0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUMvRCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly9jYWxjdWxhdGV0cmlhbmdsZXMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FsY3VsYXRldHJpYW5nbGVzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb2ludCwgTGluZSwgVHJpYW5nbGUgfSBmcm9tIFwiLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXNDb25maWcge1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHVibGljIGNvbG9yOiBzdHJpbmcsXHJcbiAgICBwdWJsaWMgbGluZVdpZHRoOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgcG9pbnRTaXplOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgYW5jaG9yUmFkaXVzOiBudW1iZXIsXHJcbiAgICBwdWJsaWMgY2FudmFzSWQ6IHN0cmluZyxcclxuICAgIHB1YmxpYyBjYW52YXNDbGVhckJ0bklkOiBzdHJpbmcgfCBudWxsXHJcbiAgKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGVDYW52YXMge1xyXG4gIGNhbnZhc0VsZW1lbnQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICBsaW5lczogTGluZVtdID0gW107XHJcblxyXG4gIG1vdXNlUG9zOiBQb2ludCA9IG5ldyBQb2ludCgwLCAwKTtcclxuICBzZWxlY3RlZFBvaW50OiBQb2ludCB8IG51bGw7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjb25maWc6IFRyaWFuZ2xlQ2FudmFzQ29uZmlnKSB7XHJcbiAgICB0aGlzLmNhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgY29uZmlnLmNhbnZhc0lkXHJcbiAgICApIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIHRoaXMucnVuVXNlckV2ZW50cygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkcmF3TGluZShmcm9tOiBQb2ludCwgdG86IFBvaW50KSB7XHJcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb25maWcuY29sb3I7XHJcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB0aGlzLmNvbmZpZy5saW5lV2lkdGg7XHJcbiAgICB0aGlzLmN0eC5tb3ZlVG8oZnJvbS54LCBmcm9tLnkpO1xyXG4gICAgdGhpcy5jdHgubGluZVRvKHRvLngsIHRvLnkpO1xyXG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZHJhd1BvaW50KHBvaW50OiBQb2ludCkge1xyXG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICBsZXQgc2l6ZSA9IHRoaXMuY29uZmlnLnBvaW50U2l6ZTtcclxuICAgIHRoaXMuY3R4LmZpbGxSZWN0KHBvaW50LnggLSBzaXplIC8gMiwgcG9pbnQueSAtIHNpemUgLyAyLCBzaXplLCBzaXplKTtcclxuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZU1vdXNlUG9zKGU6IFBvaW50ZXJFdmVudCkge1xyXG4gICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMubW91c2VQb3MueCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgIHRoaXMubW91c2VQb3MueSA9IGUuY2xpZW50WSAtIHJlY3QudG9wO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbmNob3JQb2ludFRvUG9pbnQoXHJcbiAgICBwb2ludDogUG9pbnQsXHJcbiAgICBsaW5lczogTGluZVtdLFxyXG4gICAgcmFkaXVzOiBudW1iZXJcclxuICApOiBib29sZWFuIHtcclxuICAgIGxldCBtaW5Qb2ludDogUG9pbnQgfCBudWxsID0gbnVsbDtcclxuICAgIGxldCBtaW5EaXN0OiBudW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgbGluZXMpIHtcclxuICAgICAgbGV0IGRpc3RTdGFydCA9IE1hdGguc3FydChcclxuICAgICAgICAocG9pbnQueCAtIGxpbmUuc3RhcnQueCkgKiogMiArIChwb2ludC55IC0gbGluZS5zdGFydC55KSAqKiAyXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBsZXQgZGlzdEVuZCA9IE1hdGguc3FydChcclxuICAgICAgICAocG9pbnQueCAtIGxpbmUuZW5kLngpICoqIDIgKyAocG9pbnQueSAtIGxpbmUuZW5kLnkpICoqIDJcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmIChNYXRoLm1pbihkaXN0U3RhcnQsIGRpc3RFbmQpIDwgbWluRGlzdCkge1xyXG4gICAgICAgIG1pblBvaW50ID0gZGlzdFN0YXJ0IDwgZGlzdEVuZCA/IGxpbmUuc3RhcnQgOiBsaW5lLmVuZDtcclxuICAgICAgICBtaW5EaXN0ID0gTWF0aC5taW4oZGlzdFN0YXJ0LCBkaXN0RW5kKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG1pblBvaW50ICE9IG51bGwgJiYgbWluRGlzdCA8PSByYWRpdXMpIHtcclxuICAgICAgcG9pbnQueCA9IG1pblBvaW50Lng7XHJcbiAgICAgIHBvaW50LnkgPSBtaW5Qb2ludC55O1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlU2VsZWN0ZWRQb2ludCgpIHtcclxuICAgIGxldCBwb2ludCA9IG5ldyBQb2ludCh0aGlzLm1vdXNlUG9zLngsIHRoaXMubW91c2VQb3MueSk7XHJcbiAgICB0aGlzLmFuY2hvclBvaW50VG9Qb2ludChwb2ludCwgdGhpcy5saW5lcywgdGhpcy5jb25maWcuYW5jaG9yUmFkaXVzKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IHBvaW50LmNsb25lKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNsZWFyQ2FudmFzKCkge1xyXG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KFxyXG4gICAgICAwLFxyXG4gICAgICAwLFxyXG4gICAgICB0aGlzLmNhbnZhc0VsZW1lbnQud2lkdGgsXHJcbiAgICAgIHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZHJhdygpIHtcclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKGxpbmUuc3RhcnQsIGxpbmUuZW5kKTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGxpbmUgb2YgdGhpcy5saW5lcykge1xyXG4gICAgICB0aGlzLmRyYXdQb2ludChsaW5lLnN0YXJ0KTtcclxuICAgICAgdGhpcy5kcmF3UG9pbnQobGluZS5lbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBydW5Vc2VyRXZlbnRzKCkge1xyXG4gICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzRWxlbWVudDtcclxuXHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHRoaXMucG9pbnRlcmRvd25FdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMucG9pbnRlcnVwRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJjYW5jZWxcIiwgKCkgPT4ge30sIGZhbHNlKTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgdGhpcy5wb2ludGVybW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG5cclxuICAgIGlmICh0aGlzLmNvbmZpZy5jYW52YXNDbGVhckJ0bklkICE9IG51bGwpIHtcclxuICAgICAgZG9jdW1lbnRcclxuICAgICAgICAuZ2V0RWxlbWVudEJ5SWQodGhpcy5jb25maWcuY2FudmFzQ2xlYXJCdG5JZClcclxuICAgICAgICA/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsZWFyRXZlbnRIYW5kbGVyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJFdmVudEhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLmxpbmVzID0gW107XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVybW92ZUV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XHJcbiAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmRyYXdMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludCwgdGhpcy5tb3VzZVBvcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBwb2ludGVyZG93bkV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIHRoaXMudXBkYXRlTW91c2VQb3MoZSk7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZVNlbGVjdGVkUG9pbnQoKTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHBvaW50ZXJ1cEV2ZW50SGFuZGxlciA9IChlOiBQb2ludGVyRXZlbnQpID0+IHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUG9pbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuYW5jaG9yUG9pbnRUb1BvaW50KFxyXG4gICAgICB0aGlzLm1vdXNlUG9zLFxyXG4gICAgICB0aGlzLmxpbmVzLFxyXG4gICAgICB0aGlzLmNvbmZpZy5hbmNob3JSYWRpdXNcclxuICAgICk7XHJcbiAgICB0aGlzLmxpbmVzLnB1c2goXHJcbiAgICAgIG5ldyBMaW5lKHRoaXMuc2VsZWN0ZWRQb2ludC5jbG9uZSgpLCB0aGlzLm1vdXNlUG9zLmNsb25lKCkpXHJcbiAgICApO1xyXG4gICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRQb2ludCA9IG51bGw7XHJcbiAgfTtcclxufSIsImV4cG9ydCBjbGFzcyBQb2ludCB7XHJcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cclxuXHJcbiAgcHVibGljIGNsb25lKCk6IFBvaW50IHtcclxuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIExpbmUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUG9pbnQsIHB1YmxpYyBlbmQ6IFBvaW50KSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpYW5nbGUge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwMTogUG9pbnQsIHB1YmxpYyBwMjogUG9pbnQsIHB1YmxpYyBwMzogUG9pbnQpIHt9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IFBvaW50LCBMaW5lLCBUcmlhbmdsZSB9IGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IHsgVHJpYW5nbGVDYW52YXMsIFRyaWFuZ2xlQ2FudmFzQ29uZmlnfSBmcm9tIFwiLi9jYW52YXNcIjtcclxuXHJcbm5ldyBUcmlhbmdsZUNhbnZhcyhcclxuICBuZXcgVHJpYW5nbGVDYW52YXNDb25maWcoXCJibGFja1wiLCAyLCA0LCAzMCwgXCJjYW52YXNcIiwgXCJjbGVhclwiKVxyXG4pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=