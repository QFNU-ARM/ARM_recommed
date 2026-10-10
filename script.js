'use strict';
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#nav');
toggle.addEventListener('click',()=>{const opened=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(opened));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(other=>{other.classList.toggle('selected',other===button);other.setAttribute('aria-pressed',String(other===button));});document.querySelectorAll('[data-type]').forEach(row=>{row.hidden=button.dataset.filter!=='all'&&row.dataset.type!==button.dataset.filter;});}));
document.querySelector('#year').textContent=new Date().getFullYear();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-15% 0px -55% 0px'});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));}
