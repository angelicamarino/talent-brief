/* ── Config ── */
const CATS = {
  system:   { label: 'System change',   color: '#0092D1' },
  process:  { label: 'Process change',  color: '#00A997' },
  behavior: { label: 'Behavior change', color: '#004976' },
};

const IMG_SIZES = { '100': 'Small', '160': 'Medium', '240': 'Large' };
const EMOJI_OPTIONS = ['✅','🆕','🔧','📢','⚡','🚀','🎯','💡','📌','📋','⭐','🔔','🎉','⚠️'];

const SECTION_TYPES = {
  highlight: 'Highlight box',
  items:     'Update items',
  card:      'Featured card',
  image:     'Image',
};

/* ── State ── */
let sections = [];
let nextSectionId = 0;
let nextItemId = 0;
let LOGO_B64 = '';
let lastRemoved = null;
let undoTimeout = null;

const FOOTER_DEFAULTS = {
  line1: 'Sent by the HR PID team · People and Culture Group, UNOPS',
  line2: 'Questions or feedback? Reply to this email.',
  line3: 'Know someone who should receive this? Forward it and ask them to reach out to be added to the list.',
  line4: 'To view previous newsletters, please click here.',
  line4Url: '',
};
let footer = { ...FOOTER_DEFAULTS };

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

function newSection(type) {
  return {
    id: nextSectionId++, type: type || 'highlight',
    heading: '', subtitle: '', body: '', badge: '',
    image: '', imageSize: '160', items: [],
  };
}

/* ── Section management ── */
function addSection(type) {
  syncAllSections();
  sections.push(newSection(type));
  rebuildSections();
  render();
}

function removeSection(id) {
  syncAllSections();
  const idx = sections.findIndex(s => s.id === id);
  if (idx === -1) return;
  lastRemoved = { type: 'section', data: sections[idx], index: idx };
  sections.splice(idx, 1);
  rebuildSections();
  render();
  showUndoToast('Section removed');
}

function moveSection(id, dir) {
  syncAllSections();
  const idx = sections.findIndex(s => s.id === id);
  if (idx === -1) return;
  const target = idx + dir;
  if (target < 0 || target >= sections.length) return;
  [sections[idx], sections[target]] = [sections[target], sections[idx]];
  rebuildSections();
  render();
}

function setSectionType(id, type) {
  syncAllSections();
  const sec = sections.find(s => s.id === id);
  if (!sec) return;
  sec.type = type;
  rebuildSections();
  render();
}

function syncSection(id) {
  const sec = sections.find(s => s.id === id);
  if (!sec) return;
  sec.heading  = document.getElementById(`sec-heading-${id}`)?.value ?? sec.heading;
  sec.subtitle = document.getElementById(`sec-sub-${id}`)?.value ?? sec.subtitle;
  sec.body     = document.getElementById(`sec-body-${id}`)?.value ?? sec.body;
  sec.badge    = document.getElementById(`sec-badge-${id}`)?.value ?? sec.badge;
  render();
}

function syncAllSections() {
  sections.forEach(sec => {
    sec.heading  = document.getElementById(`sec-heading-${sec.id}`)?.value ?? sec.heading;
    sec.subtitle = document.getElementById(`sec-sub-${sec.id}`)?.value ?? sec.subtitle;
    sec.body     = document.getElementById(`sec-body-${sec.id}`)?.value ?? sec.body;
    sec.badge    = document.getElementById(`sec-badge-${sec.id}`)?.value ?? sec.badge;
    sec.items.forEach(item => {
      item.category    = document.getElementById(`it-cat-${item.id}`)?.value ?? item.category;
      item.title       = document.getElementById(`it-title-${item.id}`)?.value ?? item.title;
      item.description = document.getElementById(`it-desc-${item.id}`)?.value ?? item.description;
      item.imageSize   = document.getElementById(`it-imgsize-${item.id}`)?.value ?? item.imageSize;
    });
  });
}

/* ── Footer sync ── */
function syncFooter() {
  footer.line1    = document.getElementById('ft-line1')?.value ?? footer.line1;
  footer.line2    = document.getElementById('ft-line2')?.value ?? footer.line2;
  footer.line3    = document.getElementById('ft-line3')?.value ?? footer.line3;
  footer.line4    = document.getElementById('ft-line4')?.value ?? footer.line4;
  footer.line4Url = document.getElementById('ft-line4-url')?.value ?? footer.line4Url;
  render();
}

/* ── Section image handling ── */
function handleSectionImage(id, input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const sec = sections.find(s => s.id === id);
    if (sec) { sec.image = reader.result; syncAllSections(); rebuildSections(); render(); }
  };
  reader.readAsDataURL(file);
}

function removeSectionImage(id) {
  const sec = sections.find(s => s.id === id);
  if (sec) { sec.image = ''; syncAllSections(); rebuildSections(); render(); }
}

function setSectionImageSize(id, size) {
  const sec = sections.find(s => s.id === id);
  if (sec) { sec.imageSize = size; render(); }
}

/* ── Item management ── */
function addItem(sectionId) {
  syncAllSections();
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return;
  const id = nextItemId++;
  sec.items.push({ id, category: 'system', icon: 'dot', title: '', description: '', image: '', imageSize: '160' });
  rebuildSections();
  render();
  requestAnimationFrame(() => document.getElementById(`it-title-${id}`)?.focus());
}

function removeItem(sectionId, itemId) {
  syncAllSections();
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return;
  const idx = sec.items.findIndex(i => i.id === itemId);
  if (idx === -1) return;
  lastRemoved = { type: 'item', sectionId, data: sec.items[idx], index: idx };
  sec.items.splice(idx, 1);
  rebuildSections();
  render();
  showUndoToast('Item removed');
}

function syncItem(sectionId, itemId) {
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return;
  const item = sec.items.find(i => i.id === itemId);
  if (!item) return;
  item.category    = document.getElementById(`it-cat-${itemId}`)?.value ?? item.category;
  item.title       = document.getElementById(`it-title-${itemId}`)?.value ?? item.title;
  item.description = document.getElementById(`it-desc-${itemId}`)?.value ?? item.description;
  item.imageSize   = document.getElementById(`it-imgsize-${itemId}`)?.value ?? item.imageSize;
  const card = document.getElementById(`icard-${itemId}`);
  if (card) card.style.setProperty('--dot', CATS[item.category]?.color ?? '#0092D1');
  render();
}

function setItemIcon(sectionId, itemId, icon) {
  syncAllSections();
  const sec = sections.find(s => s.id === sectionId);
  if (!sec) return;
  const item = sec.items.find(i => i.id === itemId);
  if (!item) return;
  item.icon = icon;
  rebuildSections();
  render();
}

function handleItemImage(sectionId, itemId, input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const sec = sections.find(s => s.id === sectionId);
    const item = sec?.items.find(i => i.id === itemId);
    if (item) { item.image = reader.result; syncAllSections(); rebuildSections(); render(); }
  };
  reader.readAsDataURL(file);
}

function removeItemImage(sectionId, itemId) {
  syncAllSections();
  const sec = sections.find(s => s.id === sectionId);
  const item = sec?.items.find(i => i.id === itemId);
  if (item) { item.image = ''; rebuildSections(); render(); }
}

/* ── Undo ── */
function undoRemove() {
  if (!lastRemoved) return;
  if (lastRemoved.type === 'section') {
    sections.splice(lastRemoved.index, 0, lastRemoved.data);
  } else if (lastRemoved.type === 'item') {
    const sec = sections.find(s => s.id === lastRemoved.sectionId);
    if (sec) sec.items.splice(lastRemoved.index, 0, lastRemoved.data);
  }
  lastRemoved = null;
  hideUndoToast();
  rebuildSections();
  render();
}

function showUndoToast(msg) {
  clearTimeout(undoTimeout);
  const t = document.getElementById('undo-toast');
  t.querySelector('span').textContent = msg || 'Removed';
  t.classList.add('show');
  undoTimeout = setTimeout(hideUndoToast, 5000);
}

function hideUndoToast() {
  clearTimeout(undoTimeout);
  document.getElementById('undo-toast').classList.remove('show');
  lastRemoved = null;
}

/* ── Form building ── */
function rebuildSections() {
  document.getElementById('sections-container').innerHTML = sections.map((sec, idx) => {
    const isFirst = idx === 0;
    const isLast  = idx === sections.length - 1;

    return `<div class="section-block">
  <div class="section-header">
    <span>Section ${idx + 1}</span>
    <div class="section-actions">
      ${!isFirst ? `<button class="btn-section-action" onclick="moveSection(${sec.id},-1)" title="Move up">&#9650;</button>` : ''}
      ${!isLast  ? `<button class="btn-section-action" onclick="moveSection(${sec.id},1)" title="Move down">&#9660;</button>` : ''}
      <button class="btn-remove" onclick="removeSection(${sec.id})" title="Remove section">&#x2715;</button>
    </div>
  </div>
  <div class="field">
    <label>Type</label>
    <select onchange="setSectionType(${sec.id},this.value)">
      ${Object.entries(SECTION_TYPES).map(([k,v]) => `<option value="${k}" ${sec.type === k ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div class="field-row" style="grid-template-columns:1fr 1fr;">
    <div class="field">
      <label>Heading</label>
      <input type="text" id="sec-heading-${sec.id}" value="${esc(sec.heading)}" placeholder="Optional heading" oninput="syncSection(${sec.id})">
    </div>
    <div class="field">
      <label>Subtitle</label>
      <input type="text" id="sec-sub-${sec.id}" value="${esc(sec.subtitle)}" placeholder="Optional subtitle" oninput="syncSection(${sec.id})">
    </div>
  </div>
  ${buildSectionContent(sec)}
</div>`;
  }).join('');
}

function buildSectionContent(sec) {
  switch (sec.type) {
    case 'highlight': return `
  <div class="field">
    <label>Paragraph</label>
    <textarea id="sec-body-${sec.id}" rows="4" placeholder="Write content for this section..." oninput="syncSection(${sec.id})">${esc(sec.body)}</textarea>
  </div>`;

    case 'items': return `
  <div class="items-container">${sec.items.map((item, i) => buildItemCard(sec, item, i)).join('')}</div>
  <button class="btn-add" onclick="addItem(${sec.id})">+ Add update item</button>`;

    case 'card': return `
  <div class="field">
    <label>Badge text</label>
    <input type="text" id="sec-badge-${sec.id}" value="${esc(sec.badge)}" placeholder="e.g. Coming soon" oninput="syncSection(${sec.id})">
  </div>
  <div class="field">
    <label>Paragraph</label>
    <textarea id="sec-body-${sec.id}" rows="4" placeholder="Write content for this card..." oninput="syncSection(${sec.id})">${esc(sec.body)}</textarea>
  </div>
  <div class="field" style="margin-bottom:0">
    <label>Image (optional)</label>
    ${sec.image ? `<div class="img-wrap"><img class="img-preview" src="${sec.image}"><button class="btn-remove-img" onclick="removeSectionImage(${sec.id})" title="Remove image">&#x2715;</button></div>` : ''}
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
      <input type="file" accept="image/*" onchange="handleSectionImage(${sec.id},this)" style="font-size:12px;flex:1;min-width:0;">
      <select id="sec-imgsize-${sec.id}" onchange="setSectionImageSize(${sec.id},this.value)" style="width:auto;padding:4px 6px;font-size:12px;">
        ${Object.entries(IMG_SIZES).map(([v,l]) => `<option value="${v}" ${sec.imageSize === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  </div>`;

    case 'image': return `
  <div class="field" style="margin-bottom:0">
    <label>Image</label>
    ${sec.image ? `<div class="img-wrap"><img class="img-preview" src="${sec.image}"><button class="btn-remove-img" onclick="removeSectionImage(${sec.id})" title="Remove image">&#x2715;</button></div>` : ''}
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
      <input type="file" accept="image/*" onchange="handleSectionImage(${sec.id},this)" style="font-size:12px;flex:1;min-width:0;">
      <select id="sec-imgsize-${sec.id}" onchange="setSectionImageSize(${sec.id},this.value)" style="width:auto;padding:4px 6px;font-size:12px;">
        ${Object.entries(IMG_SIZES).map(([v,l]) => `<option value="${v}" ${sec.imageSize === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  </div>`;
  }
  return '';
}

function buildItemCard(sec, item, idx) {
  const dot = CATS[item.category]?.color ?? '#0092D1';
  return `<div class="item-card" id="icard-${item.id}" style="--dot:${dot}">
  <div class="item-header">
    <span class="item-num">Item ${idx + 1}</span>
    <button class="btn-remove" onclick="removeItem(${sec.id},${item.id})" title="Remove item">&#x2715;</button>
  </div>
  <div class="field">
    <label for="it-cat-${item.id}">Category</label>
    <select id="it-cat-${item.id}" onchange="syncItem(${sec.id},${item.id})">
      <option value="system" ${item.category === 'system' ? 'selected' : ''}>System change</option>
      <option value="process" ${item.category === 'process' ? 'selected' : ''}>Process change</option>
      <option value="behavior" ${item.category === 'behavior' ? 'selected' : ''}>Behavior change</option>
    </select>
  </div>
  <div class="field">
    <label>Icon</label>
    <div class="icon-picker">
      <button type="button" class="icon-opt${item.icon === 'dot' ? ' selected' : ''}" onclick="setItemIcon(${sec.id},${item.id},'dot')" title="Category dot">
        <span class="icon-dot" style="background:${dot};"></span>
      </button>
      <button type="button" class="icon-opt${item.icon === 'none' ? ' selected' : ''}" onclick="setItemIcon(${sec.id},${item.id},'none')" title="No icon">
        <span class="icon-none">&mdash;</span>
      </button>
      ${EMOJI_OPTIONS.map(e => `<button type="button" class="icon-opt${item.icon === e ? ' selected' : ''}" onclick="setItemIcon(${sec.id},${item.id},'${e}')" title="${e}">${e}</button>`).join('')}
    </div>
  </div>
  <div class="field">
    <label for="it-title-${item.id}">Title</label>
    <input type="text" id="it-title-${item.id}" value="${esc(item.title)}"
      placeholder="e.g. Reference checks now in Talent+"
      oninput="syncItem(${sec.id},${item.id})">
  </div>
  <div class="field">
    <label for="it-desc-${item.id}">Description</label>
    <textarea id="it-desc-${item.id}" rows="2"
      placeholder="One sentence explaining what changed and why it matters."
      oninput="syncItem(${sec.id},${item.id})">${esc(item.description)}</textarea>
  </div>
  <div class="field" style="margin-bottom:0">
    <label>Image (optional)</label>
    ${item.image
      ? `<div class="img-wrap"><img class="img-preview" src="${item.image}"><button class="btn-remove-img" onclick="removeItemImage(${sec.id},${item.id})" title="Remove image">&#x2715;</button></div>`
      : ''}
    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
      <input type="file" accept="image/*" onchange="handleItemImage(${sec.id},${item.id},this)" style="font-size:12px;flex:1;min-width:0;">
      <select id="it-imgsize-${item.id}" onchange="syncItem(${sec.id},${item.id})" style="width:auto;padding:4px 6px;font-size:12px;">
        ${Object.entries(IMG_SIZES).map(([v,l]) => `<option value="${v}" ${item.imageSize === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>
  </div>
</div>`;
}

/* ── Read form values ── */
function vals() {
  return {
    issue: (document.getElementById('f-issue')?.value || '1').trim(),
    month: (document.getElementById('f-month')?.value || 'April 2026').trim(),
    sections,
    footer,
  };
}

/* ── Email HTML builders ── */
function buildItemRows(itemsData) {
  if (!itemsData.length) {
    return `<tr><td style="padding:16px 0;font-size:13px;color:#97999B;font-style:italic;font-family:system-ui,-apple-system,sans-serif;">No update items added yet.</td></tr>`;
  }
  return itemsData.map(item => {
    let iconHTML = '';
    if (item.icon === 'dot') {
      const catColor = CATS[item.category]?.color ?? '#0092D1';
      iconHTML = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${catColor};margin-right:6px;vertical-align:middle;"></span>`;
    } else if (item.icon && item.icon !== 'none') {
      iconHTML = `<span style="margin-right:4px;font-size:13px;vertical-align:middle;">${item.icon}</span>`;
    }
    const title = esc(item.title)       || '<em style="color:#97999B;">Untitled</em>';
    const desc  = esc(item.description) || '';
    const textHTML = `
      <p style="margin:0 0 3px 0;font-size:14px;font-weight:600;color:#0D1E2F;line-height:1.4;">${iconHTML}${title}</p>
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

function buildSectionEmail(sec, pStyle, emptyP) {
  const h2Style = 'margin:0 0 4px 0;font-size:18px;font-weight:600;color:#0092D1;font-family:system-ui,-apple-system,sans-serif;';
  const subStyle = 'margin:0 0 16px 0;font-size:13px;color:#97999B;line-height:1.5;font-family:system-ui,-apple-system,sans-serif;';
  const headingHTML  = sec.heading  ? `<h2 style="${h2Style}">${esc(sec.heading)}</h2>` : '';
  const subtitleHTML = sec.subtitle ? `<p style="${subStyle}">${esc(sec.subtitle)}</p>` : '';

  switch (sec.type) {
    case 'highlight': {
      const bodyHTML = nl2p(sec.body, pStyle) || emptyP;
      return `
  <tr><td style="padding-top:24px;padding-bottom:4px;">
    ${headingHTML}${subtitleHTML}
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="background:#F6F9FC;border-radius:8px;padding:16px 20px;">
        ${bodyHTML}
      </td>
    </tr></table>
  </td></tr>`;
    }

    case 'items': {
      return `
  <tr><td style="padding-top:32px;">
    ${headingHTML}${subtitleHTML}
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      ${buildItemRows(sec.items || [])}
    </table>
  </td></tr>`;
    }

    case 'card': {
      const bodyHTML = nl2p(sec.body, pStyle) || emptyP;
      const badgeHTML = sec.badge
        ? `<p style="margin:0 0 12px 0;"><span style="display:inline-block;background:#4EC3E0;color:#004976;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;padding:3px 10px;border-radius:100px;font-family:system-ui,-apple-system,sans-serif;">${esc(sec.badge)}</span></p>`
        : '';
      const cardInner = sec.image
        ? `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td style="vertical-align:top;">${badgeHTML}${bodyHTML}</td>
            <td width="${sec.imageSize}" style="vertical-align:top;padding-left:16px;">
              <img src="${sec.image}" width="${sec.imageSize}" style="display:block;border-radius:4px;width:${sec.imageSize}px;height:auto;">
            </td>
          </tr></table>`
        : `${badgeHTML}${bodyHTML}`;

      return `
  <tr><td style="padding-top:36px;">
    ${headingHTML}${subtitleHTML}
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td style="background:#F5FBFD;border-radius:8px;padding:16px 20px;border:1px solid #C8D8E4;">
        ${cardInner}
      </td>
    </tr></table>
  </td></tr>`;
    }

    case 'image': {
      const imgHTML = sec.image
        ? `<img src="${sec.image}" width="${sec.imageSize}" style="display:block;border-radius:4px;width:${sec.imageSize}px;height:auto;">`
        : `<p style="margin:0;font-size:14px;line-height:1.7;color:#97999B;font-style:italic;font-family:system-ui,-apple-system,sans-serif;">No image uploaded.</p>`;

      return `
  <tr><td style="padding-top:24px;padding-bottom:4px;">
    ${headingHTML}${subtitleHTML}
    ${imgHTML}
  </td></tr>`;
    }
  }
  return '';
}

function buildEmailBody(v) {
  const pStyle = 'margin:0 0 8px 0;font-size:14px;line-height:1.7;color:#00070A;font-family:system-ui,-apple-system,sans-serif;';
  const emptyP = `<p style="margin:0;font-size:14px;line-height:1.7;color:#97999B;font-style:italic;font-family:system-ui,-apple-system,sans-serif;">—</p>`;

  const sectionsHTML = v.sections.map(sec => buildSectionEmail(sec, pStyle, emptyP)).join('\n');

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

  ${sectionsHTML}

  <!-- FOOTER -->
  <tr><td style="padding-top:32px;padding-bottom:8px;border-top:1px solid #DDE3EA;margin-top:32px;">
    ${v.footer.line1 ? `<p style="margin:0 0 4px 0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">${esc(v.footer.line1)}</p>` : ''}
    ${v.footer.line2 ? `<p style="margin:0 0 4px 0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">${esc(v.footer.line2)}</p>` : ''}
    ${v.footer.line3 ? `<p style="margin:0 0 4px 0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">${esc(v.footer.line3)}</p>` : ''}
    ${v.footer.line4 ? (v.footer.line4Url
      ? `<p style="margin:0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;"><a href="${esc(v.footer.line4Url)}" style="color:#0092D1;text-decoration:underline;">${esc(v.footer.line4)}</a></p>`
      : `<p style="margin:0;font-size:12px;color:#97999B;font-family:system-ui,-apple-system,sans-serif;">${esc(v.footer.line4)}</p>`)
    : ''}
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
  updatePreviewScale();
}

function copyForGmail() {
  syncAllSections();
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
  syncAllSections();
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

function downloadPDF() {
  syncAllSections();
  const v = vals();
  const container = document.createElement('div');
  container.innerHTML = buildEmailBody(v);
  container.style.cssText = 'width:620px;background:#fff;padding:0;';
  document.body.appendChild(container);

  const filename = `Talent-Brief-Issue-${v.issue}-${v.month.replace(/\s+/g, '-')}.pdf`;

  html2pdf()
    .set({
      margin:      [12, 0, 12, 0],
      filename,
      image:       { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, width: 620 },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(container)
    .save()
    .then(() => document.body.removeChild(container))
    .catch(() => document.body.removeChild(container));
}

/* ── Init ── */
const s0 = newSection('highlight');
s0.body = `Welcome to the first issue of Talent+: A Brief — a monthly newsletter from the HR PID Team keeping you up to date on everything happening in Talent+ and the broader People technology space.\n\nIf this is useful to you, please share it with colleagues who should be on the list.`;
sections.push(s0);

const s1 = newSection('items');
s1.heading = 'Talent+ Updates';
s1.subtitle = 'Changes made this month';
s1.items.push({
  id: nextItemId++, category: 'system', icon: 'dot',
  title: 'Reference checks now in Talent+',
  description: 'Reference checks can now be initiated and tracked directly within Talent+, reducing the need to manage this step outside the system.',
  image: '', imageSize: '160',
});
sections.push(s1);

const s2 = newSection('card');
s2.heading = 'People – Talent Workspace';
s2.subtitle = 'A new platform from the HR PID Team';
s2.badge = 'Kicked off April 2026';
s2.body = `The HR PID Team has just kicked off the People – Talent Workspace, a new platform designed to bring all HR processes and tools into one place for everyone at UNOPS.\n\nThis project is the next step in the People technology journey, building on the foundation laid by Talent+. Work began in April 2026 and we will keep you updated here each month as it progresses.`;
sections.push(s2);

rebuildSections();
render();

fetch('assets/logo/black_logo_b64.txt')
  .then(r => r.text())
  .then(data => { LOGO_B64 = data.trim(); render(); });

/* ── Preview scaling ── */
function updatePreviewScale() {
  const panel = document.querySelector('.preview-panel');
  const shell = document.querySelector('.preview-shell');
  if (!panel || !shell) return;
  const available = panel.clientWidth - 48;
  const scale = Math.min(1, available / 700);
  shell.style.zoom = scale < 1 ? scale : '';
}

new ResizeObserver(updatePreviewScale).observe(document.querySelector('.preview-panel'));
