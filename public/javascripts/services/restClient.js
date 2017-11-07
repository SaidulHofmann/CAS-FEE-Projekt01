import {TemporaryStorage} from './temporaryStorage.js';
import { requestAsync } from '../utils/ajaxHelper.js';

export class RestClient {
    constructor(){
        this.tempStorage = new TemporaryStorage();
        this.tokenKey = "token";
    }

    isLoggedIn() {
        return !!this.tempStorage.getValue(this.tokenKey);
    }

    async login(userName, pwd) {
        return requestAsync("POST", "/login/", {email: userName, pwd: pwd})
            .done(this.setToken.bind(this));
    }

    setToken(token) {
        this.tempStorage.setValue(this.tokenKey, token);
    }

    async logout() {
        await this.tempStorage.setValue(this.tokenKey, undefined);
    }

    createNote(note) {
        return requestAsync("POST", "/notes/", { note: note },
            {authorization: "Bearer " + this.tempStorage.getValue(this.tokenKey)});
    }

}