const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const revealItems = document.querySelectorAll('[data-reveal]');
const counters = document.querySelectorAll('[data-counter]');
const carousel = document.querySelector('[data-carousel]');

const setScrolledHeader = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', setScrolledHeader, { passive: true });
setScrolledHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu?.classList.toggle('is-open', !isOpen);
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (counter) => {
  const target = Number(counter.dataset.counter);
  const duration = 1400;
  const startTime = performance.now();

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(easedProgress * target);
    const suffix = target === 98 ? '%' : '+';
    counter.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

if (carousel) {
  const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
  const buttons = Array.from(carousel.querySelectorAll('[data-slide]'));
  let activeIndex = 0;
  let intervalId;

  const showSlide = (index) => {
    activeIndex = index;
    cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index));
    buttons.forEach((button, buttonIndex) => button.classList.toggle('is-active', buttonIndex === index));
  };

  const startCarousel = () => {
    intervalId = window.setInterval(() => {
      showSlide((activeIndex + 1) % cards.length);
    }, 5500);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      window.clearInterval(intervalId);
      showSlide(Number(button.dataset.slide));
      startCarousel();
    });
  });

  startCarousel();
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion');
}
