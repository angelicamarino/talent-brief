/* ── Config ── */
const CATS = {
  system:   { label: 'System change',   color: '#0092D1' },
  process:  { label: 'Process change',  color: '#00A997' },
  behavior: { label: 'Behavior change', color: '#004976' },
};

/* ── State ── */
let items  = [];
let nextId = 0;
let LOGO_B64 = '';
let workspaceImage = '';
let workspaceImageSize = '160';

const IMG_SIZES = { '100': 'Small', '160': 'Medium', '240': 'Large' };

/* ── Helpers ── */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function nl2p(text, style) {
  const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return '';
  return lines.map(l => `<p style="${style}">${esc(l)}</p>`).join('');
}

function buildLogoHeader() {
  if (LOGO_B64) {
    return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 5px 0;margin-left:auto;"><tr>
      <td style="vertical-align:middle;padding-right:10px;">
        <img src="${LOGO_B64}" width="137" height="28" alt="Talent+" style="display:block;width:137px;height:28px;">
      </td>
      <td style="vertical-align:middle;">
        <h1 style="margin:0;font-size:22px;font-weight:500;color:#0092D1;line-height:1.2;font-family:system-ui,-apple-system,sans-serif;">A Brief</h1>
      </td>
    </tr></table>`;
  }
  return `<h1 style="margin:0 0 5px 0;font-size:22px;font-weight:500;color:#0092D1;line-height:1.2;font-family:system-ui,-apple-system,sans-serif;text-align:right;">Talent+ &mdash; A Brief</h1>`;
}

/* ── Item management ── */
function addItem() {
  const id = nextId++;
  items.push({ id, category: 'system', title: '', description: '', image: '', imageSize: '160' });
  rebuildForms();
  render();
  requestAnimationFrame(() => document.getElementById(`it-title-${id}`)?.focus());
}

function removeItem(id) {
  items = items.filter(i => i.id !== id);
  rebuildForms();
  render();
}

function syncItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  item.category    = document.getElementById(`it-cat-${id}`)?.value      ?? item.category;
  item.title       = document.getElementById(`it-title-${id}`)?.value    ?? item.title;
  item.description = document.getElementById(`it-desc-${id}`)?.value     ?? item.description;
  item.imageSize   = document.getElementById(`it-imgsize-${id}`)?.value  ?? item.imageSize;
  const card = document.getElementById(`icard-${id}`);
  if (card) card.style.setProperty('--dot', CATS[item.category]?.color ?? '#0092D1');
  render();
}

function handleItemImage(id, input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const item = items.find(i => i.id === id);
    if (item) { item.image = reader.result; rebuildForms(); render(); }
  };
  reader.readAsDataURL(file);
}

function removeItemImage(id) {
  const item = items.find(i => i.id === id);
  if (item) { item.image = ''; rebuildForms(); render(); }
}

function handleWorkspaceImage(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    workspaceImage = reader.result;
    render();
    updateWorkspacePreview();
  };
  reader.readAsDataURL(file);
}

function removeWorkspaceImage() {
  workspaceImage = '';
  render();
  updateWorkspacePreview();
}

function updateWorkspacePreview() {
  const el = document.getElementById('ws-img-preview');
  if (!el) return;
  el.innerHTML = workspaceImage
    ? `<div class="img-wrap"><img class="img-preview" src="${workspaceImage}"><button class="btn-remove-img" onclick="removeWorkspaceImage()" title="Remove image">&#x2715;</button></div>`
    : '';
}

function rebuildForms() {
  document.getElementById('items-container').innerHTML = items.map((item, idx) => {
    const dot = CATS[item.category]?.color ?? '#0092D1';
    return `<div class="item-card" id="icard-${item.id}" style="--dot:${dot}">
  <div class="item-header">
    <span class="item-num">Item ${idx + 1}</span>
    <button class="btn-remove" onclick="removeItem(${item.id})" title="Remove item">&#x2715;</button>
  </div>
  <div class="field">
    <label for="it-cat-${item.id}">Category</label>
    <select id="it-cat-${item.id}" onchange="syncItem(${item.id})">
      <option value="system"   ${item.category === 'system'   ? 'selected' : ''}>System change</option>
      <option value="process"  ${item.category === 'process'  ? 'selected' : ''}>Process change</option>
      <option value="behavior" ${item.category === 'behavior' ? 'selected' : ''}>Behavior change</option>
    </select>
  </div>
  <div class="field">
    <label for="it-title-${item.id}">Title</label>
    <input type="text" id="it-title-${item.id}" value="${esc(item.title)}"
      placeholder="e.g. Reference checks now in Talent+"
      oninput="syncItem(${item.id})">
  </div>
  <div class="field">
    <label for="it-desc-${item.id}">Description</label>
    <textarea id="it-desc-${item.id}" rows="2"
      placeholder="One sentence explaining what changed and why it matters."
      oninput="syncItem(${item.id})">${esc(item.description)}</textarea>
  </div>
  <div class="field" style="margin-bottom:0">
    <label>Image (optional)</label>
    ${item.image
      ? `<div class="img-wrap"><img class="img-preview" src="${item.image}"><button class="btn-remove-img" onclick="removeItemImage(${item.id})" title="Remove image">&#x2715;</button></div>`
      : ''}
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
      <input type="file" accept="image/*" onchange="handleItemImage(${item.id}, this)" style="font-size:12px;flex:1;min-width:0;">
      <select id="it-imgsize-${item.id}" onchange="syncItem(${item.id})" style="width:auto;padding:4px 6px;font-size:12px;">
        ${Object.entries(IMG_SIZES).map(([v,l]) => `<option value="${v}" ${item.imageSize === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  </div>
</div>`;
  }).join('');
}

/* ── Read form values ── */
function vals() {
  return {
    issue:     (document.getElementById('f-issue')?.value     || '1').trim(),
    month:     (document.getElementById('f-month')?.value     || 'April 2026').trim(),
    intro:      document.getElementById('f-intro')?.value     || '',
    badge:     (document.getElementById('f-badge')?.value     || 'Kicked off April 2026').trim(),
    workspace:  document.getElementById('f-workspace')?.value || '',
    workspaceImage: workspaceImage,
    workspaceImageSize: workspaceImageSize,
    items: items.map(item => ({
      category:    item.category,
      title:       document.getElementById(`it-title-${item.id}`)?.value ?? item.title,
      description: document.getElementById(`it-desc-${item.id}`)?.value  ?? item.description,
      image:       item.image || '',
      imageSize:   item.imageSize || '160',
    })),
  };
}

/* ── Email HTML builders ── */
function buildItems(itemsData) {
  if (!itemsData.length) {
    return `<tr><td style="padding:16px 0;font-size:13px;color:#97999B;font-style:italic;font-family:system-ui,-apple-system,sans-serif;">No update items added yet.</td></tr>`;
  }
  return itemsData.map(item => {
    const title = esc(item.title)       || '<em style="color:#97999B;">Untitled</em>';
    const desc  = esc(item.description) || '';
    const textHTML = `
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:600;color:#0D1E2F;line-height:1.4;">${title}</p>
      ${desc ? `<p style="margin:0;font-size:14px;font-weight:400;color:#00070A;line-height:1.7;">${desc}</p>` : ''}`;

    if (item.image) {
      return `<tr>
  <td style="padding:12px 0;border-bottom:1px solid #EDF2F7;vertical-align:top;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="vertical-align:top;font-family:system-ui,-apple-system,sans-serif;">${textHTML}</td>
      <td width="${item.imageSize}" style="vertical-align:top;padding-left:16px;">
        <img src="${item.image}" width="${item.imageSize}" style="display:block;border-radius:4px;width:${item.imageSize}px;height:auto;">
      </td>
    </tr></table>
  </td>
</tr>`;
    }

    return `<tr>
  <td style="padding:12px 0;border-bottom:1px solid #EDF2F7;vertical-align:top;font-family:system-ui,-apple-system,sans-serif;">${textHTML}
  </td>
</tr>`;
  }).join('\n');
}

function buildEmailBody(v) {
  const pStyle  = 'margin:0 0 8px 0;font-size:14px;line-height:1.7;color:#00070A;font-family:system-ui,-apple-system,sans-serif;';
  const emptyP  = `<p style="margin:0;font-size:14px;line-height:1.7;color:#97999B;font-style:italic;font-family:system-ui,-apple-system,sans-serif;">—</p>`;

  const introHTML     = nl2p(v.intro,     pStyle) || emptyP;
  const workspaceHTML = nl2p(v.workspace, pStyle) || emptyP;

  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFFFFF;">
<tr><td align="center" style="padding:32px 16px;">
<table cellpadding="0" cellspacing="0" border="0" width="620" style="max-width:620px;width:100%;">

  <!-- HEADER -->
  <tr><td style="padding-bottom:18px;border-bottom:2px solid #0092D1;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="vertical-align:middle;font-family:system-ui,-apple-system,sans-serif;">
        <p style="margin:0;font-size:13px;font-weight:600;color:#0D1E2F;line-height:1.4;">Process Innovation<br>&amp; Digitalization Programme</p>
      </td>
      <td style="vertical-align:middle;text-align:right;">
        ${buildLogoHeader()}
        <p style="margin:0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">Issue ${esc(v.issue)} &middot; ${esc(v.month)}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- INTRO -->
  <tr><td style="padding-top:24px;padding-bottom:4px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="background:#F6F9FC;border-radius:8px;padding:16px 20px;">
        ${introHTML}
      </td>
    </tr></table>
  </td></tr>

  <!-- TALENT+ UPDATES -->
  <tr><td style="padding-top:32px;">
    <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:600;color:#0092D1;font-family:system-ui,-apple-system,sans-serif;">Talent+ Updates</h2>
    <p style="margin:0 0 16px 0;font-size:13px;color:#97999B;line-height:1.5;font-family:system-ui,-apple-system,sans-serif;">Changes made this month</p>

    <!-- Items -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      ${buildItems(v.items)}
    </table>
  </td></tr>

  <!-- PEOPLE – TALENT WORKSPACE -->
  <tr><td style="padding-top:36px;">
    <h2 style="margin:0 0 4px 0;font-size:18px;font-weight:600;color:#0092D1;font-family:system-ui,-apple-system,sans-serif;">People &ndash; Talent Workspace</h2>
    <p style="margin:0 0 16px 0;font-size:13px;color:#97999B;line-height:1.5;font-family:system-ui,-apple-system,sans-serif;">A new platform from the HR PID Team</p>
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="background:#F5FBFD;border-radius:8px;padding:16px 20px;border:1px solid #C8D8E4;">${v.workspaceImage ? `
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="vertical-align:top;">
            <p style="margin:0 0 12px 0;">
              <span style="display:inline-block;background:#4EC3E0;color:#004976;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding:3px 10px;border-radius:100px;font-family:system-ui,-apple-system,sans-serif;">${esc(v.badge)}</span>
            </p>
            ${workspaceHTML}
          </td>
          <td width="${v.workspaceImageSize}" style="vertical-align:top;padding-left:16px;">
            <img src="${v.workspaceImage}" width="${v.workspaceImageSize}" style="display:block;border-radius:4px;width:${v.workspaceImageSize}px;height:auto;">
          </td>
        </tr></table>` : `
        <p style="margin:0 0 12px 0;">
          <span style="display:inline-block;background:#4EC3E0;color:#004976;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding:3px 10px;border-radius:100px;font-family:system-ui,-apple-system,sans-serif;">${esc(v.badge)}</span>
        </p>
        ${workspaceHTML}`}
      </td>
    </tr></table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding-top:32px;padding-bottom:8px;border-top:1px solid #DDE3EA;margin-top:32px;">
    <p style="margin:0 0 4px 0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">Sent by the HR PID team &middot; People and Culture Group, UNOPS</p>
    <p style="margin:0 0 4px 0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">Questions or feedback? Reply to this email.</p>
    <p style="margin:0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">Know someone who should receive this? Forward it and ask them to reach out to be added to the list.</p>
  </td></tr>

</table>
</td></tr></table>`;
}

function buildFullHTML(v) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Talent+ &mdash; A Brief &mdash; Issue ${esc(v.issue)}, ${esc(v.month)}</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF;">
${buildEmailBody(v)}
</body>
</html>`;
}

/* ── Render & Copy ── */
function render() {
  document.getElementById('email-preview').innerHTML = buildEmailBody(vals());
}

function copyForGmail() {
  const html = buildEmailBody(vals());
  const blob = new Blob([html], { type: 'text/html' });
  const textBlob = new Blob([html], { type: 'text/plain' });
  const item = new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob });
  navigator.clipboard.write([item]).then(showToast).catch(() => {
    fallbackRichCopy(html);
  });
}

function fallbackRichCopy(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
  document.body.appendChild(el);
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try { document.execCommand('copy'); showToast(); }
  catch(e) { alert('Copy failed. Please try the HTML button instead.'); }
  sel.removeAllRanges();
  document.body.removeChild(el);
}

function copyHTML() {
  const html = buildFullHTML(vals());
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(html).then(showToast).catch(() => fallbackCopy(html));
  } else {
    fallbackCopy(html);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast(); }
  catch(e) { alert('Copy failed. Please copy the HTML manually.'); }
  document.body.removeChild(ta);
}

function showToast() {
  const t = document.getElementById('copy-toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ── Init ── */
document.getElementById('f-intro').value =
  `Welcome to the first issue of Talent+: A Brief — a monthly newsletter from the HR PID Team keeping you up to date on everything happening in Talent+ and the broader People technology space.\n\nIf this is useful to you, please share it with colleagues who should be on the list.`;

document.getElementById('f-workspace').value =
  `The HR PID Team has just kicked off the People – Talent Workspace, a new platform designed to bring all HR processes and tools into one place for everyone at UNOPS.\n\nThis project is the next step in the People technology journey, building on the foundation laid by Talent+. Work began in April 2026 and we will keep you updated here each month as it progresses.`;

addItem();
setTimeout(() => {
  const first = items[0];
  if (!first) return;
  const titleEl = document.getElementById(`it-title-${first.id}`);
  const descEl  = document.getElementById(`it-desc-${first.id}`);
  if (titleEl) titleEl.value = 'Reference checks now in Talent+';
  if (descEl)  descEl.value  = 'Reference checks can now be initiated and tracked directly within Talent+, reducing the need to manage this step outside the system.';
  syncItem(first.id);
}, 10);

render();

fetch('assets/logo/black_logo_b64.txt')
  .then(r => r.text())
  .then(data => { LOGO_B64 = data.trim(); render(); });
