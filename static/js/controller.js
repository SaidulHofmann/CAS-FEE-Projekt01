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
        this.showPartialView(LocationEnum.HOME(), null);
    }

    showPartialView(strLocationEnum, params){
        history.pushState(null, strLocationEnum, strLocationEnum);
        this.renderCurrentLocation(params);
    }

    renderCurrentLocation(params){
        let currentLocationHash = location.hash || "#home";
        // remove event handler of previous page.

        switch(currentLocationHash){
            case LocationEnum.HOME():
                this.renderListNotesView();
                break;
            case LocationEnum.EDIT_NOTE():
                this.renderEditNoteView(params);
                break;
            default:
                console.log("Aktuelle location: '" +currentLocationHash +"' ist unbekannt.");
                break;
        }
    }

    renderListNotesView(){
        //Todo: remove handlers from the precious view in a separate method.
        this.removeEventHandlerForEditNotesView();

        this.listNotesView.renderUI(this.model.notes);
        this.addEventHandlerForListNotesView();
    }

    renderEditNoteView(params){
        //Todo: remove handlers from the precious view in a separate method.
        this.removeEventHandlerForListNotesView();

        this.editNoteView.renderUI(params);
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
        history.pushState(null, 'edit note', LocationEnum.EDIT_NOTE());
        this.renderCurrentLocation();
    }

    onDrpSelectStyle_Change(){
        console.log("Controller.onDrpSelectStyle_Click() executed.");
        console.log(this.indexPage.drpSelectStyle.value);
    }


    // Event handler for the list notes view.
    //-------------------------------------------------------------------------

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
        if(event.target.dataset.finishNoteId){
            this.onMainBubbleEvents_finishNoteId(event);
        }
        else if (event.target.dataset.editNoteId){
            this.onMainBubbleEvents_editNoteId(event);
        }
    }

    onMainBubbleEvents_finishNoteId(event){
        this.model.setNotesStateFinished(event.target.dataset.finishNoteId,
            event.target.checked);
    }

    onMainBubbleEvents_editNoteId(event){
        let note = this.model.getNoteById(event.target.dataset.editNoteId);
        if(!this.model.isNote(note)){
            throw "Die zu editierende Notiz konnte nicht geladen werden.";
        }
        this.showPartialView(LocationEnum.EDIT_NOTE(), note);
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
        this.model.saveNote(this.editNoteView.getNote());
        this.showPartialView(LocationEnum.HOME());
    }

    onBtnCancelNote_Click(){
        this.showPartialView(LocationEnum.HOME());
    }

}

// Main entry point for the application.
//-------------------------------------------------------------------------

window.onload = function() {
    console.log("window.onload started.");

    const model = new Model();
    const view = new IndexPage();
    const controller = new Controller(model,view);

}
