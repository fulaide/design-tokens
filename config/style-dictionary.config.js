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






// const StyleDictionaryConfig = {
//   source: ["tokens/**/*.json"],
//   platforms: {
//     css: {
//       transformGroup: "css",
//       transforms: ["name/path/kebab"],
//       buildPath: "dist/",
//       files: [
//         {
//           destination: "variables.css",
//           format: "css/variables",
//         },
//       ],
//     },
//     tailwind: {
//       transformGroup: "js",
//       buildPath: "dist/",
//       files: [
//         {
//           destination: "tailwind-theme.js",
//           format: "tailwind/theme",
//         },
//       ],
//     },
//     js: {
//       transformGroup: "js",
//       buildPath: "dist/",
//       files: [
//         {
//           destination: "tokens.js",
//           format: "javascript/es6",
//         },
//       ],
//     },
//   },
// }



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
    // tailwind: {
    //   transformGroup: 'js',
    //   buildPath: 'dist/tailwind/',
    //   files: [{
    //     destination: 'theme.js',
    //     format: 'javascript/module'
    //   }]
    // },
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
      buildPath: "dist/",
      files: [
        {
          destination: "theme.js",
          format: "tailwind/theme",
        },
      ],
    },
  },
  transform: {
    'custom/css-var': StyleDictionary.transform['custom/css-var'],
    'tailwind/theme': StyleDictionary.format['tailwind/theme'],
  }
};