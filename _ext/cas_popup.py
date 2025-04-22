from docutils import nodes
from sphinx.util.docutils import SphinxDirective
import uuid


class CASPopUpDirective(SphinxDirective):
    required_arguments = 2  # width, height
    optional_arguments = 2  # button text, dialog title
    has_content = False

    def run(self):
        # ---------- 1 » Parse directive arguments ----------
        try:
            width = int(self.arguments[0])
        except ValueError:
            width = 700

        try:
            height = int(self.arguments[1])
        except ValueError:
            height = 400

        button_text = self.arguments[2] if len(self.arguments) > 2 else "Åpne CAS‑vindu"
        dialog_title = self.arguments[3] if len(self.arguments) > 3 else "CAS‑vindu"

        # ---------- 2 » Generate unique element ids ----------
        container_id = f"ggb-cas-{uuid.uuid4().hex[:8]}"
        dialog_id = f"dialog-{container_id}"
        button_id = f"button-{container_id}"

        # ---------- 3 » Raw HTML (touch‑ready) ----------
        html = f"""
<!--‑‑ Mobile viewport so the dialog scales on phones ‑‑>
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- jQuery + jQuery UI -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>

<!-- Touch‑punch: maps touch / pointer events to jQuery‑UI mouse APIs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

<link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">

<!-- Button that opens the dialog -->
<button id="{button_id}" class="ggb-cas-button">{button_text}</button>

<!-- Dialog that will contain the CAS applet -->
<div id="{dialog_id}" title="{dialog_title}" style="display:none;">
    <div id="{container_id}"
         style="width:{width}px;height:{height}px;"
         class="ggb-window"></div>
</div>

<style>
/* Larger touch targets for the resizable handles */
.ui-resizable-handle {{
    min-width: 16px;
    min-height: 16px;
}}
</style>

<script>
(function() {{
    $(function() {{
        let appletInitialised = false,
            padV = 60,          /* padding inside dialog */
            padH = 20;

        /* 1 » Create the dialog (draggable + resizable now work on touch) */
        $("#{dialog_id}").dialog({{
            autoOpen : false,
            width    : {width + 40},
            height   : {height + 80},
            modal    : false,
            resizable: true,
            draggable: true,
            position : {{ my: "center", at: "center", of: window }},

            resize: function (_, ui) {{
                if (window.ggbApplet) {{
                    const w = ui.size.width  - padH,
                          h = ui.size.height - padV;
                    $("#{container_id}").css({{width: w, height: h}});
                    window.ggbApplet.setSize(w, h);
                }}
            }},

            open: function () {{
                if (!appletInitialised) {{
                    const params = {{
                        appName              : "classic",
                        id                   : "{container_id}",
                        width                : {width},
                        height               : {height},
                        perspective          : "C",
                        language             : "nb",
                        showToolBar          : true,
                        showAlgebraInput     : true,
                        showMenuBar          : false,
                        borderRadius         : 8,
                        showResetIcon        : true,
                        enableRightClick     : true,
                        showKeyboardOnFocus  : false,
                        showFullscreenButton : false,
                        customToolBar        : "1001 | 1002 | 1007 | 1010 | 1008 | 6"
                    }};
                    new GGBApplet(params, true).inject("{container_id}");
                    appletInitialised = true;
                }}
            }}
        }});

        /* 2 » Open dialog on click **or** touch/pointer‑up */
        $("#{button_id}")
            .button()
            .on("click touchend pointerup", function (e) {{
                e.preventDefault();          // eliminate 300 ms delay on iOS/Android
                $("#{dialog_id}").dialog("open");
            }});
    }});
}})();
</script>
        """
        return [nodes.raw("", html, format="html")]


def setup(app):
    app.add_directive("cas-popup", CASPopUpDirective)

    # external CSS already loaded above; here you can add your own tweaks
    app.add_css_file("misc_styles/cas_popup.css")

    return {
        "version": "0.2",  # bumped
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
