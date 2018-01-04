import Attribute from './attribute';
import Model from './model';
// Not sure why this is needed, already patching in main..
import patchExtends from './custom-extend';
patchExtends();
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        _this.isRelationship = true;
        _this.jsonapiType = args[0];
        return _this;
    }
    Base.prototype.getter = function (context) {
        return context.relationships[this.name];
    };
    Base.prototype.setter = function (context, val) {
        if (val && !val.hasOwnProperty('isRelationship')) {
            if (!(val instanceof Model) && !(Array.isArray(val))) {
                val = new this.klass(val);
            }
            context.relationships[this.name] = val;
        }
        else if (val === null || val === undefined) {
            context.relationships[this.name] = val;
        }
    };
    return Base;
}(Attribute));
export { Base };
var HasMany = /** @class */ (function (_super) {
    __extends(HasMany, _super);
    function HasMany() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HasMany.prototype.getter = function (context) {
        var gotten = _super.prototype.getter.call(this, context);
        if (!gotten) {
            this.setter(context, []);
            return _super.prototype.getter.call(this, context);
        }
        else {
            return gotten;
        }
    };
    return HasMany;
}(Base));
export { HasMany };
var HasOne = /** @class */ (function (_super) {
    __extends(HasOne, _super);
    function HasOne() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HasOne;
}(Base));
export { HasOne };
var BelongsTo = /** @class */ (function (_super) {
    __extends(BelongsTo, _super);
    function BelongsTo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BelongsTo;
}(Base));
export { BelongsTo };
var hasMany = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (HasMany.bind.apply(HasMany, [void 0].concat(args)))();
};
var hasOne = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (HasOne.bind.apply(HasOne, [void 0].concat(args)))();
};
var belongsTo = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (BelongsTo.bind.apply(BelongsTo, [void 0].concat(args)))();
};
export { hasMany, hasOne, belongsTo };
//# sourceMappingURL=associations.js.map