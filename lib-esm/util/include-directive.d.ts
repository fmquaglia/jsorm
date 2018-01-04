export default class IncludeDirective {
    dct: Object;
    constructor(obj: string | Array<any> | Object);
    toObject(): Object;
    toString(): string;
    parseIncludeArgs(includeArgs: string | Object | Array<any>): Object;
    private _parseObject(includeObj);
    private _parseArray(includeArray);
}
