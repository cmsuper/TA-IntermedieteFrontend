class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', (event) => this.addNote(event));
    }

    async addNote(event) {
        event.preventDefault();
        const title = this.shadowRoot.querySelector("#title").value;
        const body = this.shadowRoot.querySelector("#body").value;
    
        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body })
            });
    
            const result = await response.json();
            if (result.status === "success") {
                // Dispatch event di seluruh dokumen agar bisa didengar oleh elemen lain
                document.dispatchEvent(new Event('note-added'));
                
                // Opsional: Kosongkan input setelah sukses menambah catatan
                this.shadowRoot.querySelector("#title").value = "";
                this.shadowRoot.querySelector("#body").value = "";
            }
        } catch (error) {
            console.error("Error adding note:", error);
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
