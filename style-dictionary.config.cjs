const path = require('path');
const StyleDictionary = require('style-dictionary');

// Custom transform to handle token transformations
StyleDictionary.registerTransform({
  name: 'custom/css-var',
  type: 'value',
  matcher: (token) => {
    return token.type && (typeof token.value === 'string' || typeof token.value === 'number');
  },
  transformer: (token) => {
    return `var(--${token.path.join('-')})`;
  }
});

StyleDictionary.registerFormat({
  name: 'javascript/esm',
  formatter: function({ dictionary }) {
    return `export default ${JSON.stringify(dictionary.tokens, null, 2)};`;
  }
});

module.exports = {
  source: [
    path.resolve(__dirname, 'tokens/**/*.json')
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/esm'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [{
        destination: 'theme.js',
        format: 'javascript/esm'
      }]
    }
  },
  transform: {
    'custom/css-var': StyleDictionary.transform['custom/css-var']
  }
};