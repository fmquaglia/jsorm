import Model from '../model';
declare class DirtyChecker {
    model: Model;
    constructor(model: Model);
    checkRelation(relationName: string, relatedModel: Model): boolean;
    check(relationships?: Object | Array<any> | string): boolean;
    dirtyAttributes(): Object;
    private _isUnpersisted();
    private _hasDirtyAttributes();
    private _hasDirtyRelationships(includeHash);
    _eachRelatedObject(includeHash: Object, callback: Function): void;
}
export default DirtyChecker;
