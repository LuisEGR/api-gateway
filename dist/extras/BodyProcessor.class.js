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
var events_1 = require("events");
var smallJson_1 = require("../extras/smallJson");
var BodyProcessor = /** @class */ (function (_super) {
    __extends(BodyProcessor, _super);
    function BodyProcessor() {
        var _this = _super.call(this) || this;
        _this.ready = false;
        _this.body = '';
        return _this;
    }
    BodyProcessor.prototype.save = function (chunk) {
        if (!this.body)
            this.body = '';
        this.body += chunk.toString();
    };
    BodyProcessor.prototype.getBody = function () {
        try {
            var data = JSON.parse(this.body);
            return JSON.stringify(data, smallJson_1.smallJSON, 4);
        }
        catch (e) {
            return this.body.slice(0, 150) + "\n...";
        }
    };
    return BodyProcessor;
}(events_1.EventEmitter));
exports.BodyProcessor = BodyProcessor;
// class MyEmitter extends EventEmitter {}
// const myEmitter = new BodyProcessor();
// myEmitter.on('ready', () => {
//   console.log('an event occurred!');
// });
// myEmitter.end();
//# sourceMappingURL=BodyProcessor.class.js.map