import numpy as np
import matplotlib.pyplot as plt

plt.rc("text", usetex=True)

plt.style.use("ggplot")  # Use ggplot style

# Increase the figure size
plt.figure(figsize=(10, 7))

# Create a range of x values
x = np.linspace(1, 4, num=100)


# Define the function
# def f(x):
#     return 0.5 * x ** 2
def f(x):
    return x**2


# Calculate y values
y = f(x)

# Choose points
x_points = np.array([1, 2, 3, 4])
y_points = f(x_points)

# Define colors
dx_color = "purple"
dy_color = "red"
ds_color = "black"

# Plot the function
plt.plot(x, y, label="$f(x) = x^2$", color="blue")

# Plot the points
plt.scatter(x_points, y_points, color="red")

# Plot the segments between the points
for i in range(len(x_points) - 1):
    plt.plot(x_points[i : i + 2], y_points[i : i + 2], color=ds_color)

    # Plot Δx and Δy segments
    plt.plot(
        [x_points[i], x_points[i + 1]],
        [y_points[i], y_points[i]],
        color=dx_color,
        linestyle="dashed",
    )
    plt.plot(
        [x_points[i + 1], x_points[i + 1]],
        [y_points[i], y_points[i + 1]],
        color=dy_color,
        linestyle="dashed",
    )

    # Annotate Δx, Δy and ds
    plt.text(
        (x_points[i] + x_points[i + 1]) / 2,
        y_points[i] - 0.5,
        f"$\Delta x_{i + 1}$",
        ha="center",
        color=dx_color,
        fontsize=18,
    )
    plt.text(
        x_points[i + 1] + 0.1,
        (y_points[i] + y_points[i + 1]) / 2,
        f"$\Delta y_{i + 1}$",
        va="center",
        color=dy_color,
        fontsize=18,
    )
    plt.text(
        (x_points[i] + x_points[i + 1]) / 2,
        (y_points[i] + y_points[i + 1]) / 2 + 1,
        f"$\Delta s_{i + 1}$",
        ha="center",
        color=ds_color,
        fontsize=18,
    )

# Set labels and title
plt.xlabel("$x$", fontsize=18)
plt.ylabel("$y$", fontsize=18)
plt.xticks(fontsize=16)
plt.yticks(fontsize=16)
# plt.title("Buelengde", fontsize=16)

# Add a legend
plt.legend(fontsize=15)

# Add grid
plt.grid(True)

# Improve the layout
plt.tight_layout()

# Show the plot
plt.savefig("arc_length_illustration.pdf")
# plt.show()
