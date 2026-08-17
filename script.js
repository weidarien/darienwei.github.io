const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');
const progressBar = document.querySelector('.reading-progress span');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  menuButton.classList.toggle('open');
  navigation.classList.toggle('open');
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  menuButton?.classList.remove('open');
  navigation.classList.remove('open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 75}ms`;
  revealObserver.observe(element);
});

function updateReadingProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
}

window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
