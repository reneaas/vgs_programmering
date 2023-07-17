import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
from animate import create_animation
import numba


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



def make_verlet_fn(acceleration_fn: callable, dt: int) -> callable:
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
    # print(solsystem_data)

    num_timesteps = 1000_0
    positions = np.zeros(shape=(num_timesteps, len(solsystem_data), 3))
    velocities = np.zeros(shape=(num_timesteps, len(solsystem_data), 3))
    G = 4 * np.pi**2

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
    
    return r, v, m



num_timesteps = 100_000
dt = 1e-4

r, v, m = get_data()
print(r)

positions = np.zeros(shape=(num_timesteps, len(r), 3))
velocities = np.zeros_like(positions)

positions[0, ...] = r[:]
velocities[0, ...] = v[:]

# Make necessary functions
get_acceleration_fn = make_acceleration_fn(G=4 * np.pi**2)
forward = make_verlet_fn(acceleration_fn=get_acceleration_fn, dt=dt)
get_potential_energy_fn = make_potential_energy_fn(m=m, G=4 * np.pi**2)
get_kinetic_energy_fn = make_kinetic_energy_fn(m=m)

energies = np.zeros(shape=num_timesteps)

energies[0] = get_kinetic_energy_fn(v=v) + get_potential_energy_fn(r=r)
for t in trange(num_timesteps - 1):

    # Calculate energy at current timestep
    energies[t] = get_kinetic_energy_fn(v=v) + get_potential_energy_fn(r=r)

    # Calculate next positions
    r, v = forward(r=r, v=v, m=m)

    # Store positions
    positions[t + 1, ...] = r[:]
    velocities[t + 1, ...] = v[:]


    



# print(positions.shape)
# print(positions[::50, ..., :2].shape)

plt.plot([t * dt for t in range(len(positions))], energies)
plt.show()

create_animation(positions[::100, :6, :2], tail_length=30)



