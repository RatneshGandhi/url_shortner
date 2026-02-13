import {usersTable} from '../models/user.models.js'
import db from '../db/index.js'

export async function addNewUser(firstname,lastname,email,hashedPassword,salt){
         const [newUser]=await db.insert(usersTable).values({
        firstname,
        lastname,
        email,
        password:hashedPassword,
        salt
    }).returning({id:usersTable.id})

    return newUser;
}