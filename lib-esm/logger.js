var Logger = /** @class */ (function () {
    function Logger() {
        this._level = 2;
        this.LEVELS = {
            debug: 1,
            info: 2,
            warn: 3,
            error: 4
        };
    }
    Object.defineProperty(Logger.prototype, "level", {
        get: function () {
            for (var key in this.LEVELS) {
                var val = this.LEVELS[key];
                if (val === this._level)
                    return key;
            }
        },
        set: function (value) {
            var lvlValue = this.LEVELS[value];
            if (lvlValue) {
                this._level = lvlValue;
            }
            else {
                throw ("Log level must be one of " + Object.keys(this.LEVELS).join(', '));
            }
        },
        enumerable: true,
        configurable: true
    });
    Logger.prototype.debug = function (stmt) {
        if (this._level <= this.LEVELS.debug) {
            console.debug(stmt);
        }
    };
    Logger.prototype.info = function (stmt) {
        if (this._level <= this.LEVELS.info) {
            console.info(stmt);
        }
    };
    Logger.prototype.warn = function (stmt) {
        if (this._level <= this.LEVELS.warn) {
            console.warn(stmt);
        }
    };
    Logger.prototype.error = function (stmt) {
        if (this._level <= this.LEVELS.warn) {
            console.error(stmt);
        }
    };
    return Logger;
}());
export default Logger;
//# sourceMappingURL=logger.js.map