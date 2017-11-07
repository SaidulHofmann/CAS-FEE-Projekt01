/**
 * Controller for the edit-notes partial view.
 */

import { Note } from '../services/coreTtypes.js';
import { LocationEnum, SortFieldEnum } from "../services/coreTtypes.js";
import { RestClient } from "../services/restClient.js";


export class EditNoteController {

    constructor(objIndexController){
        this.indexCtr = objIndexController;
        this.restClient = objIndexController.restClient;
        this.init();
    }

    init(){
        let editNoteTemplate = document.getElementById("edit-note-template").innerHTML;
        this.fnEditNoteTemplateScript = Handlebars.compile(editNoteTemplate);
    }

    renderUI(params){
        if(params){
            document.querySelector("main").innerHTML = this.fnEditNoteTemplateScript(params);
        }
        else {
            document.querySelector("main").innerHTML = this.fnEditNoteTemplateScript(new Note());
        }
        this.setAttributes();
        this.addEventHandlers();
    }

    RenderDefaultView() {
        this.removeEventHandlers();
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }

    setAttributes(){
        this.id = document.getElementById("inpId");
        this.inpTitle = document.getElementById("inpTitle");
        this.txaDescription = document.getElementById("txaDescription");
        this.frmImportance = document.getElementById("frmImportance");
        this.inpFinishDate = document.getElementById("inpFinishDate");
        this.btnSaveNote = document.getElementById("btnSaveNote");
        this.btnCancelNote = document.getElementById("btnCancelNote");
    }

    getNote(){
        let note = new Note();
        note.id = document.getElementById("inpId").value;
        note.title = document.getElementById("inpTitle").value;
        note.description = document.getElementById("txaDescription").value;
        note.importance = document.querySelector('input[name="importance"]:checked').value;
        note.finishDate = document.getElementById("inpFinishDate").value;
        return note;
    }

    // -------------------------------------------------------------------------
    // Event handlers
    // -------------------------------------------------------------------------

    addEventHandlers(){
        this.btnSaveNote.onclick = this.onBtnSaveNote_Click.bind(this);
        this.btnCancelNote.onclick = this.onBtnCancelNote_Click.bind(this);
    }

    removeEventHandlers(){
        if(this.btnSaveNote) { this.btnSaveNote.onclick = null; }
        if(this.btnCancelNote){ this.btnCancelNote.onclick = null; }
    }

    onBtnSaveNote_Click() {
        //this.model.saveNote(this.getNote());
        event.preventDefault();
        this.restClient.createNote(this.getNote()).done(this.RenderDefaultView.bind(this)).fail(function(msg ) { //nothing!
            });
    }

    onBtnCancelNote_Click(){
        this.indexCtr.showPartialView(LocationEnum.HOME);
    }
}