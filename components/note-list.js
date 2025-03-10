class NoteList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Menggunakan Shadow DOM agar elemen ini terisolasi dari gaya global
    }

    set notes(notes) {
        this._notes = notes; // Menyimpan data catatan yang diberikan ke dalam properti privat
        this.render(); // Memanggil ulang render untuk memperbarui tampilan daftar catatan
    }

    render() {
        this.shadowRoot.innerHTML = ''; // Menghapus konten sebelumnya agar tidak terjadi duplikasi saat merender ulang
        this._notes.forEach(note => {
            const noteItem = document.createElement('note-item'); // Membuat elemen note-item untuk setiap catatan
            noteItem.setAttribute('title', note.title); // Menetapkan judul catatan
            noteItem.setAttribute('body', note.body); // Menetapkan isi catatan
            noteItem.setAttribute('created-at', note.createdAt); // Menetapkan tanggal pembuatan catatan
            noteItem.setAttribute('author', note.author || "Unknown"); // Menetapkan author catatan
            this.shadowRoot.appendChild(noteItem); // Menambahkan elemen note-item ke dalam daftar
        });
    }
}

// Mendaftarkan elemen custom "note-list" agar bisa digunakan di HTML
customElements.define('note-list', NoteList);
