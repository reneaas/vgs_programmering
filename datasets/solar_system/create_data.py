
# posisjoner er i km
# hastigheter er i km/s
# data er fra 17.juli 2023 
solar_mass = 1988500e24


data = {
    "sun": {
        "mass": 1988500e24,
        "x": -1.293732955014497E+06,
        "y": -2.399292652066420E+05,
        "z": 3.212377730124180E+04,
        "vx": 5.334507481455449E-03,
        "vy": -1.429098003547809E-02,
        "vz": -1.061893923981830E-06,
    },
    "mercury": {
        "mass": 3.302e23,
        "x": -5.904783610298202E+07,
        "y": -2.242854729792224E+05,
        "z": 5.330871913842393E+06,
        "vx": -1.014174551538922E+01,
        "vy": -4.663576765439169E+01,
        "vz": -2.879197793265885E+00,
    },
    "venus": {
        "mass": 48.685e23,
        "x": 1.141523662900143E+07,
        "y": -1.082810786509850E+08,
        "z": -2.184572298448771E+06,
        "vx": 3.455140345884551E+01,
        "vy": 3.953298084897579E+00,
        "vz": -1.938921287931780E+00,
    },
    "earth": {
        "mass": 5.97219e24,
        "x": 6.025514429036590E+07,
        "y": -1.392828686316265E+08,
        "z": 3.868484179145843E+04,
        "vx": 2.677167643624570E+01,
        "vy": 1.193310510281090E+01,
        "vz": -1.053354132984019E-03,
    },
    "mars": {
        "mass": 6.4171e23,
        "x": -2.484074480503470E+08,
        "y": 1.356731340210890E+07,
        "z": 6.383106976438502E+06,
        "vx": -4.425236189582767E-01,
        "vy": -2.213774550520064E+01,
        "vz": -4.526784765366898E-01,
    },
    "jupiter": {
        "mass": 1.898e27,
        "x": 6.396835210924487E+08,
        "y": 3.732560987311267E+08,
        "z": -1.586005045314974E+07,
        "vx": -6.730271353198785E+00,
        "vy": 1.190178726109835E+01,
        "vz": 1.012252494576211E-01,
    },
    "saturn": {
        "mass": 5.6834e26,
        "x": 1.292833341866447E+09,
        "y": -6.829461339885111E+08,
        "z": -3.959914700481319E+07,
        "vx": 3.971290641287716E+00,
        "vy": 8.523507919657888E+00,
        "vz": -3.068299672185577E-01,
    },
    "uranus": {
        "mass": 86.813e24,
        "x": 1.911343546738385E+09,
        "y": 2.229978237123985E+09,
        "z": -1.647961769467485E+07,
        "vx": -5.220670893725517E+00,
        "vy": 4.114561301535408E+00,
        "vz": 8.309935039857375E-02,
    },
    "neptune": {
        "mass": 102.409e24,
        "x": 4.458343105015861E+09,
        "y": -3.475239746291955E+08,
        "z": -9.559043823025320E+07,
        "vx": 3.870534392702127E-01,
        "vy": 5.451389005185774E+00,
        "vz": -1.213751673017687E-01,
    },
    "pluto": {
        "mass": 1.307e22,
        "x": 2.502458811527272E+09,
        "y": -4.560188211090598E+09,
        "z": -2.358913851242347E+08,
        "vx": 4.915991107078506E+00,
        "vy": 1.427386214832920E+00,
        "vz": -1.591730481728704E+00,
    },
}

km_per_au = 1.496e+8
seconds_per_year = 365.25 * 24 * 60 * 60

for planet in data:
    data[planet]["x"] /= km_per_au
    data[planet]["y"] /= km_per_au
    data[planet]["z"] /= km_per_au

    data[planet]["vx"] /= km_per_au
    data[planet]["vy"] /= km_per_au
    data[planet]["vz"] /= km_per_au

    data[planet]["vx"] *= seconds_per_year
    data[planet]["vy"] *= seconds_per_year
    data[planet]["vz"] *= seconds_per_year

    data[planet]["mass"] /= solar_mass

print(data)

M = sum([data.get(planet).get("mass") for planet in data])
print(M)


fname = "solsystem_masser.txt"
with open(fname, "w") as outfile:
    outfile.write("navn masse\n")
    for planet in data:
        outfile.write(f"{planet} {data.get(planet).get('mass')}")
        outfile.write("\n")


fname = "solsystem_posisjoner.txt"
with open(fname, "w") as outfile:
    outfile.write("navn x y z\n")
    for planet in data:
        x = data.get(planet).get("x")
        y = data.get(planet).get("y")
        z = data.get(planet).get("z")
        outfile.write(f"{planet} {x} {y} {z}")
        outfile.write("\n")

fname = "solsystem_hastigheter.txt"
with open(fname, "w") as outfile:
    outfile.write("navn vx vy vz\n")
    for planet in data:
        vx = data.get(planet).get("vx")
        vy = data.get(planet).get("vy")
        vz = data.get(planet).get("vz")
        outfile.write(f"{planet} {vx} {vy} {vz}")
        outfile.write("\n")

        


 