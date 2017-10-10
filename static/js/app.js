'use strict';
/*
Project: HSR CAS FEE 2017
Content: Javascript for page app.html.
Created on: 02.10.2017
Author: Saidul Hofmann
 */
document.addEventListener('DOMContentLoaded', () => {

	// Bootstrapping
	controller.btnCreateNewNote = document.getElementById('btnCreateNewNote');
	controller.btnSortByFinishDate = document.getElementById('btnSortByFinishDate');
	controller.btnSortByCreateDate = document.getElementById('btnSortByCreateDate');
	controller.btnSortByImportance = document.getElementById('btnSortByImportance');
	controller.btnFilterByFinished = document.getElementById('btnFilterByFinished');

	controller.bootstrapApp();

	// Display notes.
//    document.getElementById("notesCount").innerText = notes.length;
//    document.getElementById("notes").innerHTML = notes.length == 0 ? "Keine Notizen vorhanden." : notes.join("</br>"); //temporary solution.
	document.getElementById("notesCount").innerText = this.model.getAllNotes().length;
});