
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def create_animation(positions, tail_length=10, interval=50):
    T, N, _ = positions.shape

    fig = plt.figure()
    xlim = np.max(np.abs(positions[:, :, 0]))
    ylim = np.max(np.abs(positions[:, :, 1]))
    ax = plt.axes(xlim=(-xlim - 1, xlim + 1), ylim=(-ylim + 1, ylim - 1))
    lines = []

    for i in range(N):
        line, = ax.plot([], [], '-', alpha=0.4)
        dot, = ax.plot([], [], 'o', markersize=5)
        lines.append((line, dot))

    # Initialize tail data
    tail_data = [np.empty((0, 2)) for _ in range(N)]

    def update(frame):
        for i in range(N):
            tail_data[i] = np.vstack((tail_data[i], positions[frame, i]))

            # Update line data with tail
            lines[i][0].set_data(tail_data[i][-tail_length:, 0], tail_data[i][-tail_length:, 1])

            # Update dot data with current position
            lines[i][1].set_data(positions[frame, i, 0], positions[frame, i, 1])

    animation = FuncAnimation(fig, update, frames=T, interval=interval, blit=False)
    plt.show()






if __name__ == "__main__":
    N = 2
    T = 100_000
    theta = np.linspace(0, 10*np.pi, T)
    positions = np.zeros(shape=(T, N, 2))
    positions[:, 0, 0] = np.cos(theta)
    positions[:, 0, 1] = np.sin(theta)

    positions[:, 1, 0] = np.cos(theta) + 0.5*np.cos(2*theta)
    positions[:, 1, 1] = np.sin(theta) + 0.5*np.sin(2*theta)


    create_animation(positions[::100, ...], tail_length=10)
