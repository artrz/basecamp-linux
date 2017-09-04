<h1 align="center">
<img src="https://raw.githubusercontent.com/arturock/basecamp-linux/master/resources/basecamp-full-stacked.png" width="466" height="390">
</h1>

# Basecamp Desktop for Linux

Unofficial [Basecamp](https://basecamp.com/) GNU/Linux desktop client built with [Electron](http://electron.atom.io/).

## Features

- Native notifications
- Context menu on links
- Basic UI settings
- Tray icon
  - Unread count badge
  - Left click to show / hide app
  - Right click for tray menu

The application menu is hidden by default, to show it press the `alt` key.

## Privacy

No information is collected or tracked by the application, Electron however will save some data as with any webview. It is possible to purge that information with an in-app function: _menu -> file -> 'Clear data'_ will erase all stored information and cache (any open session will be lost).

## Prerequisites

As any GNU/Linux Electron application `libappindicator1` is required for [tray icon](https://github.com/electron/electron/blob/master/docs/api/tray.md) and `libnotify` for [notifications](https://github.com/electron/electron/blob/master/docs/tutorial/notifications.md) but most likely they are already installed.

## Installation

Download the [latest release](https://github.com/arturock/basecamp-linux/releases).

## Manual build

Required tools:
- Node
- Npm
- Yarn

Clone this repo, cd to the local copy and run
```sh
npm run build:64
# or npm run build:32
```

That will create a `dist/basecamp-linux-*` directory with the application.

## License

Check the [LICENSE](./LICENSE) file.

## Changelog

- 0.1.0
  - First release

## Disclosure

This application is not affiliated, authorized, endorsed by or in any way officially connected with Basecamp.
