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

Download the [latest release](https://github.com/arturock/basecamp-linux/releases) and extract it on your Applications directory. Run the app by executing the `basecamp` file.

Optionally copy the desktop file `basecamp-linux-*/resources/assets/basecamp.desktop` to your launchers dir (e.g. `~/.local/share/applications`). Note you'll need to configure it to point to the correct app location and select the icon color (white / black) depending on your desktop color scheme.

## Manual build

Required tools:
- Node ^19.0.0
- Yarn ^3.0.0

Clone this repo, cd to the local copy and run
```sh
yarn install

npm run build:64
# or npm run build:32
```

That will create a `build/basecamp-linux-*` directory with the application.

## Troubleshooting

If the app fails to open, execute it from a terminal to see any possible trace. If you're getting the error
```
[...] GPU process isn't usable. Goodbye.
```

You may need to add the `--disable-gpu-sandbox` flag when running the app. If you're using the .desktop file just append the flag to the Exec command.

## License

Check the [LICENSE](./LICENSE) file.

## Disclosure

This application is not affiliated, authorized, endorsed by or in any way officially connected with Basecamp.
