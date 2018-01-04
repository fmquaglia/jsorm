declare class CollectionProxy<T> implements IResultProxy<T> {
    private _raw_json;
    private _array;
    constructor(raw_json?: japiDoc);
    readonly raw: japiDoc;
    readonly data: Array<T>;
    readonly meta: Object;
    private setRaw;
}
export default CollectionProxy;
