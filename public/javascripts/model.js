"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Model for the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/

import { Note, SortFieldEnum } from './services/coreTypes.js';
import {TemporaryStorage} from './services/temporaryStorage.js';


/**
 * Contains business logic and provides data for the notes application.
 */
export class Model {
    constructor() {
        this.tempStorage = new TemporaryStorage();
        this.storageName = "NotesStorage";
        this.notes = this.tempStorage.loadNotes(this.storageName);
        this.notesView = this.notes;
        this.init();
    }

    init(){
    }

    getNotesView(){
        return this.notesView;
    }

    updateNotesView(bolFilterByFinished, strSortOrder, bolSortDirectionAsc){
        this.filterNotesView(bolFilterByFinished);
        this.sortNotesView(strSortOrder, bolSortDirectionAsc);
    }

    filterNotesView(bolFilterByFinished){
        if(bolFilterByFinished){
            this.notesView = this.notes.filter(note => note.isFinished);
        } else{
            this.notesView = this.notes;
        }
    }

    sortNotesView(strSortOrder, bolSortDirectionAsc){
        switch(strSortOrder){
            case SortFieldEnum.IMPORTANCE:
                if(bolSortDirectionAsc){
                    this.notesView.sort((a,b) => a.importance - b.importance);
                } else {
                    this.notesView.sort((a,b) => b.importance - a.importance);
                }
                break;
            case SortFieldEnum.FINISH_DATE:
                if(bolSortDirectionAsc){
                    this.notesView.sort((a,b) => new Date(a.finishDate) - new Date(b.finishDate));
                } else {
                    this.notesView.sort((a,b) => new Date(b.finishDate) - new Date(a.finishDate));
                }
                break;
            case SortFieldEnum.CREATE_DATE:
                if(bolSortDirectionAsc){
                    this.notesView.sort((a,b) => new Date(a.createDate) - new Date(b.createDate));
                } else {
                    this.notesView.sort((a,b) => new Date(b.createDate) - new Date(a.createDate));
                }
                break;
            default:
                throw "Die Sortierung '" +strSortOrder +"' ist unbekannt.";
        }
    }

    persistNotes(){
        this.tempStorage.saveData(this.storageName, this.notes);
    }

    persistStyleSheet(strStyleSheetStorageName, strStyleSheet){
        this.tempStorage.saveData(strStyleSheetStorageName, strStyleSheet);
    }

    loadStylesheet(strStyleSheetStorageName){
        return this.tempStorage.loadStylesheet(strStyleSheetStorageName);
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

    getNotesCount() {
        return this.notes.length;
    }

    setNotesStateFinished(strNoteId, boolFinished){
        strNoteId = String(strNoteId);
        boolFinished = Boolean(boolFinished);

        let note = this.getNoteById(strNoteId);
        if(note){
            note.finishDate = new Date().toISOString().substr(0, 10);
            note.isFinished = boolFinished;
            this.persistNotes();
        } else{
            throw "Das Notiz Objekt '" +strNoteId +"' konnte nicht gefunden werden.";
        }
    }

    isNote(note){
        // Todo: Note Objekt wurde mit Attributen erweitert. Temporär true zurückgeben.
        //return note instanceof Note;
        return true;
    }
}
