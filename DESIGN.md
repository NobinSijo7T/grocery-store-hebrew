# Design System
<!-- impeccable:design-schema 1 -->

## Visual World

**Farm-to-table warmth with organic authenticity**

Kirshner Farm isn't a sterile supermarket app—it's a direct line to a real farm. The visual language embraces natural textures, earthy warmth, and the honest imperfection of fresh produce. Think farmer's market stall meets modern convenience: handcrafted details, generous whitespace, and motion that feels alive rather than mechanical.

### Core Aesthetic Principles

1. **Organic over Digital** - Soft shadows, subtle textures, rounded corners that feel hand-carved rather than auto-generated
2. **Warmth and Trust** - Earth tones, cream backgrounds, photos of real food (not generic stock)
3. **Generous Breathing Room** - Products need space to shine; avoid crowded grids
4. **Delightful Micro-interactions** - Every tap should feel rewarding, with spring physics and natural easing
5. **Handcrafted Details** - Imperfect touches that signal real humans run this farm

### Color Palette

**Primary: Fresh Green Family**
- `#2D8A4E` - Primary (farm green, verdant and alive)
- `#245C38` - Primary Dark (deep forest)
- `#E8F5ED` - Primary Light (morning dew)
- `#C8E6D4` - Primary Tint (soft sage)

**Accent: Harvest Orange**
- `#FF8243` - Accent (ripe citrus, for highlights and CTAs)
- `#FFB088` - Accent Light (peachy dawn)

**Neutrals: Natural Palette**
- `#FFFEF7` - Cream (main background - warm, not sterile white)
- `#F5F4EC` - Linen (elevated surfaces)
- `#E8E6DC` - Sand (borders and dividers)
- `#4A4A43` - Charcoal (primary text)
- `#6B6B63` - Stone (secondary text)
- `#9A9A8F` - Ash (tertiary text/hints)

**Semantic Colors**
- Success: `#2D8A4E` (uses primary green)
- Error: `#D84315` (terracotta, earthy red)
- Warning: `#F57C00` (pumpkin)
- Info: `#5C7FA3` (dusty blue)

### Typography

**Primary Face: Heebo** (already loaded)
- Display/Hero: Heebo Black (36-48sp)
- Headings: Heebo Bold (20-28sp)
- Subheadings: Heebo SemiBold (16-18sp)
- Body: Heebo Regular (15sp base, 17sp for comfortable reading)
- Labels: Heebo Medium (13-14sp)
- Captions: Heebo Regular (12sp)

**Type Scale** (React Native sp equiv)
- Hero: 48 / Bold / -0.5 tracking
- H1: 32 / Bold / -0.3
- H2: 24 / SemiBold / normal
- H3: 20 / SemiBold / normal
- Body Large: 17 / Regular / normal / 26 leading
- Body: 15 / Regular / normal / 23 leading
- Label: 14 / Medium / 0.1
- Caption: 12 / Regular / 0.3

### Spacing Scale

Consistent 4pt base grid:
- `4xs`: 4pt
- `3xs`: 8pt
- `2xs`: 12pt
- `xs`: 16pt
- `sm`: 20pt
- `md`: 24pt
- `lg`: 32pt
- `xl`: 40pt
- `2xl`: 48pt
- `3xl`: 64pt

### Border Radius

Soft, organic radii (never sharp):
- `sm`: 8pt (chips, tags)
- `md`: 12pt (buttons, inputs)
- `lg`: 16pt (cards)
- `xl`: 24pt (bottom sheets, modals)
- `2xl`: 32pt (hero elements)
- `full`: 999pt (circular)

### Shadows & Elevation

Soft, natural shadows (no harsh drop-shadows):
- **Level 1** (cards): 0 2 8 rgba(0,0,0,0.08)
- **Level 2** (floating buttons): 0 4 16 rgba(0,0,0,0.12)
- **Level 3** (modals): 0 8 32 rgba(0,0,0,0.16)
- **Glow** (primary CTA): 0 4 20 rgba(45,138,78,0.25)

### Motion & Animation

**Philosophy: Spring physics over linear easing**

Every interaction should feel alive and responsive, with natural momentum and settle. Use `react-native-reanimated` v3 with spring configurations:

**Spring Configs:**
```typescript
const springs = {
  gentle: { damping: 20, stiffness: 90 },
  bouncy: { damping: 15, stiffness: 150 },
  snappy: { damping: 25, stiffness: 200 },
};
```

**Animation Patterns:**
- **Button Press**: Scale down to 0.95 with `bouncy` spring on press, spring back on release
- **Card Entry**: Slide up + fade in with `gentle` spring, staggered 50ms per card
- **Add to Cart**: Scale + rotate product image, morph into cart icon with `bouncy` physics
- **Page Transitions**: Shared element transforms where possible, slide with 300ms duration
- **Success Feedback**: Checkmark with elastic overshoot, hold 1200ms
- **Loading States**: Organic pulsing (not harsh flash), shimmer with gradient sweep

**Micro-interactions:**
- Haptic feedback on all button presses (light impact)
- Cart badge bounce when count changes
- Product card lift on press (translateY: -4, shadow grows)
- Pull-to-refresh with organic stretch rubber-band effect
- Quantity stepper: Number rolls with spring physics

### Component Patterns

**Buttons:**
- Primary: Filled with Fresh Green, white text, 48pt height, glow shadow on press
- Secondary: Outlined with 2pt Green border, Green text, no fill
- Tertiary: Text-only, Green text, no border
- All buttons: 12pt radius, spring scale on press, min touch target 44×44

**Product Cards:**
- 16pt radius, Level 1 shadow
- Hero image at top (3:2 aspect), no harsh crop
- Generous padding (16pt all sides)
- Badge overlays in top-left (organic, seasonal tags)
- Price bold and large, old price struck-through with muted color
- Quick-add button: Circular FAB-style at bottom-right, springs in on card appear

**Inputs:**
- 12pt radius, 1pt Sand border, Cream fill
- Focus: 2pt Green border, subtle glow
- 48pt height for comfortable tap
- Label above, hint text in Ash color
- Error state: Terracotta border, icon at end

**Bottom Sheets:**
- 24pt top radius, handle pill at top-center
- Spring physics on drag, rubber-band at extents
- Backdrop blur + dim (60% opacity)

**Empty States:**
- Large, friendly icon (80-100pt)
- Short, warm message (not generic "No items")
- Clear CTA button

### Platform Adaptations

**iOS:**
- Safe area insets respected
- Tab bar: Standard iOS pattern, 5 tabs max, icons + labels
- Navigation: Large title collapsing on scroll
- Swipe-back gesture always live

**Android:**
- Material 3 navigation bar (bottom)
- Edge-to-edge with system bars
- System back gesture respected
- FAB for primary actions

### Dark Mode

Not currently implemented, but when added:
- Background: `#1C1C19` (deep charcoal)
- Surface: `#2A2A27` (elevated charcoal)
- Text: `#FEFEF7` (warm white)
- Keep Primary Green consistent, adjust opacity for contrast

---

## Implementation Notes

### Animation Libraries
- **Primary**: `react-native-reanimated` v3 (worklet-based, 60fps native)
- **Gestures**: `react-native-gesture-handler` (already in Expo)
- **Haptics**: `expo-haptics` (subtle feedback)
- **Lottie**: `lottie-react-native` for complex hero animations (loading, success)

### Performance
- Product images: Lazy load with `expo-image`, blurhash placeholders
- Lists: `FlashList` for 60fps scrolling with 100+ items
- Animations: Run on UI thread (Reanimated worklets)
- Memoize heavy computations (React.memo, useMemo)

### Accessibility
- All touch targets ≥ 44×44pt
- Dynamic Type support (use sp units)
- High contrast mode adjustments
- Screen reader labels on all interactive elements
- Haptics paired with visual feedback (not alone)

---

## Current Implementation Gaps

The existing app has solid bones but lacks soul:
1. ❌ Generic Material/iOS hybrid (no distinct personality)
2. ❌ Flat animations (fade/slide only, no spring physics)
3. ❌ Sterile white backgrounds (needs warmth)
4. ❌ Crowded product grids (needs breathing room)
5. ❌ Stock-feeling shadows (too subtle or too harsh)
6. ❌ Missing micro-interactions (no delight)
7. ❌ Inconsistent spacing and sizing

**Redesign will address:**
- Replace theme colors with earthy palette
- Implement spring-based animations throughout
- Add cream background and natural textures
- Redesign product cards with more space and personality
- Add delightful micro-interactions (cart bounce, success animations)
- Consistent spacing scale application
- Hero moments (splash, onboarding, empty states)

---

## Verification Checklist

Before shipping any redesigned screen:
- [ ] Springs on all interactive elements
- [ ] Haptic feedback on button presses
- [ ] Smooth 60fps scrolling (test with 50+ items)
- [ ] Safe area insets respected
- [ ] Touch targets ≥ 44×44pt
- [ ] Text uses type scale (no arbitrary sizes)
- [ ] Colors from palette (no random hex)
- [ ] Spacing uses scale (no magic numbers)
- [ ] Loading states with skeleton/shimmer
- [ ] Error states with friendly messages
- [ ] Empty states with personality
- [ ] Test on both iOS and Android
- [ ] Test RTL layout (Hebrew)
- [ ] Test with Dynamic Type at 1.3x

