/* ====== APPLY GLOBAL SETTINGS ====== */
function applySettings() {
  const data = getData();
  const s = data.settings;

  // Theme colors
  document.documentElement.style.setProperty('--primary', s.primaryColor);
  document.documentElement.style.setProperty('--secondary', s.secondaryColor);
  document.documentElement.style.setProperty('--accent', s.accentColor);
  document.documentElement.style.setProperty('--font', s.fontFamily);
  document.body.style.fontFamily = s.fontFamily;

  // Button style
  document.body.classList.remove('btn-square', 'btn-pill', 'btn-rounded');
  document.body.classList.add('btn-' + (s.buttonStyle || 'rounded'));

  // Favicon
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    document.head.appendChild(favicon);
  }
  favicon.href = s.favicon;

  // SEO meta tags
  document.title = s.seo.metaTitle;
  setMeta('description', s.seo.metaDescription);
  setMeta('keywords', s.seo.keywords);

  // Logo + site title
  document.querySelectorAll('.logo-img').forEach(el => el.src = s.logo);
  document.querySelectorAll('.logo-text').forEach(el => el.textContent = s.siteTitle);

  // WhatsApp links
  document.querySelectorAll('.whatsapp-link').forEach(el => {
    el.href = `https://wa.me/${s.whatsapp}`;
  });

  // Call links
  document.querySelectorAll('.call-link').forEach(el => {
    el.href = `tel:${s.callNumber}`;
  });

  // Footer
  document.querySelectorAll('.footer-text').forEach(el => el.textContent = s.footerText);
  document.querySelectorAll('.company-desc').forEach(el => el.textContent = s.companyDesc);
  document.querySelectorAll('.contact-phone').forEach(el => el.textContent = s.phone);
  document.querySelectorAll('.contact-email').forEach(el => el.textContent = s.email);
  document.querySelectorAll('.contact-address').forEach(el => el.textContent = s.address);
  document.querySelectorAll('.map-embed').forEach(el => el.src = s.mapEmbed);

  // Social links
  renderSocialLinks();

  // Hero
  document.querySelectorAll('.hero-title').forEach(el => el.textContent = s.heroTitle);
  document.querySelectorAll('.hero-subtitle').forEach(el => el.textContent = s.heroSubtitle);
  document.querySelectorAll('.hero-btn-text').forEach(el => el.textContent = s.heroBtnText);
  document.querySelectorAll('.hero-btn2-text').forEach(el => el.textContent = s.heroBtn2Text || 'Request Site Survey');

  // Hero background (image/video toggle)
  const heroVideo = document.querySelector('.hero video');
  const heroImg = document.querySelector('.hero .hero-bg-img');
  if (heroVideo && heroImg) {
    if (s.heroBgType === 'video' && s.heroVideoEnabled) {
      heroVideo.querySelector('source').src = s.heroBgVideo;
      heroVideo.load();
      heroVideo.style.display = 'block';
      heroImg.style.display = 'none';
    } else if (s.heroBgType === 'image') {
      heroImg.src = s.heroBgImage;
      heroImg.style.display = 'block';
      heroVideo.style.display = 'none';
    } else {
      heroVideo.style.display = 'none';
      heroImg.style.display = 'none';
    }
  }
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
}

/* ====== SOCIAL LINKS ====== */
function renderSocialLinks() {
  const data = getData();
  const social = data.settings.social || {};
  const icons = { facebook: '📘', instagram: '📷', linkedin: '💼', youtube: '▶️', tiktok: '🎵' };
  document.querySelectorAll('.social-links').forEach(el => {
    let html = '';
    for (const key in social) {
      if (social[key]) {
        html += `<a href="${social[key]}" target="_blank" title="${key}">${icons[key] || '🔗'}</a>`;
      }
    }
    el.innerHTML = html;
    el.style.display = html ? 'flex' : 'none';
  });
}

/* ====== TOP PROMO BANNER ====== */
function renderBanner() {
  const el = document.getElementById('promo-banner');
  if (!el) return;
  const data = getData();
  if (!data.settings.showBanner) { el.style.display = 'none'; return; }

  const banner = data.banners.find(b => b.enabled);
  if (!banner) { el.style.display = 'none'; return; }

  if (sessionStorage.getItem('banner_closed_' + banner.id)) { el.style.display = 'none'; return; }

  el.style.display = 'flex';
  el.innerHTML = `
    <span>${banner.text}</span>
    ${banner.btnText ? `<a href="${banner.btnUrl}" class="btn">${banner.btnText}</a>` : ''}
    <button class="close-banner" onclick="closeBanner(${banner.id})">✕</button>
  `;
}
function closeBanner(id) {
  sessionStorage.setItem('banner_closed_' + id, 'true');
  document.getElementById('promo-banner').style.display = 'none';
}

/* ====== POPUP SYSTEM ====== */
function renderPopup() {
  const modal = document.getElementById('sitePopup');
  if (!modal) return;
  const data = getData();
  if (!data.settings.showPopup) return;

  const today = new Date().toISOString().split('T')[0];
  const popup = data.popups.find(p => {
    if (!p.enabled) return false;
    if (p.startDate && today < p.startDate) return false;
    if (p.endDate && today > p.endDate) return false;
    return true;
  });
  if (!popup) return;

  if (sessionStorage.getItem('popup_seen_' + popup.id)) return;

  let mediaHtml = '';
  if (popup.video) {
    mediaHtml = `<div style="aspect-ratio:16/9;"><iframe style="width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${popup.video}" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
  } else if (popup.image) {
    mediaHtml = `<img src="${popup.image}" alt="${popup.title}">`;
  }

  const btnHref = popup.btnUrl === 'whatsapp' ? `https://wa.me/${data.settings.whatsapp}` : popup.btnUrl;

  modal.innerHTML = `
    <div class="site-popup-box">
      <button class="modal-close" onclick="closePopup(${popup.id})">✕</button>
      ${mediaHtml}
      <div class="content">
        <h3>${popup.title}</h3>
        <p>${popup.desc}</p>
        ${popup.btnText ? `<a href="${btnHref}" target="_blank" class="btn btn-primary">${popup.btnText}</a>` : ''}
      </div>
    </div>
  `;

  setTimeout(() => modal.classList.add('active'), 1200);
}
function closePopup(id) {
  sessionStorage.setItem('popup_seen_' + id, 'true');
  document.getElementById('sitePopup').classList.remove('active');
}

/* ====== ANIMATED COUNTERS ====== */
function renderCounters(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const data = getData();
  if (!data.settings.showCounters) { el.style.display = 'none'; return; }

  el.innerHTML = data.statistics.map(s => `
    <div class="counter-box">
      <div class="icon">${s.icon}</div>
      <div class="num" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <div class="lbl">${s.label}</div>
    </div>
  `).join('');

  // animate when in view
  const counters = el.querySelectorAll('.num');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

/* ====== SCROLL REVEAL ====== */
function setupScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.forEach(el => observer.observe(el));
}

/* ====== PAGE LOADER ====== */
function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 250);
  }
}

/* ====== MOBILE MENU TOGGLE ====== */
function setupMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

/* ====== RENDER SERVICES (premium cards) ====== */
function renderServices(targetId, limit) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const data = getData();
  let services = data.services;
  if (limit) services = services.slice(0, limit);
  el.innerHTML = services.map((s, i) => `
    <div class="service-card reveal reveal-delay-${(i % 3)}">
      <div class="img-wrap">
        <img src="${s.image}" alt="${s.title}">
        <div class="icon-badge">${s.icon}</div>
      </div>
      <div class="body">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <a href="#" class="btn btn-outline btn-sm whatsapp-link" target="_blank">Get Quote</a>
      </div>
    </div>
  `).join('');
  setupScrollReveal();
}

/* ====== RENDER PRODUCTS (premium catalogue) ====== */
function renderProducts(targetId, limit, filterCategory) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const data = getData();
  let products = data.products;
  if (filterCategory && filterCategory !== 'all') {
    products = products.filter(p => p.category === filterCategory);
  }
  if (limit) products = products.slice(0, limit);

  el.innerHTML = products.map((p, i) => `
    <div class="product-card reveal reveal-delay-${(i % 3)}">
      <div class="img-wrap">
        ${p.badge ? `<div class="badge">${p.badge}</div>` : ''}
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="info">
        <div class="cat">${p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">${p.price}</div>
        <div class="btn-row">
          <a href="javascript:void(0)" onclick="openProductModal(${p.id})" class="btn btn-outline">View Details</a>
          <a href="https://wa.me/${data.settings.whatsapp}?text=${encodeURIComponent('Hi, I am interested in: ' + p.name)}" target="_blank" class="btn btn-primary">Inquire</a>
        </div>
      </div>
    </div>
  `).join('');
  setupScrollReveal();
}

/* ====== PRODUCT FILTER TABS ====== */
function renderProductFilters(tabsId, gridId) {
  const tabsEl = document.getElementById(tabsId);
  if (!tabsEl) return;
  const data = getData();
  const categories = ['all', ...new Set(data.products.map(p => p.category))];
  tabsEl.innerHTML = categories.map(c => `
    <button class="${c === 'all' ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'All Products' : c}</button>
  `).join('');
  tabsEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(gridId, null, btn.dataset.cat);
    });
  });
}

/* ====== PRODUCT DETAIL MODAL ====== */
function openProductModal(id) {
  const data = getData();
  const p = data.products.find(x => x.id === id);
  if (!p) return;

  let modal = document.getElementById('productModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'productModal';
    document.body.appendChild(modal);
  }

  const gallery = [p.img, ...(p.gallery || [])];
  const specsRows = (p.specs || []).map(s => `<tr><td>${s.key}</td><td>${s.value}</td></tr>`).join('');
  const videoHtml = p.video ? `<div style="margin-top:14px;aspect-ratio:16/9;"><iframe style="width:100%;height:100%;border:0;border-radius:10px;" src="https://www.youtube.com/embed/${p.video}" allowfullscreen></iframe></div>` : '';

  modal.innerHTML = `
    <div class="product-modal-content">
      <button class="modal-close" onclick="closeProductModal()" style="position:static;float:right;">✕</button>
      <div class="product-modal-grid">
        <div class="product-modal-gallery">
          ${gallery.map(g => `<img src="${g}" alt="${p.name}">`).join('')}
          ${videoHtml}
        </div>
        <div>
          <div class="cat" style="color:var(--primary);font-size:.8rem;text-transform:uppercase;letter-spacing:1px;">${p.category}</div>
          <h2 style="margin:8px 0;">${p.name}</h2>
          <div class="price" style="font-size:1.4rem;font-weight:700;color:var(--primary);margin-bottom:12px;">${p.price}</div>
          <p style="color:var(--text-muted);">${p.desc}</p>
          ${specsRows ? `<table class="specs-table">${specsRows}</table>` : ''}
          <a href="https://wa.me/${data.settings.whatsapp}?text=${encodeURIComponent('Hi, I am interested in: ' + p.name)}" target="_blank" class="btn btn-primary" style="margin-top:20px;width:100%;text-align:center;">Inquire on WhatsApp</a>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}
function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('active');
}

/* ====== RENDER PORTFOLIO ====== */
function renderPortfolio(targetId, limit) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const data = getData();
  let items = data.portfolio;
  if (limit) items = items.slice(0, limit);
  el.innerHTML = items.map((p, i) => `
    <div class="portfolio-card reveal reveal-delay-${(i % 3)}" onclick="openProjectModal(${p.id})">
      <img src="${p.img}" alt="${p.title}">
      <div class="play-icon">▶</div>
      <div class="overlay">
        <h3>${p.title}</h3>
        <div class="meta">${p.location || ''}</div>
      </div>
    </div>
  `).join('');
  setupScrollReveal();
}

/* ====== PROJECT DETAIL MODAL (with before/after slider) ====== */
function openProjectModal(id) {
  const data = getData();
  const p = data.portfolio.find(x => x.id === id);
  if (!p) return;

  let modal = document.getElementById('projectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'projectModal';
    document.body.appendChild(modal);
  }

  const gallery = (p.gallery || []).map(g => `<img src="${g}" style="border-radius:10px;margin-bottom:10px;width:100%;" alt="">`).join('');

  modal.innerHTML = `
    <div class="project-modal-content">
      <button class="modal-close" onclick="closeProjectModal()" style="position:static;float:right;">✕</button>
      <h2>${p.title}</h2>
      <p style="color:var(--text-muted);margin-top:8px;">${p.desc || ''}</p>
      <div class="project-meta">
        ${p.client ? `<div class="item"><div class="label">Client</div><div>${p.client}</div></div>` : ''}
        ${p.location ? `<div class="item"><div class="label">Location</div><div>${p.location}</div></div>` : ''}
      </div>
      ${(p.beforeImg && p.afterImg) ? `
        <div class="before-after" id="beforeAfter-${p.id}">
          <span class="label before-lbl">BEFORE</span>
          <span class="label after-lbl">AFTER</span>
          <img src="${p.beforeImg}" class="before-img" alt="Before">
          <img src="${p.afterImg}" class="after-img" alt="After">
          <div class="slider-handle" style="left:50%;"></div>
        </div>
      ` : ''}
      ${p.youtube ? `
        <div style="aspect-ratio:16/9;margin:20px 0;">
          <iframe style="width:100%;height:100%;border:0;border-radius:10px;" src="https://www.youtube.com/embed/${p.youtube}" allowfullscreen></iframe>
        </div>
      ` : ''}
      ${gallery ? `<div style="margin-top:10px;">${gallery}</div>` : ''}
    </div>
  `;
  modal.classList.add('active');

  if (p.beforeImg && p.afterImg) setupBeforeAfterSlider(`beforeAfter-${p.id}`);
}
function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.classList.remove('active');
}

/* ====== BEFORE/AFTER SLIDER ====== */
function setupBeforeAfterSlider(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const handle = container.querySelector('.slider-handle');
  const afterImg = container.querySelector('.after-img');
  let dragging = false;

  function move(x) {
    const rect = container.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  handle.addEventListener('mousedown', () => dragging = true);
  document.addEventListener('mouseup', () => dragging = false);
  document.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });

  handle.addEventListener('touchstart', () => dragging = true);
  document.addEventListener('touchend', () => dragging = false);
  document.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); });

  container.addEventListener('click', e => move(e.clientX));
}

/* ====== RENDER TESTIMONIALS (text + video) ====== */
function renderTestimonials(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  const data = getData();
  el.innerHTML = data.testimonials.map((t, i) => {
    if (t.type === 'video' && t.video) {
      return `
        <div class="testimonial reveal reveal-delay-${(i % 3)}">
          <div class="video-thumb" onclick="openVideo('${t.video}')">
            <img src="${t.image || 'https://placehold.co/400x200/0a0a0f/00aaff?text=Video'}" alt="${t.name}">
            <div class="play-icon">▶</div>
          </div>
          <p>"${t.text}"</p>
          <div class="author">
            <img src="${t.image}" alt="${t.name}">
            <div class="name">${t.name}</div>
          </div>
        </div>
      `;
    }
    return `
      <div class="testimonial reveal reveal-delay-${(i % 3)}">
        <div class="quote-icon">"</div>
        <p>${t.text}</p>
        <div class="author">
          <img src="${t.image || 'https://placehold.co/100x100/0a0a0f/00aaff?text=' + t.name.charAt(0)}" alt="${t.name}">
          <div class="name">${t.name}</div>
        </div>
      </div>
    `;
  }).join('');
  setupScrollReveal();
}

/* ====== VIDEO MODAL ====== */
function openVideo(youtubeId) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  modal.classList.add('active');
}
function closeVideo() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  iframe.src = '';
  modal.classList.remove('active');
}

/* ====== CONTACT FORM ====== */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = getData();
    const name = document.getElementById('cf-name').value;
    const phone = document.getElementById('cf-phone').value;
    const msg = document.getElementById('cf-message').value;
    const text = `Hi, my name is ${name}.\nPhone: ${phone}\nMessage: ${msg}`;
    window.open(`https://wa.me/${data.settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  });
}

/* ====== GET QUOTE / SITE SURVEY MODAL ====== */
function openQuoteModal() {
  let modal = document.getElementById('quoteModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'quoteModal';
    document.body.appendChild(modal);
  }
  const data = getData();
  modal.innerHTML = `
    <div class="form-box" style="position:relative;max-width:480px;">
      <button class="modal-close" onclick="closeQuoteModal()" style="position:absolute;top:-40px;right:0;">✕</button>
      <h2 style="margin-bottom:6px;">Request a Free Site Survey</h2>
      <p style="color:var(--text-muted);margin-bottom:20px;font-size:.9rem;">Fill in your details and we'll get back to you shortly.</p>
      <form id="quoteForm">
        <div class="form-group"><label>Full Name</label><input type="text" id="q-name" required></div>
        <div class="form-group"><label>Phone Number</label><input type="text" id="q-phone" required></div>
        <div class="form-group"><label>Service Needed</label><input type="text" id="q-service" placeholder="e.g. CCTV Installation"></div>
        <div class="form-group"><label>Address / Location</label><textarea id="q-address" rows="2"></textarea></div>
        <button type="submit" class="btn btn-primary" style="width:100%;">Send Request via WhatsApp</button>
      </form>
    </div>
  `;
  modal.classList.add('active');

  document.getElementById('quoteForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('q-name').value;
    const phone = document.getElementById('q-phone').value;
    const service = document.getElementById('q-service').value;
    const address = document.getElementById('q-address').value;
    const text = `Hi, I would like to request a free site survey.\nName: ${name}\nPhone: ${phone}\nService: ${service}\nAddress: ${address}`;
    window.open(`https://wa.me/${data.settings.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    closeQuoteModal();
  });
}
function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) modal.classList.remove('active');
}

/* ====== INIT ON LOAD ====== */
document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  setupMenu();
  setupContactForm();
  renderBanner();
  renderPopup();
  setupScrollReveal();
  hidePageLoader();
});
