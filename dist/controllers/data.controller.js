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
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var ApiStatus;
(function (ApiStatus) {
    ApiStatus[ApiStatus["NOT_FOUND"] = 0] = "NOT_FOUND";
    ApiStatus[ApiStatus["OK"] = 1] = "OK";
    ApiStatus[ApiStatus["TIMEOUT"] = 2] = "TIMEOUT";
})(ApiStatus = exports.ApiStatus || (exports.ApiStatus = {}));
// DataGatewayController Singleton
var DataGatewayController = /** @class */ (function () {
    function DataGatewayController() {
        var _this = this;
        this.allApisCache = [];
        this.addApi = function (api) { return __awaiter(_this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api.foundAt = new Date();
                        return [4 /*yield*/, DataGatewayController.getConection()];
                    case 1:
                        collection = _a.sent();
                        return [2 /*return*/, collection.insertOne(api)
                                .catch(function (e) { return e.toString(); })];
                }
            });
        }); };
        this.getApi = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var api, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = this.findLocalApi(filter);
                        if (!api) return [3 /*break*/, 1];
                        return [2 /*return*/, new Promise(function (resolve) {
                                resolve(api);
                            })];
                    case 1: return [4 /*yield*/, DataGatewayController.getConection()];
                    case 2:
                        collection = _a.sent();
                        return [2 /*return*/, collection.findOne(filter).catch(function (e) { return e.toString(); })];
                }
            });
        }); };
        this.getAllApis = function () { return __awaiter(_this, void 0, void 0, function () {
            var collection;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataGatewayController.getConection()];
                    case 1:
                        collection = _a.sent();
                        return [2 /*return*/, collection.find({})
                                .toArray().then(function (apis) {
                                _this.allApisCache = _this.allApisCache.concat(apis);
                                return apis;
                            }).catch(function (e) { return e.toString(); })];
                }
            });
        }); };
        this.registerNewRequest = function (filter, status, lastDuration) { return __awaiter(_this, void 0, void 0, function () {
            var collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DataGatewayController.getConection()];
                    case 1:
                        collection = _a.sent();
                        return [2 /*return*/, collection.updateOne(filter, {
                                $inc: {
                                    totalRequest: 1,
                                },
                                $currentDate: {
                                    timeLastRequest: true,
                                },
                                $set: {
                                    status: status,
                                    lastDuration: lastDuration,
                                },
                            })];
                }
            });
        }); };
        this.findLocalApi = function (filter) {
            var api = null;
            if (!_this.allApisCache)
                return null;
            var result = _this.allApisCache.filter(function (api) {
                return api.method === filter.method &&
                    api.endpoint === filter.endpoint;
            });
            if (result.length)
                api = result[0];
            return api;
        };
        // this.collectionName = process.env.MONGO_COLLECTION || 'prueba';
        // this.dbName = process.env.MONGO_DB || 'gateway';
        // const userMongo = process.env.MONGO_USER || 'mongoadmin';
        // const passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        // const hostMongo = process.env.MONGO_HOST || 'localhost';
        // const portMongo = process.env.MONGO_PORT || '27017';
        // this.dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo + ':' + portMongo;
        // DataGatewayController.connect();
    }
    DataGatewayController.getConection = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.conection) {
                resolve(_this.conection);
            }
            else {
                return DataGatewayController.connect();
            }
        });
    };
    DataGatewayController.getInstance = function () {
        if (!DataGatewayController.instance) {
            DataGatewayController.instance = new DataGatewayController();
        }
        return DataGatewayController.instance;
    };
    DataGatewayController.connect = function () {
        var collectionName = process.env.MONGO_COLLECTION || 'prueba';
        var dbName = process.env.MONGO_DB || 'gateway';
        var userMongo = process.env.MONGO_USER || 'mongoadmin';
        var passMongo = process.env.MONGO_PASSWORD || 'mongoadmin';
        var hostMongo = process.env.MONGO_HOST || 'localhost';
        var portMongo = process.env.MONGO_PORT || '27017';
        var dbUrl = 'mongodb://' + userMongo + ':' + passMongo + '@' + hostMongo + ':' + portMongo;
        var client = new mongodb_1.MongoClient(dbUrl, { useNewUrlParser: true });
        return client.connect().then(function (cliente) {
            DataGatewayController.conection = cliente.db(dbName).collection(collectionName);
            DataGatewayController.conection.createIndex({ method: 1, endpoint: 1 }, { unique: true });
            return DataGatewayController.conection;
        }).catch(function (e) {
            console.error("Error de conexión con MongoDB: ", e.toString());
        });
    };
    return DataGatewayController;
}());
exports.DataGatewayController = DataGatewayController;
// Connection URL
// Database Name
// Use connect method to connect to the server
// const prueba = new DataGatewayController();
// prueba.addApi({
//     name: "Acceso Cliente",
//     host: 'http://localhost',
//     endpoint: '/autenticacion/accesoCliente',
//     method: 'POST',
//     port: '8080',
//     version: '1.0.2',
// }).then((res) => {
//     console.log("res:", res);
// }).catch((e) => {
//     console.error("ERRORRRR", e);
// });
// // prueba.registerNewRequest({method: 'GET', endpoint: '/hola/mundo'}, ApiStatus.OK, 1000)
// // .then((res: any) => {
// //     res = res as ApiDescription;
// //     console.log("res:", res);
// // }).catch((e) => {
// //     console.error(e);
// // });
// prueba.getApi({method: 'POST', endpoint: '/hola/mundo2'})
// .then((res: any) => {
//     console.log("res:", res);
// }).catch((e) => {
//     console.error(e);
// });
//# sourceMappingURL=data.controller.js.map