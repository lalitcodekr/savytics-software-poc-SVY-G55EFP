# DESIGN.md

## Mini Project Tracker: "Playful Geometric" Design System

| | |
|---|---|
| **Project** | Mini Project Tracker (Savytics assessment, Candidate ID: SVY-G55EFP) |
| **Companion docs** | `PRD.md`, `TECHSTACK.md` |
| **Stack assumed** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui (Radix) |
| **Style source** | "Playful Geometric" design prompt, adapted for a task-management application |
| **Authority** | The tokens in Section 3 are authoritative. Where this document and the stack conflict, the stack and the PRD's content win. |

---

## 1. How This Document Adapts the Source Prompt

The original prompt describes a **marketing page** (hero, shape assembly, process strip, comparison tickets, back cover). The Mini Project Tracker is a **single-screen application** (dashboard, toolbar, task list, forms). This document keeps the visual language and rebuilds the layout vocabulary around the PRD's actual features.

| Source Prompt Element | Used In This Project As |
|-----------------------|-------------------------|
| Wide opening heading beside a shape assembly | App header: product title and a short line, with a small static shape cluster |
| Fact strip across layered bases | **Dashboard stat tiles** (Total, To Do, In Progress, Done) |
| Shared white "book" with violet offset backing and colored tab | **Task panel** holding the toolbar and task list; the tab reads "Tasks" |
| Numbered process strip | **Not used** (no sequence in this product). Numbered shapes appear only in the README walkthrough, if at all |
| Pale-mint benefits panel | Dashboard background band or empty-state panel |
| Speech-like quotation panels | **Not used.** The success toast may borrow the speech-bubble tail |
| Comparison tickets | **Selected filter chips and the status selector** (Selection = pale-violet fill and violet shadow) |
| Disclosure rows | Optional "Advanced filters" disclosure on mobile |
| Mint back-cover shape with confetti, slate footer | Slim footer with a curved top; confetti limited to the empty state |
| Editorial photographs with arched crops | **Not used.** The product has no photography; geometric pieces carry the personality instead |
| Hero scale of 62 to 102 px | Reduced for an app (see Section 4); the product UI must stay compact and scannable |

**Not in scope:** invented marketing copy, testimonials, pricing, or extra sections. All text comes from the PRD (task titles, statuses, priorities, messages).

---

## 2. Design Principles

1. **Function first, personality second.** Task data (title, status, priority) is always the most legible element on screen. Shapes are decorative and sparse.
2. **Outlined and offset.** Every interactive surface has a visible dark outline and a hard (unblurred) offset shadow. No blur, glass, or gradients.
3. **One main action color.** Violet is for primary actions and selection. Pink, amber, and mint label status and priority and decorate. Do not spread all accents equally across every area.
4. **Meaning never depends on color alone.** Status and priority always show a text label and a distinct shape or icon.
5. **Calm motion.** Hover lift and press feedback only. Everything else is still.
6. **Same shape language everywhere.** One broad radius family and one border width per level; avoid a different card shape for each type of content.

---

## 3. Design Tokens (Authoritative)

### 3.1 CSS Variables

Place in `src/app/globals.css`.

```css
:root {
  /* Color */
  --dp-color-ground: #fffdf5;            /* page background (warm paper) */
  --dp-color-panel: #ffffff;             /* reading surfaces */
  --dp-color-ink: #253044;               /* text */
  --dp-color-outline: #252b3a;           /* borders and hard shadows */
  --dp-color-accent: #6434df;            /* primary actions, focus, selection text */
  --dp-color-accent-secondary: #ff78c5;  /* pink: High priority, decoration */
  --dp-color-accent-warm: #ffd05b;       /* amber: Medium priority, To Do, decoration */
  --dp-color-accent-fresh: #9bf1cd;      /* mint: Done, Low priority, success */
  --dp-color-field-soft: #e9fff5;        /* pale mint band */
  --dp-color-selection: #f1ebff;         /* pale violet: selected state */
  --dp-color-rule-muted: #b8b6c5;        /* decorative rules only, never text */

  /* Typography */
  --dp-typography-display: "PlayfulGeometricDisplay", sans-serif;
  --dp-typography-reading: "PlayfulGeometricReading", sans-serif;
  --dp-typography-reading-compact: 16px;
  --dp-typography-label: 14px;
  --dp-typography-metadata: 13px;
  --dp-typography-reading-leading: 1.65;

  /* Spacing, shape, motion */
  --dp-spacing-gap-compact: 12px;
  --dp-radius-corner: 17px;
  --dp-border-outline-width: 3px;
  --dp-border-detail-width: 2px;
  --dp-motion-interaction: 180ms;

  /* Derived (project additions; not part of the source token list) */
  --dp-shadow-offset: 5px;               /* default hard offset */
  --dp-shadow-offset-sm: 3px;            /* small pieces, mobile */
  --dp-radius-panel: 28px;               /* large "book" containers */
  --dp-radius-pill: 999px;
  --dp-color-danger: #ff78c5;            /* destructive actions reuse pink with a text label */
  --dp-focus-ring: 0 0 0 3px var(--dp-color-ground), 0 0 0 6px var(--dp-color-accent);
}
```

Derived values are the only additions. They are derived from existing tokens (pink reused for destructive actions) to avoid introducing new colors.

### 3.2 Tailwind CSS v4 Theme Mapping

```css
@import "tailwindcss";

@theme inline {
  --color-ground: var(--dp-color-ground);
  --color-panel: var(--dp-color-panel);
  --color-ink: var(--dp-color-ink);
  --color-outline: var(--dp-color-outline);
  --color-accent: var(--dp-color-accent);
  --color-pink: var(--dp-color-accent-secondary);
  --color-amber: var(--dp-color-accent-warm);
  --color-mint: var(--dp-color-accent-fresh);
  --color-mint-soft: var(--dp-color-field-soft);
  --color-selection: var(--dp-color-selection);
  --color-rule: var(--dp-color-rule-muted);

  --font-display: var(--dp-typography-display);
  --font-reading: var(--dp-typography-reading);

  --radius-corner: var(--dp-radius-corner);
  --radius-panel: var(--dp-radius-panel);

  --shadow-hard: var(--dp-shadow-offset) var(--dp-shadow-offset) 0 0 var(--dp-color-outline);
  --shadow-hard-sm: var(--dp-shadow-offset-sm) var(--dp-shadow-offset-sm) 0 0 var(--dp-color-outline);
  --shadow-hard-accent: var(--dp-shadow-offset) var(--dp-shadow-offset) 0 0 var(--dp-color-accent);
}
```

If you use Tailwind v3, put the same values in `tailwind.config.ts` under `theme.extend`.

### 3.3 shadcn/ui Variable Mapping

| shadcn variable | Token |
|-----------------|-------|
| `--background` | `--dp-color-ground` |
| `--foreground` | `--dp-color-ink` |
| `--card`, `--popover` | `--dp-color-panel` |
| `--primary` | `--dp-color-accent` |
| `--primary-foreground` | `#ffffff` |
| `--secondary` | `--dp-color-selection` |
| `--accent` | `--dp-color-accent-fresh` |
| `--destructive` | `--dp-color-accent-secondary` (with ink text) |
| `--border`, `--input` | `--dp-color-outline` |
| `--ring` | `--dp-color-accent` |
| `--radius` | `--dp-radius-corner` |

---

## 4. Typography

### 4.1 Fonts

| Role | Family | Used For |
|------|--------|----------|
| Display | **Host Grotesk** (heavy weights), bound to `"PlayfulGeometricDisplay"` | Product title, dashboard numbers, panel and dialog headings |
| Reading | **Instrument Sans**, bound to `"PlayfulGeometricReading"` | Task text, labels, controls, messages |

Load both with `next/font/google` and expose them under the token names:

```ts
// src/app/fonts.ts
import { Host_Grotesk, Instrument_Sans } from "next/font/google";

export const display = Host_Grotesk({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-dp-display",
});

export const reading = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dp-reading",
});
```

```css
:root {
  --dp-typography-display: var(--font-dp-display), "PlayfulGeometricDisplay", sans-serif;
  --dp-typography-reading: var(--font-dp-reading), "PlayfulGeometricReading", sans-serif;
}
```

Apply both `variable` class names to `<html>`. Confirm the weight range available for each family in `next/font` at build time; adjust the `weight` arrays if a weight is unavailable.

### 4.2 Scale (App-Adapted)

| Element | Size | Weight | Leading | Tracking | Font |
|---------|------|--------|---------|----------|------|
| Product title (header) | `clamp(2.25rem, 5vw + 1rem, 4rem)` (36 to 64 px) | 800 | 1.0 to 1.05 | -0.03em | Display |
| Dashboard number | `clamp(2rem, 3vw + 1rem, 3rem)` | 800 | 1.0 | -0.02em | Display |
| Panel / dialog heading (h2) | 24 to 28 px | 800 | 1.15 | -0.02em | Display |
| Task title | 17 to 18 px | 700 | 1.3 | 0 | Reading |
| Body / description | 16 px (`--dp-typography-reading-compact`) | 400 | 1.65 | 0 | Reading |
| Label / button | 14 px (`--dp-typography-label`) | 600 to 700 | 1.3 | 0.01em | Reading |
| Metadata (dates, counts) | 13 px (`--dp-typography-metadata`) | 500 | 1.4 | 0 | Reading |

Notes:
- The source scale of 62 to 102 px is for marketing hero text. The product title is capped at 64 px so the dashboard and list remain above the fold.
- Never go below 13 px. At very narrow widths reduce heading sizes only, not labels.
- Task descriptions clamp to 2 lines in the list view (`line-clamp-2`) and show in full in the edit dialog.

---

## 5. Surfaces, Outlines, and Shadows

| Level | Fill | Border | Shadow | Radius | Used For |
|-------|------|--------|--------|--------|----------|
| Ground | `ground` | none | none | none | Page background |
| Panel (book) | `panel` | 3 px `outline` | 8 px hard offset in `accent` (violet backing) | 28 px | Main task panel |
| Tile | colored fill | 3 px `outline` | 5 px hard offset in `outline` | 17 px | Stat tiles, empty-state card, dialog |
| Row / card | `panel` | 2 px `outline` | 3 px hard offset in `outline` | 17 px | Individual task entries |
| Control | colored fill | 3 px `outline` | 5 px hard offset in `outline` | pill or 17 px | Buttons, inputs, selects |
| Badge | colored fill | 2 px `outline` | none | pill | Status and priority labels |
| Footer | `ink` | none | none | curved top (48 px) | Footer |

Rules:
- Shadows are **hard** (zero blur) and offset down and right.
- Use `rule` (#b8b6c5) only for decorative dividers and dashed placeholders, never for text or essential borders.
- Keep at least 16 px of open ground between separate pieces so shapes read clearly.

---

## 6. Layout and Page Structure

The app is one route (`/`) with clear regions. Content is exactly what the PRD defines.

### 6.1 Desktop (above 1100 px)

```
┌───────────────────────────────────────────────────────────────┐
│ HEADER   Product title + one-line subtitle    [ + New Task ]  │
│          (static shape cluster on the right edge)             │
├───────────────────────────────────────────────────────────────┤
│ DASHBOARD  ┌───────┐ ┌───────┐ ┌───────────┐ ┌───────┐        │
│ (fact      │ Total │ │ To Do │ │In Progress│ │ Done  │        │
│  strip)    └───────┘ └───────┘ └───────────┘ └───────┘        │
├───────────────────────────────────────────────────────────────┤
│ TASK PANEL ("book", violet backing, "Tasks" tab)              │
│ ┌───────────────────────────────────────────────────────────┐ │
│ │ Toolbar: [ Search........ ] [Status ▾] [Priority ▾] Clear │ │
│ │ ───────────────────────────────────────────────────────── │ │
│ │ Task row  ........................ [Status] [Priority] ⋯  │ │
│ │ Task row  ........................ [Status] [Priority] ⋯  │ │
│ │ Pagination                                                │ │
│ └───────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│ FOOTER (slate, curved top, pale text)                         │
└───────────────────────────────────────────────────────────────┘
```

- Content max width: 1200 px, centered, 24 to 40 px side padding.
- Header uses a slightly wider text column beside a small, static shape cluster (a circle, a triangle, and an arch; 3 pieces only, no more).
- Stat tiles sit on a **fact strip**: layered pale-mint base behind the tiles with 12 px gap.
- Task panel is the single "book": one white shape with a violet offset backing and a small colored tab labelled "Tasks".

### 6.2 Tablet (760 to 1100 px)
- Tighten grid gaps and shape spacing.
- Stat tiles stay in one row of four (or 2 by 2 if a label wraps).
- Toolbar wraps: search takes a full row, filters share the second row.

### 6.3 Mobile (below 760 px)
- Header stacks: title, subtitle, then a full-width "New Task" button.
- Shape cluster shrinks and moves behind or beside the title without overlapping text.
- Stat tiles in a **2 by 2 grid**.
- Task rows become **stacked cards**: title on top, badges below, actions in a "More" menu or icon buttons sized at least 44 px.
- Toolbar controls stack full width; filters may collapse into an "Filters" disclosure row.
- Book silhouette is preserved with narrower insets (12 to 16 px) and a 3 px offset instead of 8 px.
- Footer keeps two columns where text fits.

---

## 7. Component Specifications

### 7.1 Buttons

| Variant | Fill | Text | Used For |
|---------|------|------|----------|
| Primary | `accent` (#6434df) | white | New Task, Save, Create |
| Secondary | `panel` | `ink` | Cancel, Clear filters, Retry |
| Warm | `amber` | `ink` | Optional secondary emphasis |
| Destructive | `pink` | `ink` | Delete (always labelled "Delete") |

- Shape: pill or 17 px radius; 3 px `outline` border; 5 px hard offset shadow in `outline`.
- Min height 44 px; padding 12 px by 20 px; 14 px label, weight 700.
- **Hover:** translate (-1px, -1px) and increase offset to 6 px.
- **Pressed:** translate (2px, 2px) and reduce offset to 2 px.
- **Disabled:** 55% opacity, no hover movement, `cursor-not-allowed`, offset reduced to 2 px. Show a spinner and keep the label while submitting.
- **Focus-visible:** `--dp-focus-ring` (a ground-colored inner ring and a 3 px violet outer ring) so focus stays visible beyond the shadow.

### 7.2 Form Fields (Input, Textarea, Select, Search)

- 44 px minimum height; 3 px `outline` border; radius 17 px; `panel` fill; 3 px hard offset (small).
- Label above, 14 px, weight 600; helper or error text below, 13 px.
- **Error state:** border stays `outline`, add a `pink` offset shadow, an error icon, and error text in `ink` (not pink text). The input has `aria-invalid="true"` and `aria-describedby` pointing to the message.
- **Search:** leading magnifier icon, trailing clear (x) button with a 44 px hit area, 300 ms debounce, `role="search"` wrapper.
- **Selects:** use shadcn `Select` (Radix); the trigger follows the same outline and offset; the open menu uses the Tile surface.
- **Title counter:** show remaining characters (100 max) in metadata size.

### 7.3 Status and Priority Badges

Badges use a text label **and** a shape icon so color is never the only signal.

| Value | Fill | Icon (shape) | Text |
|-------|------|--------------|------|
| Status: To Do | `amber` | Circle (outlined) | "To Do" |
| Status: In Progress | `accent` tint (`selection`) with violet text | Half-filled circle | "In Progress" |
| Status: Done | `mint` | Check mark in circle | "Done" |
| Priority: Low | `mint` | Down chevron | "Low" |
| Priority: Medium | `amber` | Dash | "Medium" |
| Priority: High | `pink` | Up chevron or triangle | "High" |

- 2 px `outline` border, pill radius, 13 to 14 px label, weight 600, 6 px by 12 px padding.
- Status and priority badges must differ visibly when side by side: status badges use a **leading circle icon**, priority badges a **leading chevron/dash**.
- All label text is `ink` on the fills above except "In Progress", which uses `accent` on `selection` (5.83:1).

### 7.4 Stat Tiles (Dashboard)

- Tile surface with 3 px outline and 5 px offset. Content: small label (14 px), large number (Display, 32 to 48 px), optional 13 px caption.
- **Total:** `panel` fill. **To Do:** `amber`. **In Progress:** `selection` with violet offset. **Done:** `mint`.
- A thin geometric mark (circle, half-circle, check) sits in a corner as decoration with `aria-hidden="true"`.
- Numbers update live after create, edit, or delete. Announce changes with a polite live region: `aria-live="polite"` on the summary container.
- Loading: skeleton blocks of the same tile shape (see Section 8).
- Optional (PRD P2): completion percentage as a simple outlined progress bar (3 px outline, mint fill, text value always shown).

### 7.5 Task Row / Card

```
┌─────────────────────────────────────────────────────────────┐
│ ○ Title of the task (bold, one line, truncated)             │
│   Two lines of description in muted ink…                    │
│   [◐ In Progress] [▲ High]        Updated 3 Nov   [✎] [🗑]  │
└─────────────────────────────────────────────────────────────┘
```

- Row surface: `panel`, 2 px outline, 3 px offset, radius 17 px; 12 px gap between rows.
- Hover: translate (-1px, -1px) and increase offset to 4 px. Entire row is not a link; the Edit and Delete icon buttons are the controls.
- **Quick status change (PRD P1):** the status badge is a button that opens a small menu (To Do, In Progress, Done), keyboard operable.
- Icon buttons: 44 px hit area, `aria-label` such as "Edit task: {title}" and "Delete task: {title}".
- Done tasks: title gets a line-through and 70% ink opacity; keep contrast above 4.5:1 for text.
- Metadata (dates) 13 px, `ink` at 75% opacity (contrast stays above 4.5:1 on white).

### 7.6 Dialogs (Create, Edit, Delete Confirm)

- Use shadcn `Dialog` (Radix) for focus trap, Escape to close, and focus return.
- Surface: Tile style (3 px outline, 8 px offset in `accent`), radius 28 px, max width 520 px, `panel` fill.
- Header: Display heading; a small colored tab or shape in the corner, `aria-hidden`.
- Footer: Secondary "Cancel" left or first, Primary action last. On mobile the dialog becomes a bottom sheet with a 17 px top radius or a full-width modal with 16 px insets.
- **Delete confirm:** short sentence including the task title, "Cancel" (focused by default) and a pink "Delete" button.
- Backdrop: solid `ink` at 40% opacity; no blur.

### 7.7 Toasts (Success and Error)

- Appear bottom-right on desktop, bottom-center on mobile; 3 px outline, 5 px offset, radius 17 px.
- **Success:** `mint` fill, check icon, text like "Task created".
- **Error:** `pink` fill, alert icon, text with a "Retry" button where relevant.
- May include a small speech-bubble tail as a decorative corner; keep it simple.
- Use `role="status"` for success and `role="alert"` for errors. Auto-dismiss success after about 4 seconds; keep errors until dismissed. Pause dismissal on hover and focus.

### 7.8 Filter Chips and Selected State

- Status and priority filters may render as chip groups on wide screens: each chip is a small control (2 px outline, pill).
- **Selected:** `selection` fill (#f1ebff), violet offset shadow, and a leading check mark. Selection is communicated by `aria-pressed` or `aria-checked` as well as visuals.
- "Clear filters" is a Secondary button, visible only when any filter or search is active.

### 7.9 Pagination (PRD P1)

- Previous and Next as Secondary buttons plus a "Page X of Y" label in metadata size.
- Disabled states are visibly muted and have `aria-disabled`.

### 7.10 Footer

- Dark slate (`ink`) inset with a broad curved top (about 48 px radius) and pale text (`ground`).
- Content: product name, "Built for the Savytics technical assessment", and links to the repository and README if appropriate. Do not invent additional links or claims.
- A few geometric pieces (confetti) may sit at the outer edge of the back-cover area; they are static and `aria-hidden`.

---

## 8. Required UI States

Every async region (stat tiles, task list) must show all four states.

| State | Visual | Behavior |
|-------|--------|----------|
| **Loading** | Skeleton shapes matching tile and row dimensions: `rule`-colored 2 px dashed outline, pale fill. Static (no shimmer) or a very subtle opacity pulse removed under reduced motion | `aria-busy="true"` on the region; a visually hidden "Loading tasks" label |
| **Empty (no tasks yet)** | Tile on `mint-soft` background with 2 to 3 static geometric pieces, a short heading, a sentence, and a Primary "New Task" button | Focus is not moved automatically |
| **No results (search or filters active)** | Same tile style, different copy, plus a "Clear filters" Secondary button | Announce result count change via a polite live region |
| **Error** | Tile with `pink` offset shadow, alert icon, clear message, and a "Retry" Secondary button | `role="alert"`; retry re-fetches without a full page reload |
| **Success** | Toast (Section 7.7), updated list and counts | `role="status"` |

Suggested copy (edit freely): "No tasks yet", "Create your first task to get started.", "No tasks match your search.", "Something went wrong while loading tasks."

---

## 9. Motion

| Interaction | Behavior | Duration |
|-------------|----------|----------|
| Button hover | Lift (-1px, -1px), offset +1px | `--dp-motion-interaction` (180 ms) |
| Button / row press | Move (2px, 2px), offset reduced | 180 ms |
| Dialog and toast entry | Opacity and a 4 px vertical shift only | 180 ms |
| Everything else (shapes, book layers, confetti, skeletons) | **Still** | none |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. Responsive Behavior Summary

| Breakpoint | Changes |
|------------|---------|
| **Above 1100 px** | Full layout (Section 6.1); max width 1200 px |
| **1100 px and below** | Tighten grid gaps and shape spacing; reduce shape cluster size |
| **760 px and below** | Header stacks; stat tiles 2 by 2; toolbar controls stack; rows become stacked cards; dialogs become bottom sheets; shadow offsets shrink to 3 px; panel insets 12 to 16 px |
| **480 px and below** | Reduce display heading sizes and control padding only; labels stay at 13 to 14 px; keep the 3 px outline and hard offset; hit areas stay 44 px |

Verification widths: **360, 768, 1280 px** (matches PRD US-12). No horizontal scrolling at any width; long titles truncate with an ellipsis, and descriptions clamp.

Tailwind usage: define custom screens if you want an exact match, for example `min-[760px]:` and `min-[1100px]:`, or map them to `md` and `xl` in your theme.

---

## 11. Accessibility

### 11.1 Contrast (WCAG 2.2, computed from the tokens)

| Pair | Ratio | Result |
|------|-------|--------|
| Ink on ground | 13.0 : 1 | Pass (AAA) |
| Ink on panel | 13.3 : 1 | Pass (AAA) |
| White on violet (primary button) | 6.8 : 1 | Pass (AA) |
| Violet on panel / ground | 6.8 : 1 / 6.7 : 1 | Pass (AA) |
| Violet on selection | 5.8 : 1 | Pass (AA) |
| Ink on pink | 5.5 : 1 | Pass (AA) |
| Ink on amber | 9.1 : 1 | Pass (AAA) |
| Ink on mint | 10.0 : 1 | Pass (AAA) |
| Ink on mint-soft | 12.7 : 1 | Pass (AAA) |
| Pale text (ground) on slate footer | 13.0 : 1 | Pass (AAA) |
| Outline on ground | 13.9 : 1 | Pass (non-text 3:1 required) |
| `rule-muted` on ground | 2.0 : 1 | **Fails for text and essential boundaries**; decorative use only |

### 11.2 Checklist
- [ ] All controls reachable and operable by keyboard; logical tab order matches reading order
- [ ] Visible focus ring on every interactive element (ring extends beyond the hard shadow)
- [ ] Touch targets at least 44 by 44 px
- [ ] Status and priority use text and shape, not color alone
- [ ] Decorative shapes have `aria-hidden="true"` and are not focusable
- [ ] Form errors linked with `aria-describedby`; `aria-invalid` set
- [ ] Dialogs trap focus, close on Escape, and return focus to the trigger
- [ ] Live regions announce toast messages, result counts, and dashboard changes
- [ ] Heading order is sequential (h1 product title, h2 panel headings)
- [ ] `prefers-reduced-motion` honored
- [ ] Zoom to 200% without loss of content or function
- [ ] Lighthouse accessibility score of at least 90 (PRD target)

---

## 12. Implementation Guide

### 12.1 Suggested Utility Classes

Define a few reusable classes (via `@layer components`) so components stay consistent:

```css
@layer components {
  .dp-surface {
    background: var(--dp-color-panel);
    border: var(--dp-border-outline-width) solid var(--dp-color-outline);
    border-radius: var(--dp-radius-corner);
    box-shadow: var(--dp-shadow-offset) var(--dp-shadow-offset) 0 var(--dp-color-outline);
  }
  .dp-book {
    background: var(--dp-color-panel);
    border: var(--dp-border-outline-width) solid var(--dp-color-outline);
    border-radius: var(--dp-radius-panel);
    box-shadow: 8px 8px 0 var(--dp-color-accent);
  }
  .dp-btn {
    min-height: 44px;
    padding: 0.75rem 1.25rem;
    font: 700 var(--dp-typography-label) var(--dp-typography-reading);
    border: var(--dp-border-outline-width) solid var(--dp-color-outline);
    border-radius: var(--dp-radius-pill);
    box-shadow: var(--dp-shadow-offset) var(--dp-shadow-offset) 0 var(--dp-color-outline);
    transition: transform var(--dp-motion-interaction), box-shadow var(--dp-motion-interaction);
  }
  .dp-btn:hover { transform: translate(-1px, -1px); box-shadow: 6px 6px 0 var(--dp-color-outline); }
  .dp-btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--dp-color-outline); }
  .dp-btn:focus-visible { outline: none; box-shadow: var(--dp-focus-ring); }
}
```

Combine the focus ring with the hard shadow if both should remain visible:
`box-shadow: var(--dp-focus-ring), var(--dp-shadow-offset) var(--dp-shadow-offset) 0 var(--dp-color-outline);`

### 12.2 Suggested Component Files

```
src/components/ui/          # shadcn primitives, restyled with the tokens
src/components/shapes/      # <ShapeCluster />, <Confetti />   (static, aria-hidden)
src/features/tasks/         # TaskPanel, TaskToolbar, TaskRow, TaskDialog, StatusBadge, PriorityBadge
src/features/dashboard/     # StatTile, StatStrip
src/components/feedback/    # EmptyState, ErrorState, Skeletons, Toaster
```

### 12.3 Shape Pieces
- Build shapes as inline SVG or CSS (circle, triangle, arch, block); each 24 to 120 px.
- Fill with accent colors, 3 px outline; no gradients, blur, or animation.
- Limit: three pieces in the header cluster, two to three in the empty state, a few at the footer edge. Never place shapes over task text or controls.

### 12.4 Order of Work
1. Add tokens, fonts, and Tailwind theme mapping.
2. Restyle shadcn primitives (Button, Input, Select, Dialog, Toast).
3. Build Badge, StatTile, TaskRow.
4. Compose the page shell (header, strip, book panel, footer).
5. Add loading, empty, no-results, and error states.
6. Run the responsive and accessibility checks (Sections 10 and 11) at 360, 768, and 1280 px.

---

## 13. Do and Do Not

| Do | Do Not |
|----|--------|
| Keep one outline weight per level (3 px primary, 2 px detail) | Mix many border widths or radii |
| Use hard offset shadows only | Use blur, glow, glass, or gradients |
| Reserve violet for actions and selection | Use all four accents equally in every region |
| Pair every color signal with text and a shape | Rely on color alone for status or priority |
| Leave open ground between pieces | Crowd shapes around content |
| Use static decorative geometry | Animate confetti or shapes |
| Let the product's real content set the tone | Add playful copy, claims, or sections not in the PRD |
| Keep geometry `aria-hidden` | Make decorative pieces focusable or announced |

---

## 14. Verification and README Evidence

For the assignment's README ("relevant screenshots"), capture and store in `docs/screenshots/`:

| Screenshot | Width |
|------------|-------|
| Dashboard and task list (populated) | 1280 px |
| Same view on mobile | 360 px |
| Create / edit dialog with a validation error | 1280 px or 360 px |
| Empty state | 1280 px |
| Loading state | 1280 px |
| Error state | 1280 px |
| Filtered view with no results | 360 px |

Final design checks before submission:
- [ ] Tokens match Section 3 exactly (no stray hex values in components)
- [ ] Both fonts load and fall back gracefully
- [ ] All states in Section 8 verified at 360, 768, and 1280 px
- [ ] Keyboard-only walkthrough (create, edit, filter, delete) completed
- [ ] Reduced-motion mode checked
- [ ] Lighthouse accessibility score recorded

If an AI assistant helped with the visual implementation, note it in the README's AI-usage section as required by the assignment, and be ready to explain the token system and component structure in the walkthrough.
