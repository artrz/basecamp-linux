const { app, Notification, BrowserWindow } = require('electron');
const icon = require('./icon');

module.exports = (content) => {
  const myNotification = new Notification({
    title: app.name,
    body: content,
    icon: icon('icon'),
  });

  myNotification.on('click', () => {
    BrowserWindow.getAllWindows()[0].show();
  });

  myNotification.show();
};
