from docutils import nodes
from docutils.parsers.rst import directives
from sphinx.util.docutils import SphinxDirective
import re
import os
import hashlib
import sys
import tempfile
import shutil
import logging
import uuid

logger = logging.getLogger(__name__)


def normalize_polynomial(poly):
    """Ensure polynomial has explicit coefficients and is properly formatted."""
    # First normalize whitespace
    poly = re.sub(r"\s+", "", poly)

    # Ensure first term has explicit coefficient if it starts with x
    if poly.startswith("x"):
        poly = "1" + poly

    # Handle terms that start with a sign followed by x
    poly = re.sub(r"(?<![0-9a-zA-Z\)])([+\-])x", r"\g<1>1x", poly)

    # DON'T modify the exponent notation - this can cause LaTeX errors
    poly = re.sub(r"x\^([0-9]+)", r"x^{\g<1>}", poly)

    return poly


class PolyDivDirective(SphinxDirective):
    """Directive for displaying polynomial division figures with simple syntax."""

    has_content = True
    required_arguments = 0
    optional_arguments = 0
    option_spec = {
        "width": directives.unchanged,
        "height": directives.unchanged,
        "alt": directives.unchanged,
        "stage": directives.unchanged,
    }

    def run(self):
        # Process directive content
        if not self.content:
            return [
                self.state.document.reporter.warning(
                    "No content provided for polydiv directive", line=self.lineno
                )
            ]

        # Process content to handle both RST and MyST formats
        content_text = "\n".join(line for line in self.content)

        # Clean out any YAML frontmatter that MyST might add
        # content_text = re.sub(
        #     r"^---.*?^---$", "", content_text, flags=re.MULTILINE | re.DOTALL
        # )
        content_text = re.sub(
            r"^---\s*\n.*?\n---\s*\n", "", content_text, flags=re.DOTALL
        )
        content_text = content_text.strip()

        logger.info(f"Cleaned content: '{content_text}'")

        # Split on first colon only to handle possible colons in polynomial
        try:
            parts = content_text.split(":", 1)
            if len(parts) != 2:
                raise ValueError(f"Missing colon separator in: '{content_text}'")

            dividend = parts[0].strip()
            divisor = parts[1].strip()

            # Normalize polynomials
            dividend = normalize_polynomial(dividend)
            divisor = normalize_polynomial(divisor)

            logger.info(f"Normalized dividend: '{dividend}', divisor: '{divisor}'")

        except Exception as e:
            logger.error(f"Parsing error: {e}, content: '{content_text}'")
            return [
                self.state.document.reporter.warning(
                    f"Invalid polynomial division format: {str(e)}", line=self.lineno
                )
            ]

        # Get options with defaults
        width = self.options.get("width", "95%")  # Default to 95% width
        height = self.options.get("height", "auto")
        alt_text = self.options.get("alt", f"Division of {dividend} by {divisor}")
        stage = self.options.get("stage", None)

        # Generate a deterministic filename based on the content
        unique_id = f"polydiv-{uuid.uuid4().hex[:8]}"
        filename = f"polydiv_{unique_id}"

        # Generate the SVG in a temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            try:
                # Import the polydiv function
                sys.path.append(self.env.app.confdir)
                from python_util.polydiv import polylongdiv

                original_dir = os.getcwd()
                try:
                    # Change to temp directory for processing
                    os.chdir(temp_dir)

                    # Run the polylongdiv function
                    logger.info(
                        f"Calling polylongdiv with p='{dividend}', q='{divisor}'"
                    )
                    polylongdiv(
                        fname=filename,
                        p=dividend,  # Don't use extra str() calls
                        q=divisor,  # Don't use extra str() calls
                        stage=stage if stage != "None" else None,
                    )

                    # List files in temp dir for debugging
                    logger.info(f"Files in temp dir: {os.listdir('.')}")

                    # Read the SVG content for embedding directly
                    if os.path.exists(f"{filename}.svg"):
                        logger.info(f"Successfully generated SVG: {filename}.svg")
                        with open(f"{filename}.svg", "r") as f:
                            svg_content = f.read()

                        # Save original for debugging
                        with open(os.path.join(temp_dir, "original.svg"), "w") as f:
                            f.write(svg_content)

                        # Generate a unique ID for the SVG
                        unique_id = f"polydiv-{uuid.uuid4().hex[:8]}"
                        unique_class = f"polydiv-cls-{uuid.uuid4().hex[:6]}"

                        svg_content = svg_content.replace(
                            "<svg ",
                            f'<svg id="{unique_id}-svg" width="{width}" height="{height}" ',
                        )

                        # Save processed SVG for debugging
                        with open(os.path.join(temp_dir, "processed.svg"), "w") as f:
                            f.write(svg_content)

                        # Create HTML with the theme-aware SVG
                        # Replace the HTML generation code with this:
                        html = f"""
                        <div id="{unique_id}-container" class="adaptive-figure">
                            {svg_content}
                        </div>
                        """

                        raw_node = nodes.raw("", html, format="html")
                        return [raw_node]
                    else:
                        logger.error(f"SVG file not found: {filename}.svg")
                        raise FileNotFoundError(f"Failed to generate {filename}.svg")
                finally:
                    # Always return to original directory
                    os.chdir(original_dir)

            except Exception as e:
                logger.error(f"Failed to generate polynomial division figure: {e}")
                logger.error(f"Dividend: '{dividend}', Divisor: '{divisor}'")

                # Fallback - placeholder for failed generation
                placeholder_html = f"""
                <div style="border: 1px dashed #ccc; padding: 1em; text-align: center; 
                            background-color: #f9f9f9; color: #666; width: {width}; height: {height or '100px'};">
                    Polynomial Division: {dividend} ÷ {divisor}
                    <br><small>(Failed to generate figure: {str(e)})</small>
                </div>
                """
                raw_node = nodes.raw("", placeholder_html, format="html")
                return [raw_node]


def setup(app):
    app.add_directive("polydiv", PolyDivDirective)
    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
