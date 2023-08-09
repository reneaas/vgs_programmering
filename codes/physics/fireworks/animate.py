import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from matplotlib.colors import to_rgba_array

def create_animation_2d(positions, tail_length=10, interval=1):
    T, N, _ = positions.shape

    fig, ax = plt.subplots(figsize=(8, 5), facecolor='black')
    ax.set_facecolor('black')
    ax.grid(False)
    
    xlim = np.max(np.abs(positions[:, :, 0]))
    ylim = np.max(np.abs(positions[:, :, 1]))
    ax.set_xlim([-xlim, xlim])
    ax.set_ylim([-0.1 * ylim, 1.1 * ylim])

    # Colors
    colors = to_rgba_array(plt.cm.gist_rainbow(np.linspace(0, 1, N)))  # Use gist_rainbow colormap for neon colors

    lines = [ax.plot([], [], '-', lw=2, alpha=0.6)[0] for _ in range(N)]
    dots = [ax.plot([], [], 'o', markersize=5, color=colors[i])[0] for i in range(N)]  # Use corresponding colors for dots and larger markersize

    # Initialize tail data
    tail_data = [np.empty((0, 2)) for _ in range(N)]

    def init():
        for line, dot in zip(lines, dots):
            line.set_data([], [])
            dot.set_data([], [])
        return lines + dots

    def update(frame):
        for i, (line, dot) in enumerate(zip(lines, dots)):
            tail_data[i] = np.vstack((tail_data[i], positions[frame, i]))

            # Update line data with tail
            current_length = len(tail_data[i])
            line_data = tail_data[i][-tail_length:] if current_length > tail_length else tail_data[i]

            # Set line data
            line.set_data(line_data[:, 0], line_data[:, 1])
            line.set_color(colors[i])

            # Update dot data with current position
            x, y = positions[frame, i]
            dot.set_data(x, y)
            dot.set_color(colors[i])  # Set color to match object
            dot.set_zorder(3)  # Make sure dots appear on top

            # Reset tail data when frame is 0
            if frame == 0:
                tail_data[i] = np.empty((0, 2))

        return lines + dots

    # Add legend
    # ax.legend(dots, names, loc='upper right', facecolor='black', fontsize=10, framealpha=0.8)
    # plt.setp(plt.gca().get_legend().get_texts(), color='w')  # Set legend text color to white

    animation = FuncAnimation(
        fig, 
        update, 
        frames=T, 
        init_func=init, 
        interval=interval, 
        blit=False,
    )

    # plt.show()

    return animation


from mpl_toolkits.mplot3d import Axes3D

def create_animation_3d(positions, tail_length=10, interval=50):
    T, N, _ = positions.shape

    fig = plt.figure(figsize=(8, 5), facecolor='black')
    ax = fig.add_subplot(111, projection='3d')
    ax.set_facecolor('black')
    ax.grid(False)
    ax.set_axis_off()

    xlim = np.max(np.abs(positions[:, :, 0]))
    ylim = np.max(np.abs(positions[:, :, 1]))
    zlim = np.max(np.abs(positions[:, :, 2]))
    ax.set_xlim([-xlim, xlim])
    ax.set_ylim([-ylim, ylim])
    ax.set_zlim([-zlim, zlim])

    # Colors
    colors = to_rgba_array(plt.cm.gist_rainbow(np.linspace(0, 1, N)))  # Use gist_rainbow colormap for neon colors

    lines = [ax.plot([], [], [], '-', lw=2, alpha=0.6)[0] for _ in range(N)]
    dots = [ax.plot([], [], [], 'o', markersize=5, color=colors[i])[0] for i in range(N)]  # Use corresponding colors for dots

    # Initialize tail data
    tail_data = [np.empty((0, 3)) for _ in range(N)]

    def init():
        for line, dot in zip(lines, dots):
            line.set_data([], [])
            line.set_3d_properties([])
            dot.set_data([], [])
            dot.set_3d_properties([])
        return lines + dots

    def update(frame):
        # Rotate the perspective
        # ax.view_init(30, 0.3 * frame)
        ax.view_init(elev=20, azim=180)  # Adjust the elev parameter to view from below

        for i, (line, dot) in enumerate(zip(lines, dots)):
            tail_data[i] = np.vstack((tail_data[i], positions[frame, i]))

            # Update line data with tail
            line_data = tail_data[i][-tail_length:] # Now using constant tail length

            # Set line data
            line.set_data(line_data[:, 0], line_data[:, 1])
            line.set_3d_properties(line_data[:, 2])
            line.set_color(colors[i])

            # Update dot data with current position
            x, y, z = positions[frame, i]
            dot.set_data(x, y)
            dot.set_3d_properties(z)
            dot.set_color(colors[i])  # Set color to match object
            dot.set_zorder(3)  # Bring dots to front

        return lines + dots


    progress_callback = lambda current_frame, total_frames: print(f"Progress: {current_frame / total_frames * 100:.2f}%")
    animation = FuncAnimation(
        fig, 
        update, 
        frames=T, 
        init_func=init, 
        interval=interval, 
        blit=False,
        repeat=True,
        repeat_delay=8,
    )

    # animation = FuncAnimation(fig, update, frames=T, init_func=init, interval=interval, blit=False, repeat=True, repeat_delay=8)

    # plt.show()

    return animation


if __name__ == "__main__":
    N = 2
    T = 100_000
    theta = np.linspace(0, 10*np.pi, T)
    positions = np.zeros(shape=(T, N, 2))
    positions[:, 0, 0] = np.cos(theta)
    positions[:, 0, 1] = np.sin(theta)

    positions[:, 1, 0] = np.cos(theta) + 0.5*np.cos(2*theta)
    positions[:, 1, 1] = np.sin(theta) + 0.5*np.sin(2*theta)


    ani = create_animation_2d(positions[::50, ...], tail_length=100)
