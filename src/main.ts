// ===== Autheo Investor Pitch Deck — HORIZONTAL SLIDE MODE =====

// ── Horizontal deck navigation ──
function initHorizontalDeck(): void {
  const container = document.getElementById('deckContainer');
  if (!container) { console.error('No deckContainer found'); return; }

  const slides = container.querySelectorAll<HTMLElement>('.section');
  const total = slides.length;
  let current = 0;

  console.log(`Horizontal deck: ${total} slides`);

  // Update counter
  const totalEl = document.getElementById('deckTotal');
  if (totalEl) totalEl.textContent = String(total);

  // Build dot indicators
  const dotsEl = document.getElementById('deckDots');
  if (dotsEl) {
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'deck-dot' + (i === 0 ? ' active' : '');
      dot.dataset.idx = String(i);
      dot.addEventListener('click', () => go(parseInt(dot.dataset.idx || '0')));
      dotsEl.appendChild(dot);
    }
  }

  function go(idx: number): void {
    if (idx < 0 || idx >= total) return;
    current = idx;
    container!.style.transform = `translateX(-${current * 100}vw)`;

    // Update counter
    const currentEl = document.getElementById('deckCurrent');
    if (currentEl) currentEl.textContent = String(current + 1);

    // Update dots
    document.querySelectorAll('.deck-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Update arrows
    const prev = document.getElementById('deckPrev') as HTMLButtonElement | null;
    const next = document.getElementById('deckNext') as HTMLButtonElement | null;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === total - 1;

    // Trigger animations on current slide
    slides[current].querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach((el) => {
      el.classList.add('visible');
    });

    // Trigger stack canvas when navigating to technology slide
    if (slides[current].id === 'technology') {
      const c = document.getElementById('stackCanvas');
      if (c) c.dispatchEvent(new Event('startanim'));
    }

    // Update nav links
    const sid = slides[current].id;
    document.querySelectorAll('.nav-link').forEach((l) => {
      l.classList.toggle('active', l.getAttribute('data-section') === sid);
    });
  }

  // Arrow button clicks
  document.getElementById('deckNext')?.addEventListener('click', () => go(current + 1));
  document.getElementById('deckPrev')?.addEventListener('click', () => go(current - 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(total - 1); }
  });

  // Touch / swipe support
  let tx = 0;
  let ty = 0;
  document.addEventListener('touchstart', (e: TouchEvent) => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e: TouchEvent) => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? go(current + 1) : go(current - 1);
    }
  }, { passive: true });

  // Hash link navigation
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const tid = a.getAttribute('href')?.replace('#', '');
      // Check if it's a detail overlay
      const overlay = document.getElementById(tid || '');
      if (overlay && overlay.classList.contains('detail-overlay')) {
        e.preventDefault();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
      }
      const idx = Array.from(slides).findIndex((s) => s.id === tid);
      if (idx >= 0) { e.preventDefault(); go(idx); }
    });
  });

  // Detail overlay close buttons
  document.querySelectorAll('.detail-overlay-close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const overlay = btn.closest('.detail-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close overlay on Escape
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const active = document.querySelector('.detail-overlay.active');
      if (active) {
        active.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Initialize first slide
  go(0);

  // Hide hint after 5s
  setTimeout(() => {
    const h = document.querySelector('.deck-hint') as HTMLElement | null;
    if (h) h.style.opacity = '0';
  }, 5000);
}

// ── Stagger children with delays ──
function initStaggerAnimations(): void {
  const containers = document.querySelectorAll(
    '.card-grid-3x2, .stat-grid-2x2, .metric-grid, .partner-grid, .ip-stats, .stack-list, .team-grid, .invest-grid, .proof-points, .valkra-stats, .channels-grid, .traction-links-grid, .solution-traction-row, .tps-table tbody tr, .token-dist-table tbody tr'
  );
  containers.forEach((container) => {
    Array.from(container.children).forEach((child, i) => {
      (child as HTMLElement).style.transitionDelay = `${i * 100}ms`;
    });
  });
}

// ── Ambient twinkling star field ──
function initStarField(): void {
  if (document.querySelector('.star-field')) return;
  const field = document.createElement('div');
  field.className = 'star-field';
  field.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 2 + 1}px`;
    star.style.height = star.style.width;
    star.style.setProperty('--twinkle-dur', `${2 + Math.random() * 4}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 5}s`);
    field.appendChild(star);
  }
  document.body.prepend(field);
}

// ── Section glow ──
function initSectionGlows(): void {
  ['solution', 'stack', 'quantum', 'investment', 'closing'].forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.classList.add('section-glow');
  });
}

// ── Animated Stack Canvas (Technology slide) ──
function initStackDiagram(): void {
  const canvas = document.getElementById('stackCanvas') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 420, H = 420;
  canvas.width = W * 2; canvas.height = H * 2;
  ctx.scale(2, 2); // retina

  // Bottom-up order: Autheo-One is the foundation (largest), Autheo ID at top (smallest)
  const layers = [
    { label: 'Autheo ID', color: '#34D399' },
    { label: 'PQCNet', color: '#F472B6' },
    { label: 'Zer0veil', color: '#818CF8' },
    { label: 'THEO AI', color: '#00E5CC' },
    { label: 'Execution', color: '#FBBF24' },
    { label: 'Infrastructure', color: '#38BDF8' },
    { label: 'Autheo-One', color: '#00E5CC' },
  ];

  let time = 0;
  let animating = false;

  function hexPoints(cx: number, cy: number, r: number, skewY: number): [number, number][] {
    const pts: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle) * skewY]);
    }
    return pts;
  }

  function drawHex(cx: number, cy: number, r: number, skewY: number, color: string, alpha: number, lineW: number) {
    const pts = hexPoints(cx, cy, r, skewY);
    ctx!.beginPath();
    ctx!.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i][0], pts[i][1]);
    ctx!.closePath();
    ctx!.strokeStyle = color;
    ctx!.lineWidth = lineW;
    ctx!.globalAlpha = alpha;
    ctx!.stroke();
    ctx!.globalAlpha = 1;
  }

  function drawFilledHex(cx: number, cy: number, r: number, skewY: number, color: string, fillAlpha: number) {
    const pts = hexPoints(cx, cy, r, skewY);
    ctx!.beginPath();
    ctx!.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx!.lineTo(pts[i][0], pts[i][1]);
    ctx!.closePath();
    ctx!.fillStyle = color;
    ctx!.globalAlpha = fillAlpha;
    ctx!.fill();
    ctx!.globalAlpha = 1;
  }

  function render() {
    ctx!.clearRect(0, 0, W, H);
    time += 0.015;

    const cx = W / 2;
    const baseY = H - 45;
    const layerGap = 48;
    const skew = 0.42;
    const total = layers.length;

    // Draw bottom-up: index 6=Autheo-One (bottom, largest) to index 0=Autheo ID (top, smallest)
    for (let i = total - 1; i >= 0; i--) {
      const layer = layers[i];
      const fromBottom = total - 1 - i; // 0 for top layer, 6 for bottom
      const y = baseY - fromBottom * layerGap;
      const r = 55 + fromBottom * 13; // larger at bottom
      const pulse = Math.sin(time * 2 + i * 0.5) * 0.04 + 0.96;

      ctx!.shadowColor = layer.color;
      ctx!.shadowBlur = 12 + Math.sin(time + i) * 4;

      drawFilledHex(cx, y, r * pulse, skew, layer.color, 0.07 + Math.sin(time + i) * 0.02);
      drawHex(cx, y, r * pulse, skew, layer.color, 0.5 + Math.sin(time * 1.5 + i) * 0.15, 1.5);

      ctx!.shadowBlur = 0;
      drawHex(cx, y, r * pulse * 0.55, skew, layer.color, 0.15, 0.5);

      ctx!.font = '600 10px Inter, sans-serif';
      ctx!.fillStyle = layer.color;
      ctx!.globalAlpha = 0.9;
      ctx!.textAlign = 'center';
      ctx!.fillText(layer.label, cx, y + 4);
      ctx!.globalAlpha = 1;

      if (i < total - 1) {
        const nextFromBottom = total - 2 - i;
        const yBelow = baseY - nextFromBottom * layerGap;
        ctx!.beginPath();
        ctx!.moveTo(cx, y + r * skew * 0.35);
        ctx!.lineTo(cx, yBelow - (55 + (total - 2 - i) * 13) * skew * 0.35);
        ctx!.strokeStyle = layer.color;
        ctx!.globalAlpha = 0.12;
        ctx!.lineWidth = 1;
        ctx!.setLineDash([3, 4]);
        ctx!.stroke();
        ctx!.setLineDash([]);
        ctx!.globalAlpha = 1;
      }
    }

    for (let i = 0; i < 10; i++) {
      const px = cx + Math.sin(time * 0.7 + i * 1.3) * 110;
      const py = H / 2 + Math.cos(time * 0.5 + i * 0.9) * 140;
      ctx!.beginPath();
      ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx!.fillStyle = '#00E5CC';
      ctx!.globalAlpha = Math.sin(time + i) * 0.3 + 0.2;
      ctx!.fill();
      ctx!.globalAlpha = 1;
    }

    ctx!.shadowBlur = 0;
    if (animating) requestAnimationFrame(render);
  }

  // Start animation when slide is visible
  function startAnim() { if (!animating) { animating = true; render(); } }
  function stopAnim() { animating = false; }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startAnim() : stopAnim());
  }, { threshold: 0.1 });
  obs.observe(canvas);
  // Also start after short delay for horizontal deck navigation
  setTimeout(startAnim, 600);
}

// ── Animated Quantum Timeline ──
function initQuantumTimeline(): void {
  const canvas = document.getElementById('quantumTimeline') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = 560, H = 420;
  canvas.width = W * 2; canvas.height = H * 2;
  ctx.scale(2, 2);

  const events = [
    { year: 2025, label: "Shor's Algorithm\nBreakthrough", colors: ['#00FFD1','#80FFE8'] },
    { year: 2026, label: 'First Quantum\nAttacks', colors: ['#66EEBB','#FFD580'] },
    { year: 2028, label: 'Key Infrastructure\nCompromised', colors: ['#FFB347','#FF8C69'] },
    { year: 2029, label: 'Widespread\nCryptographic Failures', colors: ['#FF6B6B','#FF4757'] },
    { year: 2030, label: 'Systemic Risk\nRealized', colors: ['#FF4757','#FF6348'] },
  ];

  const years = [2025, 2026, 2027, 2028, 2029, 2030];
  let time = 0;
  let animating = false;

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx!.beginPath();
    ctx!.moveTo(x + r, y); ctx!.lineTo(x + w - r, y);
    ctx!.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx!.lineTo(x + w, y + h - r);
    ctx!.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx!.lineTo(x + r, y + h);
    ctx!.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx!.lineTo(x, y + r);
    ctx!.quadraticCurveTo(x, y, x + r, y);
    ctx!.closePath();
  }

  function render() {
    ctx!.clearRect(0, 0, W, H);
    time += 0.014;

    const mL = 30, mR = 30, tlY = 44;
    const tlW = W - mL - mR;

    // Timeline line
    ctx!.beginPath(); ctx!.moveTo(mL - 10, tlY); ctx!.lineTo(mL + tlW + 10, tlY);
    ctx!.strokeStyle = '#F5A623'; ctx!.lineWidth = 2.5; ctx!.globalAlpha = 0.8; ctx!.stroke(); ctx!.globalAlpha = 1;

    // Arrows both ends
    ctx!.beginPath(); ctx!.moveTo(mL - 2, tlY - 5); ctx!.lineTo(mL - 10, tlY); ctx!.lineTo(mL - 2, tlY + 5);
    ctx!.strokeStyle = '#F5A623'; ctx!.lineWidth = 2; ctx!.stroke();
    ctx!.beginPath(); ctx!.moveTo(mL + tlW + 2, tlY - 5); ctx!.lineTo(mL + tlW + 10, tlY); ctx!.lineTo(mL + tlW + 2, tlY + 5);
    ctx!.stroke();

    // Downward arrow
    ctx!.beginPath(); ctx!.moveTo(mL, tlY); ctx!.lineTo(mL, H - 15);
    ctx!.strokeStyle = '#F5A623'; ctx!.lineWidth = 2; ctx!.globalAlpha = 0.5; ctx!.stroke(); ctx!.globalAlpha = 1;
    ctx!.beginPath(); ctx!.moveTo(mL - 5, H - 23); ctx!.lineTo(mL, H - 15); ctx!.lineTo(mL + 5, H - 23);
    ctx!.strokeStyle = '#F5A623'; ctx!.lineWidth = 2; ctx!.stroke();

    // Year diamonds + labels
    years.forEach((yr, i) => {
      const x = mL + (i / (years.length - 1)) * tlW;
      ctx!.save(); ctx!.translate(x, tlY); ctx!.rotate(Math.PI / 4);
      ctx!.fillStyle = '#F5A623'; ctx!.globalAlpha = 0.9; ctx!.fillRect(-5, -5, 10, 10);
      ctx!.restore(); ctx!.globalAlpha = 1;
      ctx!.font = '800 14px Inter, sans-serif'; ctx!.fillStyle = '#00FFD1'; ctx!.textAlign = 'center';
      ctx!.fillText(String(yr), x, tlY - 16);
    });

    // Event cards — staggered cascade
    events.forEach((evt, i) => {
      const yearIdx = years.indexOf(evt.year);
      const xBase = mL + (yearIdx / (years.length - 1)) * tlW;
      const cardW = 180, cardH = 54, rad = 10;
      const cardX = Math.min(xBase - 30, W - mR - cardW);
      const cardY = tlY + 28 + i * 65;

      const progress = Math.min(1, Math.max(0, (time - 0.5 - i * 0.5) * 1.8));
      if (progress <= 0) return;

      // Gradient fill
      const grad = ctx!.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
      grad.addColorStop(0, evt.colors[0]); grad.addColorStop(1, evt.colors[1]);

      ctx!.globalAlpha = progress;

      // Shadow glow
      ctx!.shadowColor = evt.colors[0]; ctx!.shadowBlur = 16 + Math.sin(time * 2 + i) * 6;

      roundRect(cardX, cardY, cardW, cardH, rad);
      ctx!.fillStyle = grad; ctx!.fill();
      ctx!.shadowBlur = 0;

      // Border
      ctx!.strokeStyle = 'rgba(255,255,255,0.3)'; ctx!.lineWidth = 1; ctx!.stroke();

      // Text — dark for contrast on bright cards
      ctx!.font = '700 13px Inter, sans-serif'; ctx!.fillStyle = '#111'; ctx!.textAlign = 'center';
      const labelLines = evt.label.split('\n');
      labelLines.forEach((line: string, li: number) => {
        ctx!.fillText(line, cardX + cardW / 2, cardY + 24 + li * 17);
      });

      ctx!.globalAlpha = 1;
    });

    ctx!.shadowBlur = 0;
    if (animating) requestAnimationFrame(render);
  }

  function startAnim() { if (!animating) { animating = true; time = 0; render(); } }
  function stopAnim() { animating = false; }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? startAnim() : stopAnim());
  }, { threshold: 0.1 });
  obs.observe(canvas);
  setTimeout(startAnim, 600);
}

// ── Initialize everything ──
document.addEventListener('DOMContentLoaded', () => {
  initStarField();
  initStaggerAnimations();
  initSectionGlows();
  initStackDiagram();
  initQuantumTimeline();
  initHorizontalDeck();
});
