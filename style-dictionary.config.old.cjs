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



StyleDictionary.registerFormat({
  name: 'javascript/tailwind',
  formatter: function({ dictionary }) {
    return `module.exports = ${JSON.stringify(dictionary.tokens, null, 2)};`;
  }
});




// Custom formatters
StyleDictionary.registerFormat({
  name: "css/variables",
  formatter: ({ dictionary }) =>
    `:root {\n${dictionary.allProperties.map((prop) => `  --${prop.name}: ${prop.value};`).join("\n")}\n}\n`,
})

StyleDictionary.registerFormat({
  name: "tailwind/theme",
  formatter: ({ dictionary }) => {
    const colorTokens = dictionary.tokens.color

    // Transform tokens into a format suitable for Tailwind
    const transformColorTokens = (obj) => {
      const result = {}
      Object.keys(obj).forEach((key) => {
        if (obj[key].value) {
          result[key] = obj[key].value
        } else {
          result[key] = transformColorTokens(obj[key])
        }
      })
      return result
    }

    // Create tailwind config structure
    const theme = {
      colors: transformColorTokens(colorTokens),
      spacing: transformTokenCategory(dictionary.tokens.spacing),
      fontSize: transformTokenCategory(dictionary.tokens.fontSize),
      fontWeight: transformTokenCategory(dictionary.tokens.fontWeight),
      borderRadius: transformTokenCategory(dictionary.tokens.borderRadius),
    }

    return `export default ${JSON.stringify(theme, null, 2)}`
  },
})

// Helper function to transform token categories
function transformTokenCategory(category) {
  if (!category) return {}

  const result = {}
  Object.keys(category).forEach((key) => {
    if (category[key].value) {
      result[key] = category[key].value
    }
  })
  return result
}

// Transform name/path format
StyleDictionary.registerTransform({
  name: "name/path/kebab",
  type: "name",
  transformer: (prop) => prop.path.join("-"),
})




// Custom formatter for Tailwind v4 CSS variables
StyleDictionary.registerFormat({
  name: "css/tailwind-v4",
  formatter: ({ dictionary }) => {
    // Start with the base CSS variables
    let output = ":root {\n"

    // Colors
    if (dictionary.tokens.color) {
      Object.entries(dictionary.tokens.color).forEach(([colorName, colorValues]) => {
        Object.entries(colorValues).forEach(([shade, value]) => {
          if (value.value) {
            output += `  --${colorName}-${shade}: ${value.value};\n`
          } else {
            // Handle nested color objects
            Object.entries(value).forEach(([subShade, subValue]) => {
              if (subValue.value) {
                output += `  --${colorName}-${shade}-${subShade}: ${subValue.value};\n`
              }
            })
          }
        })
      })
    }

    // Spacing
    if (dictionary.tokens.spacing) {
      Object.entries(dictionary.tokens.spacing).forEach(([key, value]) => {
        output += `  --spacing-${key}: ${value.value};\n`
      })
    }

    // Font sizes
    if (dictionary.tokens.fontSize) {
      Object.entries(dictionary.tokens.fontSize).forEach(([key, value]) => {
        output += `  --font-size-${key}: ${value.value};\n`
      })
    }

    // Font weights
    if (dictionary.tokens.fontWeight) {
      Object.entries(dictionary.tokens.fontWeight).forEach(([key, value]) => {
        output += `  --font-weight-${key}: ${value.value};\n`
      })
    }

    // Border radius
    if (dictionary.tokens.borderRadius) {
      Object.entries(dictionary.tokens.borderRadius).forEach(([key, value]) => {
        output += `  --radius-${key}: ${value.value};\n`
      })
    }

    output += "}\n"
    return output
  },
})


// Custom formatter for Tailwind v4 theme config
StyleDictionary.registerFormat({
  name: "tailwind/v4-theme",
  formatter: ({ dictionary }) => {
    // Create the theme configuration that references CSS variables
    const theme = {
      colors: {},
      spacing: {},
      fontSize: {},
      fontWeight: {},
      borderRadius: {},
    }

    // Colors
    if (dictionary.tokens.color) {
      Object.entries(dictionary.tokens.color).forEach(([colorName, colorValues]) => {
        theme.colors[colorName] = {}
        Object.keys(colorValues).forEach((shade) => {
          theme.colors[colorName][shade] = `var(--${colorName}-${shade})`
        })
      })
    }

    // Spacing
    if (dictionary.tokens.spacing) {
      Object.keys(dictionary.tokens.spacing).forEach((key) => {
        theme.spacing[key] = `var(--spacing-${key})`
      })
    }

    // Font sizes
    if (dictionary.tokens.fontSize) {
      Object.keys(dictionary.tokens.fontSize).forEach((key) => {
        theme.fontSize[key] = `var(--font-size-${key})`
      })
    }

    // Font weights
    if (dictionary.tokens.fontWeight) {
      Object.keys(dictionary.tokens.fontWeight).forEach((key) => {
        theme.fontWeight[key] = `var(--font-weight-${key})`
      })
    }

    // Border radius
    if (dictionary.tokens.borderRadius) {
      Object.keys(dictionary.tokens.borderRadius).forEach((key) => {
        theme.borderRadius[key] = `var(--radius-${key})`
      })
    }

    return `export default ${JSON.stringify(theme, null, 2)}`
  },
})


// Custom formatter for Tailwind v4 @theme directive
StyleDictionary.registerFormat({
  name: "css/tailwind-v4-theme",
  formatter: ({ dictionary }) => {
    // Start with the imports and theme block
    //@import "tailwindcss";
    let output = '\n\n'
    output += "@theme {\n"

    // Colors
    if (dictionary.tokens.color) {
      Object.entries(dictionary.tokens.color).forEach(([colorName, colorValues]) => {
        Object.entries(colorValues).forEach(([shade, value]) => {
          if (value.value) {
            output += `  --color-${colorName}-${shade}: ${value.value};\n`
          } else {
            // Handle nested color objects
            Object.entries(value).forEach(([subShade, subValue]) => {
              if (subValue.value) {
                output += `  --color-${colorName}-${shade}-${subShade}: ${subValue.value};\n`
              }
            })
          }
        })
      })
    }

    // Spacing
    if (dictionary.tokens.spacing) {
      Object.entries(dictionary.tokens.spacing).forEach(([key, value]) => {
        output += `  --spacing-${key}: ${value.value};\n`
      })
    }

    // Font sizes
    if (dictionary.tokens.fontSize) {
      Object.entries(dictionary.tokens.fontSize).forEach(([key, value]) => {
        output += `  --font-size-${key}: ${value.value};\n`
      })
    }

    // Font weights
    if (dictionary.tokens.fontWeight) {
      Object.entries(dictionary.tokens.fontWeight).forEach(([key, value]) => {
        output += `  --font-weight-${key}: ${value.value};\n`
      })
    }

    // Border radius
    if (dictionary.tokens.borderRadius) {
      Object.entries(dictionary.tokens.borderRadius).forEach(([key, value]) => {
        output += `  --radius-${key}: ${value.value};\n`
      })
    }

    output += "}\n"
    return output
  },
})



// Custom formatter for Tailwind v4 @theme directive with improved token handling
StyleDictionary.registerFormat({
  name: "css/tailwind-v4-theme-improved",
  formatter: ({ dictionary }) => {
    let output = '@theme {\n';
    
    // Process typography tokens
    if (dictionary.tokens.typography) {
      // Font Family
      if (dictionary.tokens.typography.fontFamily) {
        Object.entries(dictionary.tokens.typography.fontFamily).forEach(([key, value]) => {
          if (value.value) {
            output += `  --font-family-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Font Size
      if (dictionary.tokens.typography.fontSize) {
        Object.entries(dictionary.tokens.typography.fontSize).forEach(([key, value]) => {
          if (value.value) {
            output += `  --font-size-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Font Weight
      if (dictionary.tokens.typography.fontWeight) {
        Object.entries(dictionary.tokens.typography.fontWeight).forEach(([key, value]) => {
          if (value.value) {
            output += `  --font-weight-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Line Height
      if (dictionary.tokens.typography.lineHeight) {
        Object.entries(dictionary.tokens.typography.lineHeight).forEach(([key, value]) => {
          if (value.value) {
            output += `  --line-height-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Letter Spacing
      if (dictionary.tokens.typography.letterSpacing) {
        Object.entries(dictionary.tokens.typography.letterSpacing).forEach(([key, value]) => {
          if (value.value) {
            output += `  --letter-spacing-${key}: ${value.value};\n`;
          }
        });
      }
    }
    
    // Process spacing tokens - FIXED to use --spacing- prefix
    if (dictionary.tokens.spacing && dictionary.tokens.spacing.scale) {
      Object.entries(dictionary.tokens.spacing.scale).forEach(([key, value]) => {
        if (value.value) {
          // Use --spacing- prefix for all spacing tokens
          output += `  --spacing-${key}: ${value.value};\n`;
        }
      });
    }
    
    // Process opacity tokens
    if (dictionary.tokens.opacity) {
      Object.entries(dictionary.tokens.opacity).forEach(([key, value]) => {
        if (value.value) {
          output += `  --opacity-${key}: ${value.value};\n`;
        }
      });
    }
    
    // Process shadow tokens
    if (dictionary.tokens.shadow) {
      Object.entries(dictionary.tokens.shadow).forEach(([key, value]) => {
        if (value.value) {
          output += `  --shadow-${key}: ${value.value};\n`;
        }
      });
    }
    
    // Process border tokens
    if (dictionary.tokens.border) {
      // Border radius
      if (dictionary.tokens.border.radius) {
        Object.entries(dictionary.tokens.border.radius).forEach(([key, value]) => {
          if (value.value) {
            output += `  --radius-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Border width
      if (dictionary.tokens.border.width) {
        Object.entries(dictionary.tokens.border.width).forEach(([key, value]) => {
          if (value.value) {
            output += `  --border-width-${key}: ${value.value};\n`;
          }
        });
      }
      
      // Border style
      if (dictionary.tokens.border.style) {
        Object.entries(dictionary.tokens.border.style).forEach(([key, value]) => {
          if (value.value) {
            output += `  --border-style-${key}: ${value.value};\n`;
          }
        });
      }
    }
    
    // Process color tokens
    if (dictionary.tokens.color) {
      Object.entries(dictionary.tokens.color).forEach(([colorName, colorValues]) => {
        Object.entries(colorValues).forEach(([shade, value]) => {
          if (value.value) {
            output += `  --color-${colorName}-${shade}: ${value.value};\n`;
          }
        });
      });
    }
    
    output += '}\n';
    return output;
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
    // tailwind: {
    //   transformGroup: 'js',
    //   buildPath: 'dist/tailwind/',
    //   files: [{
    //     destination: 'theme.js',
    //     format: 'javascript/tailwind'
    //   }]
    // },
    tailwind: {
      transformGroup: "js",
      buildPath: "dist/tailwind/",
      files: [
        {
          destination: "theme.js",
          format: "tailwind/theme",
        },
      ],
    },
    // tailwind: {
    //   transformGroup: "js",
    //   buildPath: "dist/tailwind/",
    //   files: [
    //     {
    //       destination: "theme.js",
    //       format: "tailwind/theme",
    //       filter: {
    //         attributes: {
    //           category: ["color", "spacing", "fontSize", "fontWeight", "borderRadius"],
    //         },
    //       },
    //     },
    //   ],
    // },


    // tailwind: {
    //   transformGroup: "js",
    //   buildPath: "dist/tailwind/",
    //   files: [
    //     {
    //       destination: "theme.js",
    //       format: "tailwind/v4-theme",
    //     },
    //   ],
    // },
    theme: {
      transformGroup: "css",
      transforms: ["name/path/kebab"],
      buildPath: "dist/tailwind/",
      files: [
        {
          destination: "theme.css",
          format: "css/tailwind-v4-theme-improved",
        },
      ],
    },


    
  },
  transform: {
    'custom/css-var': StyleDictionary.transform['custom/css-var'],
    'tailwind/theme': StyleDictionary.format['tailwind/theme'],
    'tailwind/v4-theme': StyleDictionary.format['tailwind/v4-theme'],
    'css/tailwind-v4-theme': StyleDictionary.format['css/tailwind-v4-theme'],
    'css/tailwind-v4-theme-improved': StyleDictionary.format['css/tailwind-v4-theme-improved'],
  }
};