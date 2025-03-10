class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._notes = [];
    }

    async fetchNotes() {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
            const result = await response.json();
            if (result.status === 'success') {
                this.notes = result.data; // Mengisi daftar catatan dari API
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }
    

    set notes(notes) {
        this._notes = notes;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        this._notes.forEach(note => {
            const noteItem = document.createElement('note-item');
            noteItem.setAttribute('title', note.title);
            noteItem.setAttribute('body', note.body);
            noteItem.setAttribute('created-at', note.createdAt);
            this.shadowRoot.appendChild(noteItem);
        });
    }

    connectedCallback() {
        this.fetchNotes(); // Ambil catatan saat elemen dipasang ke DOM
    }
}

customElements.define('note-list', NoteList);
