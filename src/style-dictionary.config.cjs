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


    /////typography
    const formatCssVarName = (path) => path.join('-');

    // Handle typography formatting specifically for `text.*`
    const generateTypographyThemeProperties = (tokens) => {
      let themeCSS = '';

      Object.entries(tokens).forEach(([key, styles]) => {
        if (styles.fontSize?.value) {
          themeCSS += `  --text-${key}: ${styles.fontSize.value};\n`;
        }
        if (styles.lineHeight?.value) {
          themeCSS += `  --text-${key}--line-height: ${styles.lineHeight.value};\n`;
        }
        if (styles.letterSpacing?.value) {
          themeCSS += `  --text-${key}--letter-spacing: ${styles.letterSpacing.value};\n`;
        }
        if (styles.fontWeight?.value) {
          themeCSS += `  --text-${key}--font-weight: ${styles.fontWeight.value};\n`;
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

    if (dictionary.properties.typography?.text) {
      output += generateTypographyThemeProperties(dictionary.properties.typography.text);
    }
    
    // if (dictionary.properties.typography) {
    //   if (dictionary.properties.typography.fontFamily) {
    //     output += generateThemeProperties(dictionary.properties.typography.fontFamily, 'font');
    //   }
    //   if (dictionary.properties.typography.fontSize) {
    //     output += generateThemeProperties(dictionary.properties.typography.fontSize, 'font-size');
    //   }
    //   if (dictionary.properties.typography.fontWeight) {
    //     output += generateThemeProperties(dictionary.properties.typography.fontWeight, 'font-weight');
    //   }
    //   if (dictionary.properties.typography.lineHeight) {
    //     output += generateThemeProperties(dictionary.properties.typography.lineHeight, 'line-height');
    //   }
    //   if (dictionary.properties.typography.letterSpacing) {
    //     output += generateThemeProperties(dictionary.properties.typography.letterSpacing, 'letter-spacing');
    //   }
    // }
    
    output += '}';
    
    return output;
  }
});





// Custom format for CSS variables
// StyleDictionary.registerFormat({
//   name: 'css/variables-with-tailwind-theme',
//   formatter: function(dictionary) {
//     // First, create CSS variables
//     let cssVariables = ':root {\n';
    
//     // Process each token
//     dictionary.allProperties.forEach(prop => {
//       // Special handling for fontSize to use the --text-{size} format
//       let name;
//       if (prop.type === 'fontSize') {
//         name = `--text-${prop.name}`;
//       } else {
//         name = `--${prop.type}-${prop.name}`;
//       }
      
//       cssVariables += `  ${name}: ${prop.value};\n`;
//     });
    
//     cssVariables += '}\n\n';
    
//     // Then, create the @theme directive for Tailwind v4
//     cssVariables += '@theme {\n';
    
//     // Group tokens by type
//     const tokensByType = {};
//     dictionary.allProperties.forEach(prop => {
//       if (!tokensByType[prop.type]) {
//         tokensByType[prop.type] = [];
//       }
//       tokensByType[prop.type].push(prop);
//     });
    
//     // Map type to Tailwind property name
//     const typeToTailwindProp = {
//       'fontFamily': 'font-family',
//       'fontSize': 'font-size',
//       'fontWeight': 'font-weight',
//       'lineHeight': 'line-height',
//       'letterSpacing': 'letter-spacing'
//     };
    
//     // Add each type to the @theme directive
//     Object.keys(typeToTailwindProp).forEach(type => {
//       if (tokensByType[type]) {
//         cssVariables += `  ${typeToTailwindProp[type]}: {\n`;
        
//         tokensByType[type].forEach(prop => {
//           let varName;
//           if (type === 'fontSize') {
//             varName = `--text-${prop.name}`;
//           } else {
//             varName = `--${type}-${prop.name}`;
//           }
          
//           cssVariables += `    ${prop.name}: var(${varName});\n`;
//         });
        
//         cssVariables += '  }\n\n';
//       }
//     });
    
//     cssVariables = cssVariables.slice(0, -1); // Remove the last newline
//     cssVariables += '}\n';
    
//     return cssVariables;
//   }
// });


// // Custom name transform for fontSize
// StyleDictionary.registerTransform({
//   name: 'name/custom',
//   type: 'name',
//   transformer: function(token) {
//     return token.path.slice(-1)[0]; // Just use the last segment of the path as the name
//   }
// });


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



//////new for typo 
// Custom format for Tailwind v4 theme CSS variables
StyleDictionary.registerFormat({
  name: 'css/tailwind-v4-theme',
  formatter: function({ dictionary }) {
    const tokens = dictionary.allTokens;
    
    // Function to transform token paths to tailwind v4 CSS variable naming
    const getVariableName = (token) => {
      const tokenType = token.type;
      const path = token.path;

      // Apply specific prefixes based on token type
      switch (tokenType) {
        case 'fontFamily':
          return `--font-${path[path.length - 1]}`;
        case 'fontSize':
          return `--text-${path[path.length - 1]}`;
        case 'fontWeight':
          return `--font-weight-${path[path.length - 1]}`;
        case 'lineHeight':
          return `--leading-${path[path.length - 1]}`;
        case 'letterSpacing':
          return `--tracking-${path[path.length - 1]}`;
        default:
          return `--${path.join('-')}`;
      }
    };

    // Generate the CSS content
    let cssContent = `@theme {\n\n--text-*: initial; \n\n`;
    
    tokens.forEach(token => {
      const variableName = getVariableName(token);
      cssContent += `  ${variableName}: ${token.value};\n`;
    });
    
    cssContent += `}\n`;
    return cssContent;
  }
});


// Register a format for Figma-compatible JSON
StyleDictionary.registerFormat({
  name: 'json/figma-variables',
  formatter: function({ dictionary }) {
    const figmaVariables = {
      collections: [{
        name: "Design System",
        modes: [{
          name: "Default",
          variables: {}
        }]
      }]
    };
    
    const variables = figmaVariables.collections[0].modes[0].variables;
    
    dictionary.allTokens.forEach(token => {
      const tokenType = token.type;
      const tokenName = token.path.join('/');
      
      let variableType;
      let value;
      
      // Map token types to Figma variable types
      switch (tokenType) {
        case 'fontFamily':
          variableType = 'STRING';
          value = token.value;
          break;
        case 'fontSize':
          variableType = 'FLOAT';
          // Convert rem to pixels (assuming 1rem = 16px)
          value = parseFloat(token.value) * 16;
          break;
        case 'fontWeight':
          variableType = 'INTEGER';
          value = parseInt(token.value);
          break;
        case 'lineHeight':
          variableType = 'FLOAT';
          if (token.value.includes('%')) {
            value = parseFloat(token.value) / 100;
          } else {
            value = parseFloat(token.value);
          }
          break;
        case 'letterSpacing':
          variableType = 'FLOAT';
          // Convert em to pixels
          if (token.value.includes('em')) {
            value = parseFloat(token.value) * 16;
          } else {
            value = parseFloat(token.value);
          }
          break;
        default:
          variableType = 'STRING';
          value = token.value;
      }
      
      variables[tokenName] = {
        type: variableType,
        value: value
      };
    });
    
    return JSON.stringify(figmaVariables, null, 2);
  }
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
    // tailwind: {
    //   transformGroup: 'web',
    //   buildPath: 'dist/',
    //   files: [{
    //     destination: 'theme.css',
    //     format: 'css/tailwind-theme'
    //   }]
    // },
    // theme: {
    //   transformGroup: 'css',
    //   transforms: ['name/custom'], // Use our custom name transform
    //   buildPath: 'dist/',
    //   files: [{
    //     destination: 'tailwind-theme.css',
    //     format: 'css/variables-with-tailwind-theme'
    //   }]
    // },
    tailwind: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'theme.css',
          format: 'css/tailwind-v4-theme'
        }
      ]
    },
    figma: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        {
          destination: 'figma-variables.json',
          format: 'json/figma-variables'
        }
      ]
    }
  }
};