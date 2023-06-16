import json

fname = "solsystem_data.json"
with open(fname, "r") as infile:
    solsystem_data = json.load(infile)
print(solsystem_data)

