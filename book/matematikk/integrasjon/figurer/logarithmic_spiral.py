import numpy as np
import matplotlib.pyplot as plt
plt.style.use('ggplot')  # Use ggplot style
plt.rc('text', usetex=True) 

t = np.linspace(0, 2 * np.pi, 1001)
x = np.exp(t) * np.cos(4 * t)
y = np.exp(t) * np.sin(4 * t)

plt.plot(x, y)
plt.xlabel("x")
plt.ylabel("y")
plt.axis("equal")
plt.tight_layout()
plt.savefig("logarithmic_spiral.pdf")
