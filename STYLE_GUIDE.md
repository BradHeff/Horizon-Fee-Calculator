# Horizon Christian School - Material-UI Style Guide

## Brand Colors & MUI Theme Configuration

### Primary Colors
```javascript
// MUI Theme Colors based on Horizon branding
const horizonColors = {
  primary: {
    main: '#2E5D4A',        // Deep forest green (from logo)
    light: '#4A8B3B',       // Lighter green
    dark: '#1A3429',        // Darker green
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F4B942',        // Golden yellow (from logo)
    light: '#F6C142',       // Lighter yellow
    dark: '#E6A832',        // Darker yellow
    contrastText: '#1A3429',
  },
  success: {
    main: '#28A745',
    light: '#34CE57',
    dark: '#1E7E34',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FF8F00',
  },
  error: {
    main: '#DC3545',
    light: '#FF6B6B',
    dark: '#C82333',
  },
  info: {
    main: '#17A2B8',
    light: '#58D3E8',
    dark: '#117A8B',
  },
  background: {
    default: '#FAF7F2',     // Warm cream background
    paper: '#FFFFFF',
    accent: '#E8F4E8',      // Light green background
  },
  text: {
    primary: '#1A3429',     // Dark green for main text
    secondary: '#495057',   // Gray for secondary text
    disabled: '#6C757D',
  },
  divider: '#DEE2E6',
  grey: {
    50: '#F8F9FA',
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#6C757D',
    600: '#495057',
    700: '#343A40',
    800: '#212529',
    900: '#1A3429',
  }
};
```

## Typography

### Font Configuration for Parents (Easy to Read)
```javascript
const typography = {
  fontFamily: [
    'Poppins', // Primary font - friendly and readable
    'Montserrat', // Secondary font - for headings
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Arial',
    'sans-serif',
  ].join(','),
  
  // Large, readable sizes for parents
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    fontFamily: 'Montserrat, sans-serif',
    color: '#1A3429',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#1A3429',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    fontFamily: 'Montserrat, sans-serif',
    color: '#1A3429',
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 500,
    color: '#1A3429',
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    color: '#1A3429',
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#1A3429',
    lineHeight: 1.5,
  },
  
  // Body text - larger for readability
  body1: {
    fontSize: '1.125rem', // Larger than default
    lineHeight: 1.6,
    color: '#1A3429',
  },
  body2: {
    fontSize: '1rem',
    lineHeight: 1.5,
    color: '#495057',
  },
  
  // Button text - clear and readable
  button: {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none', // No all-caps for better readability
  },
  
  // Labels and captions
  caption: {
    fontSize: '0.875rem',
    lineHeight: 1.4,
    color: '#6C757D',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#6C757D',
  },
};
```

## Component Customization

### Button Styles (Parent-Friendly)
```javascript
const buttonStyles = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
      },
      containedPrimary: {
        backgroundColor: '#2E5D4A',
        '&:hover': {
          backgroundColor: '#1A3429',
        },
      },
      containedSecondary: {
        backgroundColor: '#F4B942',
        color: '#1A3429',
        '&:hover': {
          backgroundColor: '#E6A832',
        },
      },
      outlinedPrimary: {
        borderColor: '#2E5D4A',
        color: '#2E5D4A',
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
          backgroundColor: 'rgba(46, 93, 74, 0.08)',
        },
      },
      large: {
        padding: '16px 32px',
        fontSize: '1.125rem',
      },
    },
  },
};
```

### Card Styles
```javascript
const cardStyles = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        background: 'linear-gradient(135deg, #2E5D4A, #4A8B3B)',
        color: '#FFFFFF',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        fontFamily: 'Montserrat, sans-serif',
      },
    },
  },
};
```

### Form Controls (Simplified for Parents)
```javascript
const formStyles = {
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          fontSize: '1.125rem', // Larger text for readability
          '& fieldset': {
            borderColor: '#DEE2E6',
            borderWidth: '2px',
          },
          '&:hover fieldset': {
            borderColor: '#2E5D4A',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2E5D4A',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '1rem',
          fontWeight: 500,
          color: '#1A3429',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        fontSize: '1.125rem',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        fontSize: '1rem',
        color: '#1A3429',
      },
    },
  },
};
```

### Table Styles (Clear Fee Display)
```javascript
const tableStyles = {
  MuiTable: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#2E5D4A',
        '& .MuiTableCell-head': {
          color: '#FFFFFF',
          fontWeight: 600,
          fontSize: '1rem',
          fontFamily: 'Montserrat, sans-serif',
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: '#E8F4E8',
        },
        '& .MuiTableCell-root': {
          fontSize: '1rem',
          padding: '16px',
        },
      },
    },
  },
};
```

## Campus-Specific Theme Variations

### Balaklava Campus Theme
```javascript
const balaklavTheme = {
  primary: {
    main: '#2E5D4A',
    light: '#4A8B3B',
    dark: '#1A3429',
  },
  secondary: {
    main: '#F4B942',
    light: '#F6C142',
    dark: '#E6A832',
  },
};
```

### Clare Campus Theme
```javascript
const clareTheme = {
  primary: {
    main: '#3E5F4F',
    light: '#5A9B4B',
    dark: '#2A4237',
  },
  secondary: {
    main: '#F6C142',
    light: '#F8D176',
    dark: '#E8B132',
  },
};
```

## Responsive Breakpoints

```javascript
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};
```

## Spacing System (8px Grid)

```javascript
const spacing = 8; // Base spacing unit

// Usage examples:
// spacing(1) = 8px
// spacing(2) = 16px
// spacing(3) = 24px
// etc.
```

## Design Principles for Parent Users

### 1. **Visual Hierarchy**
- Use size, color, and spacing to guide attention
- Most important information (total cost) should be prominent
- Clear section separations

### 2. **Simplified Language**
- Avoid technical jargon
- Use terms parents understand
- Provide explanations for school-specific terms

### 3. **Progressive Disclosure**
- Show information step by step
- Don't overwhelm with all options at once
- Use expansion panels for detailed breakdowns

### 4. **Error Prevention & Recovery**
- Validate inputs immediately
- Provide helpful error messages
- Suggest corrections when possible

### 5. **Mobile-First Design**
- Touch-friendly button sizes (min 44px)
- Easy-to-read text on small screens
- Simplified navigation

### 6. **Trust Indicators**
- School branding throughout
- Clear contact information
- Professional appearance
- Accurate calculations

## Implementation Notes

- Use Material-UI's `createTheme()` to implement these styles
- Test on actual devices with parents if possible
- Ensure WCAG 2.1 AA accessibility compliance
- Use semantic HTML and proper ARIA labels
- Test with screen readers for accessibility