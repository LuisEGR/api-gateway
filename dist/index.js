"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_colors_1 = require("logger-colors");
var express_1 = __importDefault(require("express"));
var apis_controller_1 = require("./controllers/apis.controller");
var gateway_controller_1 = require("./controllers/gateway.controller");
var data_controller_1 = require("./controllers/data.controller");
var logger = new logger_colors_1.Logger();
var port = Number(process.env.PORT) || 3002;
var dataC = data_controller_1.DataGatewayController.getInstance();
var app = express_1.default();
apis_controller_1.autoDiscovery(true).then(function () {
    app.listen(port, function () {
        logger.success('');
        logger.success("API Gateway Ready", true);
        logger.success("Listening on port " + port, true);
    });
});
var timeInt = parseInt(process.env.INTERVAL_DISCOVERY || '6000', 10);
// Find apis every 1 minute
setInterval(function () {
    apis_controller_1.autoDiscovery();
}, timeInt);
app.get('/describe', function (req, res) {
    res.sendStatus(404);
});
app.get('/discover', function (req, res) {
    dataC.deleteCache();
    apis_controller_1.autoDiscovery().then(function (apis) {
        res.send(apis);
    });
});
app.use(gateway_controller_1.GatewayController);
exports.default = app;
//# sourceMappingURL=index.js.map