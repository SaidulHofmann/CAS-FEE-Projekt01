import {TemporaryStorage} from './temporaryStorage.js';
import { requestAsync } from '../utils/ajaxHelper.js';
import { User } from './coreTypes.js';

export class RestClient {
    constructor(){
        this.tempStorage = new TemporaryStorage();
    }

    isLoggedIn(objUser) {
        return !!(objUser && objUser.passwortHash);
    }

    async login(strEmail, strPassword) {
        let user = null;
        await requestAsync("POST", "/login/", {email: strEmail, pwd: strPassword})
            .done((token) => {
                user = this.tempStorage.getValue(strEmail);
                user = user ? user : new User(strEmail);
                user.passwortHash = token;
                this.tempStorage.setValue(strEmail, user);
            });
        return user;
    }

    async logout(objUser) {
        objUser.passwortHash = "";
        await this.saveUser(objUser);
        objUser = null;
    }

    saveUser(objUser) {
        this.tempStorage.setValue(objUser.email, objUser);
    }


    saveStyleSheet(strStyleSheetStorageName, strStyleSheet){
        this.tempStorage.saveData(strStyleSheetStorageName, strStyleSheet);
    }

    loadStylesheet(strStyleSheetStorageName){
        return this.tempStorage.loadStylesheet(strStyleSheetStorageName);
    }

    async saveNote(objUser, objNote) {
        return requestAsync("POST", "/notes/", { note: objNote },
            {authorization: "Bearer " + objUser.passwortHash});
    }

    async getNotes(objUser, strQueryString) {
        return requestAsync("GET", `/notes/?email=${objUser.email}&${strQueryString}`, undefined, {authorization: "Bearer " + objUser.passwortHash});
    }

    async getNote(objUser, strNoteId) {
        return requestAsync("GET", `/notes/${strNoteId}`, undefined, {authorization: "Bearer " + objUser.passwortHash});
    }

    deleteNote(objUser, objNote) {
        return requestAsync("DELETE", `/notes/${objNote._id}`, undefined, {authorization: "Bearer " + objUser.passwortHash});
    }

    async setNotesStateFinished(objUser, strNoteId, boolFinished){
        let note = await this.getNote(objUser, strNoteId);
        if(note){
            note.finishDate = new Date().toISOString().substr(0, 10);
            note.isFinished = boolFinished;
            this.saveNote(objUser, note);
        } else{
            throw "Das Notiz Objekt '" +strNoteId +"' konnte nicht gefunden werden.";
        }
    }


}