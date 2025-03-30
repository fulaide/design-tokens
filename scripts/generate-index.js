// scripts/generate-index.js

import fs from 'fs';
import path from 'path';

const outputPath = path.resolve('dist/index.js');
//const tokensPath = './tokens.js'; // relative to dist/index.js

const content = `
// AUTO-GENERATED FILE - DO NOT EDIT
// This file re-exports named design tokens

import tokens from './tokens.js';

export const colors = tokens.color;
export const typography = tokens.typography;
export const spacing = tokens.spacing;
export const shadow = tokens.shadow;
export const opacity = tokens.opacity;
export const border = tokens.border;

export default tokens;
`;

fs.writeFileSync(outputPath, content.trim() + '\n', 'utf-8');

console.log('✅ Generated dist/index.js');