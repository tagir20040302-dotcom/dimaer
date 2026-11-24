(() => {
  const gallery = document.querySelector('.case-gallery');
  const galleryContent = document.querySelector('.case-gallery-content');
  const layout = document.querySelector('.case-layout');
  const film = document.querySelector('[data-case-video]');
  const lead = document.querySelector('[data-case-lead], [data-case-video]');
  const projectName = document.body.dataset.projectName || 'Fluento';
  const mobile = window.matchMedia('(max-width: 900px)');
  const updateLayout = () => {
    if (mobile.matches) {
      gallery.removeAttribute('tabindex');
      if (lead && lead.parentElement !== layout) layout.prepend(lead);
    } else {
      gallery.setAttribute('tabindex', '0');
      if (lead && lead.parentElement !== galleryContent) galleryContent.prepend(lead);
    }
  };
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

  const share = document.querySelector('.case-share');
  share.tabIndex = -1;
  const shareUrl = new URL(document.querySelector('link[rel="canonical"]').href).href;
  const shareText = document.querySelector('meta[name="description"]').content;
  const shareTitle = `${projectName} — кейс Алсу Тагировой`;
  const shareStatus = share.querySelector('[data-share-status]');
  const copyLabel = share.querySelector('[data-copy-share-label]');
  const urlLink = share.querySelector('[data-share-url]');
  urlLink.href = shareUrl;
  urlLink.textContent = shareUrl;
  const telegramUrl = new URL('https://t.me/share/url');
  telegramUrl.search = new URLSearchParams({url: shareUrl, text: shareText});
  share.querySelector('[data-share-telegram]').href = telegramUrl.href;
  const whatsappUrl = new URL('https://wa.me/');
  whatsappUrl.search = new URLSearchParams({text: `${shareText}\n${shareUrl}`});
  share.querySelector('[data-share-whatsapp]').href = whatsappUrl.href;
  share.querySelector('[data-share-mail]').href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;

  document.querySelector('[data-open-share]').addEventListener('click', () => {
    shareStatus.textContent = '';
    copyLabel.textContent = 'Копировать ссылку';
    share.showModal();
    share.focus({preventScroll: true});
    share.scrollTop = 0;
  });
  share.querySelector('[data-close-share]').addEventListener('click', () => share.close());
  share.addEventListener('click', event => {
    if (event.target !== share) return;
    const rect = share.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) share.close();
  });

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copyLabel.textContent = 'Ссылка скопирована';
      shareStatus.textContent = '';
      return true;
    } catch {
      shareStatus.textContent = 'Не удалось скопировать ссылку';
      return false;
    }
  };
  share.querySelector('[data-copy-share]').addEventListener('click', copyShareUrl);
  share.querySelector('[data-share-instagram]').addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({title: shareTitle, text: shareText, url: shareUrl});
      } catch (error) {
        if (error.name !== 'AbortError') await copyShareUrl();
      }
      return;
    }
    const copied = copyShareUrl();
    window.open('https://www.instagram.com/direct/inbox/', '_blank', 'noopener,noreferrer');
    await copied;
  });

  if (film?.dataset.videoSrc) {
    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    video.preload = video.autoplay ? 'metadata' : 'none';
    video.poster = film.querySelector('img').src;
    video.src = film.dataset.videoSrc;
    video.setAttribute('aria-label', `Видеообзор проекта ${projectName}`);
    film.replaceChildren(video);
    if (video.autoplay) video.play().catch(() => { video.autoplay = false; });
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
