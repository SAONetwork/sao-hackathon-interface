module.exports = {
	// 基本路径
	publicPath: './',
	// 输出文件目录
	outputDir: 'sao-ui',
	// 取消eslint代码校验
	lintOnSave: false,
	// webpack-dev-server 相关配置
	devServer: {
		open: true,
		host: '0.0.0.0',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: null,
		before: app => {}
	},
	productionSourceMap: false,
	configureWebpack: config => {
		// 生产环境下使用gzip
		if (process.env.NODE_ENV === 'production') {
			const CompressionWebpackPlugin = require('compression-webpack-plugin')
			// 增加浏览器CPU（需要解压缩）， 减少网络传输量和带宽消耗 （需要衡量，一般小文件不需要压缩的）
			// 图片和PDF文件不应该被压缩，因为他们已经是压缩的了，试着压缩他们会浪费CPU资源而且可能潜在增加文件大小。
			config.plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]', // asset -> filename
					algorithm: 'gzip',
					test: /\.(js|css)$/,
					threshold: 10240, // 达到10kb的静态文件进行压缩 按字节计算
					minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
					deleteOriginalAssets: false // 是否删除压缩的源文件
				})
			)
		}
	}
}
