declare class RecordProxy<T> implements IResultProxy<T> {
    private _raw_json;
    private _model;
    constructor(raw_json?: japiDoc);
    readonly raw: japiDoc;
    readonly data: T;
    readonly meta: Object;
    private setRaw;
}
export default RecordProxy;
