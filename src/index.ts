import cv, { Rect } from 'opencv4nodejs'
import * as nw from './newspaper'
import * as crop from './crop'
import * as post from './post'
;(async () => {
    // let paper = await nw.downloadJP2()
    // cv.imwrite('./image.jpg', paper.image)
    // let image = cv.imread('./image.jpg')
    // let bbs = crop.findBoxes(image)
    // console.log(bbs)
    // const region = crop.crop(image, bbs[0])
    // console.log(region)
    // cv.imwrite('./cropped.jpg', region)
    let credentials = {
        consumer_key: 'SjuqcUEDFBpbfbETpdrBKp5N9',
        consumer_secret: '7XW4FGXsV34VGJVsSIJ5WHWAOD0apH6WXKNVaOs5QyYZ6qJgrS',
        access_token_key: '914188211718586368-a7JKgkuEqEDWCMJhinPvABrNlr0w0n1',
        access_token_secret: 'jQUOI6Ch3cIRFMrubqDujMzmCv9otCzKwJdPpTflKT239',
    }
    post.postTwitter(credentials, './cropped.jpg', 'test')
})()
