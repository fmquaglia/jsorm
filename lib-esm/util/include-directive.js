var IncludeDirective = /** @class */ (function () {
    function IncludeDirective(obj) {
        this.dct = {};
        var includeHash = this.parseIncludeArgs(obj);
        for (var key in includeHash) {
            this.dct[key] = new IncludeDirective(includeHash[key]);
        }
    }
    IncludeDirective.prototype.toObject = function () {
        var hash = {};
        for (var key in this.dct) {
            hash[key] = this.dct[key].toObject();
        }
        return hash;
    };
    IncludeDirective.prototype.toString = function () {
        var stringArray = [];
        var _loop_1 = function (key) {
            var stringValue = this_1.dct[key].toString();
            if (stringValue === '') {
                stringArray.push(key);
            }
            else {
                stringValue = stringValue.split(',');
                stringValue = stringValue.map(function (x) { return key + "." + x; });
                stringArray.push(stringValue.join(','));
            }
        };
        var this_1 = this;
        for (var key in this.dct) {
            _loop_1(key);
        }
        return stringArray.join(',');
    };
    IncludeDirective.prototype.parseIncludeArgs = function (includeArgs) {
        if (Array.isArray(includeArgs)) {
            return this._parseArray(includeArgs);
        }
        else if (typeof includeArgs == "string") {
            var obj = {};
            obj[includeArgs] = {};
            return obj;
        }
        else if (typeof includeArgs == "object") {
            return this._parseObject(includeArgs);
        }
        else {
            return {};
        }
    };
    // private
    IncludeDirective.prototype._parseObject = function (includeObj) {
        var parsed = {};
        for (var key in includeObj) {
            parsed[key] = this.parseIncludeArgs(includeObj[key]);
        }
        return parsed;
    };
    IncludeDirective.prototype._parseArray = function (includeArray) {
        var parsed = {};
        for (var _i = 0, includeArray_1 = includeArray; _i < includeArray_1.length; _i++) {
            var value = includeArray_1[_i];
            var parsedEl = this.parseIncludeArgs(value);
            for (var key in parsedEl) {
                parsed[key] = parsedEl[key];
            }
        }
        return parsed;
    };
    return IncludeDirective;
}());
export default IncludeDirective;
//# sourceMappingURL=include-directive.js.map