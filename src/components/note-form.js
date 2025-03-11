class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.shadowRoot.querySelector('form').addEventListener('submit', (event) => this.addNote(event));
        
        this.shadowRoot.querySelector("#title").addEventListener("input", (event) => {
            this.validateInput(event.target, "#title-error", 3, "Judul harus minimal 3 karakter");
        });

        this.shadowRoot.querySelector("#body").addEventListener("input", (event) => {
            this.validateInput(event.target, "#body-error", 5, "Isi catatan harus minimal 5 karakter");
        });
    }

    validateInput(input, errorSelector, minLength, errorMessage) {
        const errorElement = this.shadowRoot.querySelector(errorSelector);
        if (input.value.trim().length < minLength) {
            input.setCustomValidity(errorMessage);
            errorElement.textContent = errorMessage;
        } else {
            input.setCustomValidity("");
            errorElement.textContent = "";
        }
    }

    async addNote(event) {
        event.preventDefault();
        const titleInput = this.shadowRoot.querySelector("#title");
        const bodyInput = this.shadowRoot.querySelector("#body");
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();
        const loading = document.querySelector("loading-indicator");

        this.validateInput(titleInput, "#title-error", 3, "Judul harus minimal 3 karakter");
        this.validateInput(bodyInput, "#body-error", 5, "Isi catatan harus minimal 5 karakter");

        if (title.length < 3 || body.length < 5) {
            return;
        }

        if (loading) loading.show();

        try {
            const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body })
            });

            const result = await response.json();
            if (result.status === "success") {
                document.dispatchEvent(new Event('note-added'));
                titleInput.value = "";
                bodyInput.value = "";
                this.shadowRoot.querySelector("#title-error").textContent = "";
                this.shadowRoot.querySelector("#body-error").textContent = "";
            }
        } catch (error) {
            console.error("Error adding note:", error);
        } finally {
            if (loading) loading.hide();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .error-message {
                    color: red;
                    font-size: 12px;
                    margin-top: 5px;
                }
            </style>
            <form>
                <input type="text" id="title" placeholder="Title" required />
                <div id="title-error" class="error-message"></div>
                <textarea id="body" placeholder="Note Content" required></textarea>
                <div id="body-error" class="error-message"></div>
                <button type="submit">Add Note</button>
            </form>
        `;
    }
}

customElements.define('note-form', NoteForm);