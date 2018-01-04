/// <reference path="../types/index.d.ts" />
import Attribute from './attribute';
import Logger from './logger';
import * as _cloneDeep from './util/clonedeep';
var cloneDeep = _cloneDeep.default || _cloneDeep;
if (cloneDeep.default) {
    cloneDeep = cloneDeep.default;
}
var ctx = this;
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.setup = function (options) {
        if (!options)
            options = {};
        this.jwtLocalStorage = options['jwtLocalStorage'];
        for (var _i = 0, _a = this.models; _i < _a.length; _i++) {
            var model = _a[_i];
            this.typeMapping[model.jsonapiType] = model;
            if (options['jwtOwners'] && options['jwtOwners'].indexOf(model) !== -1) {
                model.isJWTOwner = true;
                if (this.jwtLocalStorage) {
                    model.jwt = this.localStorage.getItem(this.jwtLocalStorage);
                }
            }
        }
        for (var _b = 0, _c = this.models; _b < _c.length; _b++) {
            var model = _c[_b];
            Attribute.applyAll(model);
        }
        for (var _d = 0, _e = this.models; _d < _e.length; _d++) {
            var model = _e[_d];
            var parentAttrList = cloneDeep(model.parentClass.attributeList);
            var attrList = cloneDeep(model.attributeList);
            model.attributeList = Object.assign(parentAttrList, attrList);
        }
    };
    Config.reset = function () {
        this.typeMapping = {};
        this.models = [];
    };
    Config.modelForType = function (type) {
        var klass = this.typeMapping[type];
        if (klass) {
            return klass;
        }
        else {
            throw ("Could not find class for jsonapi type \"" + type + "\"");
        }
    };
    Config.models = [];
    Config.typeMapping = {};
    Config.logger = new Logger();
    Config.jwtLocalStorage = 'jwt';
    Config.beforeFetch = [];
    Config.afterFetch = [];
    return Config;
}());
export default Config;
// In node, no localStorage available
// We do this so we can mock it
try {
    Config.localStorage = localStorage;
}
catch (e) {
}
//# sourceMappingURL=configuration.js.map