"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var logger_colors_1 = require("logger-colors");
var request_1 = __importDefault(require("request"));
var data_controller_1 = require("./data.controller");
var BodyProcessor_class_1 = require("../extras/BodyProcessor.class");
var router = express_1.Router();
var logger = new logger_colors_1.Logger();
var dataCtrl = data_controller_1.DataGatewayController.getInstance();
var separador = '----------------------------------------------------';
var startRequest = function (req, res, api) {
    var actualTime = (new Date()).getTime();
    var totalTime = 0;
    var bodyRequest = new BodyProcessor_class_1.BodyProcessor();
    var bodyResponse = new BodyProcessor_class_1.BodyProcessor();
    req.on('data', function (c) { return bodyRequest.save(c); });
    req.on('end', function () { return bodyRequest.emit('ready', bodyRequest.getBody()); });
    // logger.info(api._id + '', true);
    var fullUrl = api.host + ':' + api.port + api.endpoint;
    var re = request_1.default[api.method.toLowerCase()](fullUrl, {
        headers: {
            'accept-encoding': 'identity',
        },
    });
    re.on('response', function (response) {
        response.on('data', function (c) { return bodyResponse.save(c); });
        response.on('end', function () { return bodyResponse.emit('ready', bodyResponse.getBody()); });
        response.on('end', function () {
            var endTime = (new Date()).getTime();
            totalTime = endTime - actualTime;
            logger.success('');
            logger.success('');
            logger.success(api.name + ' v' + api.version, true);
            logger.success(api.endpoint, true);
            logger.success('FROM:\t' + getIp(req), false);
            logger.success('USER:\t' + getUser(req), false);
            logger.success('TIME:\t' + totalTime + 'ms', false);
            logger.info(separador);
            logger.cyan('REQUEST', true);
            logger.cyan('METHOD:\t' + api.method, false);
            logger.cyan('URL:   \t' + fullUrl, false);
            logger.cyan('HEADERS:', false);
            Object.keys(req.headers).forEach(function (h) {
                // logger.cyan(h + ":\t" + req.headers[h], false);
                logger.cyan('- ' + h + ": " + logger_colors_1.LColor.c_white + req.headers[h] + logger_colors_1.LColor.c_cyan, false);
            });
            // logger.cyan(JSON.stringify(req.headers), false);
            logger.cyan('', false);
            logger.cyan('BODY:', false);
            var lineasBodyRequest = bodyRequest.getBody().split('\n');
            lineasBodyRequest.forEach(function (l) {
                logger.cyan(l, false);
            });
            // logger.cyan(bodyRequest.getBody(), false);
            logger.info(separador);
            logger.magenta('RESPONSE:', true);
            logger.magenta('STATUS: [' +
                ("" + logger_colors_1.LColor.c_white + response.statusCode + " ") +
                ("" + response.statusMessage + logger_colors_1.LColor.c_magenta + "]"), false);
            logger.magenta('');
            logger.magenta('HEADERS');
            Object.keys(response.headers).forEach(function (h) {
                logger.magenta('- ' + h + ": " + logger_colors_1.LColor.c_white + response.headers[h] + logger_colors_1.LColor.c_magenta, false);
            });
            // logger.magenta(JSON.stringify(response.headers), false);
            logger.magenta('');
            logger.magenta('BODY');
            // logger.magenta(bodyResponse.getBody(), false);
            var lineasBody = bodyResponse.getBody().split('\n');
            lineasBody.forEach(function (l) {
                logger.magenta(l, false);
            });
            logger.info('');
            logger.info('END RESPONSE', true);
            logger.info(separador);
            logger.info('');
            logger.info('');
            logger.info('');
        });
    });
    req.on('error', function (err) {
        logger.error("1-REQUEST ERROR:", err);
        sendError(res, err, api);
    });
    re.on('error', function (err) {
        console.error("2-REQUEST ERROR:", err);
        sendError(res, err, api);
    });
    req.pipe(re).pipe(res);
};
function getIp(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}
function getUser(req) {
    return req.headers['iv-user'] || 'desconocido';
}
function sendError(res, error, api) {
    if (error.code === 'ECONNREFUSED') {
        res.status(500).send({
            message: "Gateway can't connect to service: " + api.name,
            code: error.code,
            port: error.port,
        });
    }
    else {
        res.status(500).send(error);
    }
}
router.all('*', function (req, res) {
    var apib = { method: req.method, endpoint: req.url };
    dataCtrl
        .getApi(apib)
        .then(function (api) {
        if (api && api.method !== 'HEAD') {
            logger.info(separador);
            logger.info("Processing request: " + api.method + ' ' + api.endpoint);
            logger.info('', true);
            startRequest(req, res, api);
        }
        else {
            res.sendStatus(404);
        }
    });
});
exports.GatewayController = router;
//# sourceMappingURL=gateway.controller.js.map