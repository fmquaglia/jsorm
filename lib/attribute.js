// In the future, this class will be used for
// transforms, default values, etc.
import Config from './configuration';
var Attribute = /** @class */ (function () {
    function Attribute(opts) {
        this.persist = true;
        this.isAttr = true;
        this.isRelationship = false;
        if (opts && opts.hasOwnProperty('persist')) {
            this.persist = opts.persist;
        }
    }
    Attribute.applyAll = function (klass) {
        this._eachAttribute(klass, function (attr) {
            klass.attributeList[attr.name] = attr;
            var descriptor = attr.descriptor();
            Object.defineProperty(klass.prototype, attr.name, descriptor);
            var instance = new klass();
            var decorators = instance['__attrDecorators'] || [];
            decorators.forEach(function (d) {
                if (d['attrName'] === attr.name) {
                    d['decorator'](klass.prototype, attr.name, descriptor);
                }
            });
        });
    };
    Attribute._eachAttribute = function (klass, callback) {
        var instance = new klass();
        for (var propName in instance) {
            if (instance[propName] && instance[propName].hasOwnProperty('isAttr')) {
                var attrInstance = instance[propName];
                attrInstance.name = propName;
                if (attrInstance.isRelationship) {
                    attrInstance.klass = Config.modelForType(attrInstance.jsonapiType || attrInstance.name);
                }
                callback(attrInstance);
            }
        }
    };
    // This returns the getters/setters for use on the *model*
    Attribute.prototype.descriptor = function () {
        var attr = this;
        return {
            enumerable: true,
            get: function () {
                return attr.getter(this);
            },
            set: function (value) {
                if (!value || !value.hasOwnProperty('isAttr')) {
                    attr.setter(this, value);
                }
            }
        };
    };
    // The model calls this setter
    Attribute.prototype.setter = function (context, val) {
        context.attributes[this.name] = val;
    };
    // The model calls this getter
    Attribute.prototype.getter = function (context) {
        return context.attributes[this.name];
    };
    return Attribute;
}());
export default Attribute;
//# sourceMappingURL=attribute.js.map