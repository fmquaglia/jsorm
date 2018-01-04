// Override defined here w/noEmitHelpers
// https://github.com/Microsoft/TypeScript/issues/6425
// Allows 'inherited' hook
var globalObj;
if (typeof window === 'undefined' || window != global) {
    globalObj = global;
}
else {
    globalObj = window;
}
var originalSetPrototypeOf = Object['setPrototypeOf'];
var patchExtends = function () {
    Object['setPrototypeOf'] = function (subClass, superClass) {
        originalSetPrototypeOf(subClass, superClass);
        if (superClass['inherited']) {
            superClass['inherited'](subClass);
        }
    };
    globalObj['__extends'] = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        if (b.inherited)
            b.inherited(d);
    };
};
export default patchExtends;
//# sourceMappingURL=custom-extend.js.map