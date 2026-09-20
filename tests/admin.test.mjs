import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const source=await fs.readFile(new URL('../js/admin.js',import.meta.url),'utf8');
async function admin(bootstrap,api){
 const elements=new Map();
 const element=selector=>{
  if(!elements.has(selector))elements.set(selector,{disabled:false,hidden:false,textContent:'',value:'',setAttribute(){},removeAttribute(){},addEventListener(){},reset(){},showModal(){this.open=true;},elements:{namedItem:name=>element('field:'+name)}});
  return elements.get(selector);
 };
 element('#admin-bootstrap').textContent=JSON.stringify(bootstrap);
 vm.runInNewContext(source,{document:{querySelector:element,querySelectorAll:()=>[]},window:{addEventListener(){}},portfolioAPI:api});
 await new Promise(resolve=>setImmediate(resolve));
 return element;
}
test('authorized page opens new project even when API fetches are unavailable',async()=>{
 const el=await admin({session:{email:'owner@example.test'},projects:[],settings:{contacts:{},copy:{}},copyDefaults:{}},()=>{throw new Error('HTML response');});
 assert.equal(el('#account').textContent,'owner@example.test');
 assert.equal(el('#load-recovery').hidden,true);
 assert.equal(el('#new-project').disabled,false);
 el('#new-project').onclick();
 assert.equal(el('#editor').open,true);
 assert.equal(el('#editor-title').textContent,'Новый проект');
});
test('failed initial API request offers recovery without permanently disabling creation',async()=>{
 const el=await admin(null,async()=>{throw new Error('HTML response');});
 assert.equal(el('#load-recovery').hidden,false);
 assert.equal(el('#retry-load').disabled,false);
 assert.equal(el('#new-project').disabled,false);
 el('#new-project').onclick();assert.equal(el('#editor').open,true);
});
