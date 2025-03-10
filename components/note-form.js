class NoteForm extends HTMLElement {
    connectedCallback() {
        this.render();
        this.addValidation();
    }

    render() {
        this.innerHTML = `
            <form id="noteForm">
                <input type="text" id="title" placeholder="Title" required>
                <small class="error-message" id="titleError"></small>

                <textarea id="body" placeholder="Note body" required></textarea>
                <small class="error-message" id="bodyError"></small>

                <input type="text" id="author" placeholder="Author (optional)">
                
                <button type="submit" id="submitButton" disabled>Add Note</button>
            </form>
        `;
    }

    addValidation() {
        const form = this.querySelector("#noteForm");
        const titleInput = this.querySelector("#title");
        const bodyInput = this.querySelector("#body");
        const authorInput = this.querySelector("#author");
        const titleError = this.querySelector("#titleError");
        const bodyError = this.querySelector("#bodyError");
        const submitButton = this.querySelector("#submitButton");

        function validateForm() {
            let isValid = true;

            if (titleInput.value.length < 3) {
                titleError.textContent = "Title must be at least 3 characters.";
                isValid = false;
            } else if (titleInput.value.length > 50) {
                titleError.textContent = "Title must be less than 50 characters.";
                isValid = false;
            } else {
                titleError.textContent = "";
            }

            if (bodyInput.value.length < 10) {
                bodyError.textContent = "Note body must be at least 10 characters.";
                isValid = false;
            } else {
                bodyError.textContent = "";
            }

            submitButton.disabled = !isValid;
        }

        titleInput.addEventListener("input", validateForm);
        bodyInput.addEventListener("input", validateForm);

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!submitButton.disabled) {
                this.dispatchEvent(new CustomEvent("note-added", {
                    detail: {
                        title: titleInput.value,
                        body: bodyInput.value,
                        author: authorInput.value || "Unknown" // Default ke "Unknown" jika tidak diisi
                    },
                    bubbles: true,
                    composed: true
                }));

                form.reset();
                validateForm(); // Validasi ulang setelah reset form
            }
        });
    }
}

customElements.define("note-form", NoteForm);
