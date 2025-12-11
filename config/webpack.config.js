const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  // Default to mocks in development mode
  // Check both process.env and explicit 'true'/'false' values
  const useMocks = process.env.USE_MOCKS === 'true' ||
                   (process.env.USE_MOCKS === undefined && isDevelopment)
    ? 'true'
    : 'false';

  console.log(`[Webpack] USE_MOCKS: ${useMocks} (from env: ${process.env.USE_MOCKS}, isDevelopment: ${isDevelopment})`);

  return {
    entry: './src/frontend/main.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../public/dist'),
      publicPath: '/dist/',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@/frontend': path.resolve(__dirname, '../src/frontend'),
        '@/shared': path.resolve(__dirname, '../src/shared')
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.frontend.json')
            }
          },
          exclude: /node_modules/
        }
      ]
    },
    devtool: isDevelopment ? 'source-map' : false,
    devServer: {
      static: {
        directory: path.join(__dirname, '../public')
      },
      port: 8080,
      hot: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:8081'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.USE_MOCKS': JSON.stringify(useMocks),
        'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:8080'),
        'process.env.GOOGLE_CLIENT_ID': JSON.stringify(process.env.GOOGLE_CLIENT_ID || '')
      })
    ]
  };
};
