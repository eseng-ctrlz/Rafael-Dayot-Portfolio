'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Theme toggle (remembered when storage is available) */
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
$('.theme-toggle').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* Mobile navigation */
const toggle = $('.nav-toggle'), links = $('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => { if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', false); } });

/* Scroll reveal + skill bar animation */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    const bar = $('.bar b', en.target);
    if (bar) bar.style.width = en.target.dataset.level + '%';
    io.unobserve(en.target);
  });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* Active navigation highlighting */
const navLinks = $$('.nav-links a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* Back-to-top */
const topBtn = $('#to-top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Project filtering */
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  $$('.chip').forEach(c => c.classList.toggle('active', c === chip));
  $$('.project').forEach(p => p.classList.toggle('hide', chip.dataset.filter !== 'all' && p.dataset.cat !== chip.dataset.filter));
}));

/* Project details toggle */
$$('.details-btn').forEach(btn => btn.addEventListener('click', () => {
  const box = btn.nextElementSibling, open = box.hidden;
  box.hidden = !open;
  btn.setAttribute('aria-expanded', open);
  btn.textContent = open ? 'Hide Details' : 'View Details';
}));

/* Dashboard: sample/demo values only */
$('#refresh').addEventListener('click', () => {
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  $('#m-avail').textContent = (99.85 + Math.random() * .14).toFixed(2) + '%';
  $('#m-dev').textContent = rnd(120, 135);
  $('#m-conn').textContent = rnd(22, 26);
  $('#dash-note').textContent = ' Sample values regenerated (demo only).';
});

/* Contact form validation (front-end only demo) */
const form = $('#contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  $$('input,textarea', form).forEach(f => {
    const err = f.parentElement.querySelector('.err');
    let msg = '';
    if (!f.value.trim()) msg = 'This field is required.';
    else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = 'Enter a valid email address.';
    err.textContent = msg;
    if (msg) valid = false;
  });
  $('.form-ok', form).textContent = valid ? 'Message validated. Connect a form service to send it.' : '';
  if (valid) form.reset();
});
