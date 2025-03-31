// Import Style Dictionary
const StyleDictionary = require("style-dictionary")

// Custom formatter for Tailwind v4 @theme directive with improved token handling
StyleDictionary.registerFormat({
  name: "css/tailwind-v4-theme-improved",
  formatter: ({ dictionary }) => {
    let output = "@theme {\n"

    // Process border tokens
    if (dictionary.tokens.border) {
      // Border radius
      if (dictionary.tokens.border.radius) {
        Object.entries(dictionary.tokens.border.radius).forEach(([key, value]) => {
          if (value.value) {
            output += `  --radius-${key}: ${value.value};\n`
          }
        })
      }

      // Border width
      if (dictionary.tokens.border.width) {
        Object.entries(dictionary.tokens.border.width).forEach(([key, value]) => {
          if (value.value) {
            output += `  --border-width-${key}: ${value.value};\n`
          }
        })
      }

      // Border style
      if (dictionary.tokens.border.style) {
        Object.entries(dictionary.tokens.border.style).forEach(([key, value]) => {
          if (value.value) {
            output += `  --border-style-${key}: ${value.value};\n`
          }
        })
      }
    }

    // Process color tokens
    if (dictionary.tokens.color) {
      Object.entries(dictionary.tokens.color).forEach(([colorName, colorValues]) => {
        Object.entries(colorValues).forEach(([shade, value]) => {
          if (value.value) {
            output += `  --color-${colorName}-${shade}: ${value.value};\n`
          }
        })
      })
    }

    // Process spacing tokens
    if (dictionary.tokens.spacing) {
      Object.entries(dictionary.tokens.spacing).forEach(([key, value]) => {
        if (value.value) {
          output += `  --spacing-${key}: ${value.value};\n`
        }
      })
    }

    // Process font size tokens
    if (dictionary.tokens.fontSize) {
      Object.entries(dictionary.tokens.fontSize).forEach(([key, value]) => {
        if (value.value) {
          output += `  --font-size-${key}: ${value.value};\n`
        }
      })
    }

    // Process font weight tokens
    if (dictionary.tokens.fontWeight) {
      Object.entries(dictionary.tokens.fontWeight).forEach(([key, value]) => {
        if (value.value) {
          output += `  --font-weight-${key}: ${value.value};\n`
        }
      })
    }

    output += "}\n"
    return output
  },
})

