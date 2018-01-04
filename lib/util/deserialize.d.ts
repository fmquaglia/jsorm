/// <reference path="../../types/index.d.ts" />
import Model from '../model';
declare function deserialize(datum: japiResource, payload: japiDoc): Model;
declare function deserializeInstance(instance: Model, resource: japiResource, payload: japiDoc, includeDirective?: Object): Model;
export { deserialize, deserializeInstance };
