let code = null; // Global variable to store code temporarily



function generateInteractiveCode(containerId, code) {
    const uniqueId = generateUUID();
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

    const runIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>
`;
    const resetIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
</svg>
`;
    
    const cancelIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
</svg>
`;

    const html = `
        <div>
            <textarea id="${editorId}" name="code-${uniqueId}">${code}</textarea>
            
            <button id="${runButtonId}" class="button button-run">Kjør kode ${runIcon}</button>
            <button id="${resetButtonId}" class="button button-reset">Reset kode ${resetIcon}</button>
            <button id="${cancelButtonId}" class="button button-cancel">Avbryt kjøring ${cancelIcon}</button>
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
