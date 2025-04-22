from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.docutils import SphinxDirective
from sphinx.util import logging
from _ext.cas import CASDirective  # Import the CAS directive

logger = logging.getLogger(__name__)


class CASWindowDirective(CASDirective):
    """A directive that wraps a CAS window in a dropdown admonition."""

    has_content = True
    required_arguments = 0
    optional_arguments = 1
    final_argument_whitespace = True
    option_spec = {
        "width": directives.unchanged,
        "height": directives.unchanged,
    }

    def run(self):
        # Get the title from arguments
        if len(self.arguments) > 0:
            title = self.arguments[0]
        else:
            title = "CAS-vindu"

        # Get dimensions from options or use defaults
        width = self.options.get("width", "720")
        height = self.options.get("height", "700")

        # Create the admonition node
        admonition_node = nodes.admonition()
        admonition_node["classes"] = ["admonition", "progging", "dropdown"]

        # Create the title node
        title_node = nodes.title(text=title)
        admonition_node += title_node

        # Save original arguments and update with width/height
        original_args = self.arguments
        self.arguments = [width, height]  # Set arguments for the CAS directive

        # Get the CAS window nodes by calling the parent class's run method
        cas_nodes = super().run()

        # Restore original arguments
        self.arguments = original_args

        # Add the CAS nodes to the admonition
        for node in cas_nodes:
            admonition_node += node

        return [admonition_node]


def setup(app):
    app.add_directive("cas-window", CASWindowDirective)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
