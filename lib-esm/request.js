import Config from './configuration';
import colorize from './util/colorize';
import patchExtends from './custom-extend';
patchExtends();
var RequestError = /** @class */ (function (_super) {
    __extends(RequestError, _super);
    function RequestError(message, url, options, originalError) {
        var _this = _super.call(this, message) || this;
        _this.url = url;
        _this.options = options;
        _this.originalError = originalError;
        return _this;
    }
    return RequestError;
}(Error));
var ResponseError = /** @class */ (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(response, message, originalError) {
        var _this = _super.call(this, message || 'Invalid Response') || this;
        _this.response = response;
        _this.originalError = originalError;
        return _this;
    }
    return ResponseError;
}(Error));
var Request = /** @class */ (function () {
    function Request(modelClass) {
        this.modelClass = modelClass;
    }
    Request.prototype.get = function (url, options) {
        options.method = 'GET';
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.post = function (url, payload, options) {
        options.method = 'POST';
        options.body = JSON.stringify(payload);
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.put = function (url, payload, options) {
        options.method = 'PUT';
        options.body = JSON.stringify(payload);
        return this._fetchWithLogging(url, options);
    };
    Request.prototype.delete = function (url, options) {
        options.method = 'DELETE';
        return this._fetchWithLogging(url, options);
    };
    // private
    Request.prototype._logRequest = function (verb, url) {
        Config.logger.info(colorize('cyan', verb + ": ") + colorize('magenta', url));
    };
    Request.prototype._logResponse = function (responseJSON) {
        Config.logger.debug(colorize('bold', JSON.stringify(responseJSON, null, 4)));
    };
    Request.prototype._fetchWithLogging = function (url, options) {
        var _this = this;
        this._logRequest(options.method, url);
        var promise = this._fetch(url, options);
        return promise.then(function (response) {
            _this._logResponse(response['jsonPayload']);
            return response;
        });
    };
    Request.prototype._fetch = function (url, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.modelClass.beforeFetch(url, options);
            }
            catch (e) {
                reject(new RequestError('beforeFetch failed; review Config.beforeFetch', url, options, e));
            }
            var fetchPromise = fetch(url, options);
            fetchPromise.then(function (response) {
                _this._handleResponse(response, resolve, reject);
            });
            fetchPromise.catch(function (e) {
                // Fetch itself failed (usually network error)
                reject(new ResponseError(null, e.message, e));
            });
        });
    };
    Request.prototype._handleResponse = function (response, resolve, reject) {
        var _this = this;
        response.json().then(function (json) {
            try {
                _this.modelClass.afterFetch(response, json);
            }
            catch (e) {
                // afterFetch middleware failed
                reject(new ResponseError(response, 'afterFetch failed; review Config.afterFetch', e));
            }
            if (response.status >= 500) {
                reject(new ResponseError(response, 'Server Error'));
            }
            else if (response.status !== 422 && json['data'] === undefined) {
                // Bad JSON, for instance an errors payload
                // Allow 422 since we specially handle validation errors
                reject(new ResponseError(response, 'invalid json'));
            }
            response['jsonPayload'] = json;
            resolve(response);
        }).catch(function (e) {
            // The response was probably not in JSON format
            reject(new ResponseError(response, 'invalid json', e));
        });
    };
    return Request;
}());
export default Request;
//# sourceMappingURL=request.js.map