import {pgTable,varchar,text,uuid} from 'drizzle-orm/pg-core'
import {usersTable} from './user.models.js'
import { timestamp } from 'drizzle-orm/pg-core'
export const urlsTable=pgTable('urls',{
    id:uuid().primaryKey().defaultRandom(),
    shortCode:varchar('code',{length:225}).notNull().unique(),
    targetURL:text('target_url').notNull(),

    userId:uuid('user_id').references(()=>usersTable.id).notNull(),

    createdAt:timestamp('created_at').defaultNow().notNull(),
    updatedAt:timestamp('updated_at').$onUpdate(()=> new Date()),

})