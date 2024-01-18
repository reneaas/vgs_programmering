import numpy as np
import matplotlib.pyplot as plt
plt.rc("text", usetex=True)

def f(x):
    return x**2 - 4 * x + 4

def g(x):
    return (-x + 8) / 2
    
color = "teal"

a = -6
b = 8
x = np.linspace(a, b, 1001)

fig, ax = plt.subplots()
ax.plot(x, f(x), color=color, label="$y = x^2 - 4x + 4$")
ax.plot(x, g(x), color="purple", label="$2y + x = 8$")

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

xticks = list(range(a, b, 1))
xticks.remove(0)
xlabels = []
for xtick in xticks:
    if xtick % 2 == 0:
        xlabels.append(f"{xtick}")
    else:
        xlabels.append("")

yticks = list(range(-1, 10, 1))
yticks.remove(0)
ylabels = []
for ytick in yticks:
    if ytick % 2 == 0:
        ylabels.append(f"{ytick}")
    else:
        ylabels.append("")

plt.xlim(-6, 7)
plt.ylim(-1, 9)

plt.xticks(xticks, xlabels, fontsize=14)
plt.yticks(yticks, ylabels, fontsize=14)


plt.grid(True, color="gray", linestyle="--", linewidth=0.5)
plt.tight_layout()
plt.legend(fontsize=14)
plt.savefig("ligningssystem2.png")
# plt.savefig("andregradspolynom1.pdf")
