# E-Clear Design System

## Color Palette

### Primary Colors
- **Deep Black**: `#0B0F0E` - Main background
- **Neon Eco-Green**: `#2DFF7A` - Primary accent, CTAs, highlights

### Secondary Colors
- **Dark Gray**: `rgba(11, 15, 14, 0.6)` - Card backgrounds
- **Soft White**: `#F5F5F5` - Body text
- **Gray 400**: `#999999` - Secondary text
- **Gray 600**: `#666666` - Disabled states

### Semantic Colors
- **Success**: `#2DFF7A` (same as primary)
- **Warning**: `#FFA500` (orange for pending states)
- **Error**: `#FF4444` (red for errors)

## Typography

### Font Family
- **Primary**: Inter / Space Grotesk
- **Fallback**: System sans-serif

### Font Weights
- **Light**: 300 (body text)
- **Regular**: 400 (default)
- **Semibold**: 600 (labels, small headings)
- **Bold**: 700 (buttons, emphasis)
- **Black**: 900 (large headings)

### Font Sizes
- **Hero**: 6xl-8xl (96px-128px)
- **H1**: 4xl (48px)
- **H2**: 2xl (32px)
- **H3**: xl (24px)
- **Body**: base (16px)
- **Small**: sm (14px)
- **Tiny**: xs (12px)

## Spacing & Layout

### Grid System
- **Container Max Width**: 1280px (7xl)
- **Grid Columns**: 12-column system
- **Gap**: 24px (6)
- **Padding**: 24px (6) mobile, 48px (12) desktop

### Border Radius
- **Small**: 8px (rounded-lg)
- **Medium**: 12px (rounded-xl)
- **Large**: 16px (rounded-2xl)

## Components

### Cards
```css
background: rgba(11, 15, 14, 0.6)
border: 1px solid rgba(45, 255, 122, 0.3)
border-radius: 16px
padding: 24px
backdrop-filter: blur(12px)
```

### Primary Button
```css
background: #2DFF7A
color: #0B0F0E
height: 56px
padding: 0 40px
border-radius: 12px
font-weight: 700
box-shadow: 0 0 30px rgba(45, 255, 122, 0.4)
transition: all 0.3s
hover: scale(1.05)
```

### Secondary Button
```css
background: rgba(45, 255, 122, 0.05)
border: 1px solid rgba(45, 255, 122, 0.3)
color: #2DFF7A
height: 56px
padding: 0 40px
border-radius: 12px
font-weight: 600
backdrop-filter: blur(12px)
```

### Status Badge
```css
/* Active */
background: rgba(45, 255, 122, 0.2)
color: #2DFF7A
padding: 8px 16px
border-radius: 8px
font-weight: 700

/* Pending */
background: rgba(255, 165, 0, 0.2)
color: #FFA500
```

### Progress Bar
```css
background: rgba(255, 255, 255, 0.1)
height: 12px
border-radius: 999px

/* Fill */
background: #2DFF7A
box-shadow: 0 0 10px rgba(45, 255, 122, 0.5)
```

## Grid Background

### Settings
- **Scan Color**: `#2DFF7A`
- **Lines Color**: `#1a3d2e`
- **Scan Opacity**: 0.5
- **Grid Scale**: 0.05
- **Line Thickness**: 1.5
- **Scan Glow**: 1.2
- **Bloom Intensity**: 0.5

## Animations

### Hover Effects
- **Scale**: 1.05
- **Duration**: 300ms
- **Easing**: ease-out

### Loading States
- **Pulse**: animate-pulse
- **Spin**: animate-spin

### Transitions
- **Default**: all 0.3s ease
- **Fast**: all 0.15s ease
- **Slow**: all 0.5s ease

## Page Layouts

### 1. Landing Page
- Hero section with centered content
- 3-column feature grid
- Shared pickup visualization
- Full-width background grid

### 2. User Dashboard
- 12-column grid layout
- 8-column main content (left)
- 4-column sidebar (right)
- 3-column stats grid
- Card-based request list

### 3. Pickup Scheduling
- Step-based wizard (3 steps)
- Progress bar at top
- Single column layout
- Item selection grid (2-3 columns)
- Calendar day selector (7 columns)

### 4. Recycler Dashboard
- 3-column stats grid
- Full-width visualization card
- Data table with hover states
- Action buttons in table rows

## Responsive Breakpoints

- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)
- **Wide**: > 1280px (xl)

## Accessibility

- **Contrast Ratio**: Minimum 4.5:1 for text
- **Focus States**: 2px solid #2DFF7A outline
- **Touch Targets**: Minimum 44x44px
- **Keyboard Navigation**: Full support

## Icons

- **Library**: Lucide React
- **Style**: Line icons, minimal
- **Size**: 20px (h-5 w-5) default, 24px (h-6 w-6) large
- **Color**: Inherits from parent or #2DFF7A

## Key UX Principles

1. **Pickup-Only Messaging**: Clear indicators that this is not a drop-off service
2. **Shared Pickup Visualization**: Always show household clustering
3. **Progress Indicators**: Use green progress bars for all multi-step flows
4. **Status Clarity**: Color-coded badges for all states
5. **Interactive Grid**: Visible, animated background grid on all pages
6. **High Contrast**: Deep black with neon green for maximum visibility
7. **Micro-animations**: Subtle hover effects on all interactive elements
