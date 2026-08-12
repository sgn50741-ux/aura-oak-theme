
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ===== Page load transition ===== */
  window.addEventListener('load', () => document.body.classList.add('loaded'));

  const fmt = (cents) => {
    const f = window.AURA?.moneyFormat || '${{amount}}';
    return f.replace('{{amount}}', (cents / 100).toFixed(2));
  };

  /* ===== Scroll reveal system ===== */
  const revealClasses = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'reveal-clip', 'line-reveal', 'stagger'];
  const revealSelector = revealClasses.map(c => '.' + c).join(',');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  function initReveals() {
    $$(revealSelector).forEach(el => {
      if (!el.classList.contains('in')) revealObserver.observe(el);
    });
  }
  initReveals();

  /* ===== Parallax on scroll ===== */
  const parallaxEls = $$('.parallax');
  if (parallaxEls.length) {
    let ticking = false;
    const updateParallax = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.speed) || 0.3;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ===== Header scroll state ===== */
  const header = $('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== Mobile menu ===== */
  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const menuClose = $('.mobile-menu-close');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('is-open'));
    menuClose?.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('is-open')));
  }

  /* ===== Toast ===== */
  let toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-shown');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove('is-shown'), 2800);
  }

  /* ===== Cart drawer ===== */
  const drawer = $('.cart-drawer');
  const drawerItems = $('.cart-items');
  const drawerCount = $$('.cart-count');
  const openDrawer = () => drawer?.classList.add('is-open');
  const closeDrawer = () => drawer?.classList.remove('is-open');

  $('.cart-link')?.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
  $('.cart-close')?.addEventListener('click', closeDrawer);
  $('.cart-backdrop')?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  async function fetchCart() {
    try {
      const r = await fetch('/cart.js', { cache: 'no-store' });
      return await r.json();
    } catch { return null; }
  }

  function renderCartItems(cart) {
    if (!drawerItems) return;
    if (!cart.items.length) {
      drawerItems.innerHTML = `
        <div class="cart-empty">
          <svg class="icon icon--lg" viewBox="0 0 24 24"><path d="M3 3h2l2.5 13h11l2-9H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
          <p>Your ritual awaits</p>
        </div>`;
    } else {
      drawerItems.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-key="${item.key}">
          <div class="cart-item-media">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" loading="lazy">` : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-family:var(--serif);font-style:italic;color:var(--oak);opacity:.3">A&O</div>`}
          </div>
          <div>
            <div class="cart-item-title">${item.product_title || item.title}</div>
            ${item.variant_title && item.variant_title !== 'Default Title' ? `<div class="cart-item-variant">${item.variant_title}</div>` : ''}
            <div class="cart-item-qty">
              <button data-dec>−</button>
              <span>${item.quantity}</span>
              <button data-inc>+</button>
            </div>
            <button class="cart-item-remove" data-remove>Remove</button>
          </div>
          <div class="cart-item-price">${fmt(item.final_line_price || item.line_price)}</div>
        </div>
      `).join('');
      $$('.cart-item', drawerItems).forEach(row => {
        const key = row.dataset.key;
        row.querySelector('[data-inc]')?.addEventListener('click', () => updateItem(key, cart.items.find(i => i.key === key).quantity + 1));
        row.querySelector('[data-dec]')?.addEventListener('click', () => updateItem(key, cart.items.find(i => i.key === key).quantity - 1));
        row.querySelector('[data-remove]')?.addEventListener('click', () => updateItem(key, 0));
      });
    }
    const subtotal = cart.total_price;
    const threshold = 7500;
    const remaining = threshold - subtotal;
    const reached = remaining <= 0;
    const pct = Math.min(100, (subtotal / threshold) * 100);
    const prog = $('.cart-progress');
    if (prog) {
      prog.innerHTML = reached
        ? `<span class="cart-progress-reached">✓ You've unlocked complimentary shipping</span>`
        : `<span>Add <strong>${fmt(remaining)}</strong> more for free shipping</span>`;
      const bar = prog.parentElement.querySelector('.cart-progress-fill');
      if (bar) bar.style.width = pct + '%';
    }
    const sub = $('.cart-subtotal-value');
    if (sub) sub.textContent = fmt(subtotal);
    drawerCount.forEach(el => {
      el.textContent = cart.item_count || 0;
      el.hidden = !cart.item_count;
    });
  }

  async function updateItem(key, qty) {
    try {
      await fetch('/cart/update.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { [key]: qty } })
      });
      const cart = await fetchCart();
      if (cart) renderCartItems(cart);
    } catch (e) { console.error(e); }
  }

  async function addToCart(variantId, qty = 1) {
    try {
      const r = await fetch('/cart/add.js', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: qty })
      });
      if (!r.ok) throw new Error('add failed');
      const cart = await fetchCart();
      if (cart) renderCartItems(cart);
      toast('Added to your cart');
      openDrawer();
    } catch (e) { toast('Couldn\'t add to cart — please try again'); }
  }
  window.addToCart = addToCart;

  fetchCart().then(c => c && renderCartItems(c));

  /* ===== PDP: variant picker ===== */
  const pdpForm = $('#ProductForm');
  if (pdpForm) {
    const product = JSON.parse(pdpForm.dataset.product);
    const selected = {};
    product.options.forEach((opt, i) => { selected[opt.name] = opt.values[0]; });

    function findVariant() {
      return product.variants.find(v =>
        product.options.every(opt => v.options.find(o => o.name === opt.name)?.value === selected[opt.name])
      );
    }

    function render() {
      $$('.pdp-option-pill', pdpForm).forEach(btn => {
        btn.classList.toggle('is-selected', selected[btn.dataset.option] === btn.dataset.value);
      });
      const v = findVariant();
      const priceEl = $('.pdp-price-current');
      const addBtn = $('.pdp-add');
      if (v) {
        priceEl.textContent = fmt(v.price);
        addBtn.disabled = !v.available;
        addBtn.textContent = v.available ? 'Add to cart' : 'Sold out';
        pdpForm.dataset.variantId = v.id;
      } else {
        addBtn.disabled = true;
        addBtn.textContent = 'Unavailable';
      }
    }

    $$('.pdp-option-pill', pdpForm).forEach(btn => {
      btn.addEventListener('click', () => {
        selected[btn.dataset.option] = btn.dataset.value;
        render();
      });
    });

    pdpForm.addEventListener('submit', e => {
      e.preventDefault();
      const qty = parseInt($('.pdp-qty-input', pdpForm).value, 10) || 1;
      const id = parseInt(pdpForm.dataset.variantId, 10);
      if (id) addToCart(id, qty);
    });

    const mainImg = $('.pdp-main-image img');
    $$('.pdp-thumb').forEach(t => {
      t.addEventListener('click', () => {
        mainImg.src = t.dataset.src;
        mainImg.alt = t.dataset.alt || '';
        $$('.pdp-thumb').forEach(x => x.classList.toggle('is-active', x === t));
      });
    });

    render();
  }

  /* ===== FAQ accordion (auto-close others) ===== */
  $$('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        $$('.faq-list details').forEach(d => { if (d !== detail) d.open = false; });
      }
    });
  });

  /* ===== FAQ category filter ===== */
  $$('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.faq-cat-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.category;
      $$('.faq-item').forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  /* ===== Newsletter ===== */
  const newsForm = $('.newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('input[type=email]', newsForm).value;
      try {
        await fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `form_type=newsletter&contact[email]=${encodeURIComponent(email)}&contact[tags]=newsletter`
        });
        newsForm.innerHTML = '<p class="newsletter-success">Thank you. Welcome to the ritual.</p>';
      } catch { toast('Couldn\'t subscribe — please try again'); }
    });
  }

  /* ===== Magnetic buttons (optional, desktop only) ===== */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ===== Re-init reveals after dynamic content ===== */
  window.addEventListener('shopify:section:load', initReveals);
})();
