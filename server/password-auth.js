import loginHTML from '../admin/login.html?raw';

const enc=new TextEncoder();
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const digest=async value=>hex(await crypto.subtle.digest('SHA-256',enc.encode(value)));
const query=(env,sql,...args)=>env.DB.prepare(sql).bind(...args);
const cookieName=request=>new URL(request.url).protocol==='https:'?'__Host-portfolio_session':'portfolio_local_session';
const sessionToken=request=>{
 const value=(request.headers.get('Cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName(request)+'='))?.split('=')[1];
 return /^[a-f0-9]{64}$/.test(value||'')?value:null;
};
const cookie=(request,token,age)=>`${cookieName(request)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${new URL(request.url).protocol==='https:'?'; Secure':''}`;
export const passwordMode=env=>!!env.ADMIN_PASSWORD_HASH;
export async function passwordIdentity(request,env){
 const token=sessionToken(request);if(!token)return null;
 const row=await query(env,'SELECT credential_version FROM admin_sessions WHERE token_hash=? AND expires>?',await digest(token),Date.now()).first();
 if(!row||row.credential_version!==await digest(env.ADMIN_PASSWORD_HASH))return null;
 return {id:'password-owner',email:env.ADMIN_USERNAME||'admin'};
}
export async function authRoute(request,env,{json,fail,body,sameOrigin}){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/admin/login'){
  if(!passwordMode(env))return Response.redirect(`${url.origin}/signin-with-chatgpt?return_to=%2Fadmin`,302);
  if(await passwordIdentity(request,env))return Response.redirect(`${url.origin}/admin`,302);
  return new Response(loginHTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'"}});
 }
 if(path!=='/api/auth/login'&&path!=='/api/auth/logout')return null;
 if(request.method!=='POST')fail('Method not allowed',405);
 sameOrigin(request);
 if(path==='/api/auth/logout'){
  const token=sessionToken(request);if(token)await query(env,'DELETE FROM admin_sessions WHERE token_hash=?',await digest(token)).run();
  return new Response(null,{status:303,headers:{Location:'/admin/login','Set-Cookie':cookie(request,'',0),'Cache-Control':'no-store'}});
 }
 if(!passwordMode(env))fail('Вход по паролю не настроен',503);
 const value=await body(request,4096);
 if(typeof value.username!=='string'||typeof value.password!=='string'||value.username.length>100||value.password.length>256)fail('Неверный логин или пароль',401);
 const current=Date.now(),key='login:'+await digest(request.headers.get('CF-Connecting-IP')||'unknown');
 const limit=await query(env,'INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END RETURNING count',key,current+15*60*1000,current,current).first();
 if(limit.count>10)fail('Слишком много попыток. Попробуйте через 15 минут.',429);
 const [scheme,saltHex,expected]=env.ADMIN_PASSWORD_HASH.split(':');
 if(scheme!=='pbkdf2-sha256-100000'||!/^([a-f0-9]{2}){16}$/.test(saltHex)||!/^[a-f0-9]{64}$/.test(expected))fail('Вход временно недоступен',503);
 const keyMaterial=await crypto.subtle.importKey('raw',enc.encode(value.password),'PBKDF2',false,['deriveBits']);
 const salt=Uint8Array.from(saltHex.match(/../g),v=>parseInt(v,16));
 const actual=hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},keyMaterial,256));
 let difference=0;for(let i=0;i<expected.length;i++)difference|=expected.charCodeAt(i)^actual.charCodeAt(i);
 if(difference||value.username!==(env.ADMIN_USERNAME||'admin'))fail('Неверный логин или пароль',401);
 const token=hex(crypto.getRandomValues(new Uint8Array(32))),oldToken=sessionToken(request);
 const operations=[query(env,'DELETE FROM admin_sessions WHERE expires<=?',current)];
 if(oldToken)operations.push(query(env,'DELETE FROM admin_sessions WHERE token_hash=?',await digest(oldToken)));
 operations.push(query(env,'INSERT INTO admin_sessions (token_hash,expires,credential_version) VALUES (?,?,?)',await digest(token),current+8*60*60*1000,await digest(env.ADMIN_PASSWORD_HASH)));
 await env.DB.batch(operations);
 const response=json({ok:true});response.headers.set('Set-Cookie',cookie(request,token,8*60*60));return response;
}
