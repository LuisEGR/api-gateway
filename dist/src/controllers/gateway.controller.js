"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var logger_colors_1 = require("logger-colors");
var request_1 = __importDefault(require("request"));
var data_controller_1 = require("./data.controller");
var log_request_stream_1 = require("src/streams/log.request.stream");
var router = express_1.Router();
var logger = new logger_colors_1.Logger();
var dataCtrl = new data_controller_1.DataGatewayController();
var separador = '----------------------------------------------------';
// La ruta depende de donde se monte este controller en server.ts, en
// este caso este controller está en /general, por lo tanto esta
// ruta está ligada a /general/registroInicial
// Usando 'wrap' no tenemos que hacer try-catch para los métodos async
router.all('*', function (req, res) {
    console.log("Requesting....");
    console.log("req.url:", req.url);
    console.log("req.method:", req.method);
    // getApi(req.method, req.url);
    var apib = { method: req.method, endpoint: req.url };
    dataCtrl
        .getApi(apib)
        .then(function (api) {
        console.log("api:", api);
        // dataCtrl.registerNewRequest(apib)
    });
    var logReq = new log_request_stream_1.LogRequestStream();
    req
        .pipe(logReq)
        .pipe(request_1.default.post('https://postman-echo.com/post')).pipe(res);
});
// Export the express.Router() instance to be used by server.ts
exports.GatewayController = router;
