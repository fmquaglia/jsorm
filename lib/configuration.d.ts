/// <reference path="../types/index.d.ts" />
import Model from './model';
import Logger from './logger';
export default class Config {
    static models: Array<typeof Model>;
    static typeMapping: Object;
    static logger: Logger;
    static jwtLocalStorage: string | false;
    static localStorage: any;
    static beforeFetch: Array<Function>;
    static afterFetch: Array<Function>;
    static setup(options?: Object): void;
    static reset(): void;
    static modelForType(type: string): typeof Model;
}
