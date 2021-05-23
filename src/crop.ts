import cv, { Mat, Point2, Size } from 'opencv4nodejs'

export async function findBoxes(image: Mat) {
    let boxList: BoundingBox[] = []
    let gray = image.bgrToGray()

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
                boxList.push({
                    x: bb.x,
                    y: bb.y,
                    w: bb.width,
                    h: bb.height,
                })
            }
        }
    })

    return boxList
}

type BoundingBox = {
    x: number
    y: number
    w: number
    h: number
}
