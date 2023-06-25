import json
import numpy as np

fname = "solsystem_data.json"
with open(fname, "r") as infile:
    solsystem_data = json.load(infile)
print(solsystem_data)

with open(fname, "w") as outfile:
    json.dump(solsystem_data, outfile, indent=4)

for name in solsystem_data:
    x = solsystem_data.get(name).get("x")
    y = solsystem_data.get(name).get("y")
    z = solsystem_data.get(name).get("z")

    vx = solsystem_data.get(name).get("vx")
    vy = solsystem_data.get(name).get("vy")
    vz = solsystem_data.get(name).get("vz")


    r = [x, y, z]
    v = [vx, vy, vz]

    solsystem_data[name]["posisjon"] = r
    solsystem_data[name]["hastighet"] = v

    del solsystem_data[name]["x"]
    del solsystem_data[name]["y"]
    del solsystem_data[name]["z"]
    del solsystem_data[name]["vx"]
    del solsystem_data[name]["vy"]
    del solsystem_data[name]["vz"]

with open("solsystemdata2.json", "w") as outfile:
    json.dump(solsystem_data, outfile, indent=4)
