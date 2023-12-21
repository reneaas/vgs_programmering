import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

def create_animation(array_list, interval=1):
    """
    Create an animation from a list of 2D arrays.

    Parameters:
    - array_list: A list of 2D numpy arrays.
    - interval: Time interval between frames in milliseconds.

    Returns:
    - anim: The created animation object.
    """

    # Initialize the plot
    fig, ax = plt.subplots()

    def animate(i):
        ax.clear()
        ax.imshow(array_list[i])
        return ax

    # Create the animation
    anim = animation.FuncAnimation(fig, animate, frames=len(array_list), interval=interval)

    return anim

# Example usage:
# array_list = [np.random.rand(10, 10) for _ in range(5)]
# anim = create_animation(array_list)
# To display the animation in a Jupyter notebook: anim
# To save the animation: anim.save('animation.mp4', writer='ffmpeg')



def f(x, y, t):
    return (
        np.exp(-((x - 0.4)**2 + (y - 0.2)**2) / 0.01**2) * np.sin(2 * np.pi * 5 * t)
        + np.exp(-((x - 0.6)**2 + (y - 0.2)**2) / 0.01**2) * np.sin(2 * np.pi * 5 * (t - 0.1))
    )

def next_state(
        u_prev: np.ndarray, 
        u: np.ndarray, 
        c: float, 
        dt: float, 
        dx: float, 
        dy: float,
        f: np.ndarray,
    ) -> np.ndarray:
    rx = c * dt / dx
    ry = c * dt / dy
    nx, ny = u.shape
    u_next = np.zeros((nx, ny))
    u_next[1:-1, 1:-1] = (
        - u_prev[1:-1, 1:-1] + 2 * u[1:-1, 1:-1]
        + rx**2 * (u[2:, 1:-1] - 2 * u[1:-1, 1:-1] + u[:-2, 1:-1])
        + ry**2 * (u[1:-1, 2:] - 2 * u[1:-1, 1:-1] + u[1:-1, :-2]) + dt**2 / c**2 * f[1:-1, 1:-1]
    )
    return u_next


nx = 100
ny = 100
dx = 1 / (nx - 1)
dy = 1 / (ny - 1)
dt = 0.001
c = 1
x = np.linspace(0, 1, nx)
y = np.linspace(0, 1, ny)

x, y = np.meshgrid(x, y)


u = np.zeros((nx, ny))
u_prev = np.zeros((nx, ny))
u_list = []
t = 0
for i in range(10000):

    u_next = next_state(u_prev, u, c, dt, dx, dy, f(x, y, t))
    u_list.append(u_next)
    u_prev = u
    u = u_next
    t += dt
plt.imshow(u.T, cmap='gray')
plt.show()


plt.imshow(f(x, y, t), cmap='gray')
plt.show()

ani = create_animation([u.T for u in u_list[::10]])
plt.show()