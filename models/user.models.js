import { timestamp } from 'drizzle-orm/pg-core'
import {pgTable,varchar,text,uuid} from 'drizzle-orm/pg-core'
export const usersTable=pgTable('users',{
    id:uuid().primaryKey().defaultRandom(),

    firstname:varchar('first_name',{length:200}).notNull(),
    lastname:varchar('last_name',{length:200}),

    email:varchar({length:220}).unique().notNull(),

    password:text().notNull(),
    salt:text().notNull(),

    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').$onUpdate(()=> new Date()),
})