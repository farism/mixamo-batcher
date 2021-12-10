import path from 'path'

export default {
  mode: 'production',
  entry: {
    'background.js': path.resolve('./src/background.ts'),
    'inject-custom-xhr.js': path.resolve('./src/inject-custom-xhr.ts'),
    'custom-xhr.js': path.resolve('./src/custom-xhr.ts'),
    'content.js': path.resolve('./src/content.ts'),
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve('./tsconfig.chrome.json'),
        },
      },
    ],
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name]',
  },
}
