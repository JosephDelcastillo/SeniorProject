const { createProxyMiddleware } = require('http-proxy-middleware');
const API = false ? "http://localhost:7071" : "https://epots-api.azurewebsites.net";

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: API,
            changeOrigin: true,
        })
    );
};