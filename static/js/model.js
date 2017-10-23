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
        this.notesView = this.notes;
        this.currentSortOrder = SortDataEnum.BY_IMPORTANCE();
        this.currentSortDirectionAsc = true;
        this.filterByFinished = false;
        this.init();
    }

    init(){
        this.sortNotesView();
    }

    getNotesView(){
        return this.notesView;
    }

    updateNotesView(){
        this.filterNotesView();
        this.sortNotesView();
    }

    filterNotesView(){
        if(this.filterByFinished){
            this.notesView = this.notes.filter(note => note.finished);
        } else{
            this.notesView = this.notes;
        }
    }

    sortNotesView(){
        switch(this.currentSortOrder){
            case SortDataEnum.BY_IMPORTANCE():
                if(this.currentSortDirectionAsc){
                    this.notesView.sort((a,b) => a.importance - b.importance);
                } else {
                    this.notesView.sort((a,b) => b.importance - a.importance);
                }
                break;
            case SortDataEnum.BY_FINISH_DATE():
                if(this.currentSortDirectionAsc){
                    this.notesView.sort((a,b) => new Date(a.finishDate) - new Date(b.finishDate));
                } else {
                    this.notesView.sort((a,b) => new Date(b.finishDate) - new Date(a.finishDate));
                }
                break;
            case SortDataEnum.BY_CREATE_DATE():
                if(this.currentSortDirectionAsc){
                    this.notesView.sort((a,b) => new Date(a.createDate) - new Date(b.createDate));
                } else {
                    this.notesView.sort((a,b) => new Date(b.createDate) - new Date(a.createDate));
                }
                break;
            default:
                throw "Die Sortierung '" +this.currentSortOrder +"' ist unbekannt.";
        }
    }

    persistNotes(){
        this.storageHelper.saveDataInStorage(this.storageName, this.notes);
        this.updateNotesView();
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
        this.persistNotes();
    }

    getNoteById(id){
        if(! id instanceof String) {
            throw `Die Notiz Id (${id.toString()}) ist ungültig.`;
        }
        return this.notes.find(item => item.id === id);
    }

    toggletSortOrderBy(strSortDataEnum) {
        if(this.currentSortOrder === strSortDataEnum){
            this.currentSortDirectionAsc = !this.currentSortDirectionAsc;
        } else{
            this.currentSortOrder = strSortDataEnum;
            this.currentSortDirectionAsc = true;
        }
        this.sortNotesView();
    }

    toggleFilterByFinished() {
        if(this.filterByFinished){
            this.filterByFinished = false;
        } else {
            this.filterByFinished = true;
        }
        this.updateNotesView();
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
