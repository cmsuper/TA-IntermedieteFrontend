class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Mengaktifkan Shadow DOM untuk menjaga styling tetap terisolasi
    }

    static get observedAttributes() {
        return ["title", "body", "created-at", "author"]; // Tambahkan "author" ke daftar atribut yang dipantau
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render(); // Memperbarui tampilan jika ada perubahan atribut
        }
    }

    connectedCallback() {
        this.render(); // Memanggil render() saat elemen pertama kali dimasukkan ke dalam DOM
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    background: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    margin: 10px 0;
                }
                h3 {
                    margin: 0;
                    font-size: 18px;
                }
                p {
                    font-size: 14px;
                    color: #555;
                }
                .date, .author {
                    font-size: 12px;
                    color: #777;
                }
            </style>
            <div class="note">
                <h3>${this.getAttribute("title") || "Untitled"}</h3> 
                <p>${this.getAttribute("body") || "No content"}</p> 
                <p class="date">Created at: ${this.getAttribute("created-at") || "Unknown"}</p> 
                <p class="author">Author: ${this.getAttribute("author") || "Unknown"}</p> 
            </div>
        `;
    }
}

// Mendaftarkan elemen custom "note-item" agar bisa digunakan di HTML
customElements.define("note-item", NoteItem);
