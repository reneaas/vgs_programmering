import json
import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
from animate import create_animation

fname = "../../../datasets/solar_system/solsystem_data.json"
with open(fname, "r") as infile:
    solsystem_data = json.load(infile)
# print(solsystem_data)

n_timesteps = 1_00000  
positions = np.zeros(shape=(n_timesteps, len(solsystem_data), 3))
G = 4 * np.pi**2


def make_get_force_fn(solsystem_data):
    def get_force(name, i):
        F_x = 0
        F_y = 0
        F_z = 0
        for j, name_ in enumerate(solsystem_data):
            if j != i:
                xi = solsystem_data.get(name).get("x")
                yi = solsystem_data.get(name).get("y")
                zi = solsystem_data.get(name).get("z")
                xj = solsystem_data.get(name_).get("x")
                yj = solsystem_data.get(name_).get("y")
                zj = solsystem_data.get(name_).get("z")

                r = ((xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2) ** 0.5
                mi = solsystem_data.get(name).get("mass")
                mj = solsystem_data.get(name_).get("mass")

                F = G * mi * mj / r**2
                F_x -= F * (xi - xj) / r
                F_y -= F * (yi - yj) / r
                F_z -= F * (zi - zj) / r

        return F_x, F_y, F_z

    return get_force


def make_euler_cromer_fn(dt):
    def forward(r, v, a):
        v = v + a * dt
        r = r + v * dt
        return r, v

    return forward


get_force = make_get_force_fn(solsystem_data)
forward = make_euler_cromer_fn(dt=0.000001)

for t in trange(n_timesteps - 1):
    for i, name1 in enumerate(solsystem_data):
        F_x, F_y, F_z = get_force(name1, i)
        m = solsystem_data.get(name1).get("mass")
        a_x = F_x / m
        a_y = F_y / m
        a_z = F_z / m

        x, y, z = (
            solsystem_data.get(name1).get("x"),
            solsystem_data.get(name1).get("y"),
            solsystem_data.get(name1).get("z"),
        )
        v_x, v_y, v_z = (
            solsystem_data.get(name1).get("vx"),
            solsystem_data.get(name1).get("vy"),
            solsystem_data.get(name1).get("vz"),
        )

        r = np.array([x, y, z])
        positions[t, i, :] = r
        v = np.array([v_x, v_y, v_z])
        a = np.array([a_x, a_y, a_z])
        r, v = forward(r, v, a)
        solsystem_data.get(name1)["x"] = r[0]
        solsystem_data.get(name1)["y"] = r[1]
        solsystem_data.get(name1)["z"] = r[2]
        solsystem_data.get(name1)["vx"] = v[0]
        solsystem_data.get(name1)["vy"] = v[1]
        solsystem_data.get(name1)["vz"] = v[2]

print(positions.shape)
print(positions[::50, ..., :2].shape)

create_animation(positions[::50, ..., :2], tail_length=10)


# for i, name1 in enumerate(solsystem_data):
#     for j, name2 in enumerate(solsystem_data):
#         if i != j:
#             x1 = solsystem_data.get(name1).get("x")
#             y1 = solsystem_data.get(name1).get("y")
#             z1 = solsystem_data.get(name1).get("z")
#             x2 = solsystem_data.get(name2).get("x")
#             y2 = solsystem_data.get(name2).get("y")
#             z2 = solsystem_data.get(name2).get("z")

#             r = ((x1 - x2)**2 + (y1 - y2)**2 + (z1 - z2)**2)**0.5
#             m1 = solsystem_data.get(name1).get("mass")
#             m2 = solsystem_data.get(name2).get("mass")
