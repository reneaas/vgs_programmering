from docutils import nodes
from sphinx.util.docutils import SphinxDirective
from docutils.parsers.rst import directives
import uuid
import re


class PopupCodeDirective(SphinxDirective):
    has_content = True
    required_arguments = 0
    optional_arguments = 1  # Button text
    final_argument_whitespace = True
    option_spec = {
        "title": directives.unchanged,
        "width": directives.positive_int,
        "height": directives.positive_int,
        "lang": directives.unchanged,
        "predict": directives.flag,
    }

    def run(self):
        # Get button text from arguments or use default
        button_text = self.arguments[0] if self.arguments else "Åpne kodevindu"

        # Get title from options or use default
        dialog_title = self.options.get("title", "Interaktivt kodevindu")

        # Get width and height if specified
        width = self.options.get("width", 700)
        height = self.options.get("height", 500)

        # Get code content from the directive content
        code_content = "\n".join(self.content)

        # Escape code for JavaScript
        escaped_code = code_content.replace("`", "\\`").replace("$", "\\$")

        # Generate unique IDs
        popup_id = f"popup-code-{uuid.uuid4().hex[:8]}"
        button_id = f"button-{popup_id}"
        container_id = f"container-{popup_id}"

        is_prediction = "predict" in self.options
        # Choose the appropriate function based on the predict flag
        function_name = (
            "makePredictionInteractiveCode" if is_prediction else "makeInteractiveCode"
        )

        # Create the HTML with the button and dialog
        # Update the HTML generation part:

        html = f"""
<!-- Button to open the popup -->
<button id="{button_id}" class="popup-button">{button_text}</button>

<!-- Dialog container div included directly in HTML -->
<div id="{popup_id}" title="{dialog_title}" class="popup-code-dialog" style="display:none;">
    <div id="{container_id}" class="code-container"></div>
</div>

<!-- Dialog script -->
<script>
(function() {{
    function ensureScriptsLoaded(callback) {{
        // Check if jQuery is loaded
        if (typeof jQuery === 'undefined') {{
            console.log('jQuery not loaded, loading from CDN...');
            var script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = function() {{
                console.log('jQuery loaded successfully');
                // Now load jQuery UI
                var uiScript = document.createElement('script');
                uiScript.src = 'https://code.jquery.com/ui/1.13.2/jquery-ui.min.js';
                uiScript.onload = function() {{
                    console.log('jQuery UI loaded successfully');
                    callback();
                }};
                document.head.appendChild(uiScript);
            }};
            document.head.appendChild(script);
        }}
        else if (typeof jQuery.ui === 'undefined') {{
            console.log('jQuery UI not loaded, loading from CDN...');
            var uiScript = document.createElement('script');
            uiScript.src = 'https://code.jquery.com/ui/1.13.2/jquery-ui.min.js';
            uiScript.onload = function() {{
                console.log('jQuery UI loaded successfully');
                callback();
            }};
            document.head.appendChild(uiScript);
        }}
        else {{
            console.log('jQuery and jQuery UI already loaded');
            callback();
        }}
    }}

    function initializePopup() {{
        console.log('Initializing code popup dialog: #{popup_id}');
        try {{
            $("#{popup_id}").dialog({{
                autoOpen: false,
                title: "{dialog_title}",
                width: {width},
                height: {height},
                dialogClass: "popup-dialog code-dialog",
                modal: false,
                resizable: true,
                draggable: true,
                open: function() {{
                    console.log('Dialog opened, initializing code editor');
                    // Only initialize code editor if it hasn't been already
                    if (!$("#{container_id}").data("initialized")) {{
                        const code = `{escaped_code}`;
                        
                        if (typeof {function_name} === "function") {{
                            {function_name}("{container_id}", code);
                            $("#{container_id}").data("initialized", true);
                        }} else {{
                            console.error("{function_name} function not found!");
                            $("#{container_id}").html('<div class="error">Could not initialize code editor. Required JavaScript is not loaded.</div>');
                        }}
                    }}
                }}
            }});
            
            // Button click handler
            $("#{button_id}").on("click", function() {{
                console.log('Button clicked, opening dialog');
                $("#{popup_id}").dialog("open");
            }});
            
            console.log('Code popup initialized successfully');
        }} catch(e) {{
            console.error('Error initializing popup:', e);
        }}
    }}

    // Initialize when document is ready
    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', function() {{
            ensureScriptsLoaded(initializePopup);
        }});
    }} else {{
        ensureScriptsLoaded(initializePopup);
    }}
}})();
</script>
"""
        return [nodes.raw("", html, format="html")]


def setup(app):
    app.add_directive("popup-code", PopupCodeDirective)

    # Add jQuery UI CSS
    app.add_css_file("https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css")

    # Add custom CSS for popup
    app.add_css_file("misc_styles/popup.css")

    # Add additional CSS for code dialog
    app.add_css_file("misc_styles/popup_code.css")

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
