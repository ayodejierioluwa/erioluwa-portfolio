/**
 * Erioluwa Ayodeji - Executive Portfolio Interactive Application Logic
 * Supports:
 * 1. Dual Track Switching (Energy & Subsurface AI vs Web3 & SaaS)
 * 2. Real-Time Canvas Telemetry Simulator (Stick-Slip Vibration Dampening)
 * 3. Interactive Code Sandbox for CookiePay
 * 4. Contact Modal & Clipboard Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initTrackSwitcher();
  initCvNavigation();
  initTelemetrySimulator();
  initCodeSandbox();
  initContactModal();
});

function initCvNavigation() {
  const tocLinks = document.querySelectorAll('.cv-toc-link');
  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ----------------------------------------------------
   1. DUAL TRACK SWITCHER
   ---------------------------------------------------- */
function initTrackSwitcher() {
  const tabEnergy = document.getElementById('tabEnergy');
  const tabTech = document.getElementById('tabTech');
  const brandRole = document.getElementById('brandRoleLabel');

  if (tabEnergy && tabTech) {
    tabEnergy.addEventListener('click', () => switchTrack('energy'));
    tabTech.addEventListener('click', () => switchTrack('tech'));
  }

  // Check URL hash on load
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('tech') || hash.includes('web3') || hash.includes('saas')) {
    switchTrack('tech');
  } else {
    switchTrack('energy');
  }
}

function switchTrack(track) {
  const html = document.documentElement;
  const tabEnergy = document.getElementById('tabEnergy');
  const tabTech = document.getElementById('tabTech');
  const energySection = document.getElementById('energyTrack');
  const techSection = document.getElementById('techTrack');
  const brandRole = document.getElementById('brandRoleLabel');

  if (track === 'energy') {
    html.setAttribute('data-theme', 'energy');
    tabEnergy.classList.add('active');
    tabEnergy.setAttribute('aria-selected', 'true');
    tabTech.classList.remove('active');
    tabTech.setAttribute('aria-selected', 'false');

    energySection.classList.add('active');
    techSection.classList.remove('active');
    if (brandRole) brandRole.textContent = 'Petroleum & Subsurface AI';
  } else {
    html.setAttribute('data-theme', 'tech');
    tabTech.classList.add('active');
    tabTech.setAttribute('aria-selected', 'true');
    tabEnergy.classList.remove('active');
    tabEnergy.setAttribute('aria-selected', 'false');

    techSection.classList.add('active');
    energySection.classList.remove('active');
    if (brandRole) brandRole.textContent = 'Web3 & SaaS Systems Architect';
  }

  // Smoothly scroll towards top if switching while scrolled down
  if (window.scrollY > 300) {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
}

/* ----------------------------------------------------
   2. DOWNHOLE TELEMETRY & STICK-SLIP VIBRATION SIMULATOR
   ---------------------------------------------------- */
function initTelemetrySimulator() {
  const canvas = document.getElementById('telemetryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Interactive controls
  const rpmSlider = document.getElementById('rpmSlider');
  const rpmVal = document.getElementById('rpmVal');
  const frictionSlider = document.getElementById('frictionSlider');
  const frictionVal = document.getElementById('frictionVal');
  const toggleBtn = document.getElementById('toggleDampingBtn');
  const dampingBtnText = document.getElementById('dampingBtnText');
  const dampingDisplay = document.getElementById('dampingStateDisplay');

  let nominalRPM = 120;
  let frictionSeverity = 4; // 1 to 5
  let isDampingEngaged = false;

  if (rpmSlider) {
    rpmSlider.addEventListener('input', (e) => {
      nominalRPM = parseInt(e.target.value, 10);
      if (rpmVal) rpmVal.textContent = nominalRPM;
    });
  }

  if (frictionSlider) {
    frictionSlider.addEventListener('input', (e) => {
      frictionSeverity = parseInt(e.target.value, 10);
      const labels = ['Negligible', 'Low', 'Moderate', 'High (Severe)', 'Critical Resonant'];
      if (frictionVal) frictionVal.textContent = labels[frictionSeverity - 1] || 'Severe';
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isDampingEngaged = !isDampingEngaged;
      if (isDampingEngaged) {
        toggleBtn.classList.add('active');
        if (dampingBtnText) dampingBtnText.textContent = 'Disengage Dampener (Observe Resonant Stall)';
        if (dampingDisplay) {
          dampingDisplay.textContent = 'Filter: ACTIVE (Omesham AI Control)';
          dampingDisplay.style.color = '#00e5ff';
        }
      } else {
        toggleBtn.classList.remove('active');
        if (dampingBtnText) dampingBtnText.textContent = 'Engage Omesham AI Dampener';
        if (dampingDisplay) {
          dampingDisplay.textContent = 'Filter: OFF (Raw Resonant)';
          dampingDisplay.style.color = '#ef4444';
        }
      }
    });
  }

  // High-frequency telemetry history arrays
  const maxPoints = 250;
  const rpmHistory = new Array(maxPoints).fill(nominalRPM);
  const torqueHistory = new Array(maxPoints).fill(12);
  const activeTrajectory = new Array(maxPoints).fill(nominalRPM);

  let simTime = 0;
  let phase = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = 280 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function renderSimulation() {
    simTime += 0.05;
    phase += (nominalRPM / 60) * 0.15;

    // Physics calculation:
    // When damping is OFF: Non-linear stick-slip sawtooth wave
    // Bit sticks: RPM = 0 for a period, torque ramps up
    // Bit slips: RPM accelerates violently up to 2.5x nominal
    let rawBitRPM = nominalRPM;
    let rawTorque = 10;
    let controlledRPM = nominalRPM;

    const stickThreshold = 0.65 + (frictionSeverity * 0.06);
    const cycle = Math.sin(phase);

    if (!isDampingEngaged) {
      if (cycle < stickThreshold - 1) {
        // STICK PHASE: Drill bit is halted downhole
        rawBitRPM = Math.max(0, 5 + Math.random() * 4);
        rawTorque = 15 + (Math.sin(simTime * 2) + 1) * (frictionSeverity * 2.8);
      } else if (cycle > 0.4) {
        // SLIP PHASE: Violent unwinding
        rawBitRPM = nominalRPM * (1.8 + (frictionSeverity * 0.25)) + (Math.random() - 0.5) * 12;
        rawTorque = Math.max(2, 6 - (cycle * 3));
      } else {
        rawBitRPM = nominalRPM * 0.8 + (Math.random() - 0.5) * 10;
        rawTorque = 11 + Math.sin(simTime) * 3;
      }
      controlledRPM = rawBitRPM;
    } else {
      // Omesham AI Active Counter-Torque Dampening
      // Smooths stick-slip resonance into laminar flow
      const noise = (Math.random() - 0.5) * 3.5;
      rawBitRPM = nominalRPM + noise;
      rawTorque = 11.2 + (Math.random() - 0.5) * 1.2;
      controlledRPM = nominalRPM + (Math.sin(simTime * 0.8) * 2.5) + noise;
    }

    // Push into telemetry streams
    rpmHistory.push(rawBitRPM);
    if (rpmHistory.length > maxPoints) rpmHistory.shift();

    torqueHistory.push(rawTorque);
    if (torqueHistory.length > maxPoints) torqueHistory.shift();

    activeTrajectory.push(controlledRPM);
    if (activeTrajectory.length > maxPoints) activeTrajectory.shift();

    // Draw frame
    const width = canvas.getBoundingClientRect().width;
    const height = 280;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Baseline Reference (Nominal RPM line)
    const nominalY = height - (nominalRPM / 260) * (height - 50);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, nominalY);
    ctx.lineTo(width, nominalY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Telemetry Stream 1: Bit RPM (Red/Amber)
    ctx.strokeStyle = isDampingEngaged ? 'rgba(239, 68, 68, 0.3)' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < rpmHistory.length; i++) {
      const x = (i / (maxPoints - 1)) * width;
      const y = height - (rpmHistory[i] / 260) * (height - 50);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Telemetry Stream 2: Torque (Amber)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < torqueHistory.length; i++) {
      const x = (i / (maxPoints - 1)) * width;
      const y = height - (torqueHistory[i] / 35) * (height - 60);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Telemetry Stream 3: Dampened Trajectory (Cyan)
    if (isDampingEngaged) {
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let i = 0; i < activeTrajectory.length; i++) {
        const x = (i / (maxPoints - 1)) * width;
        const y = height - (activeTrajectory[i] / 260) * (height - 50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(renderSimulation);
  }

  requestAnimationFrame(renderSimulation);
}

/* ----------------------------------------------------
   3. COOKIEPAY CODE SANDBOX
   ---------------------------------------------------- */
function initCodeSandbox() {
  const tabs = document.querySelectorAll('.sandbox-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      
      // Update tab active classes
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update code blocks
      const blocks = document.querySelectorAll('.code-block');
      blocks.forEach(block => {
        if (block.id === `code-${tabTarget}`) {
          block.classList.add('active');
        } else {
          block.classList.remove('active');
        }
      });
    });
  });
}

/* ----------------------------------------------------
   4. CONTACT MODAL & CLIPBOARD UTILITIES
   ---------------------------------------------------- */
function initContactModal() {
  const openBtn = document.getElementById('openContactBtn');
  const closeBtn = document.getElementById('closeContactBtn');
  const modal = document.getElementById('contactModal');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => openContactModal('General Inquiry'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

function openContactModal(context) {
  const modal = document.getElementById('contactModal');
  const subjectEl = document.getElementById('modalSubject');
  const messageInput = document.getElementById('contactMessage');

  if (subjectEl) {
    subjectEl.textContent = `Get in Touch: ${context}`;
  }

  if (messageInput) {
    if (context.includes('PetroOne') || context.includes('Offshore')) {
      messageInput.value = `Hi Erioluwa, I reviewed your work on PetroOne / Omesham AI and would like to discuss drilling telemetry integration / technical roles...`;
    } else if (context.includes('CookiePay')) {
      messageInput.value = `Hi Erioluwa, I saw CookiePay's non-custodial crypto payment gateway and would like to inquire about API documentation or collaboration...`;
    } else {
      messageInput.value = '';
    }
  }

  if (modal) {
    modal.classList.add('active');
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;
  const subject = document.getElementById('modalSubject').textContent || 'Portfolio Inquiry';

  const mailtoUrl = `mailto:ayodejierioluwa@gmail.com?subject=${encodeURIComponent(subject + ' - ' + name)}&body=${encodeURIComponent(
    `From: ${name} (${email})\n\nMessage:\n${message}\n\n---\nSent via Erioluwa Ayodeji Executive Portfolio Hub`
  )}`;

  window.location.href = mailtoUrl;

  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Copied!';
    buttonElement.style.background = '#10b981';
    buttonElement.style.color = '#ffffff';

    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.style.background = '';
      buttonElement.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}
