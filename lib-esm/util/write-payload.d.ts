import Model from '../model';
export default class WritePayload {
    model: Model;
    includeDirective: Object;
    included: Array<Object>;
    constructor(model: Model, relationships: string | Array<any> | Object);
    attributes(): Object;
    removeDeletions(model: Model, includeDirective: Object): void;
    postProcess(): void;
    relationships(): Object;
    asJSON(): Object;
    private _processRelatedModel(model, nested);
    private _resourceIdentifierFor(model);
    private _pushInclude(include);
    private _isIncluded(include);
    private _eachAttribute(callback);
}
