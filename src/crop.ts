import cv, { Mat, Point2, Rect, Size } from 'opencv4nodejs-prebuilt'

export function findBoxes(image: Mat) {
    let boxList: Rect[] = []
    // let gray = image.cvtColor(cv.COLOR_BGR2GRAY)
    let gray = image

    let threshInv = gray.threshold(127, 255, cv.THRESH_BINARY_INV)

    let kernelLength = Math.floor(threshInv.cols / 80)

    let verticalKernel = cv.getStructuringElement(cv.MORPH_RECT, new Size(1, kernelLength))
    let verticalOpen = threshInv.copy().morphologyEx(verticalKernel, cv.MORPH_OPEN, new Point2(-1, -1), 3)

    let horizontalKernal = cv.getStructuringElement(cv.MORPH_RECT, new Size(kernelLength, 1))
    let horizontalOpen = threshInv.copy().morphologyEx(horizontalKernal, cv.MORPH_OPEN, new Point2(-1, -1), 3)

    let boxKernel = cv.getStructuringElement(cv.MORPH_RECT, new Size(3, 3))
    let alpha = 0.5
    let beta = 1.0 - alpha

    let combinedLinesWeighted = cv.addWeighted(verticalOpen, alpha, horizontalOpen, beta, 0.0)

    let combinedLinesErode = combinedLinesWeighted.bitwiseNot().erode(boxKernel, new Point2(-1, -1), 3)
    let boxThreshInv = combinedLinesErode.threshold(127, 225, cv.THRESH_BINARY_INV)

    let contours = boxThreshInv.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    contours.forEach((contour) => {
        let bb = contour.boundingRect()
        if (bb.width > 500 && bb.height > 500) {
            if (bb.width < 2000 && bb.height < 2000) {
                boxList.push(new Rect(bb.x, bb.y, bb.width, bb.height))
            }
        }
    })

    return boxList
}

export function crop(image: Mat, boundingBox: Rect) {
    let centerX = boundingBox.x + Math.floor(boundingBox.width / 2)
    let centerY = boundingBox.y + Math.floor(boundingBox.height / 2)

    let x1 = centerX - Math.floor(1080 / 2)
    let y1 = centerY - Math.floor(1080 / 2)
    let x2 = centerX + Math.floor(1080 / 2)
    let y2 = centerY + Math.floor(1080 / 2)

    if (x1 < 0) {
        x2 += -x1
        x1 += -x1
    }

    if (y1 < 0) {
        y2 += -y1
        y1 += -y1
    }

    if (y2 > image.rows) {
        y1 -= y2 - image.rows
        y2 -= y2 - image.rows
    }

    if (x2 > image.cols) {
        x1 -= x2 - image.cols
        x2 -= x2 - image.cols
    }

    let croppedImg = image.getRegion(new Rect(x1, y1, x2 - x1, y2 - y1))
    return croppedImg
}
