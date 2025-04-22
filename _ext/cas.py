from docutils import nodes
from sphinx.util.docutils import SphinxDirective
import uuid


class CASDirective(SphinxDirective):
    # Require two arguments: width and height.
    required_arguments = 2
    optional_arguments = 0
    has_content = False

    def run(self):
        # Convert arguments to integers (with defaults if conversion fails)
        try:
            width = int(self.arguments[0])
        except ValueError:
            width = 700
        try:
            height = int(self.arguments[1])
        except ValueError:
            height = 400

        # Generate a unique container ID using a short UUID.
        container_id = f"ggb-cas-{uuid.uuid4().hex[:8]}"

        # Create the raw HTML. Adjust the ggbBase64 value as needed.
        html = f"""
<div id="{container_id}" style="width: {width}px; height: {height}px;" class="ggb-window"></div>
<script>


document.addEventListener("DOMContentLoaded", function() {{
    var options = {{
        appName: 'classic',
        width: {width},
        height: {height},
        showToolBar: true,
        showAlgebraInput: false,
        showMenuBar: false,
        language: 'nb',
        borderRadius: 8,
        borderColor: '#000000',
        showFullscreenButton: true,
        showResetIcon: true,
        scale: 1,
        rounding: 2,
        showKeyboardOnFocus: false,
        preventFocus: true,
        id: '{container_id}',
        material_id: 'tcjdpxzj',
        // ggbBase64: "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", 
    }};

    var applet = new GGBApplet(options, true);
    applet.inject('{container_id}');

}});
</script>
        """
        return [nodes.raw("", html, format="html")]


def setup(app):
    app.add_directive("cas", CASDirective)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
