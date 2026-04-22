---
name: front-end-design
description: >-
  Build, style, and review front-end UI using the project's brand design tokens
  and utility classes. Use when creating components, writing CSS/SCSS, reviewing
  markup for token violations, implementing responsive layouts, adding motion,
  or improving accessibility. Covers Angular standalone components and vanilla
  HTML/CSS. Emphasizes distinctive, production-grade interfaces that avoid
  generic AI aesthetics.
---

# Front-End Design

This skill enforces the project's brand design system and guides creation of distinctive, production-grade interfaces. Every visual decision — colors, shadows, typography, spacing, layout widths — must flow through the tokens defined in `src/styles/brand-tokens.css` and the utilities in `src/styles/utilities.css`. Beyond token compliance, every interface should feel *designed*: intentional, cohesive, and memorable.

**Mandatory companion rule:** Always read `.cursor/rules/brand-design-tokens.mdc` before writing any UI code. That rule is the single source of truth for token names and forbidden patterns.

## Quick-start checklist

Copy this checklist when starting any UI task:

```
- [ ] Read brand-design-tokens.mdc rule
- [ ] Define aesthetic direction (see §0 Design Thinking)
- [ ] Zero hard-coded color values (hex, rgb, rgba, hsl)
- [ ] Zero hard-coded max-width on containers
- [ ] All interactive states use token overlays
- [ ] Shadows use brand-tinted tokens, not rgba(0,0,0,…)
- [ ] BEM class naming: .component-name__element--modifier
- [ ] Utility classes used where practical
- [ ] Motion: meaningful transitions and micro-interactions present
- [ ] Keyboard navigable, focus ring visible
- [ ] Color contrast passes WCAG AA (4.5:1 text, 3:1 large/UI)
```

---

## 0. Design Thinking

Before writing code, commit to a clear aesthetic direction. Ask:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Choose a direction that fits the context — refined minimal, warm editorial, technical utilitarian, soft and approachable, bold geometric, etc. There are many flavors; pick one true to the project's context and execute it with precision.
- **Constraints**: Technical requirements (framework, performance, accessibility, email compatibility).
- **Differentiation**: What makes this interface feel *designed* rather than assembled? What's the one detail someone will remember?

### Principles

1. **Intentionality over intensity.** Bold maximalism and restrained minimalism both work — the key is committing fully to the chosen direction and executing every detail in service of it.
2. **Context-specific character.** Every interface should reflect its audience and purpose. A settings panel and a hero landing page demand different aesthetic treatments. Never apply the same visual recipe to everything.
3. **No generic AI aesthetics.** Avoid the telltale signs of AI-generated UI: overused font families (Inter, Roboto, Arial as display fonts), cliched purple-gradient-on-white color schemes, predictable card-grid layouts with identical border-radius, and cookie-cutter patterns that lack context-specific character. Each generation should vary — different tonal direction, different compositional approach.
4. **Match complexity to vision.** Maximalist designs need elaborate code with extensive animations and layered effects. Minimal designs need restraint, precision, and obsessive attention to spacing and typography. Elegance comes from executing the vision well, not from adding more.

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

## 2. Visual Quality Standards

### Typography

Use the brand font tokens (`--font-family-display`, `--font-family-body`, `--font-family-mono`) as the foundation. Within that system:

- Pair display and body families with intention — display for headings and hero text, body for readable content, mono for technical values.
- Use the full weight scale (`--font-weight-normal` through `--font-weight-bold`) to create clear typographic hierarchy, not just size changes.
- Apply `--line-height-tight` on headings, `--line-height-normal` on body, `--line-height-relaxed` on long-form — don't default everything to the same line height.
- Use `letter-spacing` and `text-transform` deliberately for labels, categories, and meta text — these small details create polish.

### Color & Theme

Work within the brand token palette, but use it with intention:

- Commit to a clear foreground/background relationship. Dominant brand colors with sharp accents outperform timid, evenly-distributed palettes.
- Use `--color-brand-primary` as a focal accent, not as wallpaper. A single well-placed accent line or element is more striking than coating everything in brand blue.
- Create depth with the surface scale: `--color-bg` → `--color-surface` → `--color-surface-raised` → `--color-surface-sunken`. Layered surfaces feel architectural.
- Feedback colors (`--color-brand-success`, `--color-brand-warning`, `--color-brand-error`) should appear only when semantically meaningful, never as decoration.

### Motion & Animation

Animations create delight and convey responsiveness. Prioritize CSS-only solutions for HTML/email contexts. For Angular components, use the framework's animation system or CSS transitions.

- **High-impact moments first**: A well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions. Focus energy on entry animations and state transitions.
- **Use brand transitions**: `--transition-fast` for hover/color changes, `--transition-base` for standard element transitions, `--transition-slow` for layout shifts and expand/collapse.
- **Scroll-triggered reveals**: Use `IntersectionObserver` (or Angular equivalents) for elements that animate into view on scroll. Fade + slight translate-Y is a reliable starting point; adapt to the aesthetic direction.
- **Hover states that surprise**: Go beyond simple color changes — subtle scale, shadow lift (`--shadow-sm` → `--shadow-md`), or border-color shifts add tactile feedback.
- **Restraint matters**: Every animation should have a purpose (guide attention, confirm action, reveal content). Gratuitous motion is worse than no motion.

```css
/* Staggered entry example */
.card-grid__item {
  opacity: 0;
  transform: translateY(var(--spacing-3));
  animation: card-enter 0.4s ease-out forwards;
}
.card-grid__item:nth-child(1) { animation-delay: 0s; }
.card-grid__item:nth-child(2) { animation-delay: 0.06s; }
.card-grid__item:nth-child(3) { animation-delay: 0.12s; }

@keyframes card-enter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover lift */
.interactive-card {
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}
.interactive-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Spatial Composition

Break away from predictable layouts when the context calls for it:

- **Asymmetry**: Offset grids, unequal column splits, and off-center hero text create visual interest. A 2:3 split is more dynamic than 1:1.
- **Generous negative space**: White space (brand-tinted via `--color-bg`) is not wasted space — it directs attention and creates breathing room.
- **Grid-breaking elements**: A full-bleed accent bar, an overlapping card, or an element that extends past its container adds energy to a layout.
- **Controlled density**: When content is dense (tables, dashboards), use tight `--spacing-2` / `--spacing-3` gaps with clear borders and surface-level differentiation rather than trying to add space that doesn't exist.

### Backgrounds & Visual Depth

Create atmosphere rather than defaulting to flat solid colors:

- Layer surfaces with the token scale (`--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`) to create a sense of depth.
- Use `--shadow-*` tokens to lift elements off the page — the brand-tinted shadows already provide warmth.
- Consider subtle background treatments that match the aesthetic: a very faint gradient between two surface tokens, a hairline border pattern, or a textured overlay at low opacity.
- For hero or splash areas, combine `--color-brand-subtle` backgrounds with generous spacing (`--spacing-16` to `--spacing-24`) for visual weight.

---

## 3. Writing CSS with tokens

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

## 4. Reviewing for token violations

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

## 5. Responsive layout patterns

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

## 6. Accessibility

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

## 7. CSS naming convention

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

## 8. Anti-patterns — what "AI slop" looks like

Avoid these patterns that signal generic, undesigned output:

| Anti-pattern | Why it fails | Instead |
|---|---|---|
| Inter / Roboto / Arial as display font | Overused, signals zero typographic thought | Use `--font-family-display` (project's chosen display face) |
| Purple gradient on white background | Cliched AI aesthetic with no brand connection | Work within the brand palette; accent with `--color-brand-primary` |
| Every card has identical `border-radius: 12px` | Monotonous, cookie-cutter feel | Vary radii by context: `--radius-sm` for inputs, `--radius-md` for cards, `--radius-lg` for modals |
| Evenly-distributed rainbow palette | No hierarchy, no focal point | Dominant neutral surfaces + sharp brand accent |
| Drop shadows on everything | Flat hierarchy, visual noise | Use shadows semantically: `--shadow-sm` for resting cards, `--shadow-md` on hover, `--shadow-xl` for modals |
| Same layout for every page | No spatial variety | Adapt composition to content: dense grids for listings, generous whitespace for editorial, asymmetric splits for tools |
| No animations at all | Static, lifeless | Add staggered entry, hover lifts, transition on state changes |
| Gratuitous particle effects / blobs | Decoration without purpose | Motion should guide attention or confirm actions |

**The test**: If you removed the logo, could someone still identify which project this belongs to? If not, the interface lacks character.

---

## Additional resources

- For full token names and value tables, see [reference.md](reference.md)
- Brand token definitions: `src/styles/brand-tokens.css`
- Utility class definitions: `src/styles/utilities.css`
- Design specification: `specs/design.md`
