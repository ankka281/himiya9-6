const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

function buildModal(key) {
  const p = PERFUMES[key];
  if (!p) return;

  const chemItems = p.chemistry.map(c => `
    <li class="chem-item">
      <span class="chem-molecule">${c.name} — <em style="font-size:0.8rem;color:var(--text-muted)">${c.role}</em></span>
      <span class="chem-formula">${c.formula}</span>
    </li>
  `).join('');

  const methodTags = p.method.map(m => `<span class="method-tag">${m}</span>`).join('');

  modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-accent">${p.accent} · ${p.family}</div>
      <h2 class="modal-title">${p.name} <em>${p.nameEn}</em></h2>
      <p class="modal-tagline">${p.tagline}</p>
    </div>

    <div class="recipe-section">
      <h3>Пирамида аромата</h3>
      <div class="pyramid-mini">
        <div class="note-tier top">
          <span class="note-tier-label">▲ Верхние</span>
          <span class="note-tier-items">${p.pyramid.top}</span>
        </div>
        <div class="note-tier heart">
          <span class="note-tier-label">◆ Сердце</span>
          <span class="note-tier-items">${p.pyramid.heart}</span>
        </div>
        <div class="note-tier base">
          <span class="note-tier-label">■ База</span>
          <span class="note-tier-items">${p.pyramid.base}</span>
        </div>
      </div>
    </div>

    <div class="recipe-section">
      <h3>Химические молекулы</h3>
      <ul class="chem-list">${chemItems}</ul>
    </div>

    <div class="recipe-section">
      <h3>Метод получения</h3>
      <div>${methodTags}</div>
      <p style="margin-top:0.6rem;font-size:0.82rem;color:var(--text-muted)">Содержание масла: ${p.concentration}</p>
    </div>

    <div class="recipe-section">
      <h3>Интересный факт</h3>
      <div class="fun-fact">${p.fact}</div>
    </div>
  `;

  modal.style.setProperty('--modal-accent', p.color);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.querySelectorAll('.bottle-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const key = wrap.dataset.perfume;
    buildModal(key);
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Entrance animation for bottles
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.08}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.bottle-wrap').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.08}s`;
  observer.observe(el);
});

const shelfObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bottle-wrap').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  });
}, { threshold: 0.1 });

shelfObserver.observe(document.querySelector('.bottles-row'));
