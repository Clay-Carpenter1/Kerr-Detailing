// This would normally be installed via npm, but for completeness:
// npm install tailwindcss-animate

// For now, we'll create a simple version
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
  addUtilities({
    '.animate-in': {
      'animation-name': 'enter',
      'animation-duration': '150ms',
      '--tw-enter-opacity': 'initial',
      '--tw-enter-scale': 'initial',
      '--tw-enter-rotate': 'initial',
      '--tw-enter-translate-x': 'initial',
      '--tw-enter-translate-y': 'initial',
    },
    '.animate-out': {
      'animation-name': 'exit',
      'animation-duration': '150ms',
      '--tw-exit-opacity': 'initial',
      '--tw-exit-scale': 'initial',
      '--tw-exit-rotate': 'initial',
      '--tw-exit-translate-x': 'initial',
      '--tw-exit-translate-y': 'initial',
    },
  });
});