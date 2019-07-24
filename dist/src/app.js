"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Apis_controller_1 = require("./controllers/Apis.controller");
var gateway_controller_1 = require("./controllers/gateway.controller");
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
var servicesDiscovered = [];
Apis_controller_1.autoDiscovery().then(function (services) {
    console.log("services:", services);
    fs_1.default.writeFileSync('routes.json', JSON.stringify(services, null, 4));
}).catch(function (e) {
    console.error("ErrorGFa", e);
});
app.use(gateway_controller_1.GatewayController);
exports.default = app;
