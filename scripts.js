// Simple nav active state + smooth scroll + gameplay gallery logic

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Set active nav item on scroll
  const setActiveLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = rect.top + window.scrollY - 120;
      if (window.scrollY >= offset && window.scrollY < offset + section.offsetHeight) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  };

  setActiveLink();
  window.addEventListener('scroll', setActiveLink);

  // Smooth scroll for internal links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Initialize gameplay gallery
  initGameplayGallery();
});

// Screenshots
const imageFiles = [
  '1.png','2.png','3.png','4.png','5.png','6.png',
  '7.png','8.png','9.png','10.png','11.png','12.png'
];

let currentIndex = 0;

function initGameplayGallery() {
  const thumbsContainer = document.getElementById('gameplay-thumbs');
  const mainImg = document.getElementById('gameplay-main');
  if (!thumbsContainer || !mainImg) return;

  thumbsContainer.innerHTML = '';

  imageFiles.forEach((src, idx) => {
    const thumb = document.createElement('button');
    thumb.className = 'thumb';
    thumb.type = 'button';
    thumb.dataset.index = idx;

    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Screenshot ' + (idx + 1);

    thumb.appendChild(img);
    thumbsContainer.appendChild(thumb);

    thumb.addEventListener('click', () => {
      setMainImage(idx);
    });
  });

  // Set initial image
  setMainImage(0);

  // Clicking main image opens lightbox
  mainImg.addEventListener('click', () => openLightbox(currentIndex));
}

function setMainImage(index) {
  const mainImg = document.getElementById('gameplay-main');
  const thumbs = document.querySelectorAll('.thumb');
  if (!mainImg) return;

  currentIndex = index;
  mainImg.src = imageFiles[index];
  mainImg.alt = 'Screenshot ' + (index + 1);

  thumbs.forEach((t, i) => {
    t.classList.toggle('active', i === index);
  });
}

// Lightbox logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(index) {
  if (!lightbox || !lightboxImg) return;
  currentIndex = index;
  lightboxImg.src = imageFiles[currentIndex];
  lightboxImg.alt = 'Screenshot ' + (currentIndex + 1);
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function closeLightboxByBg(event) {
  if (event.target === event.currentTarget) {
    closeLightbox();
  }
}

function nextImage(event) {
  if (event) event.stopPropagation();
  currentIndex = (currentIndex + 1) % imageFiles.length;
  if (lightboxImg) {
    lightboxImg.src = imageFiles[currentIndex];
    lightboxImg.alt = 'Screenshot ' + (currentIndex + 1);
  }
}

function prevImage(event) {
  if (event) event.stopPropagation();
  currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
  if (lightboxImg) {
    lightboxImg.src = imageFiles[currentIndex];
    lightboxImg.alt = 'Screenshot ' + (currentIndex + 1);
  }
}

// Expose for inline handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.closeLightboxByBg = closeLightboxByBg;
window.nextImage = nextImage;
window.prevImage = prevImage;
