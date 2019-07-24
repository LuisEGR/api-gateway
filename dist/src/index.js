"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_colors_1 = require("logger-colors");
var app_1 = __importDefault(require("./app"));
var logger = new logger_colors_1.Logger();
var port = Number(process.env.PORT) || 3002;
app_1.default.listen(port, function () {
    logger.success("Servicio ejecutado exitosamente");
    logger.success("Escuchando en el puerto " + port);
});
