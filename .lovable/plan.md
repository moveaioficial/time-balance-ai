

## Visual Overhaul Plan: Gradient Removal, Solid Blue Accent, Clean Backgrounds

This plan addresses the 4 corrections from the document: enlarged header branding, removal of all purple/blue gradients in favor of solid blue (#3B82F6), cleaner backgrounds without obvious round light circles, and a new "Mensagem" textarea in the contact form.

---

### 1. Header: Larger Logo and Typography

**File:** `src/components/layout/Header.tsx`

- Increase logo from `h-12 lg:h-14` to `h-14 lg:h-16` (approx 56-64px)
- Increase nav link text from `text-sm` to `text-base` on desktop
- Increase CTA button text from `text-sm` to `text-base`
- Increase mobile menu link text similarly
- Remove `animate-pulse-glow` from CTA button (uses gradient glow)
- Change `btn-gradient` on CTA to a solid blue button style

---

### 2. Global Color System: Replace All Gradients with Solid Blue

**File:** `src/index.css` (CSS variables and component classes)

Changes to CSS variables:
- `--primary`: change from purple `258 68% 60%` to blue `217 91% 60%` (#3B82F6)
- `--ring`: same change to blue
- Remove `--gradient-brand`, `--gradient-brand-hover`, `--gradient-brand-subtle`
- Replace `--gradient-bg` with a flat dark navy background (remove radial gradients) or keep extremely subtle, diffuse, non-circular ambient light
- `--shadow-soft` / `--shadow-glow`: change from purple tint to blue tint

Changes to component classes:
- `.btn-gradient`: replace gradient background with solid `#3B82F6`, hover with `#2563EB`
- `.text-gradient`: replace with solid `color: #3B82F6` (no gradient text)
- `.dark-card:hover`: change purple border/shadow to blue
- `.gradient-border-card::before`: replace gradient border with solid blue border at low opacity
- `.link-underline::after`: solid blue instead of gradient
- `.compare-col-moveai`: solid blue tint instead of gradient
- `.animate-pulse-glow`: change purple glow to blue glow

**File:** `tailwind.config.ts`
- Update `brand.purple` references or simplify to just `brand.blue`

---

### 3. Remove Gradient References in All Section Components

**File:** `src/components/home/HeroSection.tsx`
- Remove the two large `radial-gradient` orbs (lines 58-61) -- these are the round light circles
- Replace `.text-gradient` on "mais humana" with solid blue text
- Replace `.text-gradient` on counter values with solid blue
- Replace `.btn-gradient` with solid blue button class
- Replace `.animate-pulse-glow` with clean hover effect

**File:** `src/components/home/ServicesSection.tsx`
- Icon container `background: "linear-gradient(135deg, #7C3AED, #3B82F6)"` -> solid `#3B82F6`
- Custom solutions CTA card: replace gradient background with subtle solid blue tint
- Replace `.text-gradient` on heading with solid blue
- Replace `.btn-gradient` with solid blue

**File:** `src/components/home/ComparisonSection.tsx`
- MoveAI column header: replace gradient background with solid blue tint
- MoveAI row cells: replace gradient background with solid blue tint
- Replace `.text-gradient` on heading
- Replace `.btn-gradient` on CTA

**File:** `src/components/home/HowItWorksSection.tsx`
- Vertical timeline line: replace gradient with solid blue at low opacity
- Step icon containers: solid `#3B82F6` instead of gradient
- Step icon box-shadow: change purple glow to blue
- Mobile icon: same solid blue
- Replace `.text-gradient` references
- Replace `.btn-gradient`

**File:** `src/components/home/PortfolioSection.tsx`
- Replace `.text-gradient` on heading and metrics
- Metric cards: replace gradient backgrounds with solid blue/navy tints
- Replace hover shadow from purple to blue
- Replace `.btn-gradient`

**File:** `src/components/home/FAQSection.tsx`
- Open accordion background: replace gradient with subtle solid blue tint
- Toggle button: replace gradient with solid blue
- Replace `.text-gradient` on heading

**File:** `src/components/home/CTASection.tsx`
- Section background glows (lines 33-36): remove or make extremely subtle and diffuse (no perfect circles)
- Card container: replace gradient background/border with solid blue tint
- Replace `.text-gradient` on heading
- Replace `.btn-gradient`

**File:** `src/components/layout/Footer.tsx`
- Social icon hover: `hover:bg-primary/20` remains fine (primary will now be blue)

**File:** `src/components/home/ToolsMarquee.tsx`
- No gradient references to change

---

### 4. Background Cleanup: Remove Round Light Circles

Across all sections, remove or drastically reduce any `radial-gradient(circle, ...)` background elements:

- **HeroSection**: Remove the two large animated orbs entirely
- **CTASection**: Remove the two `radial-gradient(circle, ...)` divs; optionally replace with a very subtle, non-circular ambient glow at extremely low opacity (5-8%)
- **Body gradient** (`--gradient-bg`): Replace the two radial gradients with either a flat color or a single very diffuse, non-circular, barely visible ambient wash

---

### 5. Contact Form: Add "Mensagem" Textarea

**File:** `src/components/home/CTASection.tsx`

- Add `mensagem` to the form state: `{ nome: "", telefone: "", email: "", mensagem: "" }`
- Add a new `<textarea>` field after Email with:
  - Label: "Conte-nos mais sobre o seu projeto"
  - Placeholder: "Descreva brevemente o que precisa..."
  - Matching input styling (rounded, dark bg, border)
  - Min height ~100px
  - Not required (optional field)

---

### Technical Details

All changes are CSS/component-level only. No structural layout changes. No new dependencies needed. The site remains fully responsive. The core design system shifts from:

```text
BEFORE:  gradient(#7C3AED -> #3B82F6) everywhere
AFTER:   solid #3B82F6 accent, flat backgrounds, clean shadows
```

Files to modify (10 total):
1. `src/index.css`
2. `src/components/layout/Header.tsx`
3. `src/components/home/HeroSection.tsx`
4. `src/components/home/ServicesSection.tsx`
5. `src/components/home/ComparisonSection.tsx`
6. `src/components/home/HowItWorksSection.tsx`
7. `src/components/home/PortfolioSection.tsx`
8. `src/components/home/FAQSection.tsx`
9. `src/components/home/CTASection.tsx`
10. `tailwind.config.ts`

