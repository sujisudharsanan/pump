// Color theme configuration for the entire project
export const colors = {
  // Primary brand colors
  primary: {
    50: '#fefce8',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24', // Main yellow
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Background colors
  background: {
    primary: '#ffffff', // White
    secondary: '#f9fafb', // Light gray
    tertiary: '#f3f4f6', // Slightly darker gray
  },

  // Text colors
  text: {
    primary: '#111827', // Dark gray/black
    secondary: '#6b7280', // Medium gray
    tertiary: '#9ca3af', // Light gray
    inverse: '#ffffff', // White text for dark backgrounds
  },

  // State colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Border colors
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },

  // Gradient definitions
  gradients: {
    primaryYellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
    lightYellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
  },
};

// Tailwind class mappings for consistency
export const theme = {
  // Primary button styling
  button: {
    primary:
      'bg-yellow-400 hover:bg-yellow-500 text-white focus:ring-yellow-500 ' +
      'focus:ring-2 focus:ring-offset-2',
    secondary:
      'bg-white hover:bg-gray-50 text-yellow-600 border border-yellow-400 focus:ring-yellow-500',
    outline:
      'border border-yellow-400 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
  },

  // Input styling
  input: {
    default: 'border-gray-300 focus:ring-yellow-500 focus:border-yellow-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    onYellow:
      'border-transparent focus:ring-white focus:border-transparent bg-white/90',
  },

  // Background styling
  background: {
    page: 'bg-white',
    section: 'bg-gray-50',
    card: 'bg-white',
    yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
  },

  // Text styling
  text: {
    heading: 'text-gray-900',
    body: 'text-gray-600',
    label: 'text-gray-700',
    onYellow: 'text-white',
    link: 'text-black hover:text-gray-600',
  },
};

export default theme;
