
module.exports = {
  // eslint-disable-next-line no-unused-vars
  webpack(config, env) {
    const definePluginConfig = {
      'process.env': {
        NODE_ENV: JSON.stringify(config.mode),
        SERVER_URL: JSON.stringify(env !== 'production'? process.env.SERVER_URL||'':''),
      },
    };
    // ...add your webpack config
    return config;
  },
  jest(config) {
    return config;
  },
  // eslint-disable-next-line no-unused-vars
  paths(paths, env) {
    return paths;
  },
}
