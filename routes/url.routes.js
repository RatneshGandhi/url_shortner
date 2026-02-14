import express from 'express'
import { shortenPostRequestBodySchema } from '../validation/request.validation.js'
import db from '../db/index.js'
import { urlsTable } from '../models/index.js'
import { nanoid } from 'nanoid'
import { ensureAuthenticated } from '../middleware/auth.middleware.js'
import { and, eq } from 'drizzle-orm'
import { insertUrl } from '../services/url.services.js'

const router = express.Router();

router.post('/shorten', ensureAuthenticated, async function (req, res) {

    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body)

    if (validationResult.error) {
        return res.status(400).json({ error: 'URL not valid' })
    }

    const { url, code } = validationResult.data

    const shortCode = code ?? nanoid(6)

    const result = await insertUrl(shortCode, url, req.user.id)


    return res.status(200)
        .json({ id: result.id, shortCode: result.shortCode, targetURL: result.targetURL })

})

router.get('/codes', ensureAuthenticated, async function (req, res) {
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, req.user.id))
    return res.status(200).json({ codes })
})

router.delete('/:shortCode', ensureAuthenticated, async function (req, res) {
    const shortCode = req.params.shortCode
    await db.delete(urlsTable).where(and(eq(urlsTable.shortCode, shortCode), eq(urlsTable.userId, req.user.id)))

    return res.status(200).json({ message: "Deleted successfully" })

})

router.get('/:shortCode', async function (req, res) {

    const code = req.params.shortCode
    const [result] = await db.select({
        targetURL: urlsTable.targetURL
    }).from(urlsTable).where(eq(urlsTable.shortCode, code))

    if (!result) {
        return res.status(400).json({ error: "Invalid shortcode" })
    }

    return res.redirect(result.targetURL)
})


export default router