const StyleDictionary = require('style-dictionary');

StyleDictionary.extend({
  source: [
    'tokens/primitives.json',
    'tokens/semantic.json',
    'tokens/component.json'
  ],
  platforms: {
    json: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [{
        destination: 'tokens.json',
        format: 'json/nested',
        filter: token => token.public === true
      }]
    }
  }
}).buildAllPlatforms();
