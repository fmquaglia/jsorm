import Model from '../model';
var RecordProxy = /** @class */ (function () {
    function RecordProxy(raw_json) {
        if (raw_json === void 0) { raw_json = { data: [] }; }
        var _this = this;
        this.setRaw = function (json_payload) {
            _this._raw_json = json_payload;
            if (_this.raw.data) {
                _this._model = Model.fromJsonapi(_this.raw.data, _this.raw);
            }
            else {
                _this._model = null;
            }
        };
        this.setRaw(raw_json);
    }
    Object.defineProperty(RecordProxy.prototype, "raw", {
        get: function () {
            return this._raw_json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecordProxy.prototype, "data", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RecordProxy.prototype, "meta", {
        get: function () {
            return this.raw.meta || {};
        },
        enumerable: true,
        configurable: true
    });
    return RecordProxy;
}());
export default RecordProxy;
//# sourceMappingURL=record-proxy.js.map