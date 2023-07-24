import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from matplotlib.patches import Arc, Circle
plt.rc("text", usetex=True)

# Amount of digits (plus the trailing dots)
n = 55

# Create the figure and axis
fig, ax = plt.subplots(figsize=(10, 8))

# Set the figure background color
fig.patch.set_facecolor('black')

# Create a colormap
colors = plt.cm.RdYlBu(np.linspace(0, 1, n))

# The digits of pi with trailing dots
pi_digits = '3.14159265358979323846264338327950288419716939937510...'

# Draw a radial gradient as the background
for i in range(100):
    circle = Circle((0, 0), i / 100, color=plt.cm.Blues(i / 100), alpha=0.05)
    ax.add_artist(circle)

# For each character, calculate the position and add the text to the plot
for i in range(n):
    angle = -i * 360 / n  # Negative sign for clockwise
    x = 0.9 * np.cos(np.radians(angle))
    y = 0.9 * np.sin(np.radians(angle))
    ax.text(x, y, pi_digits[i], fontsize=20, ha='center', va='center', color=colors[i])

# Draw a circle with gradient color
for i in range(n):
    angle_start = -i * 360 / n  # Negative sign for clockwise
    angle_end = -(i + 1) * 360 / n  # Negative sign for clockwise
    arc = Arc((0, 0), 2, 2, theta1=min(angle_start, angle_end), theta2=max(angle_start, angle_end), color=colors[i], lw=2)
    ax.add_artist(arc)

# Add a filled circle in the middle
circle = Circle((0, 0), 0.8, color=plt.cm.Blues(0.5), alpha=0.5)
ax.add_artist(circle)

# Add pi to the center
ax.text(0, 0, '$\pi$', color='black', fontsize=150, ha='center', va='center')

# Add a title
plt.title('En $\pi$-kake', fontsize=24, color='white')

# Make it pretty
ax.axis('off')  # Turn off the axis
ax.set_xlim(-1.2, 1.2)
ax.set_ylim(-1.2, 1.2)
ax.set_aspect('equal', 'box')

# Set the plot background color
ax.set_facecolor('black')
plt.savefig("./figures/pi_cake.pdf")
plt.show()
