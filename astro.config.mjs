import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://settingdust.github.io/',
  base: '/maven/',
  build: {
    assets: '_astro'
  },
  siteName: 'SettingDust\'s Maven'
});
