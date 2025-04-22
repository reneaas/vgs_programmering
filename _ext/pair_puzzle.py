from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.docutils import SphinxDirective
import uuid


class PairPuzzleDirective(SphinxDirective):
    """
    A directive for creating interactive pairing puzzles.

    Usage:
    .. pair-puzzle::
       :width: 100%

       $A$ : $(1, 2)$
       $B$ : $(-2, 3)$
       $C$ : $(3, -1)$
    """

    has_content = True
    option_spec = {
        "width": directives.unchanged,
        "height": directives.unchanged,
        "class": directives.unchanged,
    }

    def run(self):
        # Generate a unique ID for this puzzle
        container_id = f"pair-puzzle-{uuid.uuid4().hex[:8]}"

        # Process options
        width = self.options.get("width", "100%")
        height = self.options.get("height", "auto")
        classes = self.options.get("class", "")

        # Process the content to extract pairs
        pairs_code = []
        for line in self.content:
            if not line.strip():
                continue

            # Split by colon
            parts = [part.strip() for part in line.split(":", 1)]
            if len(parts) == 2:
                left = parts[0]
                right = parts[1]
                pairs_code.append(f"['{left}', '{right}']")

        # Construct JavaScript to define pairs
        pairs_js = ",\n            ".join(pairs_code)

        # Create the complete HTML with JavaScript
        html = f"""
<div id="{container_id}" class="pairing-puzzle-container"></div>

<script type="text/javascript">
    document.addEventListener("DOMContentLoaded", () => {{
        // Define pairs to match
        const pairs = [
            {pairs_js}
        ];

        // Initialize the puzzle
        if (typeof initGame === 'undefined') {{
            console.error('Error: initGame function not found. Make sure pair_puzzle.js is loaded.');
        }} else {{
            initGame('{container_id}', pairs);
        }}
    }});
</script>
"""

        # Create a raw HTML node with the generated content
        raw_node = nodes.raw("", html, format="html")
        return [raw_node]


def setup(app):
    # Register the directive
    app.add_directive("pair-puzzle", PairPuzzleDirective)

    # Add required JavaScript and CSS files

    # Add KaTeX if not already included in your project
    app.add_css_file("https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css")
    app.add_js_file("https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js")
    app.add_js_file(
        "https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js"
    )

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
