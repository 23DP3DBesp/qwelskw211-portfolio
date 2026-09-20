import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const owner=sqliteTable('owner',{id:integer('id').primaryKey(),userId:text('user_id').notNull().unique()});
export const projects=sqliteTable('projects',{id:text('id').primaryKey(),data:text('data').notNull(),status:text('status').notNull().default('draft'),position:integer('position').notNull().default(0),revision:integer('revision').notNull().default(1),updated:text('updated').notNull()}, t=>[index('idx_projects_status_position').on(t.status,t.position)]);
export const settings=sqliteTable('settings',{id:integer('id').primaryKey(),data:text('data').notNull(),revision:integer('revision').notNull().default(1)});
export const media=sqliteTable('media',{id:text('id').primaryKey(),type:text('type').notNull(),name:text('name').notNull(),created:text('created').notNull()});
export const inquiries=sqliteTable('inquiries',{id:text('id').primaryKey(),service:text('service').notNull(),description:text('description').notNull(),contact:text('contact').notNull(),status:text('status').notNull().default('new'),created:text('created').notNull()});
export const limits=sqliteTable('rate_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});
