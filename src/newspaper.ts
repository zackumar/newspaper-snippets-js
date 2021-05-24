import axios from 'axios'
import cv, { Mat } from 'opencv4nodejs'
import fs from 'fs'
import { privateEncrypt } from 'crypto'

var intros = [
    'Newspaper snippets',
    'Snippy snips',
    'Snippets',
    'Itty bitty pictures',
    'Clips',
    'Clippets',
    'Snip snaps',
    'Snip snips',
    "Whatever they're called",
    'Snippies',
    'Random knick-knacks',
    'Thingy things',
]

var outros = [':D', ':P', '<3', 'newspaper_snippets ❤️', '❤️', '✨', '😊', '😃', '😛', '🥰', '🤨', '👍', 'Zack ❤️', 'The account that gives you random newspaper pictures because why not?', ':)']

var warning: string = 'Hello. Zack here. Because these are snapshots of history, some are bound to be offensive. If you believe this post is overly offensive, feel free to DM me. - Z.U.'

var hashtags = ['newspaper_snippets', 'chroniclingamerica', 'history']

export async function downloadJP2(): Promise<Paper> {
    let date = new Date()
    date.setFullYear(date.getFullYear() - 100)

    let hya = date.toLocaleDateString('fr-CA', { timeZone: 'America/Chicago' })
    let prettyHya = date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric', timeZone: 'America/Chicago' })

    let papersUrl = `https://chroniclingamerica.loc.gov/frontpages/${hya}.json`

    let papersResp = await axios.get(papersUrl)
    let papers = papersResp.data

    let paper = papers[Math.floor(Math.random() * papers.length)]
    let intro = intros[Math.floor(Math.random() * intros.length)]
    let outro = outros[Math.floor(Math.random() * outros.length)]
    let publication = paper['label']
    let placeOfPublication = paper['place_of_publication']
    let pageNum = Math.floor(Math.random() * paper['pages']) + 1

    let footer = ''
    hashtags.forEach((e) => {
        footer += `#${e} `
    })

    let instagramCaption = `${intro} from ${placeOfPublication} in "${publication}", ${prettyHya}. Page ${pageNum}. ${outro} \n\n${warning} \n\n${footer}`
    let twitterCaption = `${intro} from ${placeOfPublication} in "${publication}", ${prettyHya}. Page ${pageNum}. ${outro} \n\n${footer}`

    let paperImgUrl = `https://chroniclingamerica.loc.gov/${paper['url'].slice(1, -2)}${pageNum}.jp2`

    let paperImgResp = await axios.get(paperImgUrl, { responseType: 'arraybuffer' })
    let image = cv.imdecode(paperImgResp.data)

    return {
        image: image,
        instagramCaption: instagramCaption,
        twitterCaption: twitterCaption,
    }
}

export type Paper = {
    image: Mat
    instagramCaption: string
    twitterCaption: string
}
