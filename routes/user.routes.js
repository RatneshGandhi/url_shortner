import express from 'express'
import db from '../db/index.js'
import { usersTable } from '../models/index.js'
import { hashedPasswordWithSalt } from '../utils/hash.js'
import { getUserByEmail } from '../services/user.services.js'
import { addNewUser } from '../services/newUser.services.js'
import { signupPostRequestBodySchema, loginPostRequestBodySchema } from '../validation/request.validation.js'
import {createToken} from '../utils/token.js'

const router = express.Router();

router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() });
    }

    const { firstname, lastname, email, password } = validationResult.data

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return res.status(400).json({ error: 'User exists' })
    }

    const { salt, password: hashedPassword } = hashedPasswordWithSalt(password)

    const newUser = await addNewUser(firstname, lastname, email, hashedPassword, salt)

    return res.status(200).json({ message: "sucess", userId: newUser.id })
})

router.post('/login', async (req, res) => {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body)

    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.format() })
    }

    const { email, password } = validationResult.data;

    const user = await getUserByEmail(email);

    if (!user) {
        return res.status(400).json({ error: "Email or password is wrong" })
    }

    const { password: hashedPassword } = hashedPasswordWithSalt(password, user.salt)

    if (user.password != hashedPassword) {
        return res.status(400).json({ message: " password is wrong" })
    }


    const token = await createToken({id:user.id})

    return res.json({ message: token })

})


export default router;