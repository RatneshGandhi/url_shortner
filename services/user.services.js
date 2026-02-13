import db from '../db/index.js'
import { usersTable } from '../models/user.models.js'
import {eq} from "drizzle-orm"
import { hashedPasswordWithSalt } from '../utils/hash.js'

export async function getUserByEmail(email){
     const [existingUser]=await db
    .select({id:usersTable.id,
        firstname:usersTable.firstname,
        lastname:usersTable.lastname,
        email:usersTable.email,
        password:usersTable.password,
        salt:usersTable.salt
    })
    .from(usersTable)
    .where(eq(usersTable.email,email))

    

    return existingUser
}