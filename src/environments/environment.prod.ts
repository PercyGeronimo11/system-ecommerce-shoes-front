import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://157.230.191.218:8080',
  apiUrlMl: 'http://157.230.191.218:5000'
};
