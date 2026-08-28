---
name: Kinetic Logic
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#611e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#872d00'
  on-tertiary-container: '#ffa583'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-tracking:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for high-velocity logistics and data-heavy environments. The brand personality is **Professional, Efficient, and Data-Driven**, prioritizing clarity over decoration. It utilizes a **Corporate Modern** style with a focus on functional aesthetics: high legibility, systematic spacing, and clear state indicators.

The user experience should evoke a sense of **uninterrupted progress**. Every interaction must feel snappy and precise, reflecting the real-time nature of express shipping. White space is used strategically to separate complex data sets, preventing cognitive overload for dispatchers and customers alike.

## Colors

The color palette is anchored in **Cobalt Blue**, signifying technological reliability and institutional trust. **Warm Amber** serves as the energetic accent, specifically reserved for active transit states and primary conversion points. 

The neutral palette uses **Cold Grays (Slate/Zinc)** to maintain a clean, surgical atmosphere. Use #F8FAFC for main application backgrounds and #FFFFFF for cards and containers to create subtle contrast. Semantic colors follow industry standards to ensure that delivery status updates (Delivered, Delayed, Exception) are immediately recognizable without reading the text.

## Typography

This design system uses **Inter** exclusively to leverage its exceptional legibility at small sizes and its neutral, systematic tone. 

- **Numerical Data:** Tracking numbers and timestamps should use `label-md` or `code-tracking` for high visibility.
- **Hierarchy:** Use FontWeight 600 for all interactive elements and headlines to differentiate from informational body text.
- **Scale:** Large display sizes are reserved for high-level dashboard metrics; tracking details should stick to `body-md` and `body-sm` to maximize information density.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile devices. 

- **Rhythm:** An 8px linear scale (incremented by 4px for tight areas) ensures consistent vertical rhythm.
- **Information Density:** Use `md` (16px) padding for standard cards and `sm` (8px) for condensed data tables.
- **Breakpoints:**
  - **Mobile:** < 640px (16px margins)
  - **Tablet:** 641px - 1024px (24px margins)
  - **Desktop:** > 1025px (40px margins, max-width 1440px)

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. 

1.  **Background:** #F8FAFC (Lowest)
2.  **Surface:** #FFFFFF with a 1px border (#E2E8F0).
3.  **Elevation (Small):** Used for standard tracking cards. `0px 1px 2px 0px rgba(15, 23, 42, 0.05)`.
4.  **Elevation (Medium):** Used for dropdowns and popovers. `0px 4px 6px -1px rgba(15, 23, 42, 0.1)`.

Avoid heavy shadows. Rely on the #E2E8F0 (Slate 200) border to define boundaries, using shadows only to indicate interactivity or temporary overlay states.

## Shapes

The shape language is primarily **Rounded (8px / 0.5rem)** to provide a modern, approachable feel that remains professional. 

- **Standard Elements:** Buttons, Inputs, and Cards use `rounded-lg` (8px).
- **Status Badges:** Use `rounded-full` (Pill-shaped) to distinguish them from interactive buttons.
- **Large Containers:** Modals or large dashboard sections use `rounded-xl` (24px) for a more distinct structural presence.

## Components

### Buttons
- **Primary:** Cobalt Blue background, White text. 8px roundedness. Subtle scale-down effect (98%) on click.
- **CTA:** Warm Amber background, White text. Reserved for "Ship Now" or "Resolve Issue."
- **Secondary:** White background, Slate 200 border, Slate 900 text.

### Inputs & Selects
- 1px border (#E2E8F0). Focus state uses 2px Cobalt Blue ring with 4px offset.
- Labels use `label-sm` in Slate 600.

### Tracking Cards
- White background, Slate 200 border. 
- Left-edge accent strip: 4px wide, color-coded by status (Green for delivered, Amber for in-transit, Red for exception).

### Status Chips (Pills)
- Height: 24px.
- Background: 10% opacity of the semantic color.
- Text: 100% opacity of the semantic color, `label-sm` weight.

### Data Tables
- Row hover state: #F1F5F9 (Slate 100).
- Border-bottom only for rows to maintain a clean horizontal flow.