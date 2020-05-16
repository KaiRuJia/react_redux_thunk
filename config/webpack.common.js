const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')//  配置模版html
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css 压缩
const webpack = require('webpack')
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const dev_ENV = process.env.npm_lifecycle_script.split('--mode=')[1] == 'development'
// const theme = require(path.resolve(__dirname, '../src/static/comcss/theme.js'))

module.exports = {
  entry:{
    index: path.resolve(__dirname, '../src/index.js'),
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
        include: path.resolve(__dirname, '../src'),
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
      }
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
    new AntDesignThemePlugin({
      antDir: path.join(__dirname, '../node_modules/antd'),//antd包位置
      stylesDir: path.join(__dirname, '../src/styles/theme'),//主题文件所在文件夹
      varFile: path.join(__dirname, '../src/styles/theme/variables.less'),// 自定义默认的主题色
      indexFileName: '../build/index.html', // index.html所在位置
      mainLessFile: path.join(__dirname, '../src/styles/theme/index.less'), // 项目中其他自定义的样式（如果不需要动态修改其他样式，该文件可以为空）
      outputFilePath: path.join(__dirname, '../build/theme/color.less'),//提取的less文件输出到什么地方
      themeVariables: [ //要改变的主题变
          '@primary-color',
          '@text-color-secondary',
      ],
      generateOnce: false //是否只生成一次
    })
  ]
}