/* eslint-disable no-undef, func-names */
const { ipcRenderer: ipc, remote } = require('electron');

const integration = {
  notifications() {
    const NativeNotification = Notification;
    Notification = function (title, options) {
      const notification = new NativeNotification(title, options);
      notification.addEventListener('click', () => {
        ipc.sendToHost(remote.getCurrentWindow().show());
      });
      return notification;
    };
    Notification.prototype = NativeNotification.prototype;
    Notification.permission = NativeNotification.permission;
    Notification.requestPermission = NativeNotification.requestPermission.bind(Notification);
  },
};

integration.notifications();
