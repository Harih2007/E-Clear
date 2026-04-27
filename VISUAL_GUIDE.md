# Visual Guide - Pickup Person Details Feature

## User Dashboard View

### Before Scheduling (PENDING Status)
```
┌─────────────────────────────────────────────────────────────┐
│  📦 Pickup Status                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  💻  LAPTOP                          [PENDING]        │ │
│  │      Qty: 1 • ID: ABC123                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After Scheduling (SCHEDULED Status) - NEW FEATURE! ✨
```
┌─────────────────────────────────────────────────────────────┐
│  📦 Pickup Status                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  💻  LAPTOP                          [SCHEDULED]      │ │
│  │      Qty: 1 • ID: ABC123                              │ │
│  │      2/5 households grouped                           │ │
│  │                                                        │ │
│  │  ─────────────────────────────────────────────────── │ │
│  │  PICKUP PERSON DETAILS                                │ │
│  │                                                        │ │
│  │  👤 Green Recycle Centre    📞 +91-9876543211        │ │
│  │                                  (clickable)          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After Collection (COLLECTED Status)
```
┌─────────────────────────────────────────────────────────────┐
│  📦 Pickup Status                                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  💻  LAPTOP                          [COLLECTED] ✓    │ │
│  │      Qty: 1 • ID: ABC123                              │ │
│  │                                                        │ │
│  │  ─────────────────────────────────────────────────── │ │
│  │  PICKUP PERSON DETAILS                                │ │
│  │                                                        │ │
│  │  👤 Green Recycle Centre    📞 +91-9876543211        │ │
│  │                                  (clickable)          │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## E-Centre Dashboard View

### Requests Table - NEW FEATURE! ✨
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  🚛 Pickup Requests                                    [Schedule Route]          │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Request ID │ User              │ Items    │ Location │ Status    │ Actions    │
│  ───────────┼───────────────────┼──────────┼──────────┼───────────┼────────── │
│             │                   │          │          │           │            │
│  #ABC123    │ 👤 Test User      │ 💻 LAPTOP│ 📍 560001│ [PENDING] │ [Schedule] │
│             │ 📞 +91-9876543210 │ Qty: 1   │          │           │            │
│             │    (clickable)    │          │          │           │            │
│             │                   │          │          │           │            │
│  #DEF456    │ 👤 John Doe       │ 📱 PHONE │ 📍 560001│[SCHEDULED]│[Mark       │
│             │ 📞 +91-9876543220 │ Qty: 2   │          │           │ Collected] │
│             │    (clickable)    │          │          │           │            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

## Color Coding

### Status Badges

**PENDING**
```
┌──────────┐
│ PENDING  │  Yellow background (#FEF3C7)
└──────────┘  Yellow text (#92400E)
```

**GROUPING**
```
┌──────────┐
│ GROUPING │  Amber background (#FEF3C7)
└──────────┘  Amber text (#92400E)
```

**SCHEDULED**
```
┌───────────┐
│ SCHEDULED │  Blue background (#DBEAFE)
└───────────┘  Blue text (#1E40AF)
```

**COLLECTED**
```
┌───────────┐
│ COLLECTED │  Green background (#D1FAE5)
└───────────┘  Green text (#065F46)
```

## Interactive Elements

### Clickable Phone Numbers

**Desktop:**
```
📞 +91-9876543211
   └─ Hover: Underline appears
   └─ Click: Opens phone dialer (if supported)
   └─ Color: Blue (#2563EB)
```

**Mobile:**
```
📞 +91-9876543211
   └─ Tap: Opens phone app with number pre-filled
   └─ Long press: Copy number option
```

## Responsive Design

### Desktop (>768px)
- Full table layout with all columns visible
- Pickup person details shown inline
- Hover effects on interactive elements

### Tablet (768px - 1024px)
- Condensed table layout
- Phone numbers may wrap
- Touch-friendly button sizes

### Mobile (<768px)
- Card-based layout instead of table
- Stacked information
- Large touch targets for phone numbers

## Icon Legend

- 👤 **User Icon**: Represents person (user or E-Centre)
- 📞 **Phone Icon**: Indicates phone number
- 💻 **Laptop Icon**: E-waste item type
- 📱 **Phone Icon**: Mobile device item type
- 🔋 **Battery Icon**: Battery item type
- 📦 **Package Icon**: Generic item
- 📍 **Map Pin Icon**: Location/pincode
- ✓ **Check Icon**: Completed status
- 🚛 **Truck Icon**: Pickup/delivery

## User Flow Visualization

```
┌─────────────┐
│   USER      │
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Creates pickup request
       ↓
┌─────────────┐
│  Request    │
│  [PENDING]  │  ← No pickup person details yet
└──────┬──────┘
       │
       │ 2. Assigned to E-Centre
       ↓
┌─────────────┐
│  E-CENTRE   │
│  Dashboard  │  ← Sees user details (name, phone)
└──────┬──────┘
       │
       │ 3. Schedules pickup
       ↓
┌─────────────┐
│  Request    │
│ [SCHEDULED] │  ← ✨ Pickup person details appear!
└──────┬──────┘
       │
       │ 4. User sees E-Centre details
       ↓
┌─────────────┐
│   USER      │
│  Dashboard  │  ← Shows: "Green Recycle Centre"
│             │  ← Shows: "+91-9876543211"
└──────┬──────┘
       │
       │ 5. E-Centre collects
       ↓
┌─────────────┐
│  Request    │
│ [COLLECTED] │  ← Pickup person details still visible
└──────┬──────┘
       │
       │ 6. User receives points
       ↓
┌─────────────┐
│   USER      │
│  Dashboard  │  ← Points updated
│             │  ← Can still see who collected
└─────────────┘
```

## Styling Details

### Pickup Person Details Section

**Container:**
- Border top: 1px solid emerald-200
- Padding top: 12px
- Margin top: 12px
- Background: Transparent

**Header:**
- Text: "PICKUP PERSON DETAILS"
- Font size: 10px
- Font weight: 600 (semibold)
- Color: Emerald-700
- Text transform: Uppercase
- Letter spacing: Wide

**Details Row:**
- Display: Flex
- Gap: 16px
- Align items: Center

**Name Badge:**
- Icon: User (16px)
- Background: Emerald-100
- Icon color: Emerald-600
- Text: Font weight 500 (medium)
- Text color: Gray-900

**Phone Badge:**
- Icon: Phone (16px)
- Background: Blue-100
- Icon color: Blue-600
- Text: Font weight 500 (medium)
- Text color: Blue-600
- Hover: Blue-700 + underline

## Accessibility Features

### Screen Reader Support
```html
<a href="tel:+919876543211" aria-label="Call Green Recycle Centre at +91-9876543211">
  +91-9876543211
</a>
```

### Keyboard Navigation
- Tab: Navigate to phone number link
- Enter/Space: Activate phone link
- Focus indicator: Blue outline

### Color Contrast
- All text meets WCAG AA standards
- Status badges have sufficient contrast
- Phone numbers readable in all states

## Animation & Transitions

### Pickup Person Details Appearance
```
Opacity: 0 → 1 (300ms ease-in)
Transform: translateY(10px) → translateY(0)
```

### Phone Number Hover
```
Color: Blue-600 → Blue-700 (150ms)
Text decoration: none → underline
```

### Status Badge Updates
```
Background: Fade transition (200ms)
Border: Fade transition (200ms)
```

## Print Styles

When printing the dashboard:
- Phone numbers remain visible
- Clickable links show full URL
- Colors converted to grayscale
- Icons replaced with text labels

---

**Note**: All measurements are approximate and may vary slightly based on screen size and browser settings.
