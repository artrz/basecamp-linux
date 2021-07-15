const { clipboard, Menu, shell } = require('electron');
const settings = require('./settings');

module.exports = {
  /**
   * Generates the app menu template.
   */
  forApp(app) {
    return Menu.buildFromTemplate([
      {
        label: 'File',
        submenu: [
          { label: 'Clear data', accelerator: 'Ctrl+K', click() { app.showClearDataDialog(); } },
          { type: 'separator' },
          { role: 'quit' },
        ],
      },
      {
        label: 'Navigation',
        submenu: [
          { label: 'Back', accelerator: 'Alt+Left', click() { app.goBack(); } },
          { label: 'Forward', accelerator: 'Alt+Right', click() { app.goForward(); } },
          { type: 'separator' },
          { role: 'reload' },
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
        label: 'View',
        submenu: [
          { role: 'zoomin' },
          { role: 'zoomout' },
          { role: 'resetzoom' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
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
                checked: settings.get('iconScheme') === 'black',
                click() {
                  app.configureIconScheme('black');
                },
              },
              {
                groupId: 1,
                type: 'radio',
                label: 'White icons',
                checked: settings.get('iconScheme') === 'white',
                click() {
                  app.configureIconScheme('white');
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
                checked: settings.get('showBadge'),
                click() {
                  app.configureShowBadge(true);
                },
              },
              {
                groupId: 2,
                type: 'radio',
                label: 'Hide',
                checked: !settings.get('showBadge'),
                click() {
                  app.configureShowBadge(false);
                },
              },
            ],
          },
          {
            type: 'checkbox',
            label: 'Check for updates at startup',
            checked: settings.get('checkNewVersion'),
            click() {
              settings.set('checkNewVersion', !settings.get('checkNewVersion'));
            },
          },
          {
            type: 'checkbox',
            label: 'Autohide menu',
            checked: settings.get('autoHideMenu'),
            click() {
              app.switchAutoHideMenu();
            },
          },
        ],
      },
      {
        role: 'help',
        submenu: [
          { label: 'About', click() { app.showAboutDialog(); } },
          { label: 'Website', click() { shell.openExternal('https://github.com/arturock/basecamp-linux'); } },
          { label: 'Check for updates...', click() { app.checkNewVersion(true); } },
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
