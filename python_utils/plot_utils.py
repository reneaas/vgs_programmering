import pathlib

import numpy as np
import matplotlib.pyplot as plt

colors = ["#029386", "#C875C4", "#E50000", "blue", "purple", "orange"]
# colors = np.random.permutation(colors)
plt.rcParams["axes.prop_cycle"] = plt.cycler(color=colors)


def _get_figure_and_axis():
    fig, ax = plt.subplots()
    ax.spines["left"].set_position("zero")
    ax.spines["right"].set_color("none")
    ax.spines["bottom"].set_position("zero")
    ax.spines["top"].set_color("none")

    ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
    ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

    ax.set_xlabel(r"$x$", fontsize=16, loc="right")
    ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

    return fig, ax


def _set_ticks(xmin, xmax, ymin, ymax):
    xticks = list(np.arange(xmin + 1, xmax, 1))
    if 0 in xticks:
        xticks.remove(0)
    plt.xticks(xticks, fontsize=16)

    yticks = list(np.arange(ymin + 1, ymax, 1))
    if 0 in yticks:
        yticks.remove(0)
    plt.yticks(yticks, fontsize=16)

    return None


def make_figure(
    functions,
    fn_labels=None,
    xmin=-5,
    xmax=5,
    ymin=-5,
    ymax=5,
    ticks=True,
    alpha=0.7,
    grid=True,
):
    fig, ax = _get_figure_and_axis()

    if ticks:
        _set_ticks(xmin, xmax, ymin, ymax)
    else:
        plt.xticks([])
        plt.yticks([])

    a = -50
    b = 50
    x = np.linspace(a, b, 1024)

    if fn_labels is not None:
        for f, label in zip(functions, fn_labels):
            ax.plot(x, f(x), lw=2, alpha=alpha, label=label)

        ax.legend(fontsize=16)

    else:
        for f in functions:
            ax.plot(x, f(x), lw=2, alpha=alpha)

    plt.ylim(ymin, ymax)
    plt.xlim(xmin, xmax)

    if grid:
        plt.grid(True, linestyle="--", alpha=0.6)

    plt.tight_layout()

    return fig, ax


def savefig(dirname, fname):
    dir = pathlib.Path(dirname)
    dir.mkdir(parents=True, exist_ok=True)
    plt.savefig(f"{dir}/{fname}")

    return None
