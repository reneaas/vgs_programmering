import plotmath


def main(dirname, save):
    #
    # Define functions
    def f(x):
        return x**2 - x - 6

    def g(x):
        return x - 3

    def h(x):
        return (x - 2) ** 2 + 1

    def p(x):
        return 2 * x + 1

    # List of functions and their labels.
    functions = [f, g, h, p]

    fn_labels = ["$\\mathrm{A}$", "$\\mathrm{B}$", "$\\mathrm{C}$", "$\\mathrm{D}$"]

    figs, axes = plotmath.multiplot(
        functions=functions,
        fn_labels=True,
        xmin=-6,
        xmax=6,
        ymin=-6,
        ymax=6,
        xstep=1,
        ystep=1,
        ticks=True,
        rows=2,
        cols=2,
    )

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
