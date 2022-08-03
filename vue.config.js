module.exports = {
	publicPath: './',
	outputDir: 'sao-ui',
	lintOnSave: false,
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
		if (process.env.NODE_ENV === 'production') {
			const CompressionWebpackPlugin = require('compression-webpack-plugin')
			config.plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]', // asset -> filename
					algorithm: 'gzip',
					test: /\.(js|css)$/,
					threshold: 10240, 
					minRatio: 0.8, 
					deleteOriginalAssets: false 
				})
			)
		}
	}
}
