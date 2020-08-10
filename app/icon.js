const { app } = require('electron');
const path = require('path');
const settings = require('./settings');

module.exports = (icon) => {
  const iconsPath = path.join(app.getAppPath(), '..', 'assets', 'icons');
  const iconScheme = settings.get('iconScheme');
  return `${iconsPath}/${iconScheme}/${icon}.png`;
};
