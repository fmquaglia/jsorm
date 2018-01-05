import Model from '../model';
import Config from '../configuration';

export default function refreshJWT(klass: typeof Model, serverResponse: Response) : void {
  let jwt = serverResponse.headers.get('X-JWT');
  if (!jwt) return

  let localStorage = Config.localStorage;
  if (localStorage) {
    let localStorageKey = Config.jwtLocalStorage;
    if (localStorageKey) {
      localStorage['setItem'](localStorageKey, jwt);
    }
  }

  if (jwt) {
    klass.setJWT(jwt);
  }
}
