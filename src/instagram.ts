import fs from 'fs'
import { IgApiClient } from 'instagram-private-api'

export async function postInstagram(credentials: any, filename: string, caption: string) {
    let ig = new IgApiClient()
    ig.state.generateDevice(credentials['username'])
    await ig.account.login(credentials['username'], credentials['password'])

    let publishResults = await ig.publish.photo({
        file: fs.readFileSync(filename),
        caption: caption,
    })

    return publishResults.status === 'ok'
}
