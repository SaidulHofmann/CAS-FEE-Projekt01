"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Controller functionality for the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/
import { LocationEnum } from './core-types.js';
import { Model } from "./model.js";
import { IndexPage, ListNotesView, EditNoteView } from "./view.js";


/**
 * Handles user inputs and routing. Mediates between view and business logic.
 */
class Controller {
    constructor(objModel, objView) {
        this.model = objModel;
        this.indexPage = objView;
        this.listNotesView = new ListNotesView();
        this.editNoteView = new EditNoteView();

        this.init();
    }

    init(){
        this.addEventHandlerForIndexPage();
        window.addEventListener("hashchange", this.renderCurrentLocation.bind(this));
        this.moveToPage(LocationEnum.HOME());
    }

    moveToPage(strLocationEnum){
        history.pushState(null, strLocationEnum, strLocationEnum);
        this.renderCurrentLocation();
    }

    renderCurrentLocation(){
        let currentLocationHash = location.hash || "#home";
        // remove event handler of previous page.

        switch(currentLocationHash){
            case LocationEnum.HOME():
                console.log("Controller.renderCurrentLocation() executed.");
                console.log("Location hash: " +currentLocationHash);
                this.renderListNotesView();
                break;
            case LocationEnum.EDIT_NOTE():
                console.log("Controller.renderCurrentLocation() executed.");
                console.log("Location hash: " +currentLocationHash);
                this.renderEditNoteView();
                break;
            default:
                console.log("Controller.renderCurrentLocation() executed.");
                console.log("Aktuelle location: '" +currentLocationHash +"' ist unbekannt.");
                break;
        }
    }

    renderListNotesView(){
        //Todo: remove handlers from the precious view automatically.
        this.removeEventHandlerForEditNotesView();

        this.listNotesView.renderUI(this.model.notes);
        this.addEventHandlerForListNotesView();
    }

    renderEditNoteView(){
        //Todo: remove handlers from the precious view automatically.
        this.removeEventHandlerForListNotesView();

        this.editNoteView.renderUI();
        this.addEventHandlerForEditNotesView();
    }

    // Event handler for the index page.
    //-------------------------------------------------------------------------

    addEventHandlerForIndexPage() {
        this.indexPage.btnCreateNewNote.onclick = this.onBtnCreateNewNote_Click.bind(this);
        this.indexPage.drpSelectStyle.onchange = this.onDrpSelectStyle_Change.bind(this);
    }

    removeEventHandlerForIndexPage() {
        this.indexPage.btnCreateNewNote.onclick = null;
        this.indexPage.drpSelectStyle.onchange = null;
    }


    onBtnCreateNewNote_Click(){
        console.log("Controller.onBtnCreateNewNote_Click() executed.");
        history.pushState(null, 'edit note', LocationEnum.EDIT_NOTE());
        this.renderCurrentLocation();
    }

    onDrpSelectStyle_Change(){
        console.log("Controller.onDrpSelectStyle_Click() executed.");
        console.log(this.view.elm.drpSelectStyle.value);
    }


    // Event handler for list notes view.
    //-------------------------------------------------------------------------

    // Todo: add hb template fileds.

    addEventHandlerForListNotesView(){
        this.listNotesView.btnSortByFinishDate.onclick = this.onBtnSortByFinishDate_Click.bind(this);
        this.listNotesView.btnSortByCreateDate.onclick = this.onBtnSortByCreateDate_Click.bind(this);
        this.listNotesView.btnSortByImportance.onclick = this.onBtnSortByImportance_Click.bind(this);
        this.listNotesView.btnFilterByFinished.onclick = this.onBtnFilterByFinished_Click.bind(this);
        this.listNotesView.mainBubbleEvents.onclick = this.onMainBubbleEvents.bind(this);
    }

    removeEventHandlerForListNotesView(){
        this.listNotesView.btnSortByFinishDate.onclick = null;
        this.listNotesView.btnSortByCreateDate.onclick = null;
        this.listNotesView.btnSortByImportance.onclick = null;
        this.listNotesView.btnFilterByFinished.onclick = null;
        this.listNotesView.mainBubbleEvents.onclick = null;
    }

    onBtnSortByFinishDate_Click(){
        console.log("Controller.onBtnSortByFinishDate_Click() executed.");
    }
    onBtnSortByCreateDate_Click(){
        console.log("Controller.onBtnSortByCreateDate_Click() executed.");
    }

    onBtnSortByImportance_Click(){
        console.log("Controller.onBtnSortByImportance_Click() executed.");
    }

    onBtnFilterByFinished_Click(){
        console.log("Controller.onBtnFilterByFinished_Click() executed.");
    }

    onMainBubbleEvents(event){
        console.log("Controller.onMainBubbleEvents() executed.");
        console.log(event);
    }


    // Event handler for edit note view.
    //-------------------------------------------------------------------------

    addEventHandlerForEditNotesView(){
        this.editNoteView.btnSaveNote.onclick = this.onBtnSaveNote_Click.bind(this);
        this.editNoteView.btnCancelNote.onclick = this.onBtnCancelNote_Click.bind(this);
    }

    removeEventHandlerForEditNotesView(){
        if(this.editNoteView.btnSaveNote) { this.editNoteView.btnSaveNote.onclick = null; }
        if(this.editNoteView.btnCancelNote){ this.editNoteView.btnCancelNote.onclick = null; };
    }

    onBtnSaveNote_Click(){
        console.log("Controller.onBtnSaveNote_Click() executed.");
        this.model.saveNote(this.editNoteView.getNote());
        this.moveToPage(LocationEnum.HOME());
    }

    onBtnCancelNote_Click(){
        console.log("Controller.onBtnCancelNote_Click() executed.");
        this.moveToPage(LocationEnum.HOME());
    }


    addNote(note){
        console.log("Controller.addNote() executed. ", note);
        // Validate
        // Check if note already exists.

        // Save note.
        this.model.saveNote(note);
        window.location.replace("index.html");
        this.renderUI();
    }

    renderUI(){
        let elmMain = document.getElementById("main");
        let notesListTemplate = document.getElementById("notes-list-template").innerHTML;
        let fnNotesListTemplateScript = Handlebars.compile(notesListTemplate);
        document.getElementById("main").innerHTML = fnNotesListTemplateScript({notes: this.model.notes});

        //document.getElementById("notes").innerHTML = notes.length == 0 ? "Keine Notizen vorhanden." : notes.join("</br>"); //temporary solution.
    }

    getNotesCount() {
        return this.model.getNotesCount();
    }
}


window.onload = function() {
    console.log("window.onload started.");

    const model = new Model();
    const view = new IndexPage();
    const controller = new Controller(model,view);

}
