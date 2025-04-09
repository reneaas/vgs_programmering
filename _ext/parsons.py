from docutils import nodes
from docutils.parsers.rst import Directive, directives
import uuid


class ParsonsPuzzleDirective(Directive):
    has_content = True
    required_arguments = 0
    optional_arguments = 1
    final_argument_whitespace = True
    option_spec = {
        "lang": directives.unchanged,
    }

    def run(self):
        # Generate a unique identifier or use the provided one
        if self.arguments:
            identifier = self.arguments[0]
        else:
            identifier = f"puzzle-{uuid.uuid4().hex[:8]}"

        puzzle_container_id = f"container-parsons-puzzle-{identifier}"
        editor_container_id = f"container-kode-{identifier}"

        # Get code content from the directive content
        code_content = "\n".join(self.content)

        # Escape code for JavaScript
        escaped_code = code_content.replace("`", "\\`").replace("$", "\\$")

        # Create the HTML with the template
        html = f"""
        <div id="{puzzle_container_id}" class="puzzle-container"></div>
        <div id="{editor_container_id}" style="display: none"></div>

        <script type="text/javascript">
            document.addEventListener("DOMContentLoaded", () => {{
                const code = 
`{escaped_code}`;

                const puzzleContainerId = '{puzzle_container_id}';
                const editorId = '{editor_container_id}';

                const switchToCodeEditor = makeCallbackFunction(puzzleContainerId, editorId);
                const puzzle = new ParsonsPuzzle(
                    puzzleContainerId,
                    code,
                    switchToCodeEditor,
                );
            }});    
        </script>
        """

        raw_node = nodes.raw("", html, format="html")
        return [raw_node]


def setup(app):
    app.add_directive("parsons-puzzle", ParsonsPuzzleDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
