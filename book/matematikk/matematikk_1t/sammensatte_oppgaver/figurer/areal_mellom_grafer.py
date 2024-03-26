import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def g(x):
    return -4*(x - 3)*(x**2 + 1)

a = 0
b = 3

x = np.linspace(a, b, 1024)

fig, ax = plt.subplots(1, 2, figsize=(10, 4))
# ax.plot(x, f(x), color="teal")
ax[0].plot(x, g(x), color="teal", lw=2, alpha=0.7)
ax[1].plot(x, g(x), color="teal", lw=2, alpha=0.7)

ax[0].spines["left"].set_position("zero")
ax[0].spines["right"].set_color("none")
ax[0].spines["bottom"].set_position("zero")
ax[0].spines["top"].set_color("none")

ax[0].plot(1, 0, ">k", transform=ax[0].get_yaxis_transform(), clip_on=False)
ax[0].plot(0, 1, "^k", transform=ax[0].get_xaxis_transform(), clip_on=False)

ax[0].set_xlabel(r"$x$", fontsize=16, loc="right")
ax[0].set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

ax[1].spines["left"].set_position("zero")
ax[1].spines["right"].set_color("none")
ax[1].spines["bottom"].set_position("zero")
ax[1].spines["top"].set_color("none")

ax[1].plot(1, 0, ">k", transform=ax[1].get_yaxis_transform(), clip_on=False)
ax[1].plot(0, 1, "^k", transform=ax[1].get_xaxis_transform(), clip_on=False)

ax[1].set_xlabel(r"$x$", fontsize=16, loc="right")
ax[1].set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

ax[0].set_xticks([])
ax[0].set_yticks([])

ax[1].set_xticks([])
ax[1].set_yticks([])

ax[0].set_xlim(a - 0.5, b + 0.5)
ax[0].set_ylim(-0.5, max(g(x)) + 1)

ax[1].set_xlim(a - 0.5, b + 0.5)
ax[1].set_ylim(-0.5, max(g(x)) + 1)


dx = 0.5
x = 0
for i in range(int((b - a) / dx)):
    rect = patches.Rectangle(
        xy=(x, 0),
        width=dx,
        height=g(x),
        color="teal",
        alpha=0.2,
    )
    x = x + dx

    ax[0].add_patch(rect)


dx = 0.25
x = 0
for i in range(int((b - a) / dx)):
    rect = patches.Rectangle(
        xy=(x, 0),
        width=dx,
        height=g(x),
        color="teal",
        alpha=0.2,
    )
    x = x + dx

    ax[1].add_patch(rect)
plt.tight_layout()
plt.savefig("areal_figurer.png")

plt.show()



x = np.linspace(a, b, 1024)
fig, ax = plt.subplots()
ax.plot(x, g(x), color="teal", lw=2, alpha=0.7)



ax.spines["left"].set_position("zero")
ax.spines["right"].set_color("none")
ax.spines["bottom"].set_position("zero")
ax.spines["top"].set_color("none")

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

ax.set_xlabel(r"$x$", fontsize=16, loc="right")
ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

ax.set_xticks([])
ax.set_yticks([])

ax.set_xlim(a - 0.5, b + 0.5)
ax.set_ylim(-0.5, max(g(x)) + 1)

plt.fill_between(
    x=x,
    y1=0,
    y2=g(x),
    color="teal",
    alpha=0.2,
)

plt.tight_layout()
plt.savefig("areal.png")