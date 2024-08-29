import numpy as np
import matplotlib.pyplot as plt

def circle(x0, y0, r):
    t = np.linspace(0, 2 * np.pi, 1024)
    x = x0 + r * np.cos(t)
    y = y0 + r * np.sin(t)
    return x, y




fig, ax = plt.subplots()
x, y = circle(0, 0, 1)
ax.plot(x, y, color="teal", lw=2, alpha=0.7)

ax.spines["left"].set_position("zero")
ax.spines["right"].set_color("none")
ax.spines["bottom"].set_position("zero")
ax.spines["top"].set_color("none")

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)

ax.set_xlabel(r"$x$", fontsize=16, loc="right")
ax.set_ylabel(r"$y$", fontsize=16, loc="top", rotation="horizontal")

plt.plot([0, np.cos(np.pi/3)], [0, np.sin(np.pi/3)], color="black", lw=0.8, linestyle="--")
plt.plot([np.cos(np.pi/3), np.cos(np.pi/3)], [0, np.sin(np.pi/3)], color="black", lw=0.8, linestyle="--")

plt.text(
    x=0.15,
    y=0.6,
    s="$1$",
    fontsize=16,
)



plt.text(
    x=0.2,
    y=-0.15,
    s=r"$x$",
    fontsize=16,
)


plt.text(
    x=0.6,
    y=0.4,
    s=r"$y$",
    fontsize=16,
)

plt.xticks([])
plt.yticks([])


plt.axis("equal")
plt.savefig("sirkel.png")



plt.show()
