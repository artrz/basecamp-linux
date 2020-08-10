const { app, net } = require('electron');
const packageRepo = require('./package.json').repository.url;

module.exports = {
  config: {
    repositoryHost: 'raw.githubusercontent.com',
    repositoryPath: packageRepo.match(/https:\/\/github.com\/(.+).git/)[1],
    packageFilePath: 'master/app/package.json',
  },

  check() {
    return new Promise((resolve) => {
      const config = {
        method: 'GET',
        protocol: 'https:',
        hostname: this.config.repositoryHost,
        port: 443,
        path: `${this.config.repositoryPath}/${this.config.packageFilePath}`,
      };

      let body = '';
      const request = net.request(config);

      request.on('response', (response) => {
        response.on('data', (chunk) => {
          body += chunk.toString();
        });

        response.on('end', () => {
          const repoVersion = JSON.parse(body.trim()).version;

          resolve({
            repoVersion,
            appVersion: app.getVersion(),
            comparison: this.compareVersions(app.getVersion(), repoVersion),
          });
        });
      });

      request.end();
    });
  },

  /**
   * Returns -1 if first parameter is higher, 0 if the same, 1 if second parameter is higher.
   */
  compareVersions(v1, v2) {
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');

    for (let i = 0; i < 3; i += 1) {
      const s1 = Number(v1Parts[i]);
      const s2 = Number(v2Parts[i]);

      if (s1 > s2) {
        return -1;
      }
      if (s1 < s2) {
        return 1;
      }
    }

    return 0;
  },
};
