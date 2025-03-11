class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', (event) => this.addNote(event));
        
        this.shadowRoot.querySelector("#title").addEventListener("input", (event) => {
            const input = event.target;
            if (input.value.length < 3) {
                input.setCustomValidity("Judul harus minimal 3 karakter");
            } else {
                input.setCustomValidity("");
            }
        });

        this.shadowRoot.querySelector("#body").addEventListener("input", (event) => {
            const input = event.target;
            if (input.value.trim().length < 5) {
                input.setCustomValidity("Isi catatan harus minimal 5 karakter");
            } else {
                input.setCustomValidity("");
            }
        });
    }

    async addNote(event) {
        event.preventDefault();
        const title = this.shadowRoot.querySelector("#title").value;
        const body = this.shadowRoot.querySelector("#body").value;
        const loading = document.querySelector("loading-indicator");

        if (loading) loading.show(); // Cek apakah loading ada sebelum dipanggil

        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body })
            });

            const result = await response.json();
            if (result.status === "success") {
                document.dispatchEvent(new Event('note-added'));
                this.shadowRoot.querySelector("#title").value = "";
                this.shadowRoot.querySelector("#body").value = "";
            }
        } catch (error) {
            console.error("Error adding note:", error);
        } finally {
            if (loading) loading.hide(); // Cek apakah loading ada sebelum dipanggil
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <form>
                <input type="text" id="title" placeholder="Title" required />
                <textarea id="body" placeholder="Note Content" required></textarea>
                <button type="submit">Add Note</button>
            </form>
        `;
    }
}

customElements.define('note-form', NoteForm);
