import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://http://157.230.191.218:8080',
  apiUrlMl: 'http://http://157.230.191.218:5000'
};
