import numpy as np
import matplotlib.pyplot as plt
plt.style.use('ggplot')  # Use ggplot style

def f(x):
    return 2.5 * x**3 - 34.7 * x**2 + 120 * x + 530

x = np.linspace(0, 10, 1001)
y = f(x)

plt.plot(x, y)
plt.xlabel("x [km]")
plt.ylabel("y [m]")
# plt.axis("equal")
plt.tight_layout()
plt.savefig("ski_race.pdf")
plt.show()
