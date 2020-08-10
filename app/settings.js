const settings = require('electron-settings');

const availableSettings = {
  autoHideMenu: true,
  showBadge: true,
  iconScheme: 'white',
  checkNewVersion: true,
  appBackgroundColor: '#f5efe6',
  posY: 0,
  posX: 0,
  width: 770,
  height: 700,
  isMaximized: false,
};

module.exports = {
  get: (setting) => {
    if (setting in availableSettings) {
      const value = settings.getSync(setting);
      return value !== undefined ? value : availableSettings[setting];
    }
    return undefined;
  },

  set: (key, value) => {
    if (key in availableSettings) {
      settings.setSync(key, value);
    }
  },
};
