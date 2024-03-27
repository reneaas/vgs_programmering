import numpy as np
import matplotlib.pyplot as plt

def f(x):
    return np.sqrt(1 - x**2)

a = -1
b = 1



x = np.linspace(a, b, 1024)

fig, ax = plt.subplots()
ax.plot(x, f(x), color="teal", lw=2, alpha=0.7)

ax.spines["left"].set_position("zero")
ax.spines["right"].set_color("none")
ax.spines["bottom"].set_position("zero")
ax.spines["top"].set_color("none")

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

ax.set_xlabel(r"$x$", fontsize=16, loc="right")
ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

plt.xticks([])
plt.yticks([])



n_linjer = 4
dx = (b - a) / n_linjer

linjer = []

for i in range(n_linjer):
    x1 = a + i * dx
    i * dx
    y1 = f(x1)

    x2 = x1 + dx
    y2 = f(x2)

    linjer.append([(x1, x2), (y1, y2)])


xticks = []
yticks = []
for linje in linjer:
    # print(linje)
    x1, x2 = linje[0]
    y1, y2 = linje[1]

    plt.plot(linje[0], linje[1], color="black", lw=1)
    plt.plot([x2, x2], [y1, y2], color="black", lw=0.8, linestyle="--")
    plt.plot([x1, x2], [y1, y1], color="black", lw=0.8, linestyle="--")




xticks = [a + i * dx for i in range(n_linjer + 1)]

xlabels = [f"$x_{i}$" for i in range(1, len(xticks) + 1)]

yticks = [f(i) for i in xticks]

ylabels = [f"$y_{i}$" for i in range(1, len(yticks) + 1)]

plt.xticks(xticks, xlabels, fontsize=16)
# plt.yticks(yticks, ylabels, fontsize=16)

# plt.xticks([])
plt.yticks([])
plt.axis("equal")
plt.savefig("lengde_av_graf_2_segmenter.png")



plt.show()
