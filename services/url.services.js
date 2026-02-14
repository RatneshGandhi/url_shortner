import db from '../db/index.js'
import { urlsTable } from '../models/url.models.js'
export async function insertUrl(shortCode,url,userId) {
    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetURL: url,
        userId: userId

    }).returning({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetURL: urlsTable.targetURL
    })
    
    return result;

}