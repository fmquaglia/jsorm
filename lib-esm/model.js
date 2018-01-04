/// <reference path="../types/index.d.ts" />
import Scope from './scope';
import Config from './configuration';
import { deserialize, deserializeInstance } from './util/deserialize';
import _extend from './util/extend';
import { camelize } from './util/string';
import WritePayload from './util/write-payload';
import DirtyChecker from './util/dirty-check';
import ValidationErrors from './util/validation-errors';
import refreshJWT from './util/refresh-jwt';
import relationshipIdentifiersFor from './util/relationship-identifiers';
import Request from './request';
import * as _cloneDeep from './util/clonedeep';
var cloneDeep = _cloneDeep.default || _cloneDeep;
if (cloneDeep.default) {
    cloneDeep = cloneDeep.default;
}
var Model = /** @class */ (function () {
    function Model(attributes) {
        this._attributes = {};
        this._originalAttributes = {};
        this._originalRelationships = {};
        this.relationships = {};
        this.errors = {};
        this.__meta__ = null;
        this._persisted = false;
        this._markedForDestruction = false;
        this._markedForDisassociation = false;
        this._initializeAttributes();
        this.attributes = attributes;
        this._originalAttributes = cloneDeep(this.attributes);
        this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(this.relationships));
    }
    Model.extend = function (obj) {
        return _extend(this, obj);
    };
    Model.inherited = function (subclass) {
        Config.models.push(subclass);
        subclass.parentClass = this;
        subclass.prototype.klass = subclass;
        subclass.attributeList = cloneDeep(subclass.attributeList);
    };
    Model.scope = function () {
        return this._scope || new Scope(this);
    };
    Model.setJWT = function (token) {
        this.getJWTOwner().jwt = token;
        if (Config.jwtLocalStorage) {
            Config.localStorage.setItem(Config.jwtLocalStorage, token);
        }
    };
    Model.getJWT = function () {
        var owner = this.getJWTOwner();
        if (owner) {
            return owner.jwt;
        }
    };
    Model.fetchOptions = function () {
        var options = {
            headers: (_a = {
                    Accept: 'application/json'
                },
                _a['Content-Type'] = 'application/json',
                _a)
        };
        if (this.getJWT()) {
            options.headers.Authorization = this.generateAuthHeader(this.getJWT());
        }
        return options;
        var _a;
    };
    Model.beforeFetch = function (url, options) {
        Config.beforeFetch.forEach(function (fn) {
            fn(url, options);
        });
    };
    Model.afterFetch = function (response, json) {
        Config.afterFetch.forEach(function (fn) {
            fn(response, json);
        });
    };
    Model.getJWTOwner = function () {
        if (this.isJWTOwner) {
            return this;
        }
        else {
            if (this.parentClass) {
                return this.parentClass.getJWTOwner();
            }
            else {
                return;
            }
        }
    };
    Model.all = function () {
        return this.scope().all();
    };
    Model.find = function (id) {
        return this.scope().find(id);
    };
    Model.first = function () {
        return this.scope().first();
    };
    Model.where = function (clause) {
        return this.scope().where(clause);
    };
    Model.page = function (number) {
        return this.scope().page(number);
    };
    Model.per = function (size) {
        return this.scope().per(size);
    };
    Model.order = function (clause) {
        return this.scope().order(clause);
    };
    Model.select = function (clause) {
        return this.scope().select(clause);
    };
    Model.selectExtra = function (clause) {
        return this.scope().selectExtra(clause);
    };
    Model.stats = function (clause) {
        return this.scope().stats(clause);
    };
    Model.includes = function (clause) {
        return this.scope().includes(clause);
    };
    Model.merge = function (obj) {
        return this.scope().merge(obj);
    };
    Model.url = function (id) {
        var endpoint = this.endpoint || "/" + this.jsonapiType;
        var base = "" + this.fullBasePath() + endpoint;
        if (id) {
            base = base + "/" + id;
        }
        return base;
    };
    Model.fullBasePath = function () {
        return "" + this.baseUrl + this.apiNamespace;
    };
    Model.fromJsonapi = function (resource, payload) {
        return deserialize(resource, payload);
    };
    Model.generateAuthHeader = function (jwt) {
        return "Bearer " + jwt;
    };
    Model.prototype.clearErrors = function () {
        this.errors = {};
    };
    // Todo:
    // * needs to recurse the directive
    // * remove the corresponding code from isPersisted and handle here (likely
    // only an issue with test setup)
    // * Make all calls go through resetRelationTracking();
    Model.prototype.resetRelationTracking = function (includeDirective) {
        this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(includeDirective));
    };
    Model.prototype.relationshipResourceIdentifiers = function (relationNames) {
        return relationshipIdentifiersFor(this, relationNames);
    };
    Model.prototype.isType = function (jsonapiType) {
        return this.klass.jsonapiType === jsonapiType;
    };
    Object.defineProperty(Model.prototype, "resourceIdentifier", {
        get: function () {
            return { type: this.klass.jsonapiType, id: this.id };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        set: function (attrs) {
            this._attributes = {};
            this.assignAttributes(attrs);
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.assignAttributes = function (attrs) {
        for (var key in attrs) {
            var attributeName = key;
            if (this.klass.camelizeKeys) {
                attributeName = camelize(key);
            }
            if (key == 'id' || this.klass.attributeList[attributeName]) {
                this[attributeName] = attrs[key];
            }
        }
    };
    Model.prototype.isPersisted = function (val) {
        if (val != undefined) {
            this._persisted = val;
            this._originalAttributes = cloneDeep(this.attributes);
            this._originalRelationships = this.relationshipResourceIdentifiers(Object.keys(this.relationships));
            return val;
        }
        else {
            return this._persisted;
        }
    };
    Model.prototype.isMarkedForDestruction = function (val) {
        if (val != undefined) {
            this._markedForDestruction = val;
            return val;
        }
        else {
            return this._markedForDestruction;
        }
    };
    Model.prototype.isMarkedForDisassociation = function (val) {
        if (val != undefined) {
            this._markedForDisassociation = val;
            return val;
        }
        else {
            return this._markedForDisassociation;
        }
    };
    Model.prototype.fromJsonapi = function (resource, payload, includeDirective) {
        if (includeDirective === void 0) { includeDirective = {}; }
        return deserializeInstance(this, resource, payload, includeDirective);
    };
    Object.defineProperty(Model.prototype, "hasError", {
        get: function () {
            return Object.keys(this.errors).length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.isDirty = function (relationships) {
        var dc = new DirtyChecker(this);
        return dc.check(relationships);
    };
    Model.prototype.changes = function () {
        var dc = new DirtyChecker(this);
        return dc.dirtyAttributes();
    };
    Model.prototype.hasDirtyRelation = function (relationName, relatedModel) {
        var dc = new DirtyChecker(this);
        return dc.checkRelation(relationName, relatedModel);
    };
    Model.prototype.dup = function () {
        return cloneDeep(this);
    };
    Model.prototype.destroy = function () {
        var _this = this;
        var url = this.klass.url(this.id);
        var verb = 'delete';
        var request = new Request(this.klass);
        var requestPromise = request.delete(url, this._fetchOptions());
        return this._writeRequest(requestPromise, function () {
            _this.isPersisted(false);
        });
    };
    Model.prototype.save = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var url = this.klass.url();
        var verb = 'post';
        var request = new Request(this.klass);
        var payload = new WritePayload(this, options['with']);
        if (this.isPersisted()) {
            url = this.klass.url(this.id);
            verb = 'put';
        }
        var json = payload.asJSON();
        var requestPromise = request[verb](url, json, this._fetchOptions());
        return this._writeRequest(requestPromise, function (response) {
            _this.fromJsonapi(response['jsonPayload'].data, response['jsonPayload'], payload.includeDirective);
            payload.postProcess();
        });
    };
    // Define getter/setters and set defaults
    Model.prototype._initializeAttributes = function () {
        for (var key in this.klass.attributeList) {
            var attr = this.klass.attributeList[key];
            Object.defineProperty(this, attr.name, attr.descriptor());
            this[key] = this[key]; // set defaults
        }
    };
    Model.prototype._writeRequest = function (requestPromise, callback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return requestPromise.then(function (response) {
                _this._handleResponse(response, resolve, reject, callback);
            }).catch(reject);
        });
    };
    Model.prototype._handleResponse = function (response, resolve, reject, callback) {
        refreshJWT(this.klass, response);
        if (response.status == 422) {
            ValidationErrors.apply(this, response['jsonPayload']);
            resolve(false);
        }
        else {
            callback(response);
            resolve(true);
        }
    };
    Model.prototype._fetchOptions = function () {
        return this.klass.fetchOptions();
    };
    Model.baseUrl = 'http://please-set-a-base-url.com';
    Model.apiNamespace = '/';
    Model.jsonapiType = 'define-in-subclass';
    Model.isJWTOwner = false;
    Model.jwt = null;
    Model.camelizeKeys = true;
    Model.attributeList = {};
    return Model;
}());
export default Model;
//# sourceMappingURL=model.js.map