"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Controller for the list-notes partial view.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
 */

import { LocationEnum, SortFieldEnum, FilterFieldEnum } from "../services/coreTypes.js";

export class ListNotesController {

    constructor(objIndexController) {
        this.indexCtr = objIndexController;
        this.restClient = objIndexController.restClient;
        this.init();
    }

    init() {
        let listNotesTemplate = document.getElementById("list-notes-template").innerHTML;
        this.fnListNotesRenderer = Handlebars.compile(listNotesTemplate);
    }

    //-------------------------------------------------------------------------
    // Getters / Setters
    //-------------------------------------------------------------------------
    getIsFilteredByFinished() { return this.indexCtr.currentUser.isFilteredByFinished; } ;
    setIsFilteredByFinished(boolIsFilteredByFinished) {
        this.indexCtr.currentUser.isFilteredByFinished = boolIsFilteredByFinished;
    }

    getCurrentSortField() { return this.indexCtr.currentUser.sortField || SortFieldEnum.FINISH_DATE };
    setCurrentSortField(strSortField) {
        this.indexCtr.currentUser.sortField = strSortField;
    }

    getIsSortDirectionAsc() { return this.indexCtr.currentUser.isSortDirectionAsc || false; };
    setIsSortDirectionAsc(boolIsSortDirectionAsc) {
        this.indexCtr.currentUser.isSortDirectionAsc = boolIsSortDirectionAsc;
    }

    setContent(arrNotes) {
        document.querySelector("#content").innerHTML = this.fnListNotesRenderer({notes: arrNotes});
    }
    getBtnSortByFinishDate() {
        return document.getElementById('btnSortByFinishDate');
    }
    getBtnSortByCreateDate() {
        return document.getElementById('btnSortByCreateDate');
    }
    getBtnSortByImportance() {
        return document.getElementById('btnSortByImportance');
    }
    getBtnFilterByFinished() {
        return document.getElementById('btnFilterByFinished');
    }
    getMainBubbleEvents() {
        return document.querySelector("#content");
    }

    //-------------------------------------------------------------------------
    // Event handlers
    //-------------------------------------------------------------------------

    addEventHandlers() {
        this.getBtnSortByFinishDate().onclick = this.onBtnSortByFinishDate_Click.bind(this);
        this.getBtnSortByCreateDate().onclick = this.onBtnSortByCreateDate_Click.bind(this);
        this.getBtnSortByImportance().onclick = this.onBtnSortByImportance_Click.bind(this);
        this.getBtnFilterByFinished().onclick = this.onBtnFilterByFinished_Click.bind(this);
        this.getMainBubbleEvents().onclick = this.onMainBubbleEvents.bind(this);
    }

    removeEventHandlers() {
        this.getBtnSortByFinishDate().onclick = null;
        this.getBtnSortByCreateDate().onclick = null;
        this.getBtnSortByImportance().onclick = null;
        this.getBtnFilterByFinished().onclick = null;
        this.getMainBubbleEvents().onclick = null;
    }

    onBtnSortByFinishDate_Click() {
        this.toggletSortFieldByEnum(SortFieldEnum.FINISH_DATE);
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    onBtnSortByCreateDate_Click() {
        this.toggletSortFieldByEnum(SortFieldEnum.CREATE_DATE);
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    onBtnSortByImportance_Click() {
        this.toggletSortFieldByEnum(SortFieldEnum.IMPORTANCE);
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    onBtnFilterByFinished_Click() {
        this.toggleFilterByFinished();
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    onMainBubbleEvents(event) {
        if (event.target.dataset.finishNoteId) {
            this.onMainBubbleEvents_finishNoteId(event);
        }
        else if (event.target.dataset.editNoteId) {
            this.onMainBubbleEvents_editNoteId(event);
        }
        else if (event.target.dataset.deleteNoteId) {
            this.onMainBubbleEvents_deleteNoteId(event);
        }
    }

    onMainBubbleEvents_finishNoteId(event) {
        this.restClient.setNotesStateFinished(this.indexCtr.currentUser,
            event.target.dataset.finishNoteId,
            event.target.checked);
    }

    async onMainBubbleEvents_editNoteId(event) {
        let note = await this.restClient.getNote(this.indexCtr.currentUser, event.target.dataset.editNoteId) ;
        this.indexCtr.renderPartialView(LocationEnum.EDIT_NOTE, note);
    }

    async onMainBubbleEvents_deleteNoteId(event) {
        // let note = await this.restClient.getNote(this.indexCtr.currentUser, event.target.dataset.editNoteId) ;
        // this.indexCtr.renderPartialView(LocationEnum.EDIT_NOTE, note);
        let note = await this.restClient.getNote(this.indexCtr.currentUser, event.target.dataset.deleteNoteId);
        if (!note) {
            return
        }
        let noteDescription = `Id: ${note._id}\nTitel: ${note.title}`;
        let displayText = `Soll die Notiz wirklich gelöscht werden ?\n\n` + noteDescription;

        let boolHasConfirmed = confirm(displayText);
        if (boolHasConfirmed == true) {
            let deleteCount = await this.restClient.deleteNote(this.indexCtr.currentUser, note);
            console.log("Notiz wurde gelöscht:\n" + noteDescription);
            console.log("Anzahl gelöschter Einträge: " + deleteCount);
            this.renderUI();
        }
    }

    //-------------------------------------------------------------------------
    // Additional Methods
    //-------------------------------------------------------------------------

    renderUI() {
        if (this.indexCtr.currentUser && this.indexCtr.currentUser.passwortHash) {
            this.restClient.getNotes(this.indexCtr.currentUser, this.getQueryString()).then(arrNotes => {
                this.setContent(arrNotes);
                this.addEventHandlers();
            });
        } else {
            this.setContent("");
        }
    }

    toggleFilterByFinished() {
        this.setIsFilteredByFinished(!this.getIsFilteredByFinished());
        this.restClient.saveUser(this.indexCtr.currentUser);
        this.renderUI();
    }

    toggletSortFieldByEnum(strSortFieldEnum) {
        if (this.getCurrentSortField() === strSortFieldEnum) {
            this.setIsSortDirectionAsc(!this.getIsSortDirectionAsc());
        } else {
            this.setCurrentSortField(strSortFieldEnum);
            this.setIsSortDirectionAsc(true);
        }
        this.restClient.saveUser(this.indexCtr.currentUser);
        this.renderUI();
    }

    getQueryString() {
        let queryString = "order-by=" + this.getCurrentSortField();
        queryString += "&order-direction=" + (this.getIsSortDirectionAsc() ? "1" : "-1");
        queryString += `&${FilterFieldEnum.IS_FINISHED}=` + this.getIsFilteredByFinished();
        return queryString;
    }

}