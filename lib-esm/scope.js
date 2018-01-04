import parameterize from './util/parameterize';
import IncludeDirective from './util/include-directive';
import { CollectionProxy, RecordProxy } from './proxies';
import Request from './request';
import refreshJWT from './util/refresh-jwt';
import * as _cloneDeep from './util/clonedeep';
var cloneDeep = _cloneDeep.default || _cloneDeep;
cloneDeep = cloneDeep.default || cloneDeep;
var Scope = /** @class */ (function () {
    function Scope(model) {
        this._associations = {};
        this._pagination = {};
        this._filter = {};
        this._sort = {};
        this._fields = {};
        this._extra_fields = {};
        this._include = {};
        this._stats = {};
        this.model = model;
    }
    Scope.prototype.all = function () {
        return this._fetch(this.model.url()).then(function (json) {
            var collection = new CollectionProxy(json);
            return collection;
        });
    };
    Scope.prototype.find = function (id) {
        return this._fetch(this.model.url(id)).then(function (json) {
            return new RecordProxy(json);
        });
    };
    Scope.prototype.first = function () {
        var newScope = this.per(1);
        return newScope._fetch(newScope.model.url()).then(function (json) {
            json.data = json.data[0];
            return new RecordProxy(json);
        });
    };
    Scope.prototype.merge = function (obj) {
        var copy = this.copy();
        Object.keys(obj).forEach(function (k) {
            copy._associations[k] = obj[k];
        });
        return copy;
    };
    Scope.prototype.page = function (pageNumber) {
        var copy = this.copy();
        copy._pagination.number = pageNumber;
        return copy;
    };
    Scope.prototype.per = function (size) {
        var copy = this.copy();
        copy._pagination.size = size;
        return copy;
    };
    Scope.prototype.where = function (clause) {
        var copy = this.copy();
        for (var key in clause) {
            copy._filter[key] = clause[key];
        }
        return copy;
    };
    Scope.prototype.stats = function (clause) {
        var copy = this.copy();
        for (var key in clause) {
            copy._stats[key] = clause[key];
        }
        return copy;
    };
    Scope.prototype.order = function (clause) {
        var copy = this.copy();
        if (typeof clause == "object") {
            for (var key in clause) {
                copy._sort[key] = clause[key];
            }
        }
        else {
            copy._sort[clause] = 'asc';
        }
        return copy;
    };
    Scope.prototype.select = function (clause) {
        var copy = this.copy();
        for (var key in clause) {
            copy._fields[key] = clause[key];
        }
        return copy;
    };
    Scope.prototype.selectExtra = function (clause) {
        var copy = this.copy();
        for (var key in clause) {
            copy._extra_fields[key] = clause[key];
        }
        return copy;
    };
    Scope.prototype.includes = function (clause) {
        var copy = this.copy();
        var directive = new IncludeDirective(clause);
        var directiveObject = directive.toObject();
        for (var key in directiveObject) {
            copy._include[key] = directiveObject[key];
        }
        return copy;
    };
    // The `Model` class has a `scope()` method to return the scope for it.
    // This method makes it possible for methods to expect either a model or
    // a scope and reliably cast them to a scope for use via `scope()`
    Scope.prototype.scope = function () {
        return this;
    };
    Scope.prototype.asQueryParams = function () {
        var qp = {};
        qp['page'] = this._pagination;
        qp['filter'] = this._filter;
        qp['sort'] = this._sortParam(this._sort) || [];
        qp['fields'] = this._fields;
        qp['extra_fields'] = this._extra_fields;
        qp['stats'] = this._stats;
        qp['include'] = new IncludeDirective(this._include).toString();
        this._mergeAssociationQueryParams(qp, this._associations);
        return qp;
    };
    Scope.prototype.toQueryParams = function () {
        var paramString = parameterize(this.asQueryParams());
        if (paramString !== '') {
            return paramString;
        }
    };
    Scope.prototype.copy = function () {
        var newScope = cloneDeep(this);
        return newScope;
    };
    // private
    Scope.prototype._mergeAssociationQueryParams = function (queryParams, associations) {
        var _this = this;
        var _loop_1 = function (key) {
            var associationScope = associations[key];
            var associationQueryParams = associationScope.asQueryParams();
            queryParams['page'][key] = associationQueryParams['page'];
            queryParams['filter'][key] = associationQueryParams['filter'];
            queryParams['stats'][key] = associationQueryParams['stats'];
            associationQueryParams['sort'].forEach(function (s) {
                var transformed = _this._transformAssociationSortParam(key, s);
                queryParams['sort'].push(transformed);
            });
        };
        for (var key in associations) {
            _loop_1(key);
        }
    };
    Scope.prototype._transformAssociationSortParam = function (associationName, param) {
        if (param.indexOf('-') !== -1) {
            param = param.replace('-', '');
            associationName = "-" + associationName;
        }
        return associationName + "." + param;
    };
    Scope.prototype._sortParam = function (clause) {
        if (clause && Object.keys(clause).length > 0) {
            var params = [];
            for (var key in clause) {
                if (clause[key] !== 'asc') {
                    key = "-" + key;
                }
                params.push(key);
            }
            return params;
        }
    };
    Scope.prototype._fetch = function (url) {
        var _this = this;
        var qp = this.toQueryParams();
        if (qp) {
            url = url + "?" + qp;
        }
        var request = new Request(this.model);
        var fetchOpts = this.model.fetchOptions();
        var promise = request.get(url, fetchOpts);
        return promise.then(function (response) {
            refreshJWT(_this.model, response);
            return response['jsonPayload'];
        });
    };
    return Scope;
}());
export default Scope;
//# sourceMappingURL=scope.js.map