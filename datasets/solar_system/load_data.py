import json
import numpy as np


fname = "solsystem_posisjoner.txt"
with open(fname, "r") as infile:
    infile.readline()
    names = []
    pos = []
    for line in infile:
        line = line.split()
        names.append(line[0])
        pos.append([float(line[1]), float(line[2]), float(line[3])])
    

fname = "solsystem_hastigheter.txt"
with open(fname, "r") as infile:
    infile.readline()
    vel = []
    for line in infile:
        line = line.split()
        vel.append([float(line[1]), float(line[2]), float(line[3])])

fname = "solsystem_masser.txt"
with open(fname, "r") as infile:
    infile.readline()
    masse = []
    for line in infile:
        line = line.split()
        masse.append(float(line[1]))

solsystem_data = {}
for i in range(len(names)):
    solsystem_data[names[i]] = {
        "masse": masse[i], 
        "x": pos[i][0],
        "y": pos[i][1],
        "z": pos[i][2],
        "vx": vel[i][0],
        "vy": vel[i][1],
        "vz": vel[i][2],
    }
print(solsystem_data)


fname = "solsystem_data.json"
# with open(fname, "r") as infile:
#     solsystem_data = json.load(infile)
# print(solsystem_data)

with open(fname, "w") as outfile:
    json.dump(solsystem_data, outfile, indent=4)

# for name in solsystem_data:
#     pos = solsystem_data.get(name).get("posisjon")
#     x = pos[0]
#     y = pos[1]
#     z = pos[2]

#     vel = solsystem_data.get(name).get("hastighet")
#     vx = vel[0]
#     vy = vel[1]
#     vz = vel[2]

#     r = [x, y, z]
#     v = [vx, vy, vz]

#     solsystem_data[name]["posisjon"] = r
#     solsystem_data[name]["hastighet"] = v

# with open("solsystemdata2.json", "w") as outfile:
#     json.dump(solsystem_data, outfile, indent=4)
