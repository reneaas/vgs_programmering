from docutils import nodes
from docutils.parsers.rst import Directive, directives
import re
import uuid


class InteractiveCodeDirective(Directive):
    has_content = True
    required_arguments = 0  # The unique identifier
    optional_arguments = 1
    final_argument_whitespace = True
    option_spec = {
        "lang": directives.unchanged,
        "predict": directives.flag,
    }

    def run(self):
        # Get the unique identifier from arguments
        # Generate a unique identifier or use the provided one
        if self.arguments:
            identifier = self.arguments[0]
        else:
            identifier = f"code-{uuid.uuid4().hex[:8]}"

        container_id = f"container-{identifier}"

        # Get code content from the directive content
        code_content = "\n".join(self.content)

        # Escape code for JavaScript
        escaped_code = code_content.replace("`", "\\`").replace("$", "\\$")

        is_prediction = "predict" in self.options
        # Choose the appropriate function based on the predict flag
        function_name = (
            "makePredictionInteractiveCode" if is_prediction else "makeInteractiveCode"
        )

        # Create the HTML with the template
        html = f"""
        <div id="{container_id}"></div>
        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", () => {{
                const code = 
`{escaped_code}`;

                {function_name}(
                    "{container_id}",
                    code,
                );
            }});
        </script>
        """

        raw_node = nodes.raw("", html, format="html")
        return [raw_node]


def setup(app):
    app.add_directive("interactive-code", InteractiveCodeDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
