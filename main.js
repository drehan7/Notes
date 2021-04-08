/* globals moment */


const mainContainer = document.querySelector(".all-notes");
const addNoteButton = document.querySelector(".add-note");
const baseNotesURL = 'http://benwudnotes.herokuapp.com/notes/';
let form = document.querySelector('form');
let bodyInput = document.querySelector(".new-note-input");
let darkModeButton = document.querySelector('#dark-mode-button');

// ---------------------------------------------------------------

showAllNotes();

// ---------------------------------------------------------------

window.addEventListener('submit', e => {
    e.preventDefault();
})


form.addEventListener('submit', e => {
    postNote();
})

darkModeButton.addEventListener('click', toggleLightDark);

document.addEventListener('click', e => {
    if (e.target.className === 'delete-note-button') {
        console.log("del button clicked")
        delNote(e.target);
    } else if (e.target.className === 'edit-button') {
        // console.log("Edit button clicked", e.target.parentElement.id)
        toggleEditMode(e.target)
    } else if (e.target.className === 'edit-submit-button') {
        console.log("edit submit clicked");
        editNote(e.target)
    }
})



// ---------------------------------------------------------------
function postNote() {
    let noteTitle = document.querySelector(".new-note-title");
    let noteBody = document.querySelector(".new-note-input");
    let dateCreated = new Date();

    if (noteTitle.value.length > 1 || noteBody.value.length > 1) {
        fetch(baseNotesURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: noteTitle.value,
                body: noteBody.value,
                date_created: moment(dateCreated).format('llll')
            })
        })
            .then(res => res.json())
            .then(data => {
                renderNote(data)
            })
    }

    noteTitle.value = "";
    noteBody.value = "";


}



function toggleEditMode(note) {
    let title = note.parentElement.querySelector(".note-title").textContent
    let body = note.parentElement.querySelector(".note-body").textContent
    let editButton = note.parentElement.querySelector(".edit-button")
    let delButton = note.parentElement.querySelector('.delete-note-button');


    let editInputblock = note.parentElement.querySelector('.edit-container');
    if (editInputblock.style.display === 'none') {
        note.parentElement.classList.add("selected-note");
        editButton.id = "edit-button-id"
        delButton.classList.remove('hidden-delete-button')
        editInputblock.style.display = 'block'
        editInputblock.querySelector(".edit-input-title").value = title;
        editInputblock.querySelector(".edit-input-body").value = body;
        editButton.textContent = "Close";
    } else {
        editInputblock.style.display = 'none'
        editButton.textContent = "Edit";
        editButton.id = "";
        delButton.classList.add("hidden-delete-button")
        note.parentElement.classList.remove('selected-note');
    }

}

function toggleLightDark() {
    let styleLink = document.querySelector(".style");

    if (styleLink.getAttribute('href') === 'light_style.css') {
        styleLink.setAttribute('href', 'style.css');
    } else {
        styleLink.setAttribute('href', 'light_style.css');
    }


}

function editNote(note) {
    const noteId = note.parentElement.parentElement.id;
    console.log('url: ', baseNotesURL + noteId)
    let editTitle = note.parentElement.querySelector(".edit-input-title");
    let editBody = note.parentElement.querySelector(".edit-input-body");
    let date_updated = new Date();

    if (editTitle.value.length > 0 || editBody.value.length > 0) {
        fetch(baseNotesURL + noteId + "/", {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: editTitle.value,
                body: editBody.value,
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }
    showAllNotes()


}


function delNote(note) {
    const noteID = note.parentElement.id;
    fetch(baseNotesURL + noteID, { method: 'DELETE' })
        .then(() => {
            note.parentElement.remove();
        })

    showAllNotes();
}



function showAllNotes() {
    let notesContainer = document.querySelector(".all-notes");
    let noteCount = document.querySelector(".note-count");
    notesContainer.innerHTML = "";
    fetch(baseNotesURL)
        .then(res => res.json())
        .then(data => {
            for (let d of data) {
                renderNote(d)
            }
            console.log('notes: ', data.length)
            noteCount.innerHTML = `Notes: ${data.length}`
        })


}

function renderNote(note) {
    let listDiv = document.createElement("div");
    listDiv.className = "note"
    listDiv.id = note.id;
    let delButton = document.createElement("button");
    delButton.className = "delete-note-button";
    delButton.classList.add('hidden-delete-button')
    delButton.id = "delete-button-id"
    delButton.innerHTML = "Delete"
    let title = document.createElement("p")
    title.className = 'note-title'
    title.innerHTML = note.title;
    let noteBody = document.createElement('p');
    noteBody.className = 'note-body'
    noteBody.innerHTML = note.body;
    let noteDate = document.createElement('p');
    noteDate.className = 'note-date'
    noteDate.innerHTML = "Last updated: " + moment(note.date_updated).format('llll')



    let editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.innerHTML = "Edit";
    let editDiv = document.createElement('div');
    editDiv.className = 'edit-container';
    let editInputTitle = document.createElement('input');
    editInputTitle.className = 'edit-input-title';
    editInputTitle.id = "edit-input-title-id";
    editInputTitle.placeholder = "Title:"
    let editInputBody = document.createElement('input');
    editInputBody.className = 'edit-input-body';
    editInputBody.placeholder = "Note:"
    let editSubmit = document.createElement('button');
    editSubmit.className = 'edit-submit-button';
    editSubmit.id = 'edit-submit-button-id';
    editSubmit.innerHTML = "Submit";

    editDiv.appendChild(editInputTitle);
    editDiv.appendChild(editInputBody);
    editDiv.appendChild(editSubmit);
    editDiv.style.display = 'none';



    listDiv.appendChild(title);
    listDiv.appendChild(noteBody);
    listDiv.appendChild(noteDate);
    listDiv.appendChild(delButton);
    listDiv.appendChild(editButton);
    listDiv.appendChild(editDiv);

    mainContainer.appendChild(listDiv);
}