import Model from '../model';
var CollectionProxy = /** @class */ (function () {
    function CollectionProxy(raw_json) {
        if (raw_json === void 0) { raw_json = { data: [] }; }
        var _this = this;
        this.setRaw = function (json_payload) {
            _this._raw_json = json_payload;
            _this._array = [];
            _this.raw.data.map(function (datum) {
                _this._array.push(Model.fromJsonapi(datum, _this.raw));
            });
        };
        this.setRaw(raw_json);
    }
    Object.defineProperty(CollectionProxy.prototype, "raw", {
        get: function () {
            return this._raw_json;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionProxy.prototype, "data", {
        get: function () {
            return this._array;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CollectionProxy.prototype, "meta", {
        get: function () {
            return this.raw.meta || {};
        },
        enumerable: true,
        configurable: true
    });
    return CollectionProxy;
}());
export default CollectionProxy;
//# sourceMappingURL=collection-proxy.js.map