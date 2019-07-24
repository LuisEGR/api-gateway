"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = __importDefault(require("request"));
function autoDiscovery() {
    console.log("process.env:", process.env);
    return new Promise(function (resolve, reject) {
        var services = [];
        var servicesProcesed = 0;
        var servicesFound = Object.keys(process.env)
            .filter(function (e) {
            return e.indexOf('PORT_8080_TCP_ADDR') !== -1;
        });
        servicesFound.forEach(function (s) {
            var url = 'http://' + process.env[s] + ':8080/describe';
            request_1.default.get(url, function (err, res, body) {
                if (err == null) {
                    var b = JSON.parse(body);
                    b.apis = b.apis.map(function (api) {
                        api.host = 'http://' + process.env[s] + ':8080';
                        return api;
                    });
                    services = services.concat(b.apis);
                    servicesProcesed++;
                    if (servicesProcesed === servicesFound.length) {
                        resolve(services);
                    }
                }
            });
        });
    });
}
exports.default = autoDiscovery;
