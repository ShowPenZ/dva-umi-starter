import VConsoleWebpackPlugin from 'vconsole-webpack-plugin';
import URLDefine from './url.pre';
import ConstURl from './url';

const chainWebpack = config => {
  config.plugin('vconsole').use(VConsoleWebpackPlugin, [
    {
      enable: false,
    },
  ]);
};

const CDN_HOST = '';
const BASE_PATH = '/';
const PUBLIC_PATH = `${CDN_HOST}${BASE_PATH}`;

const define = {
  ...URLDefine,
  ...ConstURl,
};

// https://umijs.org/config/
export default {
  base: BASE_PATH,
  publicPath: PUBLIC_PATH,
  cssPublicPath: PUBLIC_PATH,

  chainWebpack,
  define,
  // extraBabelPlugins: [],
  manifest: {
    basePath: PUBLIC_PATH,
  },
  cssLoaderOptions: {
    localIdentName: '[hash:base64:8]',
  },
};
