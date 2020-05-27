const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//  配置模版html
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css 压缩
const webpack = require('webpack')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dev_ENV = process.env.npm_lifecycle_script.split('--mode=')[1] == 'development'

// 主题路径
const THEME_PATH = '../src/styles/theme';
const styleLoaders = [{ loader: 'css-loader' }, { loader: 'less-loader' }];

const resolveToThemeStaticPath = fileName => path.resolve(__dirname, THEME_PATH + '/' +fileName);

const themeFileNameSet = fs.readdirSync(path.resolve(__dirname, THEME_PATH));
const themePaths = themeFileNameSet.map(resolveToThemeStaticPath);
process.env.themes = themePaths
const getThemeName = fileName => `theme-${path.basename(fileName, path.extname(fileName))}`;
// 全部 ExtractLessS 的集合
const themesExtractLessSet = themeFileNameSet.map(fileName => new ExtractTextPlugin(`${getThemeName(fileName)}.css`))
// 主题 Loader 的集合
const themeLoaderSet = themeFileNameSet.map((fileName, index) => {
  return {
    test: /\.(less|css)$/,
    include: resolveToThemeStaticPath(fileName),
    loader: themesExtractLessSet[index].extract({
      use: styleLoaders
    })
  }
});

module.exports = {
  entry:{
    index: path.resolve(__dirname, '../src/index.js'),
    theme: path.resolve(__dirname, '../src/theme.js')
  },
  output:{
    path: path.resolve(__dirname, '../build'),
    // publicPath:NODE_ENV?'/':'/assets/',// cdn
    publicPath: './',// cdn
    filename: '[name].[hash].js' 
  },
  resolve:{
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.json', '.css'],//自动解析确定的扩展,省去你引入组件时写后缀的麻烦
    alias: {//非常重要的一个配置，它可以配置一些短路径，
      '@component': path.resolve(__dirname, '../src/component'),
      '@static': path.resolve(__dirname, '../src/static'),
      '@container': path.resolve(__dirname, '../src/container'),
      '@redux': path.resolve(__dirname, '../src/redux'),
      '@store': path.resolve(__dirname, '../src/store'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@styles': path.resolve(__dirname, '../src/styles'),
    },
    modules: ['node_modules'],//webpack 解析模块时应该搜索的目录，
  },
  module:{
    rules:[
      { // babel
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader?cacheDirectory=true',
            options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ],
                plugins: [
                    '@babel/plugin-transform-runtime', 
                    '@babel/plugin-syntax-dynamic-import',
                    [ 'react-css-modules', {
                      'filetypes': {
                        '.less': {
                            "syntax": 'postcss-less'
                        }
                      },
                      "generateScopedName": "[local]--[hash:base64:5]"
                    }],
                    ['@babel/plugin-proposal-decorators', { 'legacy': true} ],
                    ['@babel/plugin-proposal-class-properties', { 'loose': true} ],
                    ['@babel/plugin-proposal-object-rest-spread', { 'loose': true, 'useBuiltIns': true }],
                    ['import', { libraryName: "antd", style: true }, 'antd'],
                    ['import', { libraryName: 'antd-mobile', style: true }, 'antd-mobile']
                ]
            },
          },
        ]
      },
      { // eslist
        test: /\.js$/,
        enforce: 'pre', // 在webpack编译之前进行检测
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
              formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
              emitWarning: true,
              fix: true //启用 ESLint自动修复功能
            }
          }
        ]
      },
      { // css
        test: /\.css$/,
        exclude: path.resolve(__dirname, '../src/styles/theme'),
        use: [
          { loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      },
      { // less
        test: /\.less$/,
        exclude: [/node_modules/, path.resolve(__dirname, '../src/styles/theme')],
        use: [
          { loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader', //  负责读取css文件 放在后面的先被解析
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer') 
              ]
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      { // lessAntd lessAntdMobile
        test: /\.less$/, // 配置antd 的主题颜色
        include: [/antd/, /antd-mobile/],
        use: [
          {
            loader: dev_ENV ? 'style-loader' : MiniCssExtractPlugin.loader,//css内容注入到js里面去 MiniCssExtractPlugin.loader 将css样式统一打包进一个css文件，然后以link标签的形式嵌入页面进行资源请求
          },
          { loader: 'css-loader' },
          { 
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,    //允许通过js调用antd组件
              // modifyVars: { ...theme }
            }
          },
        ]
      },
      { // html
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: { 
            minimize: true 
          }
        }]
      },
      { // img
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          { 
            loader: 'image-webpack-loader' // 图片压缩
          }
        ]
      },
      { // font
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader'
      },
      { // font
        test: /\.(woff|woff2|svg|ttf|eot)$/,
        use:[
          {
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[ext]'
            }
          }//项目设置打包到dist下的fonts文件夹下
       ]
      },
      ...themeLoaderSet
    ]
  },
  optimization: { //优化
    minimize: true,//true/false,告诉webpack是否开启代码最小化压缩，
    removeEmptyChunks: true,//bool 值，它检测并删除空的块。将设置为false将禁用此优化，
    splitChunks: {
      cacheGroups: { //自定义配置决定生成的文件,缓存策略
        vendor: { // 项目基本框架等
          name: 'vendor',  // 打包后的文件名，任意命名
          chunks: 'initial', // 代码块类型 必须三选一： "initial"（初始化） | "all"(默认就是all) | "async"（动态加载） 
          test: /node_modules/, // 正则规则验证，如果符合就提取 chunk
          priority: 10, // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          enforce: true
        },
        asyncCommons: { // 异步加载公共包、组件等
          name: 'asyncCommons',
          chunks: 'async',
          minChunks: 2,
          priority: 90,
        },
        commons: { // 其他同步加载公共包
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 80,
        }
      }
    }
  },
  plugins:[
    // new CleanWebpackPlugin(),// 删除文件 保留新文件
    new HtmlWebpackPlugin({
      inject: true,//所有JavaScript资源插入到body元素的底部
      template: path.resolve('./src', 'index.html'),
      filename: 'index.html',
      // excludeChunks: ['theme']
      // minify:{ //压缩HTML文件
      //   removeComments:true,    //移除HTML中的注释
      //   collapseWhitespace:true    //删除空白符与换行符
      // }
      // hash: true, // 会在打包好的bundle.js后面加上hash串,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    ...themesExtractLessSet,
    new webpack.DefinePlugin({
      'process.env.themes': JSON.stringify(themeFileNameSet.map(fileName => fileName.replace('.less', '')))
    })
  ]
}