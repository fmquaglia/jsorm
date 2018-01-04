import Model from './model';
import { CollectionProxy, RecordProxy } from './proxies';
export default class Scope {
    model: typeof Model;
    _associations: Object;
    _pagination: {
        number?: number;
        size?: number;
    };
    _filter: Object;
    _sort: Object;
    _fields: Object;
    _extra_fields: Object;
    _include: Object;
    _stats: Object;
    constructor(model: typeof Model);
    all(): Promise<CollectionProxy<Model>>;
    find(id: string | number): Promise<RecordProxy<Model>>;
    first(): Promise<RecordProxy<Model>>;
    merge(obj: Object): Scope;
    page(pageNumber: number): Scope;
    per(size: number): Scope;
    where(clause: Object): Scope;
    stats(clause: Object): Scope;
    order(clause: Object | string): Scope;
    select(clause: Object): Scope;
    selectExtra(clause: Object): Scope;
    includes(clause: Object | string | Array<any>): Scope;
    scope(): Scope;
    asQueryParams(): Object;
    toQueryParams(): string | void;
    copy(): Scope;
    private _mergeAssociationQueryParams(queryParams, associations);
    private _transformAssociationSortParam(associationName, param);
    private _sortParam(clause);
    private _fetch(url);
}
