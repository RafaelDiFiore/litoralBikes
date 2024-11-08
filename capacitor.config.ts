import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'NEW_DRESS',
  webDir: 'www'
};

{
  "plugins": {
    "Camera": {
      "permissions": ["camera"]
    }
  }
}

export default config;
