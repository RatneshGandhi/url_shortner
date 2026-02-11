import {pgTable} from 'drizzle-orm/pg-core'
export const usersTable=pgTable('users',{
    id:uuid().primaryKey().defaultRandom()

    //..
})