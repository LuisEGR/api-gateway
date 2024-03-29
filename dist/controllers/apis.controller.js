"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var data_controller_1 = require("./data.controller");
var logger_colors_1 = require("logger-colors");
var dataCtrl = data_controller_1.DataGatewayController.getInstance();
var logger = new logger_colors_1.Logger();
function autoDiscovery(printAll) {
    var _this = this;
    if (printAll === void 0) { printAll = false; }
    return new Promise(function (resolve, reject) {
        var services = [];
        var servicesProcesed = 0;
        var servicesFound = Object.keys(process.env)
            .filter(function (e) {
            return e.match(/^.*PORT_(\d+)\_TCP_ADDR/);
        });
        if (!servicesFound.length)
            resolve([]);
        servicesFound.forEach(function (s) {
            var match = s.match(/^.*PORT_(\d+)\_TCP_ADDR/);
            var port = match ? match[1] : null;
            var url = 'http://' + process.env[s] + ':' + port + '/describe';
            request_1.default.get(url, { timeout: 1000 }, function (err, res, body) {
                servicesProcesed++;
                if (err == null) {
                    var b_1;
                    try {
                        b_1 = JSON.parse(body);
                    }
                    catch (e) { // Error no JSON
                        b_1 = {
                            apis: [],
                        };
                    }
                    b_1.apis = b_1.apis.map(function (api) {
                        api.host = 'http://' + process.env[s];
                        if (b_1.service) {
                            api.host = 'http://' + b_1.service;
                        }
                        api.port = port;
                        api._id = Buffer.from(api.endpoint + api.method + api.host).toString('base64');
                        api._foundAt = moment_timezone_1.default().tz('America/Mexico_City').format();
                        api._lastRequest = null;
                        return api;
                    });
                    b_1.apis.forEach(function (api) {
                        var apiToSave = {
                            endpoint: api.endpoint,
                            host: api.host,
                            name: api.name,
                            port: api.port,
                            method: api.method,
                            version: b_1.version,
                            totalRequests: 0,
                        };
                        services.push(apiToSave);
                        dataCtrl.addApi(apiToSave).then(function (row) {
                            if (typeof row !== 'string') {
                                var infoApi = 'NEW API FOUND: ' +
                                    '[' + row.insertedId + '] ' +
                                    '[v' + apiToSave.version + '] ' +
                                    apiToSave.method + ' ' +
                                    apiToSave.host + ':' + apiToSave.port
                                    + '' + apiToSave.endpoint;
                                //  logger.info(infoApi);
                                logger.warn(infoApi);
                            }
                        });
                    });
                }
                if (servicesProcesed === servicesFound.length) {
                    resolve(services);
                }
            });
        });
    }).then(function (apis) { return __awaiter(_this, void 0, void 0, function () {
        var all;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!printAll) return [3 /*break*/, 2];
                    return [4 /*yield*/, dataCtrl.getAllApis()];
                case 1:
                    all = _a.sent();
                    logger.info('');
                    logger.info("[ SERVING APIS ]", true);
                    logger.info('');
                    all.forEach(function (api) {
                        var logServing = '';
                        logServing += getColor(api.method);
                        logServing += api.method + ' ';
                        logServing += logger_colors_1.LColor.c_gray;
                        logServing += api.endpoint;
                        logger.info(logServing);
                    });
                    _a.label = 2;
                case 2: return [2 /*return*/, apis];
            }
        });
    }); }).catch(function (e) { return console.error(e); });
}
exports.autoDiscovery = autoDiscovery;
function getColor(method) {
    switch (method) {
        case 'GET': return logger_colors_1.LColor.c_green;
        case 'POST': return logger_colors_1.LColor.c_cyan;
        default: return logger_colors_1.LColor.c_white;
    }
}
//# sourceMappingURL=apis.controller.js.map