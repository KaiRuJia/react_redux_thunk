const webpack = require('webpack')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
    mode:'development',
    devtool: 'source',
    // 配置webpack开发服务功能
    devServer: {
        // contentBase:path.resolve(__dirname,'../dist'),//告诉服务器从哪提供内容，只有在想要提供静态文件时才需要
        /** 用来监听文件是否被改动过
         * aggregateTimeout：一旦第一个文件改变，在重建之前添加一个延迟。填以毫秒为单位的数字。
         * ignored：观察许多文件系统会导致大量的CPU或内存使用量。可以排除一个巨大的文件夹。
         * poll：填以毫秒为单位的数字。每隔（你设定的）多少时间查一下有没有文件改动过。不想启用也可以填false。
        */
        publicPath:'/',
        // publicPath: "/assets/", //和output中publicPath保持一至 用与cdn
        watchOptions:{ 
            aggregateTimeout:300,
            poll:1000,
            ignored:/node_modules/
        },
        host:"localhost",
        /** 服务端压缩是否开启
         * 优点：对JS，CSS资源的压缩率很高，可以极大得提高文件传输的速率，从而提升web性能
         * 缺点：服务端要对文件进行压缩，而客户端要进行解压，增加了两边的负载
        */
        compress:true,           
        port:3000,
        open: true, // 自动打开浏览器
        //这个配置属性用来在编译出错的时候，在浏览器页面上显示错误，默认是false，可设置为true
        overlay:{
            errors:true,
            warnings:false
        },
        disableHostCheck:true,//禁止对 host header 的正确性检测
        stats:"errors-only",//这个配置属性用来控制编译的时候shell上的输出内容,stats: "errors-only"表示只打印错误：
        hot:true,//启用模块热替换特性
        inline:true,//启用内联模式，一段处理实时重载的脚本被插入到bundle中，并且构建消息会出现在浏览器控制台
        //这个配置属性是用来应对返回404页面时定向到特定页面用的,如果为 true ，页面出错不会弹出 404 页面
        historyApiFallback:true,
        /**
         * 配置了 publicPath后， url = '主机名' + 'publicPath配置的' +'原来的url.path'
         * output.publicPath 是作用于 js, css, img 。而 devServer.publicPath 则作用于请求路径上的。
         * // devServer.publicPath
            publicPath: "/assets/"

            // 原本路径 --> 变换后的路径
            http://localhost:8080/app.js --> http://localhost:8080/assets/app.js
         */
        disableHostCheck: true,
        /**当您有一个单独的API后端开发服务器，并且想要在同一个域上发送API请求时，则代理这些 url 
         * 假设你主机名为localhost:3000,请求API的url是http：//your_api_server.com/user/list
         * '/proxy'：如果点击某个按钮，触发请求 API 事件，这时请求 url 是http：//localhost:8080/proxy/user/list
         * changeOrigin：如果 true ，那么 http：//localhost:8080/proxy/user/list 变为 http：//your_api_server.com/proxy/user/list 。但还不是我们要的 url 。
         * pathRewrite：重写路径。匹配 /proxy ，然后变为'' ，那么 url 最终为 http：//your_api_server.com/user/list 。
         */
        proxy:{
            '/proxy':{
                target:'http://your_api_server.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/proxy':''
                }
            }
        }
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin() //用以在运行时更新发生改变的模块，从而无需进行完全刷新
    ],
})