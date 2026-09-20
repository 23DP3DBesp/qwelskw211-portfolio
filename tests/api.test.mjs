import {test, afterEach, mock} from 'node:test';
import assert from 'node:assert/strict';
import '../js/api.js';
afterEach(()=>mock.restoreAll());
test('HTML login and fallback pages never become JSON syntax errors or success',async()=>{
 for(const status of [200,403,502]){
  mock.method(globalThis,'fetch',async()=>new Response('<!DOCTYPE html><html>Sign in</html>',{status,headers:{'Content-Type':'text/html'}}));
  await assert.rejects(portfolioAPI('/api/content'),/страницу вместо данных/);
  mock.restoreAll();
 }
});
test('expired sessions, invalid JSON and server errors are actionable',async()=>{
 for(const [body,status,type,message] of [['<html>',401,'text/html',/Сессия истекла/],['{',200,'application/json',/некорректные данные/],['{"error":"Conflict"}',409,'application/json',/Conflict/]]){
  mock.method(globalThis,'fetch',async()=>new Response(body,{status,headers:{'Content-Type':type}}));
  await assert.rejects(portfolioAPI('/api/admin/projects'),message);mock.restoreAll();
 }
});
test('requests retain cookies, reject redirects and preserve upload content type',async()=>{
 mock.method(globalThis,'fetch',async(path,options)=>{
  assert.equal(options.credentials,'same-origin');assert.equal(options.redirect,'error');
  assert.equal(options.headers['Content-Type'],'image/png');assert.equal(options.headers.Accept,'application/json');
  return Response.json({url:'/media/example'});
 });
 assert.deepEqual(await portfolioAPI('/api/admin/upload',{method:'POST',body:new Uint8Array([137]),headers:{'Content-Type':'image/png'}}),{url:'/media/example'});
});
