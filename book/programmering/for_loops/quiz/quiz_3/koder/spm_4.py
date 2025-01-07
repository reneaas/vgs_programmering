import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

import sys
import pathlib


def find_repo_root(current_path):
    current_path = pathlib.Path(
        current_path
    ).resolve()  # Convert to an absolute Path object
    while (
        current_path != current_path.parent
    ):  # Stop when you reach the filesystem root
        if (current_path / ".git").is_dir():  # Check if the .git directory exists
            return str(current_path)
        current_path = current_path.parent  # Move one level up
    raise FileNotFoundError("No .git directory found in any parent directories.")


# Get the directory where the script is located
current_dir = str(pathlib.Path(__file__).resolve().parent)

# Find the root of the GitHub repository (where .git is located)
repo_root = find_repo_root(current_dir)

# Add the GitHub repository root to sys.path
sys.path.append(repo_root)


parts = current_dir.split("/")
for i in range(len(parts)):
    if parts[~i] == "koder":
        parts[~i] = "figurer"
        break

dirname = "/".join(parts)

plt.rc("text", usetex=True)

fontsize = 20

# Define the range for x and y values
x_min = 0
x_max = 2
n_x = len([i for i in range(x_min, x_max + 1)])

y_min = -2
y_max = 0
n_y = len([i for i in range(y_min, y_max + 1)])

x_values = np.linspace(x_min, x_max, n_x)
y_values = np.linspace(y_min, y_max, n_y)
x_values, y_values = np.meshgrid(x_values, y_values)
x_values = x_values.T
y_values = y_values.T
x_values = x_values.flatten()
y_values = y_values.flatten()
print(len(x_values))

# Set up the plot
fig, ax = plt.subplots()
ax.spines["left"].set_position("zero")
ax.spines["right"].set_color("none")
ax.spines["bottom"].set_position("zero")
ax.spines["top"].set_color("none")

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

ax.set_xlabel(r"$x$", fontsize=fontsize, loc="right")
ax.set_ylabel(r"$y$", fontsize=fontsize, loc="top", rotation="horizontal")

# x = np.linspace(-5, 5, 1024)

# ax.plot(x, x - 1, label=r"$x - y = 1$", lw=2, color="teal", alpha=0.7)
# ax.plot(x, -x + 1, label=r"$x + y = 1$", lw=2, color="purple", alpha=0.7)
# ax.legend(fontsize=16)

xticks = list(np.arange(-3, 4, 1))
xticks.remove(0)
plt.xticks(xticks, fontsize=fontsize)

yticks = list(np.arange(-3, 4, 1))
yticks.remove(0)
plt.yticks(yticks, fontsize=fontsize)


# Point to animate (initially empty)
(point,) = ax.plot([], [], "ko", markersize=10)

plt.xlim(-4, 4)
plt.ylim(-4, 4)


# Initialize the animation
def init():
    point.set_data([], [])
    return (point,)


# Update function for the animation
def update(frame):
    x = x_values[: frame + 1]
    y = y_values[: frame + 1]
    # print(f"{frame = }")
    # x = [x_values[frame]]
    # y = [y_values[frame]]
    point.set_data(x, y)  # Average the y-values to show the midpoint
    ax.spines["left"].set_position("zero")
    ax.spines["right"].set_color("none")
    ax.spines["bottom"].set_position("zero")
    ax.spines["top"].set_color("none")
    plt.xticks(xticks, fontsize=fontsize)
    plt.yticks(yticks, fontsize=fontsize)
    # Remove previously drawn text
    for txt in ax.texts:
        txt.set_visible(False)

    # Draw new text inside a textbox
    bbox_props = dict(
        boxstyle="round,pad=0.3", edgecolor="black", facecolor="white", alpha=0.7
    )
    x_coord = -3
    y_coord = -3.5
    if x[0] < 0:
        plt.text(
            s=f"$(x, y) = ({x[-1]:.0f}, {y[-1]:.0f})$",
            x=x_coord,
            y=y_coord,
            fontsize=fontsize,
            color="blue",
            ha="right",
            bbox=bbox_props,
        )
    else:
        plt.text(
            s=f"$(x, y) = ({x[-1]:.0f}, {y[-1]:.0f})$",
            x=x_coord,
            y=y_coord,
            fontsize=fontsize,
            color="blue",
            ha="left",
            bbox=bbox_props,
        )
    return (point,)


plt.grid(True, linestyle="--", alpha=0.7)
plt.tight_layout()

progress_callback = lambda i, n: print(
    f"Writing progress: {(i+1) / n * 100 :.1f} %", end="\r"
)
ani = FuncAnimation(
    fig, update, frames=range(len(x_values)), init_func=init, blit=True, repeat=False
)


fname = __file__.split("/")[-1].replace(".py", ".gif")

dir = pathlib.Path(dirname)
dir.mkdir(parents=True, exist_ok=True)

ani.save(
    f"{dir}/{fname}",
    writer="imagemagick",
    fps=2,
    progress_callback=progress_callback,
)
plt.close()
