"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Core types used in the notes application.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
*/


export class Note {
    constructor() {
        this._id = createGuid();
        this.createdBy = "";
        this.title = "";
        this.description = "";
        this.importance = 1;
        this.createDate = new Date().toISOString().substr(0, 10);
        this.finishDate = new Date().toISOString().substr(0, 10);
        this.isFinished = false;
    }
}

export class User {
    constructor(strEmail) {
        this.email = strEmail;
        this.passwortHash = "";
        this.sortField = SortFieldEnum.FINISH_DATE;
        this.isSortDirectionAsc = true;
        this.isFilteredByFinished = false;
        this.createDate = new Date().toISOString().substr(0, 10);
    }
}

export class SortFieldEnum {
    static get FINISH_DATE(){
        return "finishDate";
    }
    static get CREATE_DATE(){
        return "createDate";
    }
    static get IMPORTANCE(){
        return "importance";
    }
}

export class FilterFieldEnum {
    static get IS_FINISHED(){
        return "isFinished";
    }
}

export class LocationEnum {
    static get LOGIN(){
        return "#login";
    }
    static get LIST_NOTES(){
        return "#listNotes";
    }
    static get EDIT_NOTE(){
        return "#editNote";
    }
}

/**
 * Creates an unique id for identifying objects.
 * @returns {string} unique identifier.
 */
export function createGuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}





