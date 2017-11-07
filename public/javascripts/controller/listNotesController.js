/**
 * Controller for the list-notes partial view.
 */

import { LocationEnum, SortFieldEnum } from "../services/coreTtypes.js";

export class ListNotesController {

    constructor(objIndexController) {
        this.indexCtr = objIndexController;
        this.model = objIndexController.model;

        this.currentSortOrder = SortFieldEnum.IMPORTANCE;
        this.currentSortDirectionAsc = true;
        this.filterByFinished = false;

        this.init();
    }

    init() {
        this.model.sortNotesView(this.currentSortOrder, this.currentSortDirectionAsc);
        let listNotesTemplate = document.getElementById("list-notes-template").innerHTML;
        this.fnListNotesTemplateScript = Handlebars.compile(listNotesTemplate);
    }

    renderUI(arrNotes) {
        document.querySelector("#content").innerHTML = this.fnListNotesTemplateScript({notes: arrNotes});
        this.setAttributes();
        this.addEventHandlers()
    }

    setAttributes() {
        this.btnSortByFinishDate = document.getElementById('btnSortByFinishDate');
        this.btnSortByCreateDate = document.getElementById('btnSortByCreateDate');
        this.btnSortByImportance = document.getElementById('btnSortByImportance');
        this.btnFilterByFinished = document.getElementById('btnFilterByFinished');
        this.mainBubbleEvents = document.querySelector("main");
    }

    toggleFilterByFinished() {
        this.filterByFinished = !this.filterByFinished;
        this.model.updateNotesView(this.filterByFinished, this.currentSortOrder, this.currentSortDirectionAsc);
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

    //-------------------------------------------------------------------------
    // Event handlers
    //-------------------------------------------------------------------------

    addEventHandlers() {
        this.btnSortByFinishDate.onclick = this.onBtnSortByFinishDate_Click.bind(this);
        this.btnSortByCreateDate.onclick = this.onBtnSortByCreateDate_Click.bind(this);
        this.btnSortByImportance.onclick = this.onBtnSortByImportance_Click.bind(this);
        this.btnFilterByFinished.onclick = this.onBtnFilterByFinished_Click.bind(this);
        this.mainBubbleEvents.onclick = this.onMainBubbleEvents.bind(this);
    }

    removeEventHandlers() {
        this.btnSortByFinishDate.onclick = null;
        this.btnSortByCreateDate.onclick = null;
        this.btnSortByImportance.onclick = null;
        this.btnFilterByFinished.onclick = null;
        this.mainBubbleEvents.onclick = null;
    }

    onBtnSortByFinishDate_Click() {
        this.toggletSortOrderBy(SortFieldEnum.FINISH_DATE);
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }
    onBtnSortByCreateDate_Click() {
        this.toggletSortOrderBy(SortFieldEnum.CREATE_DATE);
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }

    onBtnSortByImportance_Click() {
        this.toggletSortOrderBy(SortFieldEnum.IMPORTANCE);
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }

    onBtnFilterByFinished_Click() {
        this.toggleFilterByFinished();
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }

    onMainBubbleEvents(event) {
        if(event.target.dataset.finishNoteId) {
            this.onMainBubbleEvents_finishNoteId(event);
        }
        else if (event.target.dataset.editNoteId){
            this.onMainBubbleEvents_editNoteId(event);
        }
    }

    onMainBubbleEvents_finishNoteId(event) {
        this.model.setNotesStateFinished(event.target.dataset.finishNoteId,
            event.target.checked);
    }

    onMainBubbleEvents_editNoteId(event) {
        let note = this.model.getNoteById(event.target.dataset.editNoteId);
        if(!this.model.isNote(note)){
            throw "Die zu editierende Notiz konnte nicht geladen werden.";
        }
        this.indexCtr.showPartialView(LocationEnum.EDIT_NOTE, note);
    }

}