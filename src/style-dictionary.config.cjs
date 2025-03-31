const StyleDictionary = require('style-dictionary');

// Helper function to format CSS variable name properly
function formatCssVarName(path) {
  return path.join('-');
}

// Register custom formats
StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: function(dictionary) {
    return `:root {\n${dictionary.allProperties
      .map(prop => `  --${formatCssVarName(prop.path)}: ${prop.value};`)
      .join('\n')}\n}`;
  }
});

StyleDictionary.registerFormat({
  name: 'css/tailwind-theme',
  formatter: function(dictionary) {
    // Helper function to build theme properties recursively
    const generateThemeProperties = (tokens, prefix = '') => {
      if (!tokens) return '';
      
      let themeCSS = '';
      
      Object.entries(tokens).forEach(([key, value]) => {
        const propertyName = prefix ? `${prefix}-${key}` : key;
        
        // Check if this is a token with a value or a category with nested tokens
        if (Object.prototype.hasOwnProperty.call(value, 'value')) {
          // This is a leaf token, reference the CSS variable
          themeCSS += `  --${propertyName}: var(--${formatCssVarName(value.path)});\n`;
        } else {
          // This is a category with nested tokens
          themeCSS += generateThemeProperties(value, propertyName);
        }
      });
      
      return themeCSS;
    };
    
    let output = '@theme {\n';
    
    // Process color tokens
    if (dictionary.properties.color) {
      output += generateThemeProperties(dictionary.properties.color, 'color');
    }
    
    // Process border tokens
    if (dictionary.properties.border) {
      if (dictionary.properties.border.radius) {
        output += generateThemeProperties(dictionary.properties.border.radius, 'spacing');
      }
      if (dictionary.properties.border.width) {
        output += generateThemeProperties(dictionary.properties.border.width, 'border');
      }
      if (dictionary.properties.border.style) {
        output += generateThemeProperties(dictionary.properties.border.style, 'border-style');
      }
    }
    
    // Process opacity tokens
    if (dictionary.properties.opacity) {
      output += generateThemeProperties(dictionary.properties.opacity, 'opacity');
    }
    
    // Process typography tokens
    if (dictionary.properties.typography) {
      if (dictionary.properties.typography.fontFamily) {
        output += generateThemeProperties(dictionary.properties.typography.fontFamily, 'font');
      }
      if (dictionary.properties.typography.fontSize) {
        output += generateThemeProperties(dictionary.properties.typography.fontSize, 'font-size');
      }
      if (dictionary.properties.typography.fontWeight) {
        output += generateThemeProperties(dictionary.properties.typography.fontWeight, 'font-weight');
      }
      if (dictionary.properties.typography.lineHeight) {
        output += generateThemeProperties(dictionary.properties.typography.lineHeight, 'line-height');
      }
      if (dictionary.properties.typography.letterSpacing) {
        output += generateThemeProperties(dictionary.properties.typography.letterSpacing, 'letter-spacing');
      }
    }
    
    output += '}';
    
    return output;
  }
});

// Register path transform for maintaining the proper token structure
StyleDictionary.registerTransform({
  name: 'name/path',
  type: 'name',
  transformer: function(token) {
    return token.path.join('-');
  }
});

// Create a custom transform group
StyleDictionary.registerTransformGroup({
  name: 'web',
  transforms: [
    'attribute/cti',
    'name/path',
    'color/css',
    'size/px',
    'time/seconds',
    'content/icon'
  ]
});

// Create the Style Dictionary configuration
module.exports = {
  source: ['./src/tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'web',
      buildPath: 'dist/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    tailwind: {
      transformGroup: 'web',
      buildPath: 'dist/',
      files: [{
        destination: 'theme.css',
        format: 'css/tailwind-theme'
      }]
    }
  }
};