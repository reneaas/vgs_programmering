import numpy as np
import matplotlib.pyplot as plt
plt.style.use('ggplot')  # Use ggplot style
plt.rc('text', usetex=True) 

t = np.linspace(0, 2 * np.pi, 1001)
x = np.cos(t)**3
y = np.sin(t)**3

plt.plot(x, y)
plt.xlabel("x")
plt.ylabel("y")
plt.axis("equal")
plt.tight_layout()
plt.savefig("astroid.pdf")
