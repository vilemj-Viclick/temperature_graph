import HTMLWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import {
  Configuration,
  ProvidePlugin,
} from 'webpack';

export const webpackConfig: Configuration = {
  mode: 'none',
  cache: true,
  entry: {
    'client': path.join(__dirname, '../../client/index.ts'),
  },
  output: {
    path: path.join(__dirname, '../../../public/build'),
    publicPath: '/build/',
    filename: '[name]_[chunkhash].js',
    chunkFilename: '[name]_[chunkhash].js',
    pathinfo: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.less'],
    alias: {
      process: 'process/browser',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      }, {
        test: /\.pug$/,
        use: 'pug-loader',
      },
    ],
    strictExportPresence: true,
  },
  node: {
    __filename: true,
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(__dirname, '../templates/client.pug'),
      scriptLoading: 'defer',
      filename: 'client.html',
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
