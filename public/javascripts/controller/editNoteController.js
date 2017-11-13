"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Controller for the edit-notes partial view.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
 */

import { Note } from '../services/coreTypes.js';
import { LocationEnum } from "../services/coreTypes.js";


export class EditNoteController {

    constructor(objIndexController) {
        this.indexCtr = objIndexController;
        this.restClient = objIndexController.restClient;
        this.init();
    }

    init() {
        let editNoteTemplate = document.getElementById("edit-note-template").innerHTML;
        this.fnEditNoteRenderer = Handlebars.compile(editNoteTemplate);
    }

    //-------------------------------------------------------------------------
    // Getters / Setters
    //-------------------------------------------------------------------------

    getIdValue() {
        return document.getElementById("inp_id").value;
    }

    getCreatedByValue() {
        return document.getElementById("inpCreatedBy").value;
    }

    getInpTitleValue() {
        return document.getElementById("inpTitle").value;
    }

    getTxaDescriptionValue() {
        return document.getElementById("txaDescription").value;
    }

    getInpImportanceSelectedValue() {
        return document.querySelector('input[name="importance"]:checked').value;
    }

    getInpCreateDateValue() {
        return document.getElementById("inpCreateDate").value;
    }

    getInpFinishDateValue() {
        return document.getElementById("inpFinishDate").value;
    }

    getBtnSaveNote() {
        return document.getElementById("btnSaveNote");
    }

    getBtnCancelNote() {
        return document.getElementById("btnCancelNote");
    }

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    addEventHandlers() {
        this.getBtnSaveNote().onclick = this.onBtnSaveNote_Click.bind(this);
        this.getBtnCancelNote().onclick = this.onBtnCancelNote_Click.bind(this);
    }

    removeEventHandlers() {
        if (this.getBtnSaveNote()) {
            this.getBtnSaveNote().onclick = null;
        }
        if (this.getBtnCancelNote()) {
            this.getBtnCancelNote().onclick = null;
        }
    }

    async onBtnSaveNote_Click() {
        event.preventDefault();
        await this.restClient.saveNote(this.indexCtr.currentUser, this.getNote());
        this.RenderDefaultView();
    }

    onBtnCancelNote_Click() {
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    //-------------------------------------------------------------------------
    // Additional Methods
    //-------------------------------------------------------------------------

    renderUI(params) {
        if (params) {
            document.querySelector("#content").innerHTML = this.fnEditNoteRenderer(params);
        }
        else {
            let note = new Note();
            note.createdBy = this.indexCtr.currentUser.email;
            document.querySelector("#content").innerHTML = this.fnEditNoteRenderer(note);
        }
        this.addEventHandlers();
    }

    RenderDefaultView() {
        this.removeEventHandlers();
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    getNote() {
        let note = new Note();
        note._id = this.getIdValue();
        note.createdBy = this.getCreatedByValue();
        note.title = this.getInpTitleValue();
        note.description = this.getTxaDescriptionValue();
        note.importance = this.getInpImportanceSelectedValue();
        note.createDate = this.getInpCreateDateValue();
        note.finishDate = this.getInpFinishDateValue();
        return note;
    }

}