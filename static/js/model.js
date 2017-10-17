"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Model for the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/

import { Note, SortDataEnum } from './core-types.js';
import {default as Imports} from './data.js';


/**
 * Contains business logic and provides data for the notes application.
 */
export class Model {
    constructor() {
        this.storageHelper = new Imports.StorageHelper();
        this.storageName = "NotesStorage";
        this.notes = this.storageHelper.loadDataFromStorage(this.storageName);
        this.currentSortOrder = SortDataEnum.BY_IMPORTANCE();
        this.filterByFinished = false;
    }

    sortNotes(){
        switch(this.currentSortOrder){
            case SortDataEnum.BY_IMPORTANCE():
                this.notes.sort((a,b) => a.importance - b.importance);
                break;
            case SortDataEnum.BY_CREATE_DATE():
                this.notes.sort((a,b) => a.createDate - b.createDate);
                break;
            case SortDataEnum.BY_FINISH_DATE():
                this.notes.sort((a,b) => a.finishDate - b.finishDate);
                break;
        }
    }

    persistNotes(){
        this.storageHelper.saveDataInStorage(this.storageName, this.notes);
    }

    getNotesFilteredByFinished(){
        return this.notes.filter(item => item.finished);
    }

    getNotesFilteredAndSorted(){
        this.sortNotes();
        return this.getNotesFilteredByFinished();
    }

    createNote() {
        return new Note();
    }

    deleteNote(id) {
        if(! id instanceof String) {
            throw `Die Notiz Id (${id.toString()}) ist ungültig.`;
        }
        delete this.notes[id];
    }

    saveNote(note) {
        if(!this.isNote(note)) {
            throw "saveNote(note): Es wurde kein gültiges Notiz Objekt übergeben.";
        }
        let existingNote = this.getNoteById(note.id);
        if(existingNote){
            this.notes[this.notes.indexOf(existingNote)] = note;
        } else{
            this.notes.push(note);
        }
        this.storageHelper.saveDataInStorage(this.storageName, this.notes);
    }

    getNoteById(id){
        if(! id instanceof String) {
            throw `Die Notiz Id (${id.toString()}) ist ungültig.`;
        }
        return this.notes.find(item => item.id === id);
    }

    setSortOrderByImportance() {
        return getAllNotes()
        this.currentSortOrder = SortDataEnum.BY_IMPORTANCE();
    }
    setSortOrderByCreateDate() {
        return getAllNotes()
        this.currentSortOrder = SortDataEnum.BY_CREATE_DATE();
    }
    setSortOrderByFinishDate() {
        this.currentSortOrder = SortDataEnum.BY_FINISH_DATE();
    }
    toggleFilterByFinished() {
        if(this.filterByFinished){
            this.filterByFinished = false;
        } else {
            this.filterByFinished = true;
        }
    }
    getNotesCount() {
        return this.notes.length;
    }

    setNotesStateFinished(strNoteId, boolFinished){
        strNoteId = String(strNoteId);
        boolFinished = Boolean(boolFinished);

        let note = this.getNoteById(strNoteId);
        if(note){
            note.finishDate = new Date().toISOString().substr(0, 10);
            note.finished = boolFinished;
            this.persistNotes();
        } else{
            throw "Das Notiz Objekt '" +strNoteId +"' konnte nicht gefunden werden.";
        }
    }

    isNote(note){
        if(!note){
            return false;
        }
        if(!(note instanceof Object)){
            return false;
        }
        return true;
    }
}
