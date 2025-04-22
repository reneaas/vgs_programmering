from docutils import nodes
from sphinx.util.docutils import SphinxDirective
from docutils.parsers.rst import directives
import uuid


class GGBDirective(SphinxDirective):
    # Require two arguments: width and height.
    required_arguments = 2
    optional_arguments = 0
    has_content = False

    option_spec = {
        "material_id": directives.unchanged,
        "toolbar": directives.unchanged,
        "menubar": directives.unchanged,
        "algebra": directives.unchanged,
        "perspective": directives.unchanged,
        "fullscreen": directives.unchanged,
    }

    def run(self):
        # Convert arguments to integers (with defaults if conversion fails)
        try:
            width = int(self.arguments[0])
        except ValueError:
            width = 720
        try:
            height = int(self.arguments[1])
        except ValueError:
            height = 600

        material_id = self.options.get("material_id", None)
        toolbar = self.options.get("toolbar", "false")
        menubar = self.options.get("menubar", "false")
        algebra = self.options.get("algebra", "false")
        perspective = self.options.get("perspective", None)

        if perspective:
            perspective = f"perspective: '{perspective}'"
        else:
            perspective = "'': ''"

        if material_id:
            material_id = f"material_id: '{material_id}'"
        else:
            # Defaults if no material_id is provided
            material_id = "'': ''"
            toolbar = "true"
            menubar = "true"
            algebra = "true"

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
        showToolBar: {toolbar},
        showAlgebraInput: {algebra},
        showMenuBar: {menubar},
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
        {material_id},
        {perspective},
    }};

    var applet = new GGBApplet(options, true);
    applet.inject('{container_id}');

}});
</script>
        """
        return [nodes.raw("", html, format="html")]


def setup(app):
    app.add_directive("ggb", GGBDirective)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
