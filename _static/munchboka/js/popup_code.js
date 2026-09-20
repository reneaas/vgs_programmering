/* Keep the same editor DOM alive across close/open, including output and predictions. */
(() => {
    function setup() {
        document.querySelectorAll('[data-popup-code]').forEach(button => {
            if (button.dataset.popupCodeReady) return;
            button.dataset.popupCodeReady = 'true';
            const config = JSON.parse(button.dataset.popupCode);
            const content = document.getElementById(button.getAttribute('aria-controls'));
            const editorContainer = content.firstElementChild;
            const $dialog = jQuery(content);
            let initialized = false;
            let position = null;

            function refresh() {
                // Query the live editor: prediction mode can replace its instance.
                editorContainer.querySelectorAll('.CodeMirror').forEach(element => {
                    if (element.CodeMirror) element.CodeMirror.refresh();
                });
            }

            function fit() {
                const widget = $dialog.dialog('widget')[0];
                const width = Math.max(1, window.innerWidth - 16);
                const height = Math.max(1, window.innerHeight - 16);
                $dialog.dialog('option', {
                    minWidth: Math.min(280, width), minHeight: Math.min(180, height),
                    maxWidth: width, maxHeight: height,
                    width: Math.min($dialog.dialog('option', 'width'), width),
                    height: Math.min($dialog.dialog('option', 'height'), height),
                });
                const rect = widget.getBoundingClientRect();
                widget.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8))}px`;
                widget.style.top = `${Math.max(8, Math.min(rect.top, window.innerHeight - rect.height - 8))}px`;
                refresh();
            }

            $dialog.dialog({
                autoOpen: false, modal: false, draggable: true, resizable: true,
                title: config.title, closeText: 'Lukk',
                width: config.width, height: config.height,
                classes: { 'ui-dialog': 'popup-code-window' },
                open() {
                    if (position) $dialog.dialog('widget').css(position);
                    fit();
                    if (!initialized) {
                        const create = config.predict ? makePredictionInteractiveCode : makeInteractiveCode;
                        create(editorContainer.id, config.code);
                        initialized = true;
                    }
                    button.setAttribute('aria-expanded', 'true');
                    requestAnimationFrame(refresh);
                },
                close() {
                    button.setAttribute('aria-expanded', 'false');
                    button.focus();
                },
                dragStop() {
                    fit();
                    const rect = $dialog.dialog('widget')[0].getBoundingClientRect();
                    position = { left: rect.left, top: rect.top };
                },
                resize: refresh,
                resizeStop: fit,
            });

            // jQuery UI dragging handles mice; pointer events also allow touch/pen.
            const widget = $dialog.dialog('widget')[0];
            const titlebar = widget.querySelector('.ui-dialog-titlebar');
            let drag = null;
            titlebar.addEventListener('pointerdown', event => {
                if (event.pointerType === 'mouse' || event.target.closest('button')) return;
                const rect = widget.getBoundingClientRect();
                drag = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
                titlebar.setPointerCapture(event.pointerId);
                $dialog.dialog('moveToTop');
                event.preventDefault();
            });
            titlebar.addEventListener('pointermove', event => {
                if (!drag) return;
                widget.style.left = `${drag.left + event.clientX - drag.x}px`;
                widget.style.top = `${drag.top + event.clientY - drag.y}px`;
            });
            titlebar.addEventListener('lostpointercapture', () => {
                if (!drag) return;
                drag = null;
                fit();
                const rect = widget.getBoundingClientRect();
                position = { left: rect.left, top: rect.top };
            });
            button.addEventListener('click', () => $dialog.dialog('open'));
            window.addEventListener('resize', () => {
                if ($dialog.dialog('isOpen')) fit();
            });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
    else setup();
})();
