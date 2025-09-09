# Project Color Scheme Documentation

## Color Palette

The entire project uses a consistent **Yellow & Gray** color scheme for a modern, clean, and professional appearance.

### Primary Colors

- **Primary Yellow**: `#fbbf24` (yellow-400)
- **Primary Yellow Hover**: `#f59e0b` (yellow-500)
- **Primary Yellow Light**: `#fef3c7` (yellow-100)
- **Primary Yellow Dark**: `#d97706` (yellow-600)

### Background Colors

- **Primary Background**: `#ffffff` (white)
- **Secondary Background**: `#f9fafb` (gray-50)
- **Card Background**: `#ffffff` (white)
- **Section Background**: `#f3f4f6` (gray-100)

### Text Colors

- **Primary Text**: `#111827` (gray-900)
- **Secondary Text**: `#6b7280` (gray-600)
- **Label Text**: `#374151` (gray-700)
- **Placeholder Text**: `#9ca3af` (gray-400)
- **Text on Yellow**: `#ffffff` (white)

### Border Colors

- **Light Border**: `#e5e7eb` (gray-200)
- **Medium Border**: `#d1d5db` (gray-300)
- **Focus Border**: `#fbbf24` (yellow-400)

## Usage Guidelines

### Buttons

- **Primary Button**: Yellow background with white text
  - `bg-yellow-400 hover:bg-yellow-500 text-white`
- **Secondary Button**: White background with yellow text and border
  - `bg-white text-yellow-600 border border-yellow-400 hover:bg-gray-50`

### Forms

- **Input Fields**: Gray border with yellow focus
  - `border-gray-300 focus:ring-yellow-500 focus:border-yellow-500`
- **Labels**: Dark gray text
  - `text-gray-700 font-medium`

### Status Indicators

- **Active/Success**: `text-yellow-600` or `bg-yellow-500`
- **Warning/Maintenance**: `text-yellow-500` or `bg-yellow-400`
- **Inactive/Disabled**: `text-gray-400` or `bg-gray-400`

### Page Layouts

#### Login & Registration Pages

- White background with yellow circle accent
- Yellow gradient for contact details section: `bg-gradient-to-br from-yellow-400 to-yellow-500`

#### Dashboard

- White cards on light gray background
- Yellow accents for active elements and statistics
- Consistent yellow theme for all indicators

#### Forms

- White background with yellow focus states
- Gray labels and placeholder text
- Yellow submit buttons

## Component-Specific Implementations

### AuthCard Component

- Yellow left panel: `bg-[#FBC02D]`
- White right panel for content
- Black text on yellow background

### Dashboard Stats

- White cards with yellow accent icons
- Yellow text for primary statistics
- Consistent spacing and typography

### Registration Form

- Two-panel layout: white left, yellow gradient right
- White text on yellow background for right panel
- Consistent input styling throughout

## Tailwind Classes Reference

### Most Used Classes

```css
/* Backgrounds */
.bg-yellow-400    /* Primary yellow */
.bg-yellow-500    /* Hover state */
.bg-white         /* Primary background */
.bg-gray-50       /* Secondary background */

/* Text */
.text-gray-900    /* Primary text */
.text-gray-600    /* Secondary text */
.text-gray-700    /* Label text */
.text-white       /* Text on yellow */

/* Borders */
.border-gray-300  /* Default border */
.focus:ring-yellow-500  /* Focus ring */
.focus:border-yellow-500  /* Focus border */

/* Gradients */
.bg-gradient-to-br .from-yellow-400 .to-yellow-500  /* Yellow gradient */
```

## File Locations

- Color theme configuration: `/src/theme/colors.ts`
- Global CSS variables: `/src/index.css`
- Component implementations: All page and component files use these consistent colors

## Maintenance Notes

When adding new components or pages:

1. Use the established color palette
2. Follow the button and form styling guidelines
3. Maintain consistency with existing components
4. Reference this documentation for color choices
5. Test color contrast for accessibility

## Accessibility Considerations

- All text maintains proper contrast ratios
- Yellow background always uses white or dark text
- Focus states are clearly visible with yellow borders
- Color is not the only indicator for status (icons and text labels are also used)
