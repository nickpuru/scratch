const assert = require('assert');

const mockEl = () => ({
  addEventListener: () => {},
  appendChild: () => {},
  textContent: '',
  innerHTML: '',
  className: '',
  dataset: {},
});

global.document = {
  getElementById: () => mockEl(),
  createElement: () => mockEl(),
};

const storage = {};
global.localStorage = {
  getItem: k => (Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null),
  setItem: (k, v) => { storage[k] = v; },
  removeItem: k => { delete storage[k]; },
};

const { addNote, notes } = require('./script.js');

function reset() {
  notes.length = 0;
  delete storage['scratch_notes'];
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  reset();
  try {
    fn();
    console.log(`  ok  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  FAIL  ${name}: ${e.message}`);
    failed++;
  }
}

test('adds a plain note', () => {
  addNote('hello world');
  assert.strictEqual(notes.length, 1);
  assert.strictEqual(notes[0].text, 'hello world');
  assert.deepStrictEqual(notes[0].tags, []);
});

test('adds a note with tags', () => {
  addNote('buy milk #shopping #todo');
  assert.strictEqual(notes[0].text, 'buy milk');
  assert.deepStrictEqual(notes[0].tags, ['shopping', 'todo']);
});

test('newest note is prepended', () => {
  addNote('first');
  addNote('second');
  assert.strictEqual(notes[0].text, 'second');
  assert.strictEqual(notes[1].text, 'first');
});

test('returns the created note object', () => {
  const note = addNote('test note #tag');
  assert.strictEqual(note.text, 'test note');
  assert.deepStrictEqual(note.tags, ['tag']);
});

test('returns null for empty string', () => {
  assert.strictEqual(addNote(''), null);
  assert.strictEqual(notes.length, 0);
});

test('returns null for whitespace only', () => {
  assert.strictEqual(addNote('   '), null);
  assert.strictEqual(notes.length, 0);
});

test('returns null for tag-only input', () => {
  assert.strictEqual(addNote('#onlytag'), null);
  assert.strictEqual(notes.length, 0);
});

test('persists note to localStorage', () => {
  addNote('saved note');
  const stored = JSON.parse(storage['scratch_notes']);
  assert.strictEqual(stored.length, 1);
  assert.strictEqual(stored[0].text, 'saved note');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
