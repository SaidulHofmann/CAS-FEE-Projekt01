"use strict";
/**
 * Project: HSR CAS FEE 2017, Project 01 - notes application.
 * Content: Controller for the edit-notes partial view.
 * Created on: 12.10.2017
 * Author: Saidul Hofmann
 */

import {Note} from '../services/coreTypes.js';
import {LocationEnum} from "../services/coreTypes.js";


export class EditNoteController {

    constructor(objIndexController) {
        this.indexCtr = objIndexController;
        this.restClient = objIndexController.restClient;
        this.init();
    }

    init() {
        let noteEditTemplate = document.getElementById("note-edit-template").innerHTML;
        this.fnNoteEditFormRenderer = Handlebars.compile(noteEditTemplate);
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

    getInpIsFinishedChecked() {
        return document.getElementById("inpIsFinished").checked;
    }

    getNoteEditForm() {
        return document.getElementById("note-edit-form");
    }

    getBtnSaveNote() {
        return document.getElementById("btnSaveNote");
    }

    getBtnDeleteNote() {
        return document.getElementById("btnDeleteNote");
    }

    getBtnCancelNote() {
        return document.getElementById("btnCancelNote");
    }

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    addEventHandlers() {
        this.getBtnSaveNote().onclick = this.onBtnSaveNote_Click.bind(this);
        this.getBtnDeleteNote().onclick = this.onBtnDeleteNote_Click.bind(this);
        this.getBtnCancelNote().onclick = this.onBtnCancelNote_Click.bind(this);
    }

    removeEventHandlers() {
        if (this.getBtnSaveNote()) {
            this.getBtnSaveNote().onclick = null;
        }
        if (this.getBtnDeleteNote()) {
            this.getBtnDeleteNote().onclick = null;
        }
        if (this.getBtnCancelNote()) {
            this.getBtnCancelNote().onclick = null;
        }
    }

    async onBtnSaveNote_Click() {
        event.preventDefault();
        if (this.getNoteEditForm().checkValidity() == false) {
            alert("Es sind ungültige Daten vorhanden. Bitte die rot umrandeten Felder korrekt ausfüllen.");
            return;
        }
        await this.restClient.saveNote(this.indexCtr.currentUser, this.getNote());
        this.RenderDefaultView();
    }

    async onBtnDeleteNote_Click() {
        let note = await this.restClient.getNote(this.indexCtr.currentUser, this.getIdValue());
        if (!note) {
            alert("Die Notiz existiert nicht in der Daenbank.");
            return;
        }
        let noteDescription = `Id: ${note._id}\nTitel: ${note.title}`;
        let displayText = `Soll die Notiz wirklich gelöscht werden ?\n\n` + noteDescription;

        let boolHasConfirmed = confirm(displayText);
        if (boolHasConfirmed == true) {
            let deleteCount = await this.restClient.deleteNote(this.indexCtr.currentUser, note);
            console.log("Notiz wurde gelöscht:\n" + noteDescription);
            console.log("Anzahl gelöschter Einträge: " + deleteCount);
            this.RenderDefaultView();
        }

    }

    onBtnCancelNote_Click() {
        this.indexCtr.renderPartialView(LocationEnum.LIST_NOTES);
    }

    //-------------------------------------------------------------------------
    // Additional Methods
    //-------------------------------------------------------------------------

    renderUI(params) {
        if (params) {
            document.querySelector("#content").innerHTML = this.fnNoteEditFormRenderer(params);
        }
        else {
            let note = new Note();
            note.createdBy = this.indexCtr.currentUser.email;
            document.querySelector("#content").innerHTML = this.fnNoteEditFormRenderer(note);
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
        note.isFinished = this.getInpIsFinishedChecked();
        return note;
    }

}