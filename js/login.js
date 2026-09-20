'use strict';
const loginForm=document.querySelector('#login-form');
loginForm.addEventListener('submit',async event=>{
 event.preventDefault();const button=loginForm.querySelector('button');if(button.disabled)return;
 button.disabled=true;button.setAttribute('aria-busy','true');const status=document.querySelector('#login-status');status.textContent='Проверяю…';
 try{await portfolioAPI('/api/auth/login',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(loginForm)))});location.assign('/admin');}
 catch(error){status.textContent=error.message;button.disabled=false;button.removeAttribute('aria-busy');}
});
