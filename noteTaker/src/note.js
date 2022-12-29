// global query selectors
const noteContainer = document.querySelector('.note-container');
const modalContainer = document.querySelector('.modal-container');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');
const noteInput = document.querySelector('#note');


function getNotes(){
    let notes;
    if(localStorage.getItem('noteApp.notes') == null){
        notes = [];
    } else {
        notes = JSON.parse(localStorage.getItem('noteApp.notes'));
    }
    return notes;
}

function addNoteToLocalStorage(title, body){
    const notes = getNotes();
    notes.push({title, body});
    localStorage.setItem('noteApp.notes', JSON.stringify(notes))
}


function removeToLocalStorage(titleToRemove){
    const notes = getNotes();
    notes.forEach((note, index) => {
        if(note.title == titleToRemove){
            notes.splice(index, 1);
        }
        localStorage.setItem('noteApp.notes', JSON.stringify(notes));
    })

}

function addNoteToList(title, body){
    const newUINote = document.createElement('article');
    newUINote.classList.add('note');
    newUINote.innerHTML = `
    
    <h2 class="note-title">${title}</h2>
    <p class="note-body">${body}</p>
    <article class="note-btns">
        <button class="note-btn note-view">View Details</button>
        <button class="note-btn note-delete">Delete Note</button>
    </article>
    `;
    noteContainer.appendChild(newUINote);
}

function displayNotes(){
    const notes = getNotes();
    notes.forEach((note) => {
        addNoteToList(note.title, note.body);
    });
}

function alertMessage(message, alertClass) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `message ${alertClass}`;
    alertDiv.appendChild(document.createTextNode(message));
    form.insertAdjacentElement('beforebegin', alertDiv);
    titleInput.focus();
    setTimeout(() => alertDiv.remove(), 2000);
}


function activateNoteModal(title, body){
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalContainer.classList.add('active');
}

const modalBtn = document.querySelector('.modal-btn').addEventListener('click', () => {
    modalContainer.classList.remove('active');
})


noteContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('note-view')){
        const currentNote = e.target.closest('.note');
        const currentTitle = currentNote.querySelector('.note-title').textContent;
        const currentBody = currentNote.querySelector('.note-body').textContent;
        activateNoteModal(currentTitle, currentBody);
    }
    if(e.target.classList.contains('note-delete')){
        const currentNote = e.target.closest('.note');
        alertMessage('Your note was permanently deleted.', 'remove-message');
        currentNote.remove();
        const titleToRemove = currentNote.querySelector('.note-title').textContent;
        removeToLocalStorage(titleToRemove);
    }
})

document.addEventListener('DOMContentLoaded', displayNotes);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    //validate inputs

    if(titleInput.value.length > 0 && noteInput.value.length > 0){
        const newTitle = titleInput.value;
        const newBody = noteInput.value;
        addNoteToList(newTitle, newBody);
        addNoteToLocalStorage(newTitle, newBody);
        titleInput.value = "";
        noteInput.value ="";
        alertMessage('Note succesfully added!', 'success-message');
        titleInput.focus();
    } else {
        alertMessage('Please add both a title and a note.', 'alert-message');
    }
})