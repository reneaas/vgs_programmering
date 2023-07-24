import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
from animate import create_animation_2d, create_animation_3d
import numba
import matplotlib.animation as animation


def make_acceleration_fn(G: float = 4 * np.pi**2) -> callable:
    def get_acceleration_fn(r, m, i) -> np.ndarray:
        a = np.zeros(3)
        for j in range(r.shape[0]):
            if i != j:
                dr = r[i] - r[j]
                dr_norm = np.linalg.norm(dr)
                a -= m[j] * dr / dr_norm**3

        a *= G
        return a
    return get_acceleration_fn


def make_potential_energy_fn(m: np.ndarray, G: float = 4 * np.pi**2) -> callable:
    def get_potential_energy_fn(r) -> float:
        potential_energy = 0
        for i in range(len(r)):
            for j in range(len(r)):
                if i != j:
                    dr = r[i] - r[j]
                    dr_norm = np.linalg.norm(dr)
                    potential_energy -= m[i] * m[j] / dr_norm
        
        potential_energy *= G
        return potential_energy

    return get_potential_energy_fn
    
def make_kinetic_energy_fn(m: np.ndarray) -> callable:
    def get_kinetic_energy_fn(v) -> float:
        v_norm = np.linalg.norm(v**2, axis=1)
        kinetic_energy = 0.5 * np.linalg.norm(m * v_norm)
        
        return kinetic_energy
    
    return get_kinetic_energy_fn


def make_euler_cromer_fn(acceleration_fn: callable, dt: float) -> callable:
    def forward(r, v, m) -> tuple[np.ndarray]:
        a = np.zeros(shape=r.shape)
        for i in range(len(r)):
            a[i] = acceleration_fn(r=r, m=m, i=i)

        v = v + a * dt
        r = r + v * dt

        return r, v

    return forward

def make_verlet_fn(acceleration_fn: callable, dt: float) -> callable:
    def forward(r, v, m) -> tuple[np.ndarray]:

        # First step in velocity Verlet.
        a_old = np.zeros(shape=r.shape)
        for i in range(len(r)):
            a_old[i] = acceleration_fn(r=r, m=m, i=i)
        
        r = r + v * dt + 0.5 * a_old * dt**2

        # Second setop in velocity Verlet
        a_new = np.zeros(shape=r.shape)
        for i in range(len(r)):
            a_new[i] = acceleration_fn(r=r, m=m, i=i)
        
        v = v + 0.5 * (a_old + a_new) * dt

        return r, v
    
    return forward


def get_data() -> tuple[np.ndarray]:
    fname = "../../../datasets/solar_system/solsystem_data.json"
    with open(fname, "r") as infile:
        solsystem_data = json.load(infile)

    r = np.zeros(shape=(len(solsystem_data), 3))
    v = np.zeros(shape=(len(solsystem_data), 3))
    m = np.zeros(shape=len(solsystem_data))

    for i, name in enumerate(solsystem_data):
        r[i, 0] = solsystem_data.get(name).get("x")
        r[i, 1] = solsystem_data.get(name).get("y")
        r[i, 2] = solsystem_data.get(name).get("z")
        v[i, 0] = solsystem_data.get(name).get("vx")
        v[i, 1] = solsystem_data.get(name).get("vy")
        v[i, 2] = solsystem_data.get(name).get("vz")
        m[i] = solsystem_data.get(name).get("masse")

    names = list(solsystem_data.keys())
    return r, v, m, names


def get_data_three_body() -> tuple[np.ndarray]:
    solar_mass = 2e30
    mars_mass = 0.6e24
    earth_mass = 6e24
    names = ["planet", "lett stjerne", "tung stjerne"]

    m = np.array([earth_mass, solar_mass, 4 * solar_mass]) / solar_mass
    r = np.array([[-1.5, 0, 0], [0, 0, 0], [3, 0, 0]])
    v = np.array([[0, -1, 0], [0, 30, 0], [0, -7.5, 0]])

    au_per_km = 6.68459e-9
    seconds_per_year = 365.25 * 24 * 60 * 60
    v *= au_per_km * seconds_per_year

    return r, v, m, names

def main(num_timesteps: int, dt: float):

    r, v, m, names = get_data()
    # r, v, m, names = get_data_three_body()

    positions = np.zeros(shape=(num_timesteps, len(r), 3))
    velocities = np.zeros_like(positions)

    positions[0, ...] = r[:]
    velocities[0, ...] = v[:]

    # Make necessary functions
    # Acceleration function
    get_acceleration_fn = make_acceleration_fn(G=4 * np.pi**2)
    get_acceleration_fn = numba.njit(get_acceleration_fn)

    # Forward function
    # forward = make_verlet_fn(acceleration_fn=get_acceleration_fn, dt=dt)
    forward = make_euler_cromer_fn(acceleration_fn=get_acceleration_fn, dt=dt)
    forward = numba.njit(forward)

    # Energy functions
    get_potential_energy_fn = make_potential_energy_fn(m=m, G=4 * np.pi**2)
    get_potential_energy_fn = numba.njit(get_potential_energy_fn)
    get_kinetic_energy_fn = make_kinetic_energy_fn(m=m)


    # Create energy array and set initial energy
    energies = np.zeros(shape=num_timesteps)
    energies[0] = get_kinetic_energy_fn(v=v) + get_potential_energy_fn(r=r)

    # Simulate trajectories
    for t in trange(1, num_timesteps):

        # Calculate next position and velocity
        r, v = forward(r=r, v=v, m=m)

        # Calculate energy of the new state
        energies[t] = get_kinetic_energy_fn(v=v) + get_potential_energy_fn(r=r)

        # Store new state
        positions[t, ...] = r[:]
        velocities[t, ...] = v[:]

        



    # print(positions.shape)
    # print(positions[::50, ..., :2].shape)
    plt.figure(figsize=(10, 5))
    plt.plot([t * dt for t in range(len(positions))], energies)
    plt.xlabel("tid [jordår]")
    plt.ylabel(r"energi [$M_{\odot}$ AU$^2$ / år$^2$]")
    plt.grid(True)
    plt.savefig("./figures/solar_system_euler_cromer.pdf")
    # plt.savefig("./figures/energi_three_body.pdf")
    plt.show()


    # ani = create_animation_2d(positions[::500, :, :2], names=names, tail_length=30)
    # ani.save("./animations/three_body_system_2d.gif", fps=60)
    # plt.close()
    # ani = create_animation_3d(positions[::500, :, :], names=names, tail_length=30)
    # ani.save("./animations/three_body_system_3d.gif", fps=60)
    # plt.close()

    ani = create_animation_2d(positions=positions[::100, :6, :2], names=names[:6], tail_length=30)
    progress_callback = lambda current_frame, total_frames: print(f"Lager 2d-animasjon: {current_frame / total_frames * 100:.1f}%", end="\r")
    ani.save("./animations/solsystemet_2d_euler_cromer.gif", fps=60, progress_callback=progress_callback)
    plt.close()
    print("2d-animasjon ferdig: ")

    ani = create_animation_3d(positions=positions[::100, :6, :], names=names[:6], tail_length=30)
    progress_callback = lambda current_frame, total_frames: print(f"Lager 3d-animasjon: {current_frame / total_frames * 100:.1f}%", end="\r")
    ani.save("./animations/solsystemet_3d_euler_cromer.gif", fps=60, progress_callback=progress_callback)
    plt.close()
    print("3d-animasjon ferdig: ")


if __name__ == "__main__":
    main(num_timesteps=int(1e6), dt=1e-4)

