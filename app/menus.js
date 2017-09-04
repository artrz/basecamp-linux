const { clipboard, Menu, shell } = require('electron');

module.exports = {
  /**
   * Generates the app menu template.
   */
  forApp(basecamp, settings, defaults) {
    return Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          { label: 'Clear data', accelerator: 'Ctrl+K', click() { basecamp.showClearDataDialog(); } },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { type: 'separator' },
          { role: 'delete' },
        ],
      },
      {
        role: 'window',
        submenu: [
          { role: 'close' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'zoomin' },
          { role: 'zoomout' },
          { role: 'resetzoom' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
          { type: 'separator' },
          { role: 'reload' },
        ],
      },
      {
        label: 'Settings',
        submenu: [
          {
            label: 'Icons',
            submenu: [
              {
                groupId: 1,
                type: 'radio',
                label: 'Black icons',
                checked: settings.get('iconScheme', defaults.iconScheme) === 'black',
                click() {
                  basecamp.configureIconScheme('black');
                },
              },
              {
                groupId: 1,
                type: 'radio',
                label: 'White icons',
                checked: settings.get('iconScheme', defaults.iconScheme) === 'white',
                click() {
                  basecamp.configureIconScheme('white');
                },
              },
            ],
          },
          {
            label: 'Unreads badge',
            submenu: [
              {
                groupId: 2,
                type: 'radio',
                label: 'Show',
                checked: settings.get('showBadge', defaults.showBadge),
                click() {
                  basecamp.configureShowBadge(true);
                },
              },
              {
                groupId: 2,
                type: 'radio',
                label: 'Hide',
                checked: !settings.get('showBadge', defaults.showBadge),
                click() {
                  basecamp.configureShowBadge(false);
                },
              },
            ],
          },
        ],
      },
      {
        role: 'help',
        submenu: [
          { label: 'About', click() { basecamp.showAboutDialog(); } },
          { label: 'Website', click() { shell.openExternal('https://github.com/arturock/basecamp-linux'); } },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]);
  },

  /**
   * Generates the app context menu template.
   */
  forContext(linkURL) {
    return Menu.buildFromTemplate([
      {
        label: 'Open in browser',
        click: () => { shell.openExternal(linkURL); },
      },
      {
        label: 'Copy link location',
        click: () => { clipboard.writeText(linkURL); },
      },
    ]);
  },

  /**
   * Generates the tray menu.
   */
  forTray() {
    return Menu.buildFromTemplate([
      { role: 'quit' },
    ]);
  },
};
