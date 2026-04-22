const input = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('notes-list');

let notes = JSON.parse(localStorage.getItem('scratch_notes') || '[]');

function saveNotes() {
  localStorage.setItem('scratch_notes', JSON.stringify(notes));
}

function renderNotes() {
  list.innerHTML = '';
  notes.forEach((text, i) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.dataset.index = i;
    btn.textContent = '✕';
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function createNote() {
  const text = input.value.trim();
  if (!text) return;
  notes.unshift(text);
  saveNotes();
  input.value = '';
  renderNotes();
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete-btn');
  if (btn) {
    notes.splice(parseInt(btn.dataset.index, 10), 1);
    saveNotes();
    renderNotes();
  }
});

addBtn.addEventListener('click', createNote);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') createNote();
});

renderNotes();
