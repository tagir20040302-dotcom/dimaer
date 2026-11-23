(() => {
  const header = document.querySelector('.case-header');
  const gallery = document.querySelector('.case-gallery');
  const galleryContent = document.querySelector('.case-gallery-content');
  const layout = document.querySelector('.case-layout');
  const film = document.querySelector('[data-case-video]');
  const mobile = window.matchMedia('(max-width: 900px)');
  const updateLayout = () => {
    document.body.style.setProperty('--case-header-height', `${header.getBoundingClientRect().height}px`);
    if (mobile.matches) {
      gallery.removeAttribute('tabindex');
      if (film.parentElement !== layout) layout.prepend(film);
    } else {
      gallery.setAttribute('tabindex', '0');
      if (film.parentElement !== galleryContent) galleryContent.prepend(film);
    }
  };
  new ResizeObserver(updateLayout).observe(header);
  mobile.addEventListener('change', updateLayout);
  updateLayout();

  const dialog = document.querySelector('.case-lightbox');
  const largeImage = dialog.querySelector('.case-lightbox-image');
  document.querySelectorAll('[data-image-title]').forEach(button => {
    button.addEventListener('click', () => {
      const source = button.querySelector('img');
      largeImage.src = source.currentSrc || source.src;
      largeImage.alt = source.alt;
      dialog.querySelector('h2').textContent = button.dataset.imageTitle;
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  dialog.querySelector('[data-close-lightbox]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  if (film.dataset.videoSrc) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = film.querySelector('img').src;
    video.src = film.dataset.videoSrc;
    video.setAttribute('aria-label', 'Видеообзор сайта Fluento');
    film.replaceChildren(video);
  }

  const phone = document.querySelector('[data-copy-phone]');
  const status = document.querySelector('[data-copy-status]');
  let resetStatus;
  phone.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(phone.dataset.copyPhone);
      status.textContent = 'Номер скопирован';
    } catch {
      status.textContent = 'Не удалось скопировать номер';
    }
    clearTimeout(resetStatus);
    resetStatus = setTimeout(() => { status.textContent = ''; }, 3500);
  });
})();
