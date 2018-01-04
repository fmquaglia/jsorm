import Attribute from './attribute';
import Model from './model';
export declare class Base extends Attribute {
    klass: typeof Model;
    isRelationship: boolean;
    jsonapiType: string;
    constructor(...args: any[]);
    getter(context: Model): any;
    setter(context: Model, val: any): void;
}
export declare class HasMany extends Base {
    getter(context: Model): any;
}
export declare class HasOne extends Base {
}
export declare class BelongsTo extends Base {
}
declare const hasMany: (...args: any[]) => HasMany;
declare const hasOne: (...args: any[]) => HasOne;
declare const belongsTo: (...args: any[]) => BelongsTo;
export { hasMany, hasOne, belongsTo };
