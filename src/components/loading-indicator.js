class LoadingIndicator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    static get observedAttributes() {
        return ["text"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this.shadowRoot.querySelector(".loading").textContent = newValue;
        }
    }

    connectedCallback() {
        this.render();
    }

    show() {
        const loading = this.shadowRoot?.querySelector(".loading");
        if (loading) loading.style.display = "flex";
    }

    hide() {
        const loading = this.shadowRoot?.querySelector(".loading");
        if (loading) loading.style.display = "none";
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    display: none;
                    justify-content: center;
                    align-items: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    font-size: 20px;
                    font-weight: bold;
                    z-index: 9999;
                }
            </style>
            <div class="loading">Loading...</div>
        `;
    }
}

customElements.define("loading-indicator", LoadingIndicator);
