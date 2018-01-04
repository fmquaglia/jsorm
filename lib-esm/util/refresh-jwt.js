import Config from '../configuration';
export default function refreshJWT(klass, serverResponse) {
    var jwt = serverResponse.headers.get('X-JWT');
    if (!jwt)
        return;
    var localStorage = Config.localStorage;
    if (localStorage) {
        var localStorageKey = Config.jwtLocalStorage;
        if (localStorageKey) {
            localStorage['setItem'](localStorageKey, jwt);
        }
    }
    if (jwt) {
        klass.setJWT(jwt);
    }
}
//# sourceMappingURL=refresh-jwt.js.map