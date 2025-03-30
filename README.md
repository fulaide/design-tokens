# Design Tokens Package

## Overview
A comprehensive design tokens system for consistent styling across projects.

## Installation
```bash
npm install @ybianlian/design-tokens
```

## Usage

### CSS Variables
```javascript
import '@ybianlian/design-tokens/dist/css/variables.css';
```

### Tailwind Configuration
```javascript
import theme from '@bianlian/design-tokens/dist/tailwind/theme.js';

module.exports = {
  theme: {
    extend: theme
  }
}
```

### Direct Token Access
```javascript
import { colors, typography } from '@ybianlian/design-tokens';

console.log(colors.primary[500]);
console.log(typography.fontSize.base);
```

## Contributing
- Report issues on GitHub
- Pull requests welcome

## License
MIT License

## Versioning
We use semantic versioning (SemVer).