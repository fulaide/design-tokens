# Design Tokens Package

## Overview
A comprehensive design tokens system for consistent styling across projects.

## Installation
```bash
npm install @bianlian/design-tokens
```

## Usage

### CSS Variables
```javascript
import '@bianlian/design-tokens/dist/css';
```

### Tailwind Configuration
```javascript
import theme from '@bianlian/design-tokens/dist/tailwind';

module.exports = {
  theme: {
    extend: theme
  }
}
```

### Direct Token Access
```javascript
import { colors, typography } from '@bianlian/design-tokens';

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