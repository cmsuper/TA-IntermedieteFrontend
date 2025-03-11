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
                this.notes = result.data;
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
        this.shadowRoot.innerHTML = `
            <style>
                .notes-wrapper {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                        gap: 10px;
                        padding: 20px;
                }

                .note-item {
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .delete-button {
                    background: red;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                }
            </style>
            <div class="notes-wrapper">
                ${this._notes.map(note => `
                    <div class="note-item">
                        <div>
                            <strong>${note.title}</strong>
                            <p>${note.body}</p>
                            <small>Created at: ${new Date(note.createdAt).toLocaleString()}</small>
                        </div>
                        <button class="delete-button" data-id="${note.id}">Delete</button>
                    </div>
                `).join('')}
            </div>
        `;

        this.shadowRoot.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", async (event) => {
                const noteId = event.target.dataset.id;
                await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, { method: "DELETE" });
                this.fetchNotes();
            });
        });
    }

    connectedCallback() {
        this.fetchNotes();
    }
}

customElements.define('note-list', NoteList);
