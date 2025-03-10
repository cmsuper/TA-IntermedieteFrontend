class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["title", "body", "created-at", "id"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    async deleteNote() {
        const noteId = this.getAttribute("id");
        if (!noteId) return;

        try {
            const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
                method: "DELETE",
            });

            const data = await response.json();
            if (data.status === "success") {
                this.remove(); // Hapus elemen dari DOM
                document.querySelector("note-list").fetchNotes(); // Perbarui daftar catatan
            } else {
                console.error("Gagal menghapus catatan:", data.message);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
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
                    position: relative;
                }
                h3 {
                    margin: 0;
                    font-size: 18px;
                }
                p {
                    font-size: 14px;
                    color: #555;
                }
                .date {
                    font-size: 12px;
                    color: #777;
                }
                button {
                    background-color: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
            </style>
            <div class="note">
                <h3>${this.getAttribute("title") || "Untitled"}</h3>
                <p>${this.getAttribute("body") || "No content"}</p>
                <p class="date">Created at: ${this.getAttribute("created-at") || "Unknown"}</p>
                <button>Hapus</button>
            </div>
        `;

        this.shadowRoot.querySelector("button").addEventListener("click", () => this.deleteNote());
    }
}

customElements.define("note-item", NoteItem);
