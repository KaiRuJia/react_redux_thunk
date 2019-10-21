### react + webpack项目搭建流程

> 1. mkdir react_webpack
> 2. cd react_webpack
> 3. npm init -y 
> 4. npm i webpack webpack-cli -D 

```bash
-y  就是yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json
```
```bash
-D 等价与 --save-dev 安装模块并保存到 package.json 的 devDependencies中，主要在开发环境中的依赖包
```

> 5. package.json 添加构建脚本
```bash
"scripts": {
  "build": "webpack"
}
```
> 6. 创建一个 ./src/index.js 执行 `npm run build`命令,会自动生成`dist`文件

```bash
webpack4 的零配置值的是：
入口文件，默认的是./src/index.js
出口文件，默认的是./dist/main.js
生产和开发模式（无需创建两套配置文件）

在以前的版本里 webpack 的入口文件需要在配置文件 webpack.config.js 里指定。
但是现在不需要了，它会默认选择 ./src/index.js 这个文件。

```
> 7. 生产和开发模式
```bash
package.json 文件添加如下脚本

"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}

npm run dev   # dist的main.js文件没有压缩 
npm run build # dist的main.js文件被压缩了
```
> 8. 覆盖默认的入口/出口文件
```bash
# 方法一：不使用配置文件的方法
可以在package.json文件里配置：
"scripts": {
  "dev": "webpack --mode development ./src/mian1.js --output ./dist/main.js",
  "build": "webpack --mode production ./src/mian1.js --output ./dist/main.js"
}
```
> 9. babel 的安装
```javascript
npm i -D babel-loader   # 加载器
npm i -D '@babel/core'  #babel核心包，babel-loader的核心依赖
npm i -D '@babel/runtime' #babel编译时只转换语法，几乎可以编译所有时新的js语法，但并不会转化DOM（浏览器）里面不兼容的API。如Promise,Set,Symbol,Array.from,async等等一些API，需要用'@babel/runtime'和'@babel/plugin-transform-runtime'这个两个babel包
npm i -D '@babel/plugin-transform-runtime'
npm i -D '@babel/plugin-proposal-class-properties' #用来解析类的属性
npm i -D '@babel/preset-env'  #处理转译需求
npm i -D '@babel/preset-react' #安装react相关

新建.babelrc文件
{
    "presets": ["@babel/preset-env","@babel/preset-react"],
    "plugins": ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"]
}
修改webpack.dev.js文件的配置
module:{
        rules:[
            { 
                test:/\.js$/,
                exclude:/node_modules/,
                use: {
                    loader:'babel-loader'
                }
            }
        ]
    },
这个几个包是必须安装的
```    

```javascript
babel8的特点如下：
1.包的名字都是以@开头；
2.安装的所有babel包，都在node_modules中的@bable文件夹中；
3.babel7.X版本中用到的babel-preset-stage-0被废弃；
```



***

#方法二：使用配置文件的用法
在根目录新建一个webapck.config.js文件

const path = require("path")
module.exports = {
    //入口文件的配置项
    entry:{
        main11:'./src/main1.js',
        main22:'./src/main2.js'
    },
    //出口文件的配置项
    output:{
        //打包的路径
        path:path.resolve(__dirname,'./dist'),
        //打包的文件名称
        filename:'[name].js' // 这里[name]是告诉我们入口进去的文件是什么名字，打包出来也同样是什么名字
    },
    //模块：例如css,图片如何转换，压缩
    module:{},
    //插件，用于生产模版和各项功能
    plugins:[],
    //配置webpack开发服务功能
    devServer:{}
}

修改package.json文件
"scripts": {
    "dev":"webpack --mode development --config webpack.config.js",
    "build":"webpack --mode production --config webpack.config.js",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

#### 安装过程遇到的问题
> 问题1
```bash
npm ERR! Unexpected token < in JSON at position 0 while parsing near '<!DOCTYPE html>
npm ERR! <htm...'

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/jkr/.npm/_logs/2019-06-11T13_40_12_359Z-debug.log
```
```bash 
 webpack 和webpack-cli分开安装

 npm i webpack -D
 npm i webpack-cli D
```
> 问题2 
```

```



需要解决的问题：
模块按需加载；
dist清理；
热启动；
打包压缩；
打包分离；
css 模块化；
less sass预处理器；
加载图片


## webpack-dev-server配置属性

## devToop属性值

### 样式模块安装与配置  css module   less 