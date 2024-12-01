const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: "dist",
    publicPath: '/',
    devServer: {
        proxy: {
            '/api': {
                target: process.env.VUE_APP_SERVER || 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});