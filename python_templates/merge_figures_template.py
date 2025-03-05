from svgutils.compose import Figure, SVG


def main(dirname):

    fignames = ["A.svg", "B.svg", "C.svg", "D.svg"]
    # figure_paths = [dirname + path for path in figure_paths]
    figure_paths = [dirname + "/" + figname for figname in fignames]
    svgs = [SVG(path) for path in figure_paths]

    svg_width = max(svg.width for svg in svgs)
    svg_height = max(svg.height for svg in svgs)

    fig = Figure(
        svg_width * 2,
        svg_height * 2,
        SVG(dirname + "/A.svg").scale(1.25).move(0, 0),
        SVG(dirname + "/B.svg").scale(1.25).move(svg_width, 0),
        SVG(dirname + "/C.svg").scale(1.25).move(0, svg_height),
        SVG(dirname + "/D.svg").scale(1.25).move(svg_width, svg_height),
    )

    fig.save(dirname + "/merged_figure.svg")


if __name__ == "__main__":

    import pathlib

    # Get the directory where the script is located
    current_dir = str(pathlib.Path(__file__).resolve().parent)

    parts = current_dir.split("/")
    for i in range(len(parts)):
        if parts[~i] == "koder":
            parts[~i] = "figurer"
            break

    dirname = "/".join(parts)

    main(dirname=dirname)
