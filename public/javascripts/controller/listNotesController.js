"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Controller for the list-notes partial view.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
 */

import { LocationEnum, SortFieldEnum, FilterFieldEnum, Note } from "../services/coreTypes.js";


export class ListNotesController {

    constructor(objIndexController) {
        this.indexCtr = objIndexController;
        this.restClient = objIndexController.restClient;
        this.init();
    }

    init() {
        let noteListTemplate = document.getElementById("note-list-template").innerHTML;
        this.fnNoteListRenderer = Handlebars.compile(noteListTemplate);
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
        document.querySelector("#content").innerHTML = this.fnNoteListRenderer({notes: arrNotes});
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
        if (event.target.dataset.editNoteId) {
            this.onMainBubbleEvents_editNoteId(event);
        }
        if (event.target.dataset.slideNote) {
            this.onMainBubbleEvents_slideNote(event);
        }
    }

    async onMainBubbleEvents_editNoteId(event) {
        let note = await this.restClient.getNote(this.indexCtr.currentUser, event.target.dataset.editNoteId) ;
        if(note) {
            this.indexCtr.renderPartialView(LocationEnum.EDIT_NOTE, note);
        } else {
            alert("Die zu editierende Notiz konnte nicht geladen werden.");
        }
    }
    onMainBubbleEvents_slideNote(event) {
        console.log("onMainBubbleEvents_slideNote().", event.target);
        console.log("selected node: ", event.target.nextElementSibling);
        $(event.target.nextElementSibling).slideToggle(500);
    }

    //-------------------------------------------------------------------------
    // Additional Methods
    //-------------------------------------------------------------------------

    renderUI() {
        if (this.indexCtr.currentUser && this.indexCtr.currentUser.passwortHash) {
            this.restClient.getNotes(this.indexCtr.currentUser, this.getQueryString()).then(arrNotes => {
                this.setContent(arrNotes);
                this.addEventHandlers();
                this.updateFilterIcon();
                this.updateSortIcon();
            });
        } else {
            this.setContent("");
        }
    }

    toggleFilterByFinished() {
        this.setIsFilteredByFinished(!this.getIsFilteredByFinished());
        this.restClient.saveUser(this.indexCtr.currentUser);
        this.updateFilterIcon();
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
        this.updateSortIcon();
        this.renderUI();
    }

    getQueryString() {
        let queryString = "order-by=" + this.getCurrentSortField();
        queryString += "&order-direction=" + (this.getIsSortDirectionAsc() ? "1" : "-1");
        queryString += `&${FilterFieldEnum.IS_FINISHED}=` + this.getIsFilteredByFinished();
        return queryString;
    }

    updateSortIcon() {
        $("#btnSortByFinishDate, #btnSortByCreateDate, #btnSortByImportance").removeClass("icon-up icon-down active");
        switch (this.getCurrentSortField()) {
            case SortFieldEnum.FINISH_DATE:
                this.updateSortIconForButton("#btnSortByFinishDate", this.getIsSortDirectionAsc());
                break;
            case SortFieldEnum.CREATE_DATE:
                this.updateSortIconForButton("#btnSortByCreateDate", this.getIsSortDirectionAsc());
                break;
            case SortFieldEnum.IMPORTANCE:
                this.updateSortIconForButton("#btnSortByImportance", this.getIsSortDirectionAsc());
                break;
        }
    }

    updateSortIconForButton(buttonId, isSortDirectionAsc) {
        $(buttonId).toggleClass("active", true);
        $(buttonId).toggleClass("icon-down", !isSortDirectionAsc);
        $(buttonId).toggleClass("icon-up", isSortDirectionAsc);
    }

    updateFilterIcon() {
        $("#btnFilterByFinished").toggleClass("icon-filter active", (this.getIsFilteredByFinished()));
    }
}