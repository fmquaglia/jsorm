/// <reference path="../../types/index.d.ts" />
// use for non-typescript extends
var globalObj;
if (typeof window === 'undefined' || window !== global) {
    globalObj = global;
}
else {
    globalObj = window;
}
export default function (superclass, classObj) {
    globalObj['__extends'](Model, superclass);
    function Model() {
        var _this = superclass.apply(this, arguments) || this;
        for (var prop in classObj) {
            if (prop !== 'static' && classObj.hasOwnProperty(prop)) {
                _this[prop] = classObj[prop];
            }
        }
        return _this;
    }
    for (var classProp in classObj.static) {
        Model[classProp] = classObj.static[classProp];
    }
    superclass.inherited(Model);
    return Model;
}
//# sourceMappingURL=extend.js.map