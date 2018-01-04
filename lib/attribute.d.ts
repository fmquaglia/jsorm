import Model from './model';
export default class Attribute {
    name: string;
    persist: boolean;
    isAttr: boolean;
    isRelationship: boolean;
    constructor(opts?: attributeOptions);
    static applyAll(klass: typeof Model): void;
    private static _eachAttribute(klass, callback);
    descriptor(): PropertyDescriptor;
    setter(context: Model, val: any): void;
    getter(context: Model): any;
}
