import numpy as np
import matplotlib.pyplot as plt

from utils import plot_graph


def f(x):
    return x**3 + 2*x**2 - x

def make_secant(a, b):
    def secant(x):
        return (f(b) - f(a)) / (b - a) * (x - a) + f(a)
    return secant

a = -3
b = 2

x = np.linspace(a, b, 1024)

fig, ax = plot_graph(x, f)

plt.ylim(-5, 5)

x0 = -2.5
h = 1

secant = make_secant(x0, x0 + h)
plt.plot(x, secant(x), color="blue", lw=1, alpha=0.7)
xticks = list(np.arange(a, b + 1, 1))
xticks.remove(0)
plt.xticks(xticks, fontsize=16)
plt.yticks([])
plt.tight_layout()
plt.savefig("den_deriverte.png")

plt.show()