import plotmath
import numpy as np


def main(dirname, save):
    #
    # Define functions
    @np.vectorize
    def f(x):
        teller = x**2 - 6 * x + 5
        nevner = (x - 2) * (x - 4)
        if x == 2 or x == 4:
            return None
        else:
            return teller / nevner

    # List of functions and their labels.
    functions = []

    fig, ax = plotmath.plot(
        functions=functions,
        fn_labels=False,
        xmin=-4,
        xmax=10,
        ymin=-10,
        ymax=10,
        ticks=False,
        xstep=1,
        ystep=1,
        grid=False,
    )

    x_inf1 = 2
    x_inf2 = 4
    x_vals = np.linspace(-25, x_inf1, 1024)
    y_vals = f(x_vals)
    ax.plot(x_vals, y_vals, color="teal", linestyle="-", alpha=0.7, lw=2, label="$f$")

    x_vals = np.linspace(x_inf1, x_inf2, 1024)
    y_vals = f(x_vals)
    ax.plot(x_vals, y_vals, color="teal", linestyle="-", alpha=0.7, lw=2)

    x_vals = np.linspace(x_inf2, 25, 1024)
    y_vals = f(x_vals)
    ax.plot(x_vals, y_vals, color="teal", linestyle="-", alpha=0.7, lw=2)

    ax.vlines(
        x=x_inf1,
        ymin=-100,
        ymax=100,
        color="blue",
        linestyle="--",
        alpha=1,
    )

    ax.vlines(
        x=x_inf2,
        ymin=-100,
        ymax=100,
        color="blue",
        linestyle="--",
        alpha=1,
    )

    ax.hlines(
        y=1,
        xmin=-100,
        xmax=100,
        color="blue",
        linestyle="--",
        alpha=1,
    )

    ax.legend(fontsize=16)

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
