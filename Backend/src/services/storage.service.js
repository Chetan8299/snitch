import { ImageKit} from "@imagekit/nodejs"
import {env} from "../config/env.js"

const client = new ImageKit({
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
})

export async function uploadFile({buffer, fileName, folder = "snitch"}) {
    const result = await client.files.upload({
        file: await ImageKit.toFile(buffer),
        fileName,
        folder,
    })

    return result;
}