---
name: front-end-design
description: >-
  Build, style, and review front-end UI using the project's brand design tokens
  and utility classes. Use when creating components, writing CSS/SCSS, reviewing
  markup for token violations, implementing responsive layouts, or improving
  accessibility. Covers Angular standalone components and vanilla HTML/CSS.
---

# Front-End Design

This skill enforces the project's brand design system when building, styling, or reviewing UI code. Every decision — colors, shadows, typography, spacing, layout widths — must flow through the tokens defined in `src/styles/brand-tokens.css` and the utilities in `src/styles/utilities.css`.

**Mandatory companion rule:** Always read `.cursor/rules/brand-design-tokens.mdc` before writing any UI code. That rule is the single source of truth for token names and forbidden patterns.

## Quick-start checklist

Copy this checklist when starting any UI task:

```
- [ ] Read brand-design-tokens.mdc rule
- [ ] Zero hard-coded color values (hex, rgb, rgba, hsl)
- [ ] Zero hard-coded max-width on containers
- [ ] All interactive states use token overlays
- [ ] Shadows use brand-tinted tokens, not rgba(0,0,0,…)
- [ ] BEM class naming: .component-name__element--modifier
- [ ] Utility classes used where practical
- [ ] Keyboard navigable, focus ring visible
- [ ] Color contrast passes WCAG AA (4.5:1 text, 3:1 large/UI)
```

---

## 1. Building new components

### File structure

Colocate CSS with the component. One component = one directory:

```
ComponentName/
├── ComponentName.ts          # (or .tsx for React / .component.ts for Angular)
├── ComponentName.css         # Component-scoped styles
├── ComponentName.spec.ts     # Tests
└── index.ts                  # Public export barrel
```

### CSS skeleton

Every component CSS file follows this shape:

```css
.component-name {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  transition: var(--transition-base);
}

.component-name:hover {
  background: var(--color-hover);
}

.component-name:focus-visible {
  outline: none;
  box-shadow: var(--color-focus-ring);
}

.component-name__header {
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.component-name__body {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

.component-name--danger {
  border-color: var(--color-brand-error);
  background: var(--color-status-danger-bg);
}
```

### Angular standalone component pattern

```typescript
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-example-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './example-card.css',
  template: `
    <article class="example-card" [class.example-card--selected]="selected()">
      <header class="example-card__header flex-row items-center gap-2">
        <h3 class="example-card__title">{{ title() }}</h3>
      </header>
      <div class="example-card__body">
        <ng-content />
      </div>
    </article>
  `,
})
export class ExampleCardComponent {
  title = input.required<string>();
  selected = input(false);
  cardClick = output<void>();
}
```

Key rules:
- `ChangeDetectionStrategy.OnPush` always
- `input()` / `output()` functions, not decorators
- `inject()` for DI, not constructor injection
- Utility classes in templates, BEM classes for component-specific styles
- `@if` / `@for` / `@switch` control flow, not `*ngIf` / `*ngFor`

---

## 2. Writing CSS with tokens

### Decision tree — picking the right token

```
Need a color?
├─ Background     → --color-bg, --color-surface, --color-surface-raised, --color-surface-sunken
├─ Text           → --color-text, --color-text-secondary, --color-text-muted, --color-text-link
├─ Border         → --color-border, --color-border-strong, --color-border-subtle
├─ Interactive    → --color-hover, --color-active, --color-selected, --color-focus-ring
├─ Brand accent   → --color-brand-primary, --color-brand-subtle, --color-brand-secondary
├─ Feedback       → --color-brand-success / warning / error / info
├─ Status badge   → --color-status-active-bg, --color-status-draft-bg, --color-status-danger-bg
└─ Input field    → --color-input-bg, --color-input-border, --color-input-border-focus

Need a shadow?
└─ --shadow-xs / sm / md / lg / xl  (all brand-tinted, never rgba(0,0,0,...))

Need a layout width?
├─ Dialog/modal       → --layout-xs (28rem)
├─ Sidebar/form       → --layout-sm (40rem)
├─ Single-column      → --layout-md (52rem)
├─ Mid-width listing  → --layout-lg (60rem)
├─ Card grid          → --layout-xl (72rem)
└─ Prompt input       → --layout-prompt (40rem)
  Prefer .container-sm / .container-md / .container-lg / .container-xl classes.

Need spacing/sizing?
└─ --spacing-0 through --spacing-24

Need typography?
├─ Family → --font-family-display / body / mono
├─ Size   → --font-size-xs through --font-size-5xl
├─ Weight → --font-weight-normal / medium / semibold / bold
└─ Height → --line-height-tight / snug / normal / relaxed
```

### Three brand color rules (memorize these)

1. **No pure neutrals.** Every surface carries a trace of the brand's cyan-blue hue (~198deg). Use `--color-surface`, never `white` or `#f5f5f5`.
2. **Brand-tinted shadows.** Use `--shadow-*` tokens. Never write `rgba(0, 0, 0, ...)`.
3. **Brand-tinted interactions.** Hover/focus/active use `--color-hover`, `--color-active`, `--color-focus-ring`. Never a flat grey overlay.

---

## 3. Reviewing for token violations

When reviewing CSS/HTML, scan for these violations:

### Auto-detect patterns (search regex)

```
#[0-9a-fA-F]{3,8}        → hard-coded hex color
rgb\(|rgba\(              → hard-coded rgb/rgba (check it's not inside brand-tokens.css)
hsl\(|hsla\(              → hard-coded hsl
: white;|: black;         → named color keywords
max-width:\s*\d+          → hard-coded layout width (check exceptions)
```

### Review workflow

1. **Search** the file for the patterns above.
2. **Skip** permitted exceptions: `transparent`, `currentColor`, `inherit`, token definition files, SVG fill/stroke, charting libraries.
3. **For each violation**, replace with the closest token:
   - Map the hard-coded value to the token reference table (see [reference.md](reference.md))
   - If no exact match exists, find the semantically correct token
4. **Verify** shadows include brand tint, not `rgba(0,0,0,...)`.
5. **Verify** interactive states use token overlays.
6. **Run linter** after all replacements.

---

## 4. Responsive layout patterns

### Page container

```html
<main class="container-md">
  <!-- single-column content up to 832px, centered -->
</main>
```

### Two-panel layout (form + preview)

```css
.workspace {
  display: flex;
  gap: var(--spacing-6);
  max-width: var(--layout-xl);
  margin: 0 auto;
  padding: var(--spacing-4);
}

.workspace__form {
  flex: 1;
  min-width: 0;
}

.workspace__preview {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .workspace {
    flex-direction: column;
  }
}
```

### Card grid

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
  max-width: var(--layout-xl);
  margin: 0 auto;
}
```

### Utility class combos for common patterns

| Pattern | Classes |
|---------|---------|
| Horizontal bar | `flex-row items-center flex-between gap-3` |
| Stacked form fields | `flex-col gap-4` |
| Centered narrow content | `container-sm` |
| Card with scroll | `flex-col gap-2 scrollable` |
| Screen-reader-only label | `visually-hidden` |

---

## 5. Accessibility

### Focus management

Every interactive element must have a visible focus indicator:

```css
.interactive-element:focus-visible {
  outline: none;
  box-shadow: var(--color-focus-ring);
}
```

Never remove focus styles without replacing them. `outline: none` is only allowed when paired with `box-shadow: var(--color-focus-ring)`.

### Color contrast requirements

| Element | Minimum ratio | Standard |
|---------|--------------|----------|
| Body text | 4.5:1 | WCAG AA |
| Large text (18px+ bold, 24px+ regular) | 3:1 | WCAG AA |
| UI components and borders | 3:1 | WCAG AA |
| Decorative elements | No requirement | — |

The brand tokens are designed to meet these ratios. Hard-coding colors risks breaking contrast.

### Semantic HTML checklist

- Use `<button>` for actions, `<a>` for navigation — never `<div onclick>`
- Headings follow hierarchy (`h1` > `h2` > `h3`), no skipping levels
- Form inputs have associated `<label>` elements (or `aria-label`)
- Lists use `<ul>`/`<ol>` + `<li>`
- Landmark roles: `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`
- Images have `alt` text (empty `alt=""` for decorative)
- Use `aria-live="polite"` for dynamic content updates (toasts, status)
- `.visually-hidden` for screen-reader-only text

### Keyboard navigation

- All interactive elements reachable via Tab
- Escape closes modals/dropdowns
- Arrow keys navigate within composite widgets (tabs, menus)
- Enter/Space activate buttons and controls

---

## 6. CSS naming convention

Use BEM for all component-scoped CSS:

| Level | Format | Example |
|-------|--------|---------|
| Block | `.component-name` | `.user-card` |
| Element | `.component-name__element` | `.user-card__avatar` |
| Modifier | `.component-name--modifier` | `.user-card--compact` |

Combine BEM with utility classes in markup:

```html
<div class="user-card user-card--compact flex-row items-center gap-3">
  <img class="user-card__avatar" ... />
  <span class="user-card__name truncate">{{ name }}</span>
</div>
```

---

## Additional resources

- For full token names and value tables, see [reference.md](reference.md)
- Brand token definitions: `src/styles/brand-tokens.css`
- Utility class definitions: `src/styles/utilities.css`
- Design specification: `specs/design.md`
