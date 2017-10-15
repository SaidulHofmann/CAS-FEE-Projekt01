"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Contains UI related logic for data visualisation.
Created on: 02.10.2017
Author: Saidul Hofmann
 */

import { Note } from './core-types.js';

/**
 * Main page for the notes application.
 */
export class IndexPage {
    constructor (){
        this.btnCreateNewNote = document.getElementById('btnCreateNewNote');
        this.drpSelectStyle = document.getElementById('drpSelectStyle');
    }
}

/**
 * Partial view for listing notes.
 */
export class ListNotesView {
    constructor(){
        this.init();
    }

    init(){
        let listNotesTemplate = document.getElementById("list-notes-template").innerHTML;
        this.fnListNotesTemplateScript = Handlebars.compile(listNotesTemplate);
    }

    renderUI(arrNotes){
        document.querySelector("main").innerHTML = this.fnListNotesTemplateScript({notes: arrNotes});
        this.setAttributes();
    }

    setAttributes(){
        this.btnSortByFinishDate = document.getElementById('btnSortByFinishDate');
        this.btnSortByCreateDate = document.getElementById('btnSortByCreateDate');
        this.btnSortByImportance = document.getElementById('btnSortByImportance');
        this.btnFilterByFinished = document.getElementById('btnFilterByFinished');
        this.mainBubbleEvents = document.querySelector("main");
    }

}

/**
 * Partial view for editing notes.
 */
export class EditNoteView {
    constructor(){
        this.init();
    }

    init(){
        let editNoteTemplate = document.getElementById("edit-note-template").innerHTML;
        this.fnEditNoteTemplateScript = Handlebars.compile(editNoteTemplate);
    }

    renderUI(){
        document.querySelector("main").innerHTML = this.fnEditNoteTemplateScript();
        this.setAttributes();
    }

    setAttributes(){
        this.inpTitle = document.getElementById("inpTitle");
        this.txaDescription = document.getElementById("txaDescription");
        this.frmImportance = document.getElementById("frmImportance");
        this.inpFinishDate = document.getElementById("inpFinishDate");
        this.btnSaveNote = document.getElementById("btnSaveNote");
        this.btnCancelNote = document.getElementById("btnCancelNote");

        // default values
        this.inpFinishDate.value = new Date().toISOString().substr(0, 10);
    }


    getNote(){
        let note = new Note();
        note.title = document.getElementById("inpTitle").value;
        note.description = document.getElementById("txaDescription").value;
        note.importance = document.querySelector('input[name=importance][checked]').value;
        note.finishDate = document.getElementById("inpFinishDate").value;
        return note;
    }
}