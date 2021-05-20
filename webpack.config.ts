import slsw from 'serverless-webpack';
import { join } from 'path';
import TerserPlugin from 'terser-webpack-plugin';

const isLocal = slsw.lib.webpack.isLocal;

module.exports = {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    resolve: {
      extensions: [ '.js', '.jsx', '.json', '.ts', '.tsx' ]
    },
    output: {
      libraryTarget: 'commonjs2',
      path: join(__dirname, '.webpack'),
      filename: '[name].js'
    },
    target: 'node',
    module: {
      rules: [
        {
          // Include ts files.
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: ['ts-loader']
        }
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({ 
          terserOptions: { 
            mangle: false 
          } 
        })
      ]
    },
  };