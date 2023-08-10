import numpy as np
from tqdm import trange
import matplotlib.pyplot as plt
import numba


def make_drag_force_fn(drag_coeff: float, density: float, area: float) -> callable:
    def drag_force_fn(v: np.ndarray) -> np.ndarray:
        v_norm = np.linalg.norm(v)
        return -0.5 * drag_coeff * density * area * v_norm * v

    return drag_force_fn


def make_gravity_force_fn(g: float = 9.81) -> callable:
    def gravity_force_fn(m: float) -> np.ndarray:
        return np.array([0, -m * g])

    return gravity_force_fn


def make_force_fn(
    drag_coeff: float, density: float, area: float, m: float, g: float = 9.82
) -> callable:
    drag_force_fn = make_drag_force_fn(drag_coeff, density, area)
    gravity_force_fn = make_gravity_force_fn(g)

    def force_fn(v: np.ndarray) -> np.ndarray:
        return drag_force_fn(v) + gravity_force_fn(m)

    return force_fn


def make_euler_step_fn(force_fn: callable, m: float, dt: float) -> callable:
    def euler_step_fn(r: np.ndarray, v: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        a = force_fn(v) / m
        v = v + a * dt
        r = r + v * dt
        return r, v

    return euler_step_fn


def simulate_energy(init_angle: float) -> float:
    m = 7.5 / 1000  # 7.5 grams in kg
    v0 = 450  # initial velocity in m/s
    diameter = 9e-3  # 9 mm in m
    radius = 0.5 * diameter  # radius in m
    drag_coeff = 0.3  # Typical drag coefficient for a bullet
    density = 1.225  # density of air in kg/m^3
    area = np.pi * radius**2  # cross-sectional area of bullet in m^2

    force_fn = make_force_fn(drag_coeff, density, area, m)
    # force_fn = numba.njit(force_fn)

    # Set initial conditions
    init_angle = np.deg2rad(init_angle)
    v = v0 * np.array([np.cos(init_angle), np.sin(init_angle)])  # initial velocity
    r = np.array([0, 2])  # inital position 2 meters above the ground

    num_timesteps = 100_000
    dt = 0.001
    euler_step_fn = make_euler_step_fn(force_fn, m, dt)

    pos = np.zeros(shape=(num_timesteps, 2))
    vel = np.zeros(shape=(num_timesteps, 2))
    pos[0] = r
    vel[0] = v

    i = 0
    while r[1] >= 0:
        r, v = euler_step_fn(r, v)
        pos[i] = r
        vel[i] = v
        i += 1

    # Calculate energies
    kinetic_energy = 0.5 * m * np.linalg.norm(vel, axis=1) ** 2
    potential_energy = m * 9.81 * pos[:, 1]
    total_energy = kinetic_energy + potential_energy

    final_energy = total_energy[i - 1]
    return final_energy


if __name__ == "__main__":
    angles = np.linspace(0, 90, 100)
    energies = np.zeros_like(angles)
    for i, angle in enumerate(angles):
        energies[i] = simulate_energy(angle)

    plt.plot(angles, energies)
    plt.xlabel("Initial angle [deg]")
    plt.ylabel("Total energy [J]")
    plt.show()
