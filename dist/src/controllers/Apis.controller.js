"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var fs_1 = __importDefault(require("fs"));
var allApis = [];
function autoDiscovery() {
    return new Promise(function (resolve, reject) {
        var services = [];
        var servicesProcesed = 0;
        var servicesFound = Object.keys(process.env)
            .filter(function (e) {
            // console.log("e:", e);
            return e.indexOf('PORT_8080_TCP_ADDR') !== -1;
        });
        console.log("servicesFound:", servicesFound);
        servicesFound.forEach(function (s) {
            var url = 'http://' + process.env[s] + ':8080/describe';
            console.log("url:", url);
            request_1.default.get(url, { timeout: 1000 }, function (err, res, body) {
                servicesProcesed++;
                if (err == null) {
                    var b = JSON.parse(body);
                    b.apis = b.apis.map(function (api) {
                        api.host = 'http://' + process.env[s] + ':8080';
                        api._id = Buffer.from(api.endpoint + api.method).toString('base64');
                        api._foundAt = moment_timezone_1.default().tz('America/Mexico_City').format();
                        api._lastRequest = null;
                        return api;
                    });
                    addSafeService(services, b.apis);
                }
                if (servicesProcesed === servicesFound.length) {
                    resolve(services);
                }
            });
        });
    });
}
exports.autoDiscovery = autoDiscovery;
function addSafeService(arrayServices, arrayToAdd) {
    arrayToAdd.forEach(function (api) {
        var existe = arrayServices.filter(function (s) { return s._id === api._id; }).length;
        if (existe) {
            console.error("Se encontró un servicio duplicado:");
            console.error("Existente:", existe);
            console.error("Nuevo:", api);
        }
        else {
            arrayServices.push(api);
        }
    });
}
function getApi(method, endpoint) {
    if (allApis === null) {
        var all = fs_1.default.readFileSync('routes.json', { encoding: 'utf-8' });
        allApis = JSON.parse(all);
    }
    console.log("allApis:", allApis);
}
exports.getApi = getApi;
