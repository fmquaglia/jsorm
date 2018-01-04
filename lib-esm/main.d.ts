/// <reference path="../types/index.d.ts" />
import 'object-assign-shim';
import patchExtends from './custom-extend';
import Config from './configuration';
import Model from './model';
import attrDecorator from './util/attr-decorator';
import { hasMany, hasOne, belongsTo } from './associations';
declare const attr: (opts?: attributeOptions) => any;
export { Config, Model, attr, attrDecorator, hasMany, hasOne, belongsTo, patchExtends };
