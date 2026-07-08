/* =============================================
   SHIMMERING MEADOW HEALTH CLINIC
   script.js
   ============================================= */

/* ============================================
   STICKY NAV — add shadow on scroll
   ============================================ */
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ============================================
   MOBILE HAMBURGER MENU
   ============================================ */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu when any nav link is tapped
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside the nav
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMenu();
});

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/* ============================================
   FADE-IN ON SCROLL (IntersectionObserver)
   ============================================ */
const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ============================================
   FOOTER YEAR
   ============================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================
   WHATSAPP CHAT WIDGET
   ============================================ */
const waWidget = document.getElementById('whatsapp-widget');

if (waWidget) {
  const waFab     = document.getElementById('whatsapp-fab');
  const waPanel   = document.getElementById('whatsapp-panel');
  const waClose   = document.getElementById('whatsapp-close');
  const waNumber  = waWidget.dataset.whatsappNumber;

  function openWaPanel() {
    waPanel.hidden = false;
    waFab.setAttribute('aria-expanded', 'true');
  }

  function closeWaPanel() {
    waPanel.hidden = true;
    waFab.setAttribute('aria-expanded', 'false');
  }

  waFab.addEventListener('click', () => {
    if (waPanel.hidden) openWaPanel(); else closeWaPanel();
  });

  waClose.addEventListener('click', closeWaPanel);

  document.addEventListener('click', e => {
    if (!waPanel.hidden && !waWidget.contains(e.target)) closeWaPanel();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !waPanel.hidden) closeWaPanel();
  });

  document.querySelectorAll('.whatsapp-suggestion').forEach(link => {
    const text = link.dataset.query || '';
    link.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

/* ============================================
   ENQUIRY FORM — validation & submission
   ============================================ */
const form          = document.getElementById('enquiry-form');
const successBanner = document.getElementById('success-banner');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /[\d]{7,}/;   // at least 7 consecutive digits

/**
 * Show an inline error message for a field.
 */
function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const msg   = document.getElementById(fieldId + '-error');
  if (!input || !msg) return;
  input.classList.add('field-error');
  msg.textContent = message;
}

/**
 * Clear the inline error for a field.
 */
function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const msg   = document.getElementById(fieldId + '-error');
  if (!input || !msg) return;
  input.classList.remove('field-error');
  msg.textContent = '';
}

// Live validation — clear error as soon as user starts correcting
['name', 'email', 'phone'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => clearError(id));
});

/**
 * Validate all required fields.
 * Returns true if valid, false otherwise.
 */
function validate() {
  let valid = true;

  const name  = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!name) {
    setError('name', 'Please enter your full name.');
    valid = false;
  } else {
    clearError('name');
  }

  if (!email) {
    setError('email', 'Please enter your email address.');
    valid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    setError('email', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearError('email');
  }

  if (!phone) {
    setError('phone', 'Please enter your phone number.');
    valid = false;
  } else if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
    setError('phone', 'Please enter a valid phone number (at least 7 digits).');
    valid = false;
  } else {
    clearError('phone');
  }

  return valid;
}

const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/contentflowdigital321@gmail.com';
const submitBtn  = form.querySelector('.btn-submit');
const formError  = document.getElementById('form-error');

/**
 * Speak the success message aloud using the browser's built-in TTS voice.
 */
function speakSuccessMessage() {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(
    'Hurray, thank you for submission. We will get back in 3 business days.'
  );
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel(); // avoid overlapping queued speech
  window.speechSynthesis.speak(utterance);
}

/**
 * Release a burst of floating balloons as a celebratory effect.
 */
function launchBalloonEffect() {
  const colors = ['balloon--meadow', 'balloon--amber', 'balloon--amber-deep', 'balloon--coral'];
  const container = document.createElement('div');
  container.className = 'balloon-container';
  container.setAttribute('aria-hidden', 'true');

  const count = 14;
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = `balloon ${colors[i % colors.length]}`;
    balloon.style.left = `${Math.random() * 92}%`;
    balloon.style.animationDuration = `${3.2 + Math.random() * 1.6}s`;
    balloon.style.animationDelay = `${Math.random() * 0.6}s`;
    container.appendChild(balloon);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 6000);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!validate()) return;

  formError.hidden = true;
  formError.textContent = '';

  // Collect form data
  const data = {
    name:    document.getElementById('name').value.trim(),
    email:   document.getElementById('email').value.trim(),
    phone:   document.getElementById('phone').value.trim(),
    date:    document.getElementById('date').value,
    message: document.getElementById('message').value.trim(),
    _subject: 'New appointment request — Shimmering Meadow Health Clinic',
  };

  submitBtn.disabled = true;
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';

  fetch(FORMSUBMIT_ENDPOINT, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept':       'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) throw new Error(`FormSubmit responded with ${res.status}`);
      return res.json();
    })
    .then(() => {
      // Show success banner and hide the form
      form.hidden = true;
      successBanner.hidden = false;
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Post-submission celebration: spoken confirmation + balloon effect
      speakSuccessMessage();
      launchBalloonEffect();

      // Reset and restore the form after 5 seconds
      setTimeout(() => {
        form.reset();
        form.hidden = false;
        successBanner.hidden = true;
      }, 5000);
    })
    .catch(err => {
      console.error('Submission error:', err);
      formError.textContent = "Sorry, something went wrong sending your request. Please try again or call us directly.";
      formError.hidden = false;
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
});
