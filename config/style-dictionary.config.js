import StyleDictionary from 'style-dictionary';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom transform to handle token transformations
StyleDictionary.registerTransform({
  name: 'custom/css-var',
  type: 'value',
  matcher: (token) => {
    // Apply to most token types except compositions or complex objects
    return token.type && (typeof token.value === 'string' || typeof token.value === 'number');
  },
  transformer: (token) => {
    // Convert token path to CSS variable format
    return `var(--${token.path.join('-')})`;
  }
});

export default {
  source: [
    path.resolve(__dirname, '../tokens/**/*.json')
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
        format: 'javascript/module'
      }]
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'dist/tailwind/',
      files: [{
        destination: 'theme.js',
        format: 'javascript/module'
      }]
    }
  },
  transform: {
    'custom/css-var': StyleDictionary.transform['custom/css-var']
  }
};