/* ====== AUTH CHECK ====== */
if (sessionStorage.getItem('itsec_admin_logged_in') !== 'true') {
  window.location.href = 'login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('itsec_admin_logged_in');
  window.location.href = 'login.html';
});

/* ====== TAB SWITCHING ====== */
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ====== HELPER ====== */
function flashSaved(id) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 2000);
}

function extractYoutubeId(input) {
  if (!input) return '';
  input = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
  const patterns = [/youtu\.be\/([a-zA-Z0-9_-]{11})/, /v=([a-zA-Z0-9_-]{11})/, /embed\/([a-zA-Z0-9_-]{11})/];
  for (const p of patterns) { const m = input.match(p); if (m) return m[1]; }
  return input;
}

/* ====== DASHBOARD COUNTS ====== */
function refreshDashboardCounts() {
  const data = getData();
  document.getElementById('count-services').textContent = data.services.length;
  document.getElementById('count-products').textContent = data.products.length;
  document.getElementById('count-portfolio').textContent = data.portfolio.length;
  document.getElementById('count-testimonials').textContent = data.testimonials.length;
  document.getElementById('count-media').textContent = data.media.length;
  document.getElementById('count-popups').textContent = data.popups.filter(p => p.enabled).length;
}

/* ============================================================
   SERVICES
============================================================ */
function renderServicesTable() {
  const data = getData();
  document.getElementById('services-table').innerHTML = data.services.map(s => `
    <tr>
      <td><img src="${s.image || 'https://placehold.co/60x60/0a0a0f/00aaff?text=' + s.icon}" alt=""></td>
      <td style="font-size:1.5rem;">${s.icon}</td>
      <td>${s.title}</td>
      <td class="actions">
        <a class="edit-link" onclick="editService(${s.id})">Edit</a>
        <a class="delete-link" onclick="deleteService(${s.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
function showServiceForm() {
  document.getElementById('serviceForm').style.display = 'block';
  document.getElementById('serviceFormTitle').textContent = 'Add Service';
  ['service-id','service-icon','service-title','service-image','service-desc'].forEach(id => document.getElementById(id).value = '');
}
function hideServiceForm() { document.getElementById('serviceForm').style.display = 'none'; }
function editService(id) {
  const data = getData();
  const s = data.services.find(x => x.id === id);
  if (!s) return;
  showServiceForm();
  document.getElementById('serviceFormTitle').textContent = 'Edit Service';
  document.getElementById('service-id').value = s.id;
  document.getElementById('service-icon').value = s.icon;
  document.getElementById('service-title').value = s.title;
  document.getElementById('service-image').value = s.image || '';
  document.getElementById('service-desc').value = s.desc;
}
function saveService() {
  const data = getData();
  const id = document.getElementById('service-id').value;
  const icon = document.getElementById('service-icon').value || '🔧';
  const title = document.getElementById('service-title').value;
  const image = document.getElementById('service-image').value || 'https://placehold.co/500x320/0a0a0f/00aaff?text=Service';
  const desc = document.getElementById('service-desc').value;
  if (!title) return alert('Title is required');
  if (id) {
    const s = data.services.find(x => x.id === parseInt(id));
    s.icon = icon; s.title = title; s.image = image; s.desc = desc;
  } else {
    const newId = data.services.length ? Math.max(...data.services.map(s => s.id)) + 1 : 1;
    data.services.push({ id: newId, icon, title, image, desc });
  }
  saveData(data); renderServicesTable(); refreshDashboardCounts(); flashSaved('serviceSaveMsg'); hideServiceForm();
}
function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  const data = getData();
  data.services = data.services.filter(s => s.id !== id);
  saveData(data); renderServicesTable(); refreshDashboardCounts();
}

/* ============================================================
   PRODUCTS
============================================================ */
function renderProductsTable() {
  const data = getData();
  document.getElementById('products-table').innerHTML = data.products.map(p => `
    <tr>
      <td><img src="${p.img}" alt=""></td>
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.price}</td>
      <td>${p.badge || '-'}</td>
      <td class="actions">
        <a class="edit-link" onclick="editProduct(${p.id})">Edit</a>
        <a class="delete-link" onclick="deleteProduct(${p.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
function addSpecRow(key = '', value = '') {
  const container = document.getElementById('product-specs-rows');
  const row = document.createElement('div');
  row.className = 'repeat-row';
  row.innerHTML = `
    <input type="text" placeholder="Spec name (e.g. Resolution)" class="spec-key" value="${key}">
    <input type="text" placeholder="Value (e.g. 4MP)" class="spec-value" value="${value}">
    <span class="rm-btn" onclick="this.parentElement.remove()">✕</span>
  `;
  container.appendChild(row);
}
function showProductForm() {
  document.getElementById('productForm').style.display = 'block';
  document.getElementById('productFormTitle').textContent = 'Add Product';
  ['product-id','product-name','product-category','product-price','product-badge','product-img','product-gallery','product-video','product-desc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('product-specs-rows').innerHTML = '';
  document.getElementById('product-featured').checked = false;
  addSpecRow();
}
function hideProductForm() { document.getElementById('productForm').style.display = 'none'; }
function editProduct(id) {
  const data = getData();
  const p = data.products.find(x => x.id === id);
  if (!p) return;
  showProductForm();
  document.getElementById('productFormTitle').textContent = 'Edit Product';
  document.getElementById('product-id').value = p.id;
  document.getElementById('product-name').value = p.name;
  document.getElementById('product-category').value = p.category;
  document.getElementById('product-price').value = p.price;
  document.getElementById('product-badge').value = p.badge || '';
  document.getElementById('product-img').value = p.img;
  document.getElementById('product-gallery').value = (p.gallery || []).join('\n');
  document.getElementById('product-video').value = p.video || '';
  document.getElementById('product-desc').value = p.desc;
  document.getElementById('product-featured').checked = !!p.featured;
  document.getElementById('product-specs-rows').innerHTML = '';
  (p.specs || []).forEach(s => addSpecRow(s.key, s.value));
  if (!(p.specs || []).length) addSpecRow();
}
function saveProduct() {
  const data = getData();
  const id = document.getElementById('product-id').value;
  const name = document.getElementById('product-name').value;
  const category = document.getElementById('product-category').value;
  const price = document.getElementById('product-price').value;
  const badge = document.getElementById('product-badge').value;
  const img = document.getElementById('product-img').value || 'https://placehold.co/400x300/0a0a0f/00aaff?text=Product';
  const gallery = document.getElementById('product-gallery').value.split('\n').map(s => s.trim()).filter(Boolean);
  const video = extractYoutubeId(document.getElementById('product-video').value);
  const desc = document.getElementById('product-desc').value;
  const featured = document.getElementById('product-featured').checked;
  const specs = [...document.querySelectorAll('#product-specs-rows .repeat-row')].map(row => ({
    key: row.querySelector('.spec-key').value, value: row.querySelector('.spec-value').value
  })).filter(s => s.key);

  if (!name) return alert('Product name is required');
  if (id) {
    const p = data.products.find(x => x.id === parseInt(id));
    p.name = name; p.category = category; p.price = price; p.badge = badge; p.img = img;
    p.gallery = gallery; p.video = video; p.desc = desc; p.featured = featured; p.specs = specs;
  } else {
    const newId = data.products.length ? Math.max(...data.products.map(p => p.id)) + 1 : 1;
    data.products.push({ id: newId, name, category, price, badge, img, gallery, video, desc, featured, specs });
  }
  saveData(data); renderProductsTable(); refreshDashboardCounts(); flashSaved('productSaveMsg'); hideProductForm();
}
function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const data = getData();
  data.products = data.products.filter(p => p.id !== id);
  saveData(data); renderProductsTable(); refreshDashboardCounts();
}

/* ============================================================
   PORTFOLIO
============================================================ */
function renderPortfolioTable() {
  const data = getData();
  document.getElementById('portfolio-table').innerHTML = data.portfolio.map(p => `
    <tr>
      <td><img src="${p.img}" alt=""></td>
      <td>${p.title}</td>
      <td>${p.client || '-'}</td>
      <td>${p.location || '-'}</td>
      <td class="actions">
        <a class="edit-link" onclick="editPortfolio(${p.id})">Edit</a>
        <a class="delete-link" onclick="deletePortfolio(${p.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
function showPortfolioForm() {
  document.getElementById('portfolioForm').style.display = 'block';
  document.getElementById('portfolioFormTitle').textContent = 'Add Project';
  ['portfolio-id','portfolio-title','portfolio-desc','portfolio-client','portfolio-location','portfolio-img','portfolio-gallery','portfolio-before','portfolio-after','portfolio-youtube'].forEach(id => document.getElementById(id).value = '');
}
function hidePortfolioForm() { document.getElementById('portfolioForm').style.display = 'none'; }
function editPortfolio(id) {
  const data = getData();
  const p = data.portfolio.find(x => x.id === id);
  if (!p) return;
  showPortfolioForm();
  document.getElementById('portfolioFormTitle').textContent = 'Edit Project';
  document.getElementById('portfolio-id').value = p.id;
  document.getElementById('portfolio-title').value = p.title;
  document.getElementById('portfolio-desc').value = p.desc || '';
  document.getElementById('portfolio-client').value = p.client || '';
  document.getElementById('portfolio-location').value = p.location || '';
  document.getElementById('portfolio-img').value = p.img;
  document.getElementById('portfolio-gallery').value = (p.gallery || []).join('\n');
  document.getElementById('portfolio-before').value = p.beforeImg || '';
  document.getElementById('portfolio-after').value = p.afterImg || '';
  document.getElementById('portfolio-youtube').value = p.youtube || '';
}
function savePortfolio() {
  const data = getData();
  const id = document.getElementById('portfolio-id').value;
  const title = document.getElementById('portfolio-title').value;
  const desc = document.getElementById('portfolio-desc').value;
  const client = document.getElementById('portfolio-client').value;
  const location = document.getElementById('portfolio-location').value;
  const img = document.getElementById('portfolio-img').value || 'https://placehold.co/500x300/0a0a0f/00aaff?text=Project';
  const gallery = document.getElementById('portfolio-gallery').value.split('\n').map(s => s.trim()).filter(Boolean);
  const beforeImg = document.getElementById('portfolio-before').value;
  const afterImg = document.getElementById('portfolio-after').value;
  const youtube = extractYoutubeId(document.getElementById('portfolio-youtube').value);
  if (!title) return alert('Project title is required');
  if (id) {
    const p = data.portfolio.find(x => x.id === parseInt(id));
    p.title = title; p.desc = desc; p.client = client; p.location = location; p.img = img;
    p.gallery = gallery; p.beforeImg = beforeImg; p.afterImg = afterImg; p.youtube = youtube;
  } else {
    const newId = data.portfolio.length ? Math.max(...data.portfolio.map(p => p.id)) + 1 : 1;
    data.portfolio.push({ id: newId, title, desc, client, location, img, gallery, beforeImg, afterImg, youtube });
  }
  saveData(data); renderPortfolioTable(); refreshDashboardCounts(); flashSaved('portfolioSaveMsg'); hidePortfolioForm();
}
function deletePortfolio(id) {
  if (!confirm('Delete this project?')) return;
  const data = getData();
  data.portfolio = data.portfolio.filter(p => p.id !== id);
  saveData(data); renderPortfolioTable(); refreshDashboardCounts();
}

/* ============================================================
   TESTIMONIALS
============================================================ */
function renderTestimonialsTable() {
  const data = getData();
  document.getElementById('testimonials-table').innerHTML = data.testimonials.map(t => `
    <tr>
      <td><img src="${t.image || 'https://placehold.co/50x50/0a0a0f/00aaff?text=' + t.name.charAt(0)}" alt=""></td>
      <td>${t.name}</td>
      <td>${t.type === 'video' ? '🎥 Video' : '📝 Text'}</td>
      <td>${t.text.substring(0,50)}${t.text.length>50?'...':''}</td>
      <td class="actions">
        <a class="edit-link" onclick="editTestimonial(${t.id})">Edit</a>
        <a class="delete-link" onclick="deleteTestimonial(${t.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
function showTestimonialForm() {
  document.getElementById('testimonialForm').style.display = 'block';
  document.getElementById('testimonialFormTitle').textContent = 'Add Testimonial';
  ['testimonial-id','testimonial-name','testimonial-image','testimonial-video','testimonial-text'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('testimonial-type').value = 'text';
}
function hideTestimonialForm() { document.getElementById('testimonialForm').style.display = 'none'; }
function editTestimonial(id) {
  const data = getData();
  const t = data.testimonials.find(x => x.id === id);
  if (!t) return;
  showTestimonialForm();
  document.getElementById('testimonialFormTitle').textContent = 'Edit Testimonial';
  document.getElementById('testimonial-id').value = t.id;
  document.getElementById('testimonial-name').value = t.name;
  document.getElementById('testimonial-type').value = t.type || 'text';
  document.getElementById('testimonial-image').value = t.image || '';
  document.getElementById('testimonial-video').value = t.video || '';
  document.getElementById('testimonial-text').value = t.text;
}
function saveTestimonial() {
  const data = getData();
  const id = document.getElementById('testimonial-id').value;
  const name = document.getElementById('testimonial-name').value;
  const type = document.getElementById('testimonial-type').value;
  const image = document.getElementById('testimonial-image').value;
  const video = extractYoutubeId(document.getElementById('testimonial-video').value);
  const text = document.getElementById('testimonial-text').value;
  if (!name || !text) return alert('Name and message are required');
  if (id) {
    const t = data.testimonials.find(x => x.id === parseInt(id));
    t.name = name; t.type = type; t.image = image; t.video = video; t.text = text;
  } else {
    const newId = data.testimonials.length ? Math.max(...data.testimonials.map(t => t.id)) + 1 : 1;
    data.testimonials.push({ id: newId, name, type, image, video, text });
  }
  saveData(data); renderTestimonialsTable(); refreshDashboardCounts(); flashSaved('testimonialSaveMsg'); hideTestimonialForm();
}
function deleteTestimonial(id) {
  if (!confirm('Delete this testimonial?')) return;
  const data = getData();
  data.testimonials = data.testimonials.filter(t => t.id !== id);
  saveData(data); renderTestimonialsTable(); refreshDashboardCounts();
}

/* ============================================================
   STATISTICS
============================================================ */
function renderStatisticsTable() {
  const data = getData();
  document.getElementById('toggle-showCounters').checked = data.settings.showCounters;
  document.getElementById('statistics-table').innerHTML = data.statistics.map(s => `
    <tr>
      <td style="font-size:1.4rem;">${s.icon}</td>
      <td>${s.value}${s.suffix}</td>
      <td>${s.label}</td>
      <td class="actions">
        <a class="edit-link" onclick="editStat(${s.id})">Edit</a>
        <a class="delete-link" onclick="deleteStat(${s.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
document.getElementById('toggle-showCounters').addEventListener('change', function() {
  const data = getData(); data.settings.showCounters = this.checked; saveData(data);
});
function showStatForm() {
  document.getElementById('statForm').style.display = 'block';
  document.getElementById('statFormTitle').textContent = 'Add Counter';
  ['stat-id','stat-icon','stat-value','stat-suffix','stat-label'].forEach(id => document.getElementById(id).value = '');
}
function hideStatForm() { document.getElementById('statForm').style.display = 'none'; }
function editStat(id) {
  const data = getData();
  const s = data.statistics.find(x => x.id === id);
  if (!s) return;
  showStatForm();
  document.getElementById('statFormTitle').textContent = 'Edit Counter';
  document.getElementById('stat-id').value = s.id;
  document.getElementById('stat-icon').value = s.icon;
  document.getElementById('stat-value').value = s.value;
  document.getElementById('stat-suffix').value = s.suffix;
  document.getElementById('stat-label').value = s.label;
}
function saveStat() {
  const data = getData();
  const id = document.getElementById('stat-id').value;
  const icon = document.getElementById('stat-icon').value || '📊';
  const value = parseInt(document.getElementById('stat-value').value) || 0;
  const suffix = document.getElementById('stat-suffix').value;
  const label = document.getElementById('stat-label').value;
  if (!label) return alert('Label is required');
  if (id) {
    const s = data.statistics.find(x => x.id === parseInt(id));
    s.icon = icon; s.value = value; s.suffix = suffix; s.label = label;
  } else {
    const newId = data.statistics.length ? Math.max(...data.statistics.map(s => s.id)) + 1 : 1;
    data.statistics.push({ id: newId, icon, value, suffix, label });
  }
  saveData(data); renderStatisticsTable(); flashSaved('statSaveMsg'); hideStatForm();
}
function deleteStat(id) {
  if (!confirm('Delete this counter?')) return;
  const data = getData();
  data.statistics = data.statistics.filter(s => s.id !== id);
  saveData(data); renderStatisticsTable();
}

/* ============================================================
   BANNERS
============================================================ */
function renderBannersTable() {
  const data = getData();
  document.getElementById('toggle-showBanner').checked = data.settings.showBanner;
  document.getElementById('banners-table').innerHTML = data.banners.map(b => `
    <tr>
      <td>${b.text.substring(0,40)}${b.text.length>40?'...':''}</td>
      <td>${b.btnText || '-'}</td>
      <td>${b.enabled ? '✅' : '❌'}</td>
      <td class="actions">
        <a class="edit-link" onclick="editBanner(${b.id})">Edit</a>
        <a class="delete-link" onclick="deleteBanner(${b.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
document.getElementById('toggle-showBanner').addEventListener('change', function() {
  const data = getData(); data.settings.showBanner = this.checked; saveData(data);
});
function showBannerForm() {
  document.getElementById('bannerForm').style.display = 'block';
  document.getElementById('bannerFormTitle').textContent = 'Add Banner';
  ['banner-id','banner-text','banner-btnText','banner-btnUrl'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('banner-enabled').checked = true;
}
function hideBannerForm() { document.getElementById('bannerForm').style.display = 'none'; }
function editBanner(id) {
  const data = getData();
  const b = data.banners.find(x => x.id === id);
  if (!b) return;
  showBannerForm();
  document.getElementById('bannerFormTitle').textContent = 'Edit Banner';
  document.getElementById('banner-id').value = b.id;
  document.getElementById('banner-text').value = b.text;
  document.getElementById('banner-btnText').value = b.btnText || '';
  document.getElementById('banner-btnUrl').value = b.btnUrl || '';
  document.getElementById('banner-enabled').checked = b.enabled;
}
function saveBanner() {
  const data = getData();
  const id = document.getElementById('banner-id').value;
  const text = document.getElementById('banner-text').value;
  const btnText = document.getElementById('banner-btnText').value;
  const btnUrl = document.getElementById('banner-btnUrl').value;
  const enabled = document.getElementById('banner-enabled').checked;
  if (!text) return alert('Banner text is required');
  if (id) {
    const b = data.banners.find(x => x.id === parseInt(id));
    b.text = text; b.btnText = btnText; b.btnUrl = btnUrl; b.enabled = enabled;
  } else {
    const newId = data.banners.length ? Math.max(...data.banners.map(b => b.id)) + 1 : 1;
    data.banners.push({ id: newId, text, btnText, btnUrl, enabled });
  }
  saveData(data); renderBannersTable(); flashSaved('bannerSaveMsg'); hideBannerForm();
}
function deleteBanner(id) {
  if (!confirm('Delete this banner?')) return;
  const data = getData();
  data.banners = data.banners.filter(b => b.id !== id);
  saveData(data); renderBannersTable();
}

/* ============================================================
   POPUPS
============================================================ */
function renderPopupsTable() {
  const data = getData();
  document.getElementById('toggle-showPopup').checked = data.settings.showPopup;
  document.getElementById('popups-table').innerHTML = data.popups.map(p => `
    <tr>
      <td>${p.title}</td>
      <td>${p.startDate || 'Always'} ${p.endDate ? '→ ' + p.endDate : ''}</td>
      <td>${p.enabled ? '✅' : '❌'}</td>
      <td class="actions">
        <a class="edit-link" onclick="editPopup(${p.id})">Edit</a>
        <a class="delete-link" onclick="deletePopup(${p.id})">Delete</a>
      </td>
    </tr>
  `).join('');
}
document.getElementById('toggle-showPopup').addEventListener('change', function() {
  const data = getData(); data.settings.showPopup = this.checked; saveData(data); refreshDashboardCounts();
});
function showPopupForm() {
  document.getElementById('popupForm').style.display = 'block';
  document.getElementById('popupFormTitle').textContent = 'Add Popup';
  ['popup-id','popup-title','popup-desc','popup-image','popup-video','popup-btnText','popup-btnUrl','popup-startDate','popup-endDate'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('popup-enabled').checked = true;
}
function hidePopupForm() { document.getElementById('popupForm').style.display = 'none'; }
function editPopup(id) {
  const data = getData();
  const p = data.popups.find(x => x.id === id);
  if (!p) return;
  showPopupForm();
  document.getElementById('popupFormTitle').textContent = 'Edit Popup';
  document.getElementById('popup-id').value = p.id;
  document.getElementById('popup-title').value = p.title;
  document.getElementById('popup-desc').value = p.desc;
  document.getElementById('popup-image').value = p.image || '';
  document.getElementById('popup-video').value = p.video || '';
  document.getElementById('popup-btnText').value = p.btnText || '';
  document.getElementById('popup-btnUrl').value = p.btnUrl || '';
  document.getElementById('popup-startDate').value = p.startDate || '';
  document.getElementById('popup-endDate').value = p.endDate || '';
  document.getElementById('popup-enabled').checked = p.enabled;
}
function savePopup() {
  const data = getData();
  const id = document.getElementById('popup-id').value;
  const title = document.getElementById('popup-title').value;
  const desc = document.getElementById('popup-desc').value;
  const image = document.getElementById('popup-image').value;
  const video = extractYoutubeId(document.getElementById('popup-video').value);
  const btnText = document.getElementById('popup-btnText').value;
  const btnUrl = document.getElementById('popup-btnUrl').value;
  const startDate = document.getElementById('popup-startDate').value;
  const endDate = document.getElementById('popup-endDate').value;
  const enabled = document.getElementById('popup-enabled').checked;
  if (!title) return alert('Popup title is required');
  if (id) {
    const p = data.popups.find(x => x.id === parseInt(id));
    p.title = title; p.desc = desc; p.image = image; p.video = video;
    p.btnText = btnText; p.btnUrl = btnUrl; p.startDate = startDate; p.endDate = endDate; p.enabled = enabled;
  } else {
    const newId = data.popups.length ? Math.max(...data.popups.map(p => p.id)) + 1 : 1;
    data.popups.push({ id: newId, title, desc, image, video, btnText, btnUrl, startDate, endDate, enabled });
  }
  saveData(data); renderPopupsTable(); refreshDashboardCounts(); flashSaved('popupSaveMsg'); hidePopupForm();
}
function deletePopup(id) {
  if (!confirm('Delete this popup?')) return;
  const data = getData();
  data.popups = data.popups.filter(p => p.id !== id);
  saveData(data); renderPopupsTable(); refreshDashboardCounts();
}

/* ============================================================
   MEDIA LIBRARY
============================================================ */
function renderMediaGrid() {
  const data = getData();
  const grid = document.getElementById('media-grid');
  if (!data.media.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;">No media uploaded yet.</p>';
    return;
  }
  grid.innerHTML = data.media.map(m => {
    let preview = '';
    if (m.type === 'image') preview = `<img src="${m.url}" alt="${m.name}">`;
    else if (m.type === 'video') preview = `<video src="${m.url}" muted></video>`;
    else preview = `<div class="doc-icon">📄</div>`;
    return `
      <div class="media-item">
        <span class="copy-btn" onclick="copyMediaUrl('${m.id}')">Copy</span>
        <span class="del-btn" onclick="deleteMedia('${m.id}')">✕</span>
        ${preview}
        <div class="meta"><div class="name">${m.name}</div></div>
      </div>
    `;
  }).join('');
}
function copyMediaUrl(id) {
  const data = getData();
  const m = data.media.find(x => x.id === id);
  if (!m) return;
  navigator.clipboard.writeText(m.url).then(() => alert('URL copied: ' + m.name));
}
function deleteMedia(id) {
  if (!confirm('Delete this media file?')) return;
  const data = getData();
  data.media = data.media.filter(m => m.id !== id);
  saveData(data); renderMediaGrid(); refreshDashboardCounts();
}
function addMediaFromUrl() {
  const url = document.getElementById('media-url').value;
  const type = document.getElementById('media-url-type').value;
  if (!url) return alert('Please enter a URL');
  const data = getData();
  const newId = 'm' + Date.now();
  data.media.push({ id: newId, name: url.split('/').pop() || 'media', url, type });
  if (saveData(data)) {
    renderMediaGrid(); refreshDashboardCounts();
    document.getElementById('media-url').value = '';
  }
}

/* File upload via dropzone (base64 encode, best for small images) */
function handleFiles(files) {
  const data = getData();
  let processed = 0;
  [...files].forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      let type = 'document';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      const newId = 'm' + Date.now() + Math.random().toString(36).substr(2,5);
      data.media.push({ id: newId, name: file.name, url: e.target.result, type });
      processed++;
      if (processed === files.length) {
        if (saveData(data)) { renderMediaGrid(); refreshDashboardCounts(); }
      }
    };
    reader.readAsDataURL(file);
  });
}
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
dropzone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => handleFiles(e.target.files));
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

/* Media picker — lets other forms select a media URL */
let pickMediaTargetField = null;
function pickMedia(targetFieldId, filterType) {
  pickMediaTargetField = targetFieldId;
  const data = getData();
  const filtered = filterType ? data.media.filter(m => m.type === filterType) : data.media;
  if (!filtered.length) {
    alert('No media of this type in the library yet. Go to Media Library tab to upload some first.');
    return;
  }
  let modal = document.getElementById('mediaPickerModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mediaPickerModal';
    modal.style = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:5000;display:flex;align-items:center;justify-content:center;padding:20px;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:25px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;">
      <h3 style="margin-bottom:15px;">Select Media</h3>
      <div class="media-grid">
        ${filtered.map(m => `
          <div class="media-item" style="cursor:pointer;" onclick="selectMedia('${m.id}')">
            ${m.type === 'image' ? `<img src="${m.url}">` : m.type === 'video' ? `<video src="${m.url}" muted></video>` : `<div class="doc-icon">📄</div>`}
            <div class="meta"><div class="name">${m.name}</div></div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-outline" style="margin-top:15px;" onclick="document.getElementById('mediaPickerModal').remove()">Cancel</button>
    </div>
  `;
}
function selectMedia(id) {
  const data = getData();
  const m = data.media.find(x => x.id === id);
  if (m && pickMediaTargetField) {
    document.getElementById(pickMediaTargetField).value = m.url;
  }
  document.getElementById('mediaPickerModal').remove();
}

/* ============================================================
   HOMEPAGE MANAGER
============================================================ */
function loadHomepageForm() {
  const data = getData();
  const s = data.settings;
  document.getElementById('hp-heroTitle').value = s.heroTitle;
  document.getElementById('hp-heroSubtitle').value = s.heroSubtitle;
  document.getElementById('hp-heroBtnText').value = s.heroBtnText;
  document.getElementById('hp-heroBtn2Text').value = s.heroBtn2Text;
  document.getElementById('hp-heroBgType').value = s.heroBgType;
  document.getElementById('hp-heroVideoEnabled').checked = s.heroVideoEnabled;
  document.getElementById('hp-heroBgImage').value = s.heroBgImage;
  document.getElementById('hp-heroBgVideo').value = s.heroBgVideo;
}
function saveHomepage() {
  const data = getData();
  const s = data.settings;
  s.heroTitle = document.getElementById('hp-heroTitle').value;
  s.heroSubtitle = document.getElementById('hp-heroSubtitle').value;
  s.heroBtnText = document.getElementById('hp-heroBtnText').value;
  s.heroBtn2Text = document.getElementById('hp-heroBtn2Text').value;
  s.heroBgType = document.getElementById('hp-heroBgType').value;
  s.heroVideoEnabled = document.getElementById('hp-heroVideoEnabled').checked;
  s.heroBgImage = document.getElementById('hp-heroBgImage').value;
  s.heroBgVideo = document.getElementById('hp-heroBgVideo').value;
  saveData(data); flashSaved('homepageSaveMsg');
}

/* ============================================================
   THEME MANAGER
============================================================ */
function loadThemeForm() {
  const data = getData();
  const s = data.settings;
  document.getElementById('theme-primaryColor').value = s.primaryColor;
  document.getElementById('theme-secondaryColor').value = s.secondaryColor;
  document.getElementById('theme-accentColor').value = s.accentColor;
  document.getElementById('theme-fontFamily').value = s.fontFamily;
  document.getElementById('theme-buttonStyle').value = s.buttonStyle;
}
function saveTheme() {
  const data = getData();
  const s = data.settings;
  s.primaryColor = document.getElementById('theme-primaryColor').value;
  s.secondaryColor = document.getElementById('theme-secondaryColor').value;
  s.accentColor = document.getElementById('theme-accentColor').value;
  s.fontFamily = document.getElementById('theme-fontFamily').value;
  s.buttonStyle = document.getElementById('theme-buttonStyle').value;
  saveData(data); flashSaved('themeSaveMsg');
}

/* ============================================================
   SEO MANAGER
============================================================ */
function loadSEOForm() {
  const data = getData();
  const seo = data.settings.seo;
  document.getElementById('seo-metaTitle').value = seo.metaTitle;
  document.getElementById('seo-metaDescription').value = seo.metaDescription;
  document.getElementById('seo-keywords').value = seo.keywords;
}
function saveSEO() {
  const data = getData();
  data.settings.seo.metaTitle = document.getElementById('seo-metaTitle').value;
  data.settings.seo.metaDescription = document.getElementById('seo-metaDescription').value;
  data.settings.seo.keywords = document.getElementById('seo-keywords').value;
  saveData(data); flashSaved('seoSaveMsg');
}

/* ============================================================
   GENERAL SETTINGS
============================================================ */
function loadSettingsForm() {
  const data = getData();
  const s = data.settings;
  document.getElementById('set-logo').value = s.logo;
  document.getElementById('set-favicon').value = s.favicon;
  document.getElementById('set-siteTitle').value = s.siteTitle;
  document.getElementById('set-companyDesc').value = s.companyDesc;
  document.getElementById('set-footerText').value = s.footerText;
  document.getElementById('set-whatsapp').value = s.whatsapp;
  document.getElementById('set-phone').value = s.phone;
  document.getElementById('set-callNumber').value = s.callNumber;
  document.getElementById('set-email').value = s.email;
  document.getElementById('set-address').value = s.address;
  document.getElementById('set-mapEmbed').value = s.mapEmbed;
  document.getElementById('social-facebook').value = s.social.facebook;
  document.getElementById('social-instagram').value = s.social.instagram;
  document.getElementById('social-linkedin').value = s.social.linkedin;
  document.getElementById('social-youtube').value = s.social.youtube;
  document.getElementById('social-tiktok').value = s.social.tiktok;
}
function saveSettings() {
  const data = getData();
  const s = data.settings;
  s.logo = document.getElementById('set-logo').value;
  s.favicon = document.getElementById('set-favicon').value;
  s.siteTitle = document.getElementById('set-siteTitle').value;
  s.companyDesc = document.getElementById('set-companyDesc').value;
  s.footerText = document.getElementById('set-footerText').value;
  s.whatsapp = document.getElementById('set-whatsapp').value.replace(/[^0-9]/g, '');
  s.phone = document.getElementById('set-phone').value;
  s.callNumber = document.getElementById('set-callNumber').value;
  s.email = document.getElementById('set-email').value;
  s.address = document.getElementById('set-address').value;
  s.mapEmbed = document.getElementById('set-mapEmbed').value;
  s.social.facebook = document.getElementById('social-facebook').value;
  s.social.instagram = document.getElementById('social-instagram').value;
  s.social.linkedin = document.getElementById('social-linkedin').value;
  s.social.youtube = document.getElementById('social-youtube').value;
  s.social.tiktok = document.getElementById('social-tiktok').value;
  saveData(data); flashSaved('settingsSaveMsg');
}
function changeCredentials() {
  const u = document.getElementById('new-username').value;
  const p = document.getElementById('new-password').value;
  if (!u || !p) return alert('Both fields required');
  localStorage.setItem('itsec_admin_creds', JSON.stringify({ username: u, password: p }));
  flashSaved('credsSaveMsg');
  document.getElementById('new-username').value = '';
  document.getElementById('new-password').value = '';
}
function resetAllData() {
  if (!confirm('This will reset ALL website content to default. Continue?')) return;
  resetData();
  location.reload();
}

/* ====== INIT ====== */
refreshDashboardCounts();
renderServicesTable();
renderProductsTable();
renderPortfolioTable();
renderTestimonialsTable();
renderStatisticsTable();
renderBannersTable();
renderPopupsTable();
renderMediaGrid();
loadHomepageForm();
loadThemeForm();
loadSEOForm();
loadSettingsForm();
