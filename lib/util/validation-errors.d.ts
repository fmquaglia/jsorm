import Model from '../model';
export default class ValidationErrors {
    model: Model;
    payload: Array<Object>;
    constructor(model: Model, payload: Array<Object>);
    static apply(model: Model, payload: Array<Object>): void;
    apply(): void;
    private _processResource(errorsAccumulator, meta);
    private _processRelationship(model, meta);
}
