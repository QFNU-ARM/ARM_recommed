'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');

toggle.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(opened));
});

nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    })
);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('[data-filter]').forEach(button =>
    button.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(other => {
            other.classList.toggle('selected', other === button);
            other.setAttribute('aria-pressed', String(other === button));
        });
        document.querySelectorAll('[data-type]').forEach(row => {
            row.hidden = button.dataset.filter !== 'all' && row.dataset.type !== button.dataset.filter;
        });
    })
);

document.querySelector('#year').textContent = new Date().getFullYear();

// Each static page marks its own active navigation link.

// Progressive enhancement: page content remains visible if effects are unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const activeEffects = new Set();

function animateEntrance(element, delay = 0) {
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    const animation = element.animate([
        { opacity: 0.35, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 560, delay, easing: 'cubic-bezier(.2,.7,.3,1)' });
    activeEffects.add(animation);
    animation.finished.then(() => activeEffects.delete(animation), () => activeEffects.delete(animation));
}

const entranceTargets = document.querySelectorAll(
    '.section-heading, .about > div, .portal-card, .research-grid article, ' +
    '.team-grid article, .member-cohort, .cohort, .direction-grid article, ' +
    '.work-list article, .equipment-grid article, .tech-detail, ' +
    '.learning-path article, .growth-note, .join-panel'
);
if ('IntersectionObserver' in window) {
    const entranceObserver = new IntersectionObserver(entries => {
        let order = 0;
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateEntrance(entry.target, Math.min(order++ * 55, 165));
            entranceObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08 });
    entranceTargets.forEach(element => entranceObserver.observe(element));
}

// Reintroduce the visible results when changing achievement categories.
document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.work-list article:not([hidden])').forEach((row, index) => {
            animateEntrance(row, Math.min(index * 35, 140));
        });
    });
});

const lightSurfaces = document.querySelectorAll(
    '.portal-card, .research-grid article, .team-grid article, .member-cohort, ' +
    '.cohort, .work-list article, .equipment-grid article, .tech-detail, ' +
    '.learning-path article, .join-panel, .growth-note'
);
lightSurfaces.forEach(surface => {
    surface.classList.add('fx-surface');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    surface.addEventListener('pointermove', event => {
        if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            const rect = surface.getBoundingClientRect();
            surface.style.setProperty('--light-x', `${pointerX - rect.left}px`);
            surface.style.setProperty('--light-y', `${pointerY - rect.top}px`);
            surface.classList.add('fx-lit');
        });
    });
    surface.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        frame = 0;
        surface.classList.remove('fx-lit');
    });
});

reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    activeEffects.forEach(animation => animation.cancel());
    lightSurfaces.forEach(surface => surface.classList.remove('fx-lit'));
});
