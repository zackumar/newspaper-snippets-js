import fs from 'fs'

import cv from 'opencv4nodejs-prebuilt'

import * as news from './newspaper'
import * as crop from './crop'
import * as post from './post'

import './config'

;(async () => {
    let instagramCredentials = {
        username: process.env.INSTAGRAM_USERNAME,
        password: process.env.INSTAGRAM_PASSWORD,
    }

    let twitterCredentials = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    }

    console.log(`Running on ${new Date().toLocaleString('en-US', { timeZone: 'america/Chicago' })} Central Time`)

    console.log('Downloading JP2')
    let paper: news.Paper = await news.downloadJP2()

    console.log('Finding contours')
    let boundingBoxes: cv.Rect[] = crop.findBoxes(paper.image)
    console.log(`Bounding boxes:`)
    boundingBoxes.forEach((box) => {
        console.log(`[${box.x}, ${box.y}, ${box.width}, ${box.height}]`)
    })

    while (boundingBoxes.length == 0) {
        console.log(`No valid bounding boxes. Downloading new JP2`)
        paper = await news.downloadJP2()
        boundingBoxes = crop.findBoxes(paper.image)
        console.log(`Bounding boxes:`)
        boundingBoxes.forEach((box) => {
            console.log(`[${box.x}, ${box.y}, ${box.width}, ${box.height}]`)
        })
    }

    console.log(`Caption: ${paper.instagramCaption}`)

    let randomBox = boundingBoxes[Math.floor(Math.random() * boundingBoxes.length)]

    console.log(`Cropping image: [${randomBox.x}, ${randomBox.y}, ${randomBox.width}, ${randomBox.height}]`)
    let croppedImg = crop.crop(paper.image, randomBox)

    console.log('Writing image')
    cv.imwrite('./post.jpg', croppedImg)

    console.log('Posting on Instagram')
    if (!(await post.postInstagram(instagramCredentials, './post.jpg', paper.instagramCaption))) {
        console.error('Error posting to Instagram. Exiting')
        return
    }
    console.log('Posted on Instagram')

    console.log('Posting on Twitter')
    if (!(await post.postTwitter(twitterCredentials, './post.jpg', paper.twitterCaption))) {
        console.error('Error posting to Twitter. Exiting')
        return
    }
    console.log('Posted on Twitter')

    console.log('Cleaning files')
    fs.unlinkSync('./post.jpg')

    console.log('Done!')
})()
