import IncludeDirective from './include-directive';
import * as _snakeCase from './snakecase';
import tempId from './temp-id';
var snakeCase = _snakeCase.default || _snakeCase;
snakeCase = snakeCase['default'] || snakeCase;
var WritePayload = /** @class */ (function () {
    function WritePayload(model, relationships) {
        this.included = [];
        var includeDirective = new IncludeDirective(relationships);
        this.includeDirective = includeDirective.toObject();
        this.model = model;
    }
    WritePayload.prototype.attributes = function () {
        var _this = this;
        var attrs = {};
        this._eachAttribute(function (key, value) {
            var snakeKey = snakeCase(key);
            if (!_this.model.isPersisted() || _this.model.changes()[key]) {
                attrs[snakeKey] = value;
            }
        });
        return attrs;
    };
    WritePayload.prototype.removeDeletions = function (model, includeDirective) {
        var _this = this;
        Object.keys(includeDirective).forEach(function (key) {
            var nested = includeDirective[key];
            var relatedObjects = model[key];
            if (relatedObjects) {
                if (Array.isArray(relatedObjects)) {
                    relatedObjects.forEach(function (relatedObject, index) {
                        if (relatedObject.isMarkedForDestruction() || relatedObject.isMarkedForDisassociation()) {
                            model[key].splice(index, 1);
                        }
                        else {
                            _this.removeDeletions(relatedObject, nested);
                        }
                    });
                }
                else {
                    var relatedObject = relatedObjects;
                    if (relatedObject.isMarkedForDestruction() || relatedObject.isMarkedForDisassociation()) {
                        model[key] = null;
                    }
                    else {
                        _this.removeDeletions(relatedObject, nested);
                    }
                }
            }
        });
    };
    WritePayload.prototype.postProcess = function () {
        this.removeDeletions(this.model, this.includeDirective);
        this.model.resetRelationTracking(this.includeDirective);
    };
    WritePayload.prototype.relationships = function () {
        var _this = this;
        var _relationships = {};
        Object.keys(this.includeDirective).forEach(function (key) {
            var nested = _this.includeDirective[key];
            var data;
            var relatedModels = _this.model[key];
            if (relatedModels) {
                if (Array.isArray(relatedModels)) {
                    data = [];
                    relatedModels.forEach(function (relatedModel) {
                        if (_this.model.hasDirtyRelation(key, relatedModel) || relatedModel.isDirty(nested)) {
                            data.push(_this._processRelatedModel(relatedModel, nested));
                        }
                    });
                    if (data.length === 0)
                        data = null;
                }
                else {
                    // Either the related model is dirty, or it's a dirty relation
                    // (maybe the "department" is not dirty, but the employee changed departments
                    if (_this.model.hasDirtyRelation(key, relatedModels) || relatedModels.isDirty(nested)) {
                        data = _this._processRelatedModel(relatedModels, nested);
                    }
                }
                if (data) {
                    _relationships[key] = { data: data };
                }
            }
        });
        return _relationships;
    };
    WritePayload.prototype.asJSON = function () {
        var data = {};
        this.model.clearErrors();
        if (this.model.id) {
            data['id'] = this.model.id;
        }
        if (this.model.temp_id) {
            data['temp-id'] = this.model.temp_id;
        }
        data['type'] = this.model.klass.jsonapiType;
        var _attributes = this.attributes();
        if (Object.keys(_attributes).length > 0) {
            data['attributes'] = _attributes;
        }
        var relationshipData = this.relationships();
        if (Object.keys(relationshipData).length > 0) {
            data['relationships'] = relationshipData;
        }
        var json = { data: data };
        if (this.included.length > 0) {
            json['included'] = this.included;
        }
        return json;
    };
    // private
    WritePayload.prototype._processRelatedModel = function (model, nested) {
        var _this = this;
        model.clearErrors();
        if (!model.isPersisted()) {
            model.temp_id = tempId.generate();
        }
        var wp = new WritePayload(model, nested);
        var relatedJSON = wp.asJSON()['data'];
        var resourceIdentifier = this._resourceIdentifierFor(model);
        this._pushInclude(relatedJSON);
        wp.included.forEach(function (incl) {
            _this._pushInclude(incl);
        });
        return resourceIdentifier;
    };
    WritePayload.prototype._resourceIdentifierFor = function (model) {
        var identifier = {};
        identifier['type'] = model.klass.jsonapiType;
        if (model.id) {
            identifier['id'] = model.id;
        }
        if (model.temp_id) {
            identifier['temp-id'] = model.temp_id;
        }
        var method;
        if (model.isPersisted()) {
            if (model.isMarkedForDestruction()) {
                method = 'destroy';
            }
            else if (model.isMarkedForDisassociation()) {
                method = 'disassociate';
            }
            else {
                method = 'update';
            }
        }
        else {
            method = 'create';
        }
        identifier['method'] = method;
        return identifier;
    };
    WritePayload.prototype._pushInclude = function (include) {
        if (!this._isIncluded(include)) {
            this.included.push(include);
        }
        ;
    };
    WritePayload.prototype._isIncluded = function (include) {
        this.included.forEach(function (incl) {
            if (incl['type'] === include['type']) {
                if (incl['id'] === include['id'] || incl['temp-id'] === include['temp-id']) {
                    return true;
                }
            }
        });
        return false;
    };
    WritePayload.prototype._eachAttribute = function (callback) {
        var _this = this;
        var modelAttrs = this.model.attributes;
        Object.keys(modelAttrs).forEach(function (key) {
            if (_this.model.klass.attributeList[key].persist) {
                var value = modelAttrs[key];
                callback(key, value);
            }
        });
    };
    return WritePayload;
}());
export default WritePayload;
//# sourceMappingURL=write-payload.js.map