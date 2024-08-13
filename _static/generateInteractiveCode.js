let code = null; // Global variable to store code temporarily

function generateInteractiveCode(containerId, code, uniqueId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found.`);
        return;
    }

    const editorId = `code-editor-${uniqueId}`;
    const runButtonId = `run-button-${uniqueId}`;
    const resetButtonId = `reset-button-${uniqueId}`;
    const cancelButtonId = `cancel-button-${uniqueId}`;
    const outputId = `output-${uniqueId}`;
    const errorBoxId = `error-box-${uniqueId}`;

    const html = `
        <div>
            <textarea id="${editorId}" name="code-${uniqueId}">${code}</textarea>
            
            <button id="${runButtonId}" class="button button-run">Kjør kode ▶️</button>
            <button id="${resetButtonId}" class="button button-reset">Reset kode ↪️</button>
            <button id="${cancelButtonId}" class="button button-cancel">Avbryt kjøring ╳</button>
        </div>
        <div id="${errorBoxId}"></div>
        <pre id="${outputId}" class="pythonoutput"></pre>
    `;

    container.innerHTML = html;

    document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        setupEditor(editorId, runButtonId, cancelButtonId, resetButtonId, outputId, errorBoxId);
    });
}
