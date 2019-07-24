"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var LogRequestStream = /** @class */ (function (_super) {
    __extends(LogRequestStream, _super);
    function LogRequestStream(options) {
        return _super.call(this, options) || this;
    }
    LogRequestStream.prototype._write = function () {
        console.log("Args:", arguments);
    };
    return LogRequestStream;
}(stream_1.Writable));
exports.LogRequestStream = LogRequestStream;
