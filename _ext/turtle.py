from docutils import nodes
from docutils.parsers.rst import Directive, directives
from sphinx.util.docutils import SphinxDirective
import uuid


class TurtleDirective(SphinxDirective):
    """Directive for embedding Turtle Graphics code."""

    has_content = True
    required_arguments = 0
    optional_arguments = 1  # Optional identifier
    final_argument_whitespace = True
    option_spec = {
        "width": directives.unchanged,
        "height": directives.unchanged,
    }

    def run(self):
        # Generate a unique ID or use the provided one
        if self.arguments:
            identifier = self.arguments[0].replace(" ", "-").lower()
        else:
            identifier = f"turtle-{uuid.uuid4().hex[:8]}"

        container_id = f"container-kode-{identifier}"

        # Get the code content
        code_content = "\n".join(self.content)

        # Escape backticks for JavaScript
        escaped_code = code_content.replace("`", "\\`").replace("$", "\\$")

        # Create the HTML output
        html = f"""
        <div id="{container_id}"></div>
        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", () => {{
                const code = `{escaped_code}`;
                makeTurtleCode("{container_id}", code);
            }});
        </script>
        """

        raw_node = nodes.raw("", html, format="html")
        return [raw_node]


def setup(app):
    app.add_directive("turtle", TurtleDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
