const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
    transpileDependencies: true,
    outputDir: "dist",
    devServer: {
        proxy: {
            '/api': {
                target: process.env.VUE_APP_SERVER || 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});