import numpy as np
import matplotlib.pyplot as plt

def plot_graph(x: np.ndarray, f: callable):
    fig, ax = plt.subplots()
    ax.plot(x, f(x), color="teal", lw=2, alpha=0.6)

    ax.spines["left"].set_position("zero")
    ax.spines["right"].set_color("none")
    ax.spines["bottom"].set_position("zero")
    ax.spines["top"].set_color("none")

    ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
    ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)
    ax.set_xlabel(r"$x$", fontsize=16, loc="right")
    ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

    return fig, ax