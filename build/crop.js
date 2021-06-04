"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crop = exports.findBoxes = void 0;
var opencv4nodejs_1 = __importStar(require("opencv4nodejs"));
function findBoxes(image) {
    var boxList = [];
    // let gray = image.cvtColor(cv.COLOR_BGR2GRAY)
    var gray = image;
    var threshInv = gray.threshold(127, 255, opencv4nodejs_1.default.THRESH_BINARY_INV);
    var kernelLength = Math.floor(threshInv.cols / 80);
    var verticalKernel = opencv4nodejs_1.default.getStructuringElement(opencv4nodejs_1.default.MORPH_RECT, new opencv4nodejs_1.Size(1, kernelLength));
    var verticalOpen = threshInv.copy().morphologyEx(verticalKernel, opencv4nodejs_1.default.MORPH_OPEN, new opencv4nodejs_1.Point2(-1, -1), 3);
    var horizontalKernal = opencv4nodejs_1.default.getStructuringElement(opencv4nodejs_1.default.MORPH_RECT, new opencv4nodejs_1.Size(kernelLength, 1));
    var horizontalOpen = threshInv.copy().morphologyEx(horizontalKernal, opencv4nodejs_1.default.MORPH_OPEN, new opencv4nodejs_1.Point2(-1, -1), 3);
    var boxKernel = opencv4nodejs_1.default.getStructuringElement(opencv4nodejs_1.default.MORPH_RECT, new opencv4nodejs_1.Size(3, 3));
    var alpha = 0.5;
    var beta = 1.0 - alpha;
    var combinedLinesWeighted = opencv4nodejs_1.default.addWeighted(verticalOpen, alpha, horizontalOpen, beta, 0.0);
    var combinedLinesErode = combinedLinesWeighted.bitwiseNot().erode(boxKernel, new opencv4nodejs_1.Point2(-1, -1), 3);
    var boxThreshInv = combinedLinesErode.threshold(127, 225, opencv4nodejs_1.default.THRESH_BINARY_INV);
    var contours = boxThreshInv.findContours(opencv4nodejs_1.default.RETR_LIST, opencv4nodejs_1.default.CHAIN_APPROX_SIMPLE);
    contours.forEach(function (contour) {
        var bb = contour.boundingRect();
        if (bb.width > 500 && bb.height > 500) {
            if (bb.width < 2000 && bb.height < 2000) {
                boxList.push(new opencv4nodejs_1.Rect(bb.x, bb.y, bb.width, bb.height));
            }
        }
    });
    return boxList;
}
exports.findBoxes = findBoxes;
function crop(image, boundingBox) {
    var centerX = boundingBox.x + Math.floor(boundingBox.width / 2);
    var centerY = boundingBox.y + Math.floor(boundingBox.height / 2);
    var x1 = centerX - Math.floor(1080 / 2);
    var y1 = centerY - Math.floor(1080 / 2);
    var x2 = centerX + Math.floor(1080 / 2);
    var y2 = centerY + Math.floor(1080 / 2);
    if (x1 < 0) {
        x2 += -x1;
        x1 += -x1;
    }
    if (y1 < 0) {
        y2 += -y1;
        y1 += -y1;
    }
    if (y2 > image.rows) {
        y1 -= y2 - image.rows;
        y2 -= y2 - image.rows;
    }
    if (x2 > image.cols) {
        x1 -= x2 - image.cols;
        x2 -= x2 - image.cols;
    }
    var croppedImg = image.getRegion(new opencv4nodejs_1.Rect(x1, y1, x2 - x1, y2 - y1));
    return croppedImg;
}
exports.crop = crop;
