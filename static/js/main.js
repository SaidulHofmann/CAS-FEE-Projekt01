'use strict';

function addNote(){
    var notes = JSON.parse(sessionStorage.getItem("notes"));
    notes.push(document.getElementById("note").value);
    sessionStorage.setItem("notes", JSON.stringify(notes));
    window.location.replace("index.html");
}

// Create notes array in session.
var notes = sessionStorage.getItem("notes");
if(!notes){
    sessionStorage.setItem("notes", JSON.stringify([]));
    notes = sessionStorage.getItem("notes");
}
notes = JSON.parse(notes);

// Display notes.
document.getElementById("notesCount").innerText = notes.length;
document.getElementById("notes").innerHTML = notes.length == 0 ? "Keine Notizen vorhanden." : notes.join("</br>"); //temporary solution.