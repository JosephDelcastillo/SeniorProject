const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    const API = true ? "http://localhost:7071" : "https://epots-api.azurewebsites.net/";
    app.use(
        '/api',
        createProxyMiddleware({
            target: API,
            changeOrigin: true,
        })
    );
};