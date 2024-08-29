import numpy as np
import matplotlib.pyplot as plt

from utils import plot_graph

def f(x):
    return x**3 + 2*x**2 - x - 2

a = -3
b = 2

x = np.linspace(a, b, 1024)

fig, ax = plot_graph(x, f)

plt.ylim(-5, 5)
xticks = list(np.arange(a, b + 1, 1))
xticks.remove(0)
plt.xticks(xticks, fontsize=16)
plt.yticks([])
plt.tight_layout()
plt.savefig("halveringsmetoden_graf.png")

plt.show()
