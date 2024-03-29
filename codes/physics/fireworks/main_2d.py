import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
from matplotlib.animation import FuncAnimation
from animate import create_animation_2d


def make_gravitation_fn(m: float, g: float = 9.82) -> callable:
    def gravitation() -> np.ndarray:
        return -np.array([0, m * g])

    return gravitation


def make_drag_fn(C: float, rho_air: float, A: float) -> callable:
    def drag(v) -> np.ndarray:
        return -0.5 * C * rho_air * A * np.linalg.norm(v) * v

    return drag


def make_euler_cromer_fn(dt: float) -> callable:
    def euler_cromer_step(
        r: np.ndarray, v: np.ndarray, a: np.ndarray
    ) -> tuple[np.ndarray, np.ndarray]:
        v += a * dt
        r += v * dt
        return r, v

    return euler_cromer_step


def main(n_stars: int) -> None:
    # n_stars = 100 # Number of stars in the fireworks
    m = 0.1  # mass of each star
    g = 9.82

    angles = np.linspace(0, 2 * np.pi, n_stars + 1)  # angle of initial positions
    angles = angles[:-1]

    l = 0.1
    r = np.zeros(shape=(n_stars, 2))  # initial position of each star
    r[:, 0] = l * np.cos(angles)
    r[:, 1] = l * np.sin(angles)

    v0 = 300  # inital speed of each star
    v1 = 300  # initial speed after explosion of each star
    star_velocity = np.zeros(shape=(n_stars, 2))  # initial velocity of each star
    star_velocity = v1 * r / np.linalg.norm(r)

    radius = 20e-3  # radius of each star i meters
    area = np.pi * radius**2
    rho_air = 1.293  # density of air in kg/m^3
    gravitation = make_gravitation_fn(m=m, g=g)
    drag = make_drag_fn(C=0.47, rho_air=rho_air, A=area)
    euler_cromer_step = make_euler_cromer_fn(dt=1e-3)

    # Launch the rocket up in the air
    v = np.zeros(shape=(n_stars, 2))
    v[:, 1] = v0
    positions = [np.copy(r)]
    velocities = [np.copy(v)]
    while np.all(v[:, 1] >= 0):
        for j in range(n_stars):
            a = (gravitation() + drag(v[j])) / m
            r[j], v[j] = euler_cromer_step(r[j], v[j], a)
        positions.append(np.copy(r))
        velocities.append(np.copy(v))

    v[:] = star_velocity[:]
    while np.any(r[:, 1] >= 0):
        for j in range(n_stars):
            a = (gravitation() + drag(v[j])) / m
            r[j], v[j] = euler_cromer_step(r[j], v[j], a)
        positions.append(np.copy(r))
        velocities.append(np.copy(v))

    positions = np.array(positions)

    for j in range(positions.shape[1]):
        for i in range(positions.shape[0]):
            if positions[i, j, 1] < -l:
                x = positions[i, j, 0]
                positions[i:, j, 1] = 0
                positions[i:, j, 0] = x
                break

    ani = create_animation_2d(
        positions=positions[::100, :, :], tail_length=30, interval=1
    )

    progress_callback = lambda current_frame, total_frames: print(
        f"Lager animasjon for {n_stars = }: {current_frame / total_frames * 100:.1f}%",
        end="\r",
    )
    ani.save(
        f"./animations/fireworks_{n_stars}.gif",
        fps=60,
        progress_callback=progress_callback,
    )

    plt.close()


if __name__ == "__main__":
    # num_stars_even = [4, 6, 12, 24, 48, 96]
    # for n in num_stars_even:
    #     main(n_stars=n)

    num_stars_odd = [(2 * i + 1) ** 2 for i in range(1, 10)]
    for n in num_stars_odd:
        main(n_stars=n)
    # num_stars = [6, 10, 25, 50, 100]
    # for i in num_stars:
    #     print(f"{i = }")
    #     main(n_stars=i)
