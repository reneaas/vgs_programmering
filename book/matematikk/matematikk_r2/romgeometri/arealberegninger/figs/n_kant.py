import numpy as np
import matplotlib.pyplot as plt
plt.rc('text', usetex=True)

def n_kant(n):
    t = np.linspace(0, 2*np.pi, n + 1)
    x = np.cos(t)
    y = np.sin(t)
    return x, y

def circle(n=1024):
    t = np.linspace(0, 2*np.pi, n + 1)
    x = np.cos(t)
    y = np.sin(t)
    return x, y


n = 10
x, y = n_kant(n=n)
plt.plot(x, y, color="teal")

# plt.text(x=1, y=0.4, s="$a$", color="black", fontsize=20)
# plt.scatter(x, y)
plt.plot(*circle(), color="black")
plt.axis("equal")
plt.axis("off")
plt.savefig(f"{n}_kant.png")


plt.show()


x1 = 1
y1 = 0

x2 = np.cos(2*np.pi/n)
y2 = np.sin(2*np.pi/n)

plt.plot(x, y, color="teal", lw=2, alpha=0.7)
plt.plot([0, x1], [0, y1], color="black")
plt.plot([0, x2], [0, y2], color="black")


plt.quiver(x1, y1, angles='xy', scale_units='xy', scale=1, color="black", width=0.005)

plt.text(x=0.5, y=-0.15, s=r"$\vec{r}_1$", fontsize=16)


plt.quiver(x2, y2, angles='xy', scale_units='xy', scale=1, color="black", width=0.005)

# plt.quiver(x1, y1, x2-x1, y2-y1, angles='xy', scale_units='xy', scale=1, color="black", width=0.01)

plt.text(x=0.3, y=0.4, s=r"$\vec{r}_2$", fontsize=16)

theta = np.linspace(0, 2*np.pi/n, 1024)
x_arc = 0.3 * np.cos(theta)
y_arc = 0.3 * np.sin(theta)
plt.plot(x_arc, y_arc, color="black")
plt.text(x=0.35, y=0.1, s=r"$u$", fontsize=16)
# plt.text(x=1, y=0.4, s="$a$", color="black", fontsize=20)
plt.axis("equal")
plt.axis("off")
plt.plot(*circle(), color="black")
plt.savefig(f"{n}_kant_innskrevet_hjelpefigur.png")

plt.show()