# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

Open `index.html` directly in a browser — no build step, no server, no dependencies.

## Architecture

Three-file vanilla JS app with no frameworks:

- **`index.html`** — static shell; IDs `note-input`, `add-btn`, and `notes-list` are the only DOM anchors used by JS
- **`script.js`** — all logic; notes are stored as a JSON array in `localStorage` under the key `"scratch_notes"`, newest-first. `renderNotes()` is the single source of truth — call it after any mutation. HTML is escaped via `escapeHtml` before insertion

## Conventions

- All `localStorage` keys must be prefixed with `"scratch_"` (e.g. `"scratch_notes"`, `"scratch_darkMode"`)
- **`style.css`** — plain CSS, no preprocessor; uses system font stack and CSS custom-property-free color literals
