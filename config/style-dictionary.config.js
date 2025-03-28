import StyleDictionary from 'style-dictionary';

// Custom transforms for Tailwind and CSS Variables
StyleDictionary.registerTransform({
  name: 'custom/css-var',
  type: 'value',
  matcher: (token) => token.type !== 'composition',
  transformer: (token) => {
    // Convert token to CSS variable format
    return `var(--${token.path.join('-')})`;
  }
});

StyleDictionary.registerTransform({
  name: 'custom/tailwind-scale',
  type: 'value',
  matcher: (token) => ['sizing', 'spacing', 'borderRadius'].includes(token.type),
  transformer: (token) => {
    // Convert tokens to Tailwind scale
    return token.value;
  }
});

export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [{
        destination: 'theme.js',
        format: 'javascript/module',
        options: {
          outputReferences: true
        }
      }]
    }
  },
  transform: {
    'custom/css-var': StyleDictionary.transform['custom/css-var'],
    'custom/tailwind-scale': StyleDictionary.transform['custom/tailwind-scale']
  }
};