"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function smallJSON(key, value) {
    if (Array.isArray(value)) {
        if (value.length > 5) {
            value = value.slice(1, 10);
        }
        return value;
    }
    if (typeof value === 'string' && value.length > 100) {
        var charsToShow = 15;
        var val = '';
        val += value.substr(0, charsToShow);
        val += '[...]';
        val += value.substr(-charsToShow, charsToShow);
        return val;
    }
    return value;
}
exports.smallJSON = smallJSON;
//# sourceMappingURL=smallJson.js.map