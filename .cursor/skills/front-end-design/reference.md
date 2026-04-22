# Token Quick-Reference

This file is a lookup table for mapping visual intent to the correct design token. The agent should read this when it needs to find the right token for a specific use case.

## Color tokens — by purpose

### Surfaces

| Token | Use for |
|-------|---------|
| `--color-bg` | Page background |
| `--color-surface` | Card, panel, section background |
| `--color-surface-raised` | Elevated card, popover, dropdown |
| `--color-surface-sunken` | Inset area, well, code block bg |

### Text

| Token | Use for |
|-------|---------|
| `--color-text` | Primary body text, headings |
| `--color-text-secondary` | Supporting text, descriptions |
| `--color-text-muted` | Placeholder, disabled, meta labels |
| `--color-text-link` | Anchor text, clickable labels |

### Borders

| Token | Use for |
|-------|---------|
| `--color-border` | Default card/section borders |
| `--color-border-strong` | Emphasized dividers, active borders |
| `--color-border-subtle` | Light separators, hairlines |

### Interactive states

| Token | Use for |
|-------|---------|
| `--color-hover` | Hover background overlay |
| `--color-active` | Active/pressed state |
| `--color-selected` | Selected row, active tab |
| `--color-focus-ring` | Focus-visible box-shadow |

### Brand accents

| Token | Use for |
|-------|---------|
| `--color-brand-primary` | Primary buttons, key accents |
| `--color-brand-subtle` | Soft brand tint backgrounds |
| `--color-brand-secondary` | Secondary brand accent |

### Feedback

| Token | Use for |
|-------|---------|
| `--color-brand-success` | Success messages, checkmarks |
| `--color-brand-warning` | Warnings, caution indicators |
| `--color-brand-error` | Error text, destructive actions |
| `--color-brand-info` | Informational messages |

### Status badges

| Token | Use for |
|-------|---------|
| `--color-status-active-bg` | Active/live status badge |
| `--color-status-draft-bg` | Draft/pending status badge |
| `--color-status-danger-bg` | Error/critical status badge |

### Form inputs

| Token | Use for |
|-------|---------|
| `--color-input-bg` | Input/textarea background |
| `--color-input-border` | Default input border |
| `--color-input-border-focus` | Focused input border |

### Code

| Token | Use for |
|-------|---------|
| `--color-code-bg` | Inline/block code background |
| `--color-code-text` | Code text color |

---

## Shadows

| Token | Use for |
|-------|---------|
| `--shadow-xs` | Subtle lift (badges, chips) |
| `--shadow-sm` | Light cards, input focus accents |
| `--shadow-md` | Standard card elevation |
| `--shadow-lg` | Dropdowns, popovers |
| `--shadow-xl` | Modals, dialogs |

All shadows are brand-tinted. Never compose shadows manually.

---

## Layout widths

| Token | Value | Utility class | Use for |
|-------|-------|---------------|---------|
| `--layout-xs` | 28rem (448px) | — | Dialogs, small modals |
| `--layout-sm` | 40rem (640px) | `.container-sm` | Settings, narrow forms, sidebars |
| `--layout-md` | 52rem (832px) | `.container-md` | Single-column content, docs |
| `--layout-lg` | 60rem (960px) | `.container-lg` | Template selectors, mid listings |
| `--layout-xl` | 72rem (1152px) | `.container-xl` | Card grids, dashboards |
| `--layout-prompt` | 40rem | — | Chat/prompt input boxes |

---

## Typography

### Font families

| Token | Use for |
|-------|---------|
| `--font-family-display` | Headings, hero text |
| `--font-family-body` | Body copy, descriptions |
| `--font-family-mono` | Code, technical values |

### Font sizes

| Token | Approx. | Use for |
|-------|---------|---------|
| `--font-size-xs` | ~11px | Meta labels, fine print |
| `--font-size-sm` | ~13px | Secondary UI text, badges |
| `--font-size-base` | ~14-15px | Body text |
| `--font-size-lg` | ~18px | Section headings |
| `--font-size-xl` | ~20px | Page headings |
| `--font-size-2xl` | ~24px | Hero headings |
| `--font-size-3xl` – `5xl` | 30–48px | Display, splash text |

### Font weights

| Token | Value | Use for |
|-------|-------|---------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Subheadings, labels |
| `--font-weight-semibold` | 600 | Headings, emphasis |
| `--font-weight-bold` | 700 | Strong emphasis, titles |

### Line heights

| Token | Use for |
|-------|---------|
| `--line-height-tight` | Headings, compact UI |
| `--line-height-snug` | Short paragraphs, cards |
| `--line-height-normal` | Body text |
| `--line-height-relaxed` | Long-form reading |

---

## Spacing

Tokens `--spacing-0` through `--spacing-24` follow a consistent scale. Common mappings:

| Token | Approx. | Common use |
|-------|---------|------------|
| `--spacing-1` | 4px | Tight inline gaps |
| `--spacing-2` | 8px | Icon-to-text gap, small padding |
| `--spacing-3` | 12px | Form field gap |
| `--spacing-4` | 16px | Standard card padding, section gap |
| `--spacing-6` | 24px | Section spacing |
| `--spacing-8` | 32px | Large section breaks |
| `--spacing-12` | 48px | Page section margins |
| `--spacing-16` | 64px | Major layout regions |
| `--spacing-24` | 96px | Hero/splash spacing |

---

## Border radii

| Token | Use for |
|-------|---------|
| `--radius-sm` | Inputs, small controls |
| `--radius-md` | Cards, panels |
| `--radius-lg` | Modals, large cards |
| `--radius-xl` | Feature cards |
| `--radius-2xl` | Hero sections |
| `--radius-full` | Circles, pills, avatars |

---

## Transitions

| Token | Use for |
|-------|---------|
| `--transition-fast` | Hover effects, color changes |
| `--transition-base` | Standard element transitions |
| `--transition-slow` | Layout shifts, expand/collapse |

---

## Z-index

| Token | Use for |
|-------|---------|
| `--z-dropdown` | Dropdown menus |
| `--z-sticky` | Sticky headers, toolbars |
| `--z-overlay` | Overlay backgrounds |
| `--z-modal` | Modal dialogs |
| `--z-popover` | Popovers, floating panels |
| `--z-tooltip` | Tooltips |

---

## Utility classes quick-reference

| Category | Classes | Use for |
|----------|---------|---------|
| Flex | `.flex-row`, `.flex-col`, `.flex-center`, `.flex-between` | Layout direction |
| Flex sizing | `.flex-1`, `.flex-shrink-0` | Flex item sizing |
| Align | `.items-start`, `.items-center`, `.items-end` | Cross-axis alignment |
| Gap | `.gap-1` – `.gap-8` | Flex/grid gap |
| Size | `.w-full`, `.h-full`, `.min-h-0` | Dimension resets |
| Container | `.container-sm` – `.container-xl` | Centered max-width wrappers |
| Text | `.truncate`, `.line-clamp-2`, `.line-clamp-3` | Text overflow |
| A11y | `.visually-hidden` | Screen-reader-only content |
| Scroll | `.scrollable` | Brand-tinted thin scrollbar |

---

## Common violation → fix mapping

| Violation | Fix |
|-----------|-----|
| `color: #333` | `color: var(--color-text)` |
| `color: #666` / `#999` | `color: var(--color-text-secondary)` or `var(--color-text-muted)` |
| `background: white` / `#fff` | `background: var(--color-surface)` |
| `background: #f5f5f5` | `background: var(--color-bg)` or `var(--color-surface-sunken)` |
| `border: 1px solid #e5e5e5` | `border: 1px solid var(--color-border)` |
| `border: 1px solid #ccc` | `border: 1px solid var(--color-border-strong)` |
| `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` | `box-shadow: var(--shadow-sm)` |
| `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` | `box-shadow: var(--shadow-md)` |
| `max-width: 720px` | `max-width: var(--layout-md)` or class `.container-md` |
| `max-width: 1152px` | `max-width: var(--layout-xl)` or class `.container-xl` |
| `font-size: 14px` | `font-size: var(--font-size-base)` |
| `font-weight: 600` | `font-weight: var(--font-weight-semibold)` |
| `border-radius: 8px` | `border-radius: var(--radius-md)` |
| `padding: 16px` | `padding: var(--spacing-4)` |
| `gap: 8px` | `gap: var(--spacing-2)` |
