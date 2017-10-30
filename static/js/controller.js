"use strict";
/*
Project: HSR CAS FEE 2017, Project 01 - notes application.
Content: Controller functionality for the notes application.
Created on: 12.10.2017
Author: Saidul Hofmann
*/
import { LocationEnum, SortDataEnum } from './core-types.js';
import { Model } from "./model.js";
import { IndexPage, ListNotesView, EditNoteView } from "./view.js";


/**
 * Handles user inputs and routing. Mediates between view and business logic.
 */
class Controller {
    constructor(objModel, objView) {
        // Views
        this.model = objModel;
        this.mainPage = objView;
        this.listNotesView = new ListNotesView();
        this.editNoteView = new EditNoteView();
        // State
        this.styleSheetStorageName = "StyleSheetStorage";
        this.currentStyleSheet = this.getLastSelectedStylesheet();
        this.currentSortOrder = SortDataEnum.BY_IMPORTANCE();
        this.currentSortDirectionAsc = true;
        this.filterByFinished = false;

        this.init();
    }

    init(){
        this.addEventHandlerForMainPage();
        this.mainPage.setStyleSheet(this.getLastSelectedStylesheet());
        window.addEventListener("hashchange", this.renderCurrentLocation.bind(this));
        this.model.sortNotesView(this.currentSortOrder, this.currentSortDirectionAsc);
        this.showPartialView(LocationEnum.HOME(), null);
    }

    getLastSelectedStylesheet(){
        if(this.currentStyleSheet){
            return this.currentStyleSheet;
        } else{
            return this.model.loadStylesheet(this.styleSheetStorageName);
        }
    }

    toggletSortOrderBy(strSortDataEnum) {
        if(this.currentSortOrder === strSortDataEnum){
            this.currentSortDirectionAsc = !this.currentSortDirectionAsc;
        } else{
            this.currentSortOrder = strSortDataEnum;
            this.currentSortDirectionAsc = true;
        }
        this.model.sortNotesView(this.currentSortOrder, this.currentSortDirectionAsc);
    }

    toggleFilterByFinished() {
        this.filterByFinished = !this.filterByFinished;
        this.model.updateNotesView(this.filterByFinished, this.currentSortOrder, this.currentSortDirectionAsc);
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

        this.listNotesView.renderUI(this.model.getNotesView());
        this.addEventHandlerForListNotesView();
    }

    renderEditNoteView(params){
        //Todo: remove handlers from the precious view in a separate method.
        this.removeEventHandlerForListNotesView();

        this.editNoteView.renderUI(params);
        this.addEventHandlerForEditNotesView();
    }

    // Event handler for the main page.
    //-------------------------------------------------------------------------

    addEventHandlerForMainPage() {
        this.mainPage.btnCreateNewNote.onclick = this.onBtnCreateNewNote_Click.bind(this);
        this.mainPage.drpSelectStyle.onchange = this.onDrpSelectStyle_Change.bind(this);
    }

    removeEventHandlerForIndexPage() {
        this.mainPage.btnCreateNewNote.onclick = null;
        this.mainPage.drpSelectStyle.onchange = null;
    }


    onBtnCreateNewNote_Click(){
        history.pushState(null, 'edit note', LocationEnum.EDIT_NOTE());
        this.renderCurrentLocation();
    }

    onDrpSelectStyle_Change(){
        let selectedStyleSheet = this.mainPage.setSelectedStyleSheet();
        this.model.persistStyleSheet(this.styleSheetStorageName, selectedStyleSheet);
        this.currentStyleSheet = selectedStyleSheet;
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
        this.toggletSortOrderBy(SortDataEnum.BY_FINISH_DATE());
        this.showPartialView(LocationEnum.HOME());
    }
    onBtnSortByCreateDate_Click(){
        this.toggletSortOrderBy(SortDataEnum.BY_CREATE_DATE());
        this.showPartialView(LocationEnum.HOME());
    }

    onBtnSortByImportance_Click(){
        this.toggletSortOrderBy(SortDataEnum.BY_IMPORTANCE());
        this.showPartialView(LocationEnum.HOME());
    }

    onBtnFilterByFinished_Click(){
        this.toggleFilterByFinished();
        this.showPartialView(LocationEnum.HOME());
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
        if(!Model.isNote(note)){
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
        if(this.editNoteView.btnCancelNote){ this.editNoteView.btnCancelNote.onclick = null; }
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

};
