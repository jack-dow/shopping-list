import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tech.tkit.app',
  appName: 'shopping-list',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.155.26:3000',
  },
};

export default config;
