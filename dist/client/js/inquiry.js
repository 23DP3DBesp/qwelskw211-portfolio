 'use strict';
const inquiryForm=document.querySelector('#inquiry-form');
let submitted=false,pending=false;
inquiryForm.addEventListener('submit',async event=>{
 event.preventDefault();if(submitted||pending)return;
 const button=inquiryForm.querySelector('[type="submit"]'),status=document.querySelector('#inquiry-status');
 const ru=document.documentElement.lang==='ru';
 pending=true;button.disabled=true;status.setAttribute('data-cms','');
 status.textContent=ru?'Отправляю…':'Sending…';
 try{
  const data=Object.fromEntries(new FormData(inquiryForm));
  const result=await portfolioAPI('/api/inquiries',{method:'POST',body:JSON.stringify(data)});
  if(result.ok!==true)throw new Error(ru?'Сервер не подтвердил отправку. Попробуйте позже.':'The server did not confirm your request. Please try later.');
  submitted=true;inquiryForm.reset();
  status.textContent=ru?'Заявка отправлена. Я свяжусь с вами по указанному контакту.':'Request sent. I’ll get back to you using the contact you provided.';
 }catch(error){status.textContent=error.message;}
 finally{pending=false;button.disabled=submitted;}
});
