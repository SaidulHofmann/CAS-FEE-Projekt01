'use strict';
/*
Project: HSR CAS FEE 2017
Content: Javascript  for note application.
Created on: 02.10.2017
Author: Saidul Hofmann
 */

// Type definitions.
// ****************************************************************************

class SortDataEnum {
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

class Note {
    constructor() {
        this.id = createGuid();
        this.title = "";
        this.description = "";
        this.importance = 1;
        this.createDate = new Date().toDateString();
        this.finishDate = new Date().toDateString();
    }
}

class Model {
    constructor() {
        this.storage = window.localStorage;
        this.notes = createNotesStorage();
        this.currentSortOrder = SortDataEnum.BY_IMPORTANCE();
        this.filterByFinished = false;
    }

    createNotesStorage(){
        let notesJsonObj = window.localStorage.getItem("notesJsonObj");
        if(!notesJsonObj){
            localStorage.setItem("notesJsonObj", JSON.stringify([]));
            notesJsonObj = localStorage.getItem("notesJsonObj");
        }
        this.notes = JSON.parse(notesJsonObj);
    }

    createNote() {
        return new Note();
    }

    deleteNote(id) {
        if(! id instanceof String) {
            throw "Für die zu löschende Notiz wurde eine ungültige Id übergeben.";
        }
        this.storage.removeItem(id);
    }

    saveNote(note) {
        if(!note instanceof Note) {
            throw "saveNote(note): Es wurde kein gültiges Notiz Objekt übergeben.";
        }
        this.storage.setItem(id, JSON.stringify(note));
    }

    getAllNotes() {
        let notes = [];
        for (let i in this.storage) {
            if (this.storage.hasOwnProperty(i)) {
                notes.push(JSON.parse(this.storage[i]));
            }
        }

        switch(this.currentSortOrder){
            case SortDataEnum.BY_IMPORTANCE():
                notes.sort((a,b) => {a.importance - b.importance});
                break;
            case SortDataEnum.BY_CREATE_DATE():
                notes.sort((a,b) => {a.createDate - b.createDate});
                break;
            case SortDataEnum.BY_FINISH_DATE():
                notes.sort((a,b) => {a.finishDate - b.finishDate});
                break;
        }

        return notes;
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
        return this.storage.length;
    }
}

class Controller {
    constructor(model) {
        //Access to Model
        this.model = model;

        // Access to View
        this.btnCreateNewNote = null;
        this.btnSortByFinishDate = null;
        this.btnSortByCreateDate = null;
        this.btnSortByImportance = null;
        this.btnFilterByFinished = null;
        this.currentStyleSheet = "";
    }

    bootstrap(){
        this.btnSortByCreateDate.onclick = (e) => {
            this.model.setSortOrderByCreateDate();
            renderUI();
        }
        this.btnSortByFinishDate.onclick = (e) => {
            this.model.setSortOrderByFinishDate();
            renderUI();
        }
        this.btnSortByImportance.onclick = (e) => {
            this.model.setSortOrderByImportance();
            renderUI();
        }
        this.btnFilterByFinished.onclick = (e) => {
            this.model.toggleFilterByFinished();
            renderUI();
        }
    }

    renderUI(){

    }

}



// Function definitions.
// ****************************************************************************

/**
 * Creates an unique id for identifying objects.
 * @returns {string} unique identifier.
 */
function createGuid() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function addNote(){
    let notes = JSON.parse(sessionStorage.getItem("notes"));
    notes.push(document.getElementById("note").value);
    sessionStorage.setItem("notes", JSON.stringify(notes));
    window.location.replace("index.html");
}





// Global variables
// ****************************************************************************

// Create notes array in session storage.
let notes = sessionStorage.getItem("notes");
if(!notes){
    sessionStorage.setItem("notes", JSON.stringify([]));
    notes = sessionStorage.getItem("notes");
}
notes = JSON.parse(notes);









// Actions after the DOM has been fully loaded and parsed.
// ****************************************************************************
document.addEventListener('DOMContentLoaded', () => {

    let model = new Model();
    let controller = new Controller(model);

    // Bootstrapping
    controller.btnCreateNewNote = document.getElementById('btnCreateNewNote');
    controller.btnSortByFinishDate = document.getElementById('btnSortByFinishDate');
    controller.btnSortByCreateDate = document.getElementById('btnSortByCreateDate');
    controller.btnSortByImportance = document.getElementById('btnSortByImportance');
    controller.btnFilterByFinished = document.getElementById('btnFilterByFinished');

    // Display notes.
    document.getElementById("notesCount").innerText = notes.length;
    document.getElementById("notes").innerHTML = notes.length == 0 ? "Keine Notizen vorhanden." : notes.join("</br>"); //temporary solution.

});