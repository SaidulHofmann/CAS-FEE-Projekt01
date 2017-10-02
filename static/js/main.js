'use strict';
/*
Project: HSR CAS FEE 2017
Content: Javascript  for note application.
Created on: 02.10.2017
Author: Saidul Hofmann
 */

// Type definitions.
// ****************************************************************************

class Note {
    constructor() {
        this.id = createGuid();
        this.title = "";
        this.description = "";
        this.importance = 1;
        this.completionDate = new Date().toDateString();
        this.isFinished = false;
    }
}

class Model {
    constructor() {
        this.storage = window.localStorage;
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
        return notes;
    }

    getNotesCount() {
        return this.storage.length;
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












// Initialisation
// ****************************************************************************

/**
 * Actions after the DOM has been fully loaded and parsed.
 */
document.addEventListener('DOMContentLoaded', () => {

    let model = new Model();

    // Display notes.
    document.getElementById("notesCount").innerText = notes.length;
    document.getElementById("notes").innerHTML = notes.length == 0 ? "Keine Notizen vorhanden." : notes.join("</br>"); //temporary solution.


});