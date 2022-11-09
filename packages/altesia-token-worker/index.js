export class TokenWorker {
    _getKeyName () {
        return this._keyName;
    }

    setKeyName (name) {
        if (typeof name !== 'string') {
            return;
        }
        this._keyName = name;
        return this;
    }

    getToken() {
        return localStorage.getItem(this._getKeyName());
    }

    clearToken() {
        localStorage.removeItem(this._getKeyName());
    }


    setToken(data) {
        localStorage.setItem(this._getKeyName(), data);
    }

    isToken() {
        return !!this.getToken();
    }
}
