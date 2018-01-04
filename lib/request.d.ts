import Model from './model';
export default class Request {
    modelClass: typeof Model;
    constructor(modelClass: typeof Model);
    get(url: string, options: RequestInit): Promise<any>;
    post(url: string, payload: Object, options: RequestInit): Promise<any>;
    put(url: string, payload: Object, options: RequestInit): Promise<any>;
    delete(url: string, options: RequestInit): Promise<any>;
    private _logRequest(verb, url);
    private _logResponse(responseJSON);
    private _fetchWithLogging(url, options);
    private _fetch(url, options);
    private _handleResponse(response, resolve, reject);
}
