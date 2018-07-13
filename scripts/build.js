#!/usr/bin/env node

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* eslint-disable import/no-dynamic-require, no-console */

const cp = require('child_process');
const fs = require('fs');
const lzma = require('lzma-native');
const minimist = require('minimist');
const packager = require('electron-packager');
const path = require('path');
const tar = require('tar');

const pkg = require(path.join(__dirname, '..', 'app', 'package.json'));

const APP_NAME = pkg.baseName;
const APP_VERSION = pkg.version;
const SOURCE_PATH = path.join(__dirname, '..', 'app');
const ASSETS_PATH = path.join(__dirname, '..', 'assets');
const BUILD_PATH = path.join(__dirname, '..', 'build');
const DIST_PATH = path.join(__dirname, '..', 'dist');
const NODE_MODULES_PATH = path.join(__dirname, '..', 'node_modules');
const E_VERSION = require(path.join(NODE_MODULES_PATH, 'electron', 'package.json')).version;

const PACKAGE_CONFIG = {
  dir: SOURCE_PATH,
  out: BUILD_PATH,
  name: APP_NAME,
  appVersion: APP_VERSION,
  buildVersion: APP_VERSION,
  electronVersion: E_VERSION,
  extraResource: [`${ASSETS_PATH}`],
  packageManager: 'yarn',
  platform: 'linux',
};

const ARGS = minimist(process.argv.slice(2), {
  boolean: ['compress'],
  string: ['package'],
  default: {
    arch: 'ia32,x64',
    compress: false,
  },
});

const builder = {
  build() {
    builder.reinstallModules();
    builder.deleteDir(BUILD_PATH);
    builder.deleteDir(DIST_PATH);
    builder.package();
  },

  reinstallModules() {
    console.log('\nReinstalling node_modules...');
    cp.execSync('yarn install', { stdio: 'inherit' });
  },

  deleteDir(pathToDelete) {
    console.log(`\nDeleting ${pathToDelete}...`);
    cp.execSync(`rm -rf ${pathToDelete}`, { stdio: 'inherit' });
  },

  package() {
    console.log('\nPackaging app...');

    const arch = { arch: ARGS.arch.split(',') };

    packager(Object.assign({}, PACKAGE_CONFIG, arch))
      .then((appPaths) => {
        appPaths.forEach((appPath) => {
          if (ARGS.compress) {
            builder.compress(appPath);
          }
        });
      }, (err) => {
        console.log('An error ocurred:');
        return builder.printDone(err);
      });
  },

  compress(appPath) {
    const basePath = path.dirname(appPath);
    const appDir = path.basename(appPath);
    const name = path.basename(appPath).replace(APP_NAME, `${APP_NAME}-${APP_VERSION}`);
    const filename = `${name}.tar.xz`;
    cp.execSync(`mkdir -p ${DIST_PATH}`, { stdio: 'inherit' });

    console.log(`\nGenerating ${filename}...`);

    tar
      .c({ sync: true, cwd: basePath }, [appDir])
      .pipe(lzma.createCompressor())
      .pipe(fs.createWriteStream(path.join(DIST_PATH, filename)))
      .on('finish', () => {
        console.log(` ${filename} ready`);
        builder.deleteDir(appPath);
      });
  },

  printDone(err) {
    if (err) {
      console.error(err.message || err);
    }
  },
};

builder.build();
