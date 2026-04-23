const input = document.getElementById('note-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('notes-list');
const tagFilter = document.getElementById('tag-filter');

function migrate(raw) {
  return raw.map(n => typeof n === 'string' ? { text: n, tags: [] } : n);
}

let notes = migrate(JSON.parse(localStorage.getItem('scratch_notes') || '[]'));
let activeTag = null;

function saveNotes() {
  localStorage.setItem('scratch_notes', JSON.stringify(notes));
}

function parseInput(raw) {
  const tags = [];
  const text = raw.replace(/#(\w+)/g, (_, tag) => { tags.push(tag); return ''; }).trim();
  return { text, tags };
}

function renderTagFilter() {
  const allTags = [...new Set(notes.flatMap(n => n.tags))];
  tagFilter.innerHTML = '';
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (activeTag === tag ? ' active' : '');
    btn.textContent = '#' + tag;
    btn.dataset.tag = tag;
    tagFilter.appendChild(btn);
  });
}

function renderNotes() {
  const visible = activeTag ? notes.filter(n => n.tags.includes(activeTag)) : notes;
  list.innerHTML = '';
  visible.forEach(note => {
    const actualIndex = notes.indexOf(note);
    const li = document.createElement('li');

    const body = document.createElement('div');
    body.className = 'note-body';

    const span = document.createElement('span');
    span.textContent = note.text;
    body.appendChild(span);

    if (note.tags.length) {
      const tagsDiv = document.createElement('div');
      tagsDiv.className = 'note-tags';
      note.tags.forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = '#' + tag;
        chip.dataset.tag = tag;
        tagsDiv.appendChild(chip);
      });
      body.appendChild(tagsDiv);
    }

    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.dataset.index = actualIndex;
    btn.textContent = '✕';

    li.appendChild(body);
    li.appendChild(btn);
    list.appendChild(li);
  });
  renderTagFilter();
}

function addNote(raw) {
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) return null;
  const { text, tags } = parseInput(trimmed);
  if (!text) return null;
  const note = { text, tags };
  notes.unshift(note);
  saveNotes();
  return note;
}

function createNote() {
  if (!addNote(input.value)) return;
  input.value = '';
  renderNotes();
}

tagFilter.addEventListener('click', e => {
  const btn = e.target.closest('.tag-btn');
  if (!btn) return;
  activeTag = activeTag === btn.dataset.tag ? null : btn.dataset.tag;
  renderNotes();
});

list.addEventListener('click', e => {
  const chip = e.target.closest('.tag-chip');
  if (chip) {
    activeTag = activeTag === chip.dataset.tag ? null : chip.dataset.tag;
    renderNotes();
    return;
  }
  const btn = e.target.closest('.delete-btn');
  if (btn) {
    notes.splice(parseInt(btn.dataset.index, 10), 1);
    if (activeTag && !notes.some(n => n.tags.includes(activeTag))) activeTag = null;
    saveNotes();
    renderNotes();
  }
});

addBtn.addEventListener('click', createNote);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') createNote();
});

renderNotes();

if (typeof module !== 'undefined') module.exports = { addNote, notes };
