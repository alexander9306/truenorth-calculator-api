const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = (options, webpack) => {
  // Tell webpack to ignore specific imports that aren't
  // used by our Lambda but imported by NestJS (can cause packing errors).

  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    '@nestjs/platform-express',
    'swagger-ui-express',
    'class-transformer/storage',
    'pg-native',
  ];

  return {
    ...options,
    externals: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
    entry: {
      index: './src/serverless.ts',
    },
    output: {
      filename: 'main.js',
      libraryTarget: 'commonjs2',
      path: path.join(process.cwd(), '/dist'),
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
