// scripts/generateIndex.js
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const content = `
// Auto-generated entry point
module.exports = {
  variablesPath: './variables.css',
  themePath: './theme.css'
};
`;

fs.writeFileSync(path.join(distDir, 'index.js'), content.trim() + '\n');
console.log('✅ dist/index.js generated');