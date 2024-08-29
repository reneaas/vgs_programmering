import numpy as np
import matplotlib.pyplot as plt

from utils import plot_graph

def f(x):
    return x**4 + x**3 - 7 * x**2 - x + 6

a = -4
b = 4

x = np.linspace(a, b, 1024)

fig, ax = plot_graph(x, f)

plt.ylim(-15, 20)
xticks = list(np.arange(a, b + 1, 1))
xticks.remove(0)
plt.xticks(xticks, fontsize=16)
plt.yticks([])

plt.savefig("fjerdegradsfunksjon.png")

plt.show()
