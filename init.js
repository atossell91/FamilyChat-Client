import { App } from "./App.js"

function init() {
    const app = new App();
    app.Run();
}

document.addEventListener("DOMContentLoaded", ()=>{ init(); });