import numpy as np
import matplotlib.pyplot as plt
plt.rc("text", usetex=True)

def f(x):
    return -x + 10

def g(x):
    return 2*x - 8
    
color = "teal"

a = -1
b = 10
x = np.linspace(a, b, 1001)

fig, ax = plt.subplots()
ax.plot(x, f(x), color=color, label="$x + y = 10$")
ax.plot(x, g(x), color="purple", label="$2x - y = 8$")

ax.spines["left"].set_position("zero")
ax.spines["right"].set_color("none")
ax.spines["bottom"].set_position("zero")
ax.spines["top"].set_color("none")

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

ax.set_xlabel(r"$x$", fontsize=16, loc="right")
ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")


# xticks = list(range(-5, 6, 1))
# xticks.remove(0)
# plt.xticks(xticks, fontsize=14)

# yticks = list(range(-3, 6, 1))
# yticks.remove(0)
# plt.yticks(yticks, fontsize=14)

xticks = list(range(-1, 12, 1))
xticks.remove(0)
xlabels = []
for xtick in xticks:
    if xtick % 2 == 0:
        xlabels.append(f"{xtick}")
    else:
        xlabels.append("")

yticks = list(range(-10, 12, 1))
yticks.remove(0)
ylabels = []
for ytick in yticks:
    if ytick % 2 == 0:
        ylabels.append(f"{ytick}")
    else:
        ylabels.append("")

plt.xticks(xticks, xlabels, fontsize=14)
plt.yticks(yticks, ylabels, fontsize=14)


plt.grid(True, color="gray", linestyle="--", linewidth=0.5)
plt.tight_layout()
plt.legend(fontsize=14)
plt.savefig("ligningssystem1.pdf")
# plt.savefig("andregradspolynom1.pdf")
