'use strict';
/*
Project: HSR CAS FEE 2017
Content: Javascript for page edit-note.html.
Created on: 02.10.2017
Author: Saidul Hofmann
 */

class EditNoteController {
	onBtnSaveNote(){
		console.log("EditNoteController.onBtnSaveNote() executed.");

		// Create Note Object.
		let note = new Note();
		note.title = document.getElementById("editNoteForm").elements.namedItem("title").value;
		note.description = document.getElementById("editNoteForm").elements.namedItem("description").value;
		note.importance = document.querySelector('input[name=importance][checked]').value;
		note.finishDate = document.querySelector('input[id=finishDate]').value;

		console.log("EditNoteController.onBtnSaveNote() notes properties set.", note);

		// Call Add method.
		controller.addNote(note);
	}

	onBtnCancelNote(){

	}
}

var editNoteController = new EditNoteController();


document.addEventListener('DOMContentLoaded', () => {

	// Bootstrapping
	document.getElementById('btnSaveNote').onclick = this.editNoteController.onBtnSaveNote;
	//editNoteController.btnCancelNote = document.getElementById('btnCancelNote');
	//controller.bootstrapEditNote();

	// Init Form
	document.querySelector('input[id=finishDate]').value = new Date().toISOString().substr(0, 10);

});