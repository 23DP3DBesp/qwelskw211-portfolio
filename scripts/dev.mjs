import {Miniflare} from 'miniflare';
import fs from 'node:fs/promises';
let auth={};try{auth=JSON.parse(await fs.readFile('.sites-runtime/admin-auth.json','utf8'));}catch{}
const mf=new Miniflare({modules:true,scriptPath:'dist/server/index.js',host:'127.0.0.1',port:4173,d1Databases:['DB'],d1Persist:'.wrangler/d1',r2Buckets:['MEDIA'],r2Persist:'.wrangler/r2',assets:{directory:'dist/client',binding:'ASSETS',routerConfig:{has_user_worker:true}},bindings:{ADMIN_OWNER_EMAIL:'local-owner@example.test',...auth}});
const db=await mf.getD1Database('DB');
await db.exec('CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY)');
for(const name of (await fs.readdir('drizzle')).filter(x=>x.endsWith('.sql')).sort()){
 if(await db.prepare('SELECT name FROM local_migrations WHERE name=?').bind(name).first())continue;
 const sql=await fs.readFile(`drizzle/${name}`,'utf8');
 for(const statement of sql.split('--> statement-breakpoint').map(x=>x.trim()).filter(Boolean))await db.prepare(statement).run();
 await db.prepare('INSERT INTO local_migrations (name) VALUES (?)').bind(name).run();
}
console.log(`Preview: ${await mf.ready}`);
console.log(auth.ADMIN_PASSWORD_HASH?'Admin: http://127.0.0.1:4173/admin/login':'Run node scripts/setup-admin.mjs to configure local password login.');
process.on('SIGINT',async()=>{await mf.dispose();process.exit(0)});
