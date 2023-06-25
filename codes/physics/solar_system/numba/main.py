import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
import numba
from animate import create_animation


def get_euler_cromer_fn(dt):
    def forward(r, v, a):
        v = v + a * dt
        r = r + v * dt
        return r, v
    return forward

def make_acceleration_fn(m, G=4*np.pi**2):
    @numba.njit
    def get_acceleration(r, i):
        a = np.array([0., 0., 0.])
        for j in range(r.shape[0]):
            if j != i:
                rij = r[i] - r[j]
                a -= m[j] * rij / np.dot(rij, rij)**1.5
        return G * a
    return get_acceleration
        


fname = "../../../../datasets/solar_system/solsystem_data.json"
with open(fname, "r") as infile:
    solsystem_data = json.load(infile)


num_timesteps = 100_000


r = np.zeros(shape=(num_timesteps, len(solsystem_data), 3))
v = np.zeros(shape=(num_timesteps, len(solsystem_data), 3))
m = np.zeros(shape=(len(solsystem_data),))
for i, name in enumerate(solsystem_data):
    x = solsystem_data.get(name).get("x")
    y = solsystem_data.get(name).get("y")
    z = solsystem_data.get(name).get("z")
    r[0, i, ...] = [x, y, z]

    vx = solsystem_data.get(name).get("vx")
    vy = solsystem_data.get(name).get("vy")
    vz = solsystem_data.get(name).get("vz")
    v[0, i, ...] = [vx, vy, vz]

    m[i] = solsystem_data.get(name).get("mass")

forward = get_euler_cromer_fn(dt=0.0001)
get_acceleration = make_acceleration_fn(m=m)


for t in trange(num_timesteps - 1):
    for i in range(len(solsystem_data)):
        a = get_acceleration(r[t, ...], i)
        r[t + 1, i, ...], v[t + 1, i, ...] = forward(r=r[t, i, ...], v=v[t, i, ...], a=a)



# create_animation(r[::1000, :3, :2], tail_length=50, interval=50)