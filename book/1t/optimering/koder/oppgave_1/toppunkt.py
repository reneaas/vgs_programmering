import plotmath
import numpy as np
from matplotlib.patches import ConnectionPatch


def make_circle(x0, y0, r):
    theta = np.linspace(0, 2 * np.pi, 100)
    x = x0 + r * np.cos(theta)
    y = y0 + r * np.sin(theta)
    return x, y


def main(dirname, save):
    #
    # Define functions
    def f(x):
        return -(((x - 4) ** 2)) + 12

    # List of functions and their labels.
    functions = [f]

    fig, ax = plotmath.plot(
        functions=functions,
        fn_labels=["A"],
        xmin=-1,
        xmax=8,
        ymin=-2,
        ymax=16,
        ticks=False,
        xstep=1,
        ystep=1,
        grid=False,
    )

    points = [i for i in range(1, 5, 1)]
    labels = [f"$x_{i}$" for i in range(1, len(points) + 1)]

    ax.set_xticks(points)
    ax.set_xticklabels(labels, fontsize=16)

    for point in points:
        if f(point) > 0:
            ax.vlines(
                x=point,
                ymin=0,
                ymax=f(point),
                color="black",
                linestyle="--",
                alpha=0.5,
            )
        else:
            ax.vlines(
                x=point,
                ymin=f(point),
                ymax=0,
                color="black",
                linestyle="--",
                alpha=0.5,
            )

    dy = 0.5
    dx = 2

    start = (1, 6)  # (x, y) of start point
    end = (2, 10)  # (x, y) of end point
    arrow = ConnectionPatch(
        xyA=start,  # start point
        xyB=end,  # end point
        coordsA="data",  # coordinate system for start point
        coordsB="data",  # coordinate system for end point
        axesA=ax,  # reference axes
        axesB=ax,  # reference axes
        arrowstyle="->",  # arrow style
        shrinkB=0,  # don't shrink the end
        mutation_scale=20,  # arrow head size
        fc="black",  # fill color
        ec="black",  # edge color
    )

    ax.add_patch(arrow)

    for point in points:
        if point < 4:
            ax.plot(point, f(point), "bo", markersize=8)
        else:
            ax.plot(point, f(point), "ro", markersize=8)

    x, y = make_circle(x0=4, y0=-0.9, r=0.4)
    ax.plot(x, y, color="red", linestyle="--", alpha=1)

    ax.legend(fontsize=16, loc="upper center")

    # NOTE: Select an appropriate `dirname` to save the figure.
    # The directory `dirname` will be created automatically if it does not exist already.
    if save:
        fname = __file__.split("/")[-1].replace(".py", ".svg")
        plotmath.savefig(
            dirname=dirname, fname=fname
        )  # Lagrer figuren i `dirname`-directory

    if not save:

        plotmath.show()


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

    # NOTE: Set `save=True` to save figure. `save=False` to display figure.
    main(dirname=dirname, save=True)
