import "./styles/styles.css";
import './components/note-list.js';
import './components/note-item.js';
import './components/note-form.js';

document.addEventListener('note-added', () => {
    document.querySelector('note-list').fetchNotes();
});

