class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["id", "title", "body", "created-at", "archived"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "archived") {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    async toggleArchive() {
        const noteId = this.getAttribute("id");
        const archived = this.getAttribute("archived") === "true";
        const url = `https://notes-api.dicoding.dev/v2/notes/${noteId}/${archived ? "unarchive" : "archive"}`;

        await fetch(url, { method: "POST" });
        this.setAttribute("archived", !archived);
        this.dispatchEvent(new CustomEvent("noteUpdated"));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .note-item { padding: 10px; border: 1px solid #ddd; }
            </style>
            <div class="note-item">
                <h3>${this.getAttribute("title")}</h3>
                <p>${this.getAttribute("body")}</p>
                <button id="toggle-archive">${this.getAttribute("archived") === "true" ? "Kembalikan" : "Arsipkan"}</button>
            </div>
        `;

        this.shadowRoot.querySelector("#toggle-archive").addEventListener("click", () => this.toggleArchive());
    }
}
customElements.define("note-item", NoteItem);