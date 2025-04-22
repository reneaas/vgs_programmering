from docutils.parsers.rst import directives
from sphinx.directives.patches import Figure
from docutils import nodes
import os


class ClickableFigureDirective(Figure):
    """
    A figure directive that can be clicked to show an enlarged version in an overlay.

    Usage:
    .. clickable-figure:: path/to/image.png
       :width: 80%
       :alt: Alternative text

       Caption text goes here.
    """

    def run(self):
        # Get standard figure nodes from parent class
        figure_nodes = super().run()

        if not figure_nodes:
            return figure_nodes

        # Get the figure node
        figure_node = figure_nodes[0]

        # Find the image node within the figure
        image_node = None
        for node in figure_node.traverse(nodes.image):
            image_node = node
            break

        if not image_node:
            return figure_nodes

        # Add classes to figure node
        if "classes" not in figure_node:
            figure_node["classes"] = []
        figure_node["classes"].append("clickable-figure")
        figure_node["classes"].append("adaptive-figure")

        # Get the caption if present
        caption = ""
        for child in figure_node.children:
            if isinstance(child, nodes.caption):
                caption = child.astext()
                break

        # Add data attributes to the image
        image_node["data-clickable"] = "true"
        if not image_node.get("alt"):
            image_node["alt"] = caption

        return figure_nodes


def setup(app):
    # Register the directive (without overriding figure)
    app.add_directive("clickable-figure", ClickableFigureDirective)

    # Add JavaScript and CSS files
    static_dir = os.path.join(os.path.dirname(__file__), "../_static/clickable_figures")

    # Create the directory if it doesn't exist
    if not os.path.exists(static_dir):
        os.makedirs(static_dir)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
