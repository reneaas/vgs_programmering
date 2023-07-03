import numpy as np
import matplotlib.pyplot as plt

filnavn = "../../datasets/climate_data/global_temperatures.txt"

år = []
temperaturavvik = []
temperaturavvik_smooth = []
n_hopp = 5  # Fem tommer linjer.

with open(filnavn, "r") as infile:
    for _ in range(n_hopp):
        infile.readline()

    for linje in infile:
        verdier = linje.split()

        år.append(float(verdier[0]))
        temperaturavvik.append(float(verdier[1]))
        temperaturavvik_smooth.append(float(verdier[-1]))

# Visualiserer dataene
plt.plot(år, temperaturavvik, color="purple", alpha=0.5, label="Rådata")
plt.plot(år, temperaturavvik_smooth, color="red", label="Glattet kurve")
plt.xlabel("År")
plt.ylabel("Temperaturavvik [°C]")
plt.grid(True)
plt.legend()
plt.show()


gjennomsnitt_stigning = 0
gjennomsnitt_stigning_smooth = 0
 
stigning_per_år = []
stinings_smooth_per_år = []

for i in range(len(år) - 1):
    stigning = (temperaturavvik[i + 1] - temperaturavvik[i]) / (år[i + 1] - år[i])
    gjennomsnitt_stigning += stigning

    stigning_per_år.append(stigning)

    stigning_smooth = (temperaturavvik_smooth[i + 1] - temperaturavvik_smooth[i]) / (
        år[i + 1] - år[i]
    )
    gjennomsnitt_stigning_smooth += stigning_smooth

    stinings_smooth_per_år.append(stigning_smooth)

gjennomsnitt_stigning /= len(år) - 1
gjennomsnitt_stigning_smooth /= len(år) - 1

print(f"{gjennomsnitt_stigning = :.5f} °C/år")
print(f"{gjennomsnitt_stigning_smooth = :.5f} °C/år")


plt.plot(år[:-1], stigning_per_år, color="purple", alpha=0.5, label="Rådata")
plt.plot(år[:-1], stinings_smooth_per_år, color="red", label="Glattet kurve")
plt.xlabel("År")
plt.ylabel("Stigning [°C/år]")
plt.grid(True)
plt.legend()
plt.show()


current_temp = temperaturavvik[-1]
current_temp_smooth = temperaturavvik_smooth[-1]
current_year = år[-1]
while current_temp < 2.0:
    current_temp += gjennomsnitt_stigning
    current_temp_smooth += gjennomsnitt_stigning_smooth
    current_year += 1

print(f"{current_year = }")

