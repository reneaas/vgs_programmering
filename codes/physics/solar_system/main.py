import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
from animate import create_animation

fname = "../../../datasets/solar_system/solsystem_data.json"
with open(fname, "r") as infile:
    solsystem_data = json.load(infile)
# print(solsystem_data)

n_timesteps = 100_000  
positions = np.zeros(shape=(n_timesteps, len(solsystem_data), 3))
velocities = np.zeros(shape=(n_timesteps, len(solsystem_data), 3))
G = 4 * np.pi**2

r = np.zeros(shape=(len(solsystem_data), 3))
v = np.zeros(shape=(len(solsystem_data), 3))
m = np.zeros(len(solsystem_data))

for i, name in enumerate(solsystem_data):
    r[i, 0] = solsystem_data.get(name).get("x")
    r[i, 1] = solsystem_data.get(name).get("y")
    r[i, 2] = solsystem_data.get(name).get("z")
    v[i, 0] = solsystem_data.get(name).get("vx")
    v[i, 1] = solsystem_data.get(name).get("vy")
    v[i, 2] = solsystem_data.get(name).get("vz")
    m[i] = solsystem_data.get(name).get("mass")


def get_acceleration(r, m, i):
    a = np.zeros(3)
    for j in range(r.shape[0]):
        if i != j:
            a -= G * m[j] * (r[i] - r[j]) / np.linalg.norm(r[i] - r[j])**3
    return a



def make_euler_cromer_fn(dt):
    def forward(r, v, a):
        v = v + a * dt
        r = r + v * dt
        return r, v

    return forward


def make_verlet_fn(dt):
    def forward(r, v, a, j):
        r = r + v * dt + 0.5 * a * dt**2
        a_new = get_acceleration(r, m, i)
        v = v + 0.5 * (a + a_new) * dt
        return r, v

    return forward


forward = make_euler_cromer_fn(dt=0.00001)
# forward = make_verlet_fn(dt=0.001)

num_timesteps = 100_000

for i in trange(num_timesteps - 1):
    for j in range(r.shape[0]):
        a = get_acceleration(r, m, j)
        positions[i + 1, j], velocities[i + 1, j] = forward(r[j], v[j], a)
    

    for j in range(r.shape[0]):
        r[j] = positions[i + 1, j]
        v[j] = velocities[i + 1, j]
    



# print(positions.shape)
# print(positions[::50, ..., :2].shape)

create_animation(positions[::50, :4, :2], tail_length=10)



