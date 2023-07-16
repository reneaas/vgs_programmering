import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np


def create_images(x, y, x_cells, y_cells, skip):
    fig, ax = plt.subplots()
    plt.axis("off")
    imgs = []
    for n, (i, j) in enumerate(zip(x[::skip], y[::skip])):
        R = np.zeros(shape=(x_cells, y_cells))
        for k, l in zip(i, j):
            R[k, l] = 1

        if n == 0:
            imgs.append([ax.imshow(R.T, cmap="gray")])
        else:
            imgs.append([ax.imshow(R.T, animated=True, cmap="gray")])
    return fig, ax, imgs


def create_animation(fname, x_cells, y_cells, x, y, fps=240, skip=50):
    fig, ax, imgs = create_images(x=x, y=y, x_cells=x_cells, y_cells=y_cells, skip=skip)
    ani = animation.ArtistAnimation(fig, imgs, blit=True)
    ani.save(fname, fps=fps, writer="ffmpeg")
    plt.close()
