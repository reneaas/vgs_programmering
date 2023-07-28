import numpy as np
import matplotlib.pyplot as plt
plt.style.use('ggplot')  # Use ggplot style
plt.rc('text', usetex=True) 

t = np.linspace(0, 4 * np.pi, 1001)
x = t * np.cos(t)
y = t * np.sin(t)

plt.plot(x, y)
plt.xlabel("$x$")
plt.ylabel("$y$")
plt.axis("equal")
plt.tight_layout()
plt.savefig("archimedean_spiral.pdf")
