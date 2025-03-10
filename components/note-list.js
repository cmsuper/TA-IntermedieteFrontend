class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async fetchNotes() {
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
            const data = await response.json();
            
            if (data.status === "success") {
                this.notes = data.data; // Simpan catatan dari API ke dalam variabel
            } else {
                console.error("Gagal mengambil catatan:", data.message);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    }

    set notes(notes) {
        this._notes = notes;
        this.render();
    }

    connectedCallback() {
        this.fetchNotes(); // Ambil daftar catatan saat elemen pertama kali dimasukkan ke dalam DOM
    }

    render() {
        this.shadowRoot.innerHTML = ''; 

        this._notes.forEach(note => {
            const noteItem = document.createElement('note-item');
            noteItem.setAttribute('title', note.title);
            noteItem.setAttribute('body', note.body);
            noteItem.setAttribute('created-at', note.createdAt);
            noteItem.setAttribute('id', note.id); // Tambahkan ID untuk keperluan penghapusan
            
            this.shadowRoot.appendChild(noteItem);
        });
    }
}

customElements.define('note-list', NoteList);
