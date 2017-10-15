"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Core types used in the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/

export class Note {
    constructor() {
        this.id = createGuid();
        this.title = "";
        this.description = "";
        this.importance = 1;
        this.createDate = new Date().toISOString().substr(0, 10);
        this.finishDate = new Date().toISOString().substr(0, 10);
        this.finished = false;
    }
}

export class SortDataEnum {
    static BY_FINISH_DATE(){
        return "BY_FINISH_DATE";
    }
    static BY_CREATE_DATE(){
        return "BY_CREATE_DATE";
    }
    static BY_IMPORTANCE(){
        return "BY_IMPORTANCE";
    }
}

export class LocationEnum {
    static HOME(){
        return "#home";
    }
    static EDIT_NOTE(){
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





