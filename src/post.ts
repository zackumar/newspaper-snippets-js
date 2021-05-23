import fs from 'fs'
import { IgApiClient } from 'instagram-private-api'
import Twitter from 'twitter'

export async function postInstagram(credentials: any, filename: string, caption: string) {
    let client = new IgApiClient()
    client.state.generateDevice(credentials['username'])
    await client.account.login(credentials['username'], credentials['password'])

    let publishResults = await client.publish.photo({
        file: fs.readFileSync(filename),
        caption: caption,
    })

    return publishResults.status === 'ok'
}

export async function postTwitter(credentials: any, filename: string, caption: string) {
    let client = new Twitter(credentials)
    client.post('media/upload', { media: fs.readFileSync(filename) }, (err, media, response) => {
        if (err) {
            console.error(err)
            return false
        }
        var status = {
            status: caption,
            media_ids: media.media_id_string,
        }

        client.post('statuses/update', status, (err, tweet, response) => {
            if (err) {
                console.error(err)
                return false
            }
        })
    })

    return true
}
