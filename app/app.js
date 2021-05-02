const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  shell,
  Tray,
} = require('electron');
const appPackage = require('./package.json');
const icon = require('./icon');
const menus = require('./menus');
const notification = require('./notification');
const settings = require('./settings');
const versionChecker = require('./versionChecker');

const ELECTRON_VERSION = process.versions.electron;
const APP_NAME = app.name;
const APP_VERSION = app.getVersion();
const APP_DESCRIPTION = appPackage.description;
const BASECAMP_URL = 'https://launchpad.37signals.com';

/** @type {BrowserWindow} */
let win;
let tray;
let unreadsNotified = false;

/**
 * The app builder object.
 */
const basecamp = {
  buildApp(url) {
    this.createWindow(url);
    this.addAppMenu();
    this.addContextMenu();
    this.addTrayIcon();
    this.setIcons();
    this.addWindowEvents();
    this.bootstrap();
  },

  /**
   * Creates the app window.
   */
  createWindow(url) {
    const config = {
      y: settings.get('posY'),
      x: settings.get('posX'),
      width: settings.get('width'),
      height: settings.get('height'),
      title: APP_NAME,
      icon: icon('icon'),
      autoHideMenuBar: settings.get('autoHideMenu'),
      backgroundColor: settings.get('appBackgroundColor'),
      webPreferences: {
        nodeIntegration: false,
      },
    };

    win = new BrowserWindow(config);

    if (settings.get('isMaximized')) {
      win.maximize();
    }

    win.loadURL(url);
  },

  addWindowEvents() {
    win
      .on('close', () => {
        const bounds = win.getBounds();
        settings.set('posX', bounds.x);
        settings.set('posY', bounds.y);
        settings.set('width', bounds.width);
        settings.set('height', bounds.height);
        settings.set('isMaximized', win.isMaximized());
      })
      .on('closed', () => {
        tray = null;
        win = null;
      })
      .on('page-title-updated', (event, title) => {
        event.preventDefault();
        this.setTitles(title);
      });

    win.webContents
      .on('new-window', (event, linkUrl) => {
        const regex = /accounts.google.com/;

        if (!linkUrl.match(regex)) {
          event.preventDefault();
          shell.openExternal(linkUrl);
        }
      })
      .on('will-navigate', (event, linkUrl) => {
        const regex = /(37signals.com|basecamp.com)/;

        if (!linkUrl.match(regex)) {
          event.preventDefault();
          shell.openExternal(linkUrl);
        }
      });

    return win;
  },

  bootstrap() {
    if (settings.get('checkNewVersion')) {
      this.checkNewVersion();
    }
  },

  /**
   * Checks for new versions.
   */
  checkNewVersion(notifyLatest) {
    versionChecker.check().then((check) => {
      if (check.comparison === 1) {
        notification(`New version available\n${check.repoVersion}`);
      } else if (notifyLatest === true) {
        notification(check.comparison === 0
          ? `You have the latest version\n${check.appVersion}`
          : `Dev version ${check.appVersion}\nLatest ${check.repoVersion}`);
      }
    });
  },

  /**
   * Adds the app menu.
   */
  addAppMenu() {
    Menu.setApplicationMenu(menus.forApp(this));
  },

  /**
   * Adds the app context menu.
   */
  addContextMenu() {
    win.webContents.on('context-menu', (event, params) => {
      event.preventDefault();
      const { linkURL } = params;

      if (linkURL) {
        menus.forContext(linkURL).popup(win);
      }
    });
  },

  /**
   * Adds the tray icon.
   */
  addTrayIcon() {
    tray = new Tray(icon('tray'));
    tray.setToolTip(APP_NAME);
    tray.setContextMenu(menus.forTray());
    tray.on('click', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
  },

  /**
   * Enables or disables menu auto hiding
   */
  switchAutoHideMenu() {
    const isAutoHide = !settings.get('autoHideMenu');
    win.setAutoHideMenuBar(isAutoHide);
    win.setMenuBarVisibility(!isAutoHide);
    settings.set('autoHideMenu', isAutoHide);
  },

  /**
   * Go to previous page on history.
   */
  goBack() {
    if (win.webContents.canGoBack()) {
      win.webContents.goBack();
    }
  },

  /**
   * Go to next page on history.
   */
  goForward() {
    if (win.webContents.canGoForward()) {
      win.webContents.goForward();
    }
  },

  /**
   * Generates and displays a clear data dialog.
   */
  showClearDataDialog() {
    dialog.showMessageBox(win, {
      type: 'warning',
      buttons: ['Yes', 'Cancel'],
      defaultId: 1,
      title: 'Clear data',
      message: 'This will clear all data.\n\nDo you want to proceed?',
    }).then((result) => {
      if (result.response === 0) {
        this.clearData();
      }
    });
  },

  /**
   * Generates and displays an about dialog.
   */
  showAboutDialog() {
    dialog.showMessageBox(win, {
      type: 'info',
      icon: icon('logo'),
      buttons: ['Ok'],
      defaultId: 0,
      title: 'About',
      message: `${APP_NAME} ${APP_VERSION}\n\n${APP_DESCRIPTION}\n\nElectron ${ELECTRON_VERSION}\n\n${win.webContents.getUserAgent()}`,
    });
  },

  /**
   * Sets the app & tray titles.
   *
   * @param {string} title The webpage title
   */
  setTitles(title) {
    let fixedTitle = title;

    let match = /^\((\d+)\)(.+)/.exec(title);
    if (match) {
      fixedTitle = match[2].trim();
    } else {
      match = /^(•)(.+)/.exec(title);
      if (match) {
        fixedTitle = match[2].trim();
      }
    }

    win.webContents.executeJavaScript('typeof BC === \'undefined\' ? 0 : BC.unreads.all', false, (result) => (result)).then((result) => {
      const unreads = result.length;

      win.setTitle(unreads > 0 ? `${fixedTitle} • ${unreads}` : fixedTitle);

      tray.setToolTip(unreads > 0 ? `${APP_NAME} • ${unreads}` : APP_NAME);

      if (unreads > 0) {
        if (!unreadsNotified) {
          notification(`You have ${unreads} unread notifications`);
          unreadsNotified = true;
        }

        if (settings.get('showBadge')) {
          this.setIcons(`-unreads-${(unreads > 10 ? '10p' : unreads)}`);
        } else {
          this.setIcons('-unreads');
        }
      } else {
        this.setIcons();
      }
    });
  },

  /**
   * Sets the app & tray icons.
   */
  setIcons(suffix) {
    win.setIcon(icon(`icon${suffix ? '-unreads' : ''}`));
    tray.setImage(icon(`tray${suffix || ''}`));
  },

  /**
   * Clears all the app data.
   */
  clearData() {
    const { session } = win.webContents;
    session.clearStorageData().then(() => {
      session.clearCache().then(() => {
        win.loadURL(BASECAMP_URL);
      });
    });
  },

  /**
   * Configures the icon scheme.
   *
   * @param {string} color
   */
  configureIconScheme(color) {
    settings.set('iconScheme', color);
    win.reload();
  },

  /**
   * Configures the icon badge showing.
   *
   * @param {string} color
   */
  configureShowBadge(config) {
    settings.set('showBadge', config);
    win.reload();
  },
};

// --- Build the app

app.disableHardwareAcceleration();

app
  .on('window-all-closed', () => {
    app.quit();
  })
  .on('ready', () => {
    basecamp.buildApp(BASECAMP_URL);
  })
  .on('activate', () => {
    if (win === null) {
      basecamp.buildApp(BASECAMP_URL);
    }
  });
