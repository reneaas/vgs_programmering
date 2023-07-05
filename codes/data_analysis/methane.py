import numpy as np
import matplotlib.pyplot as plt

def main():
    fname = "../../datasets/climate_data/methane_measurements.txt"

    data = np.loadtxt(fname)

    year = data[:, 0]
    ch4 = data[:, 1]
    uncertainty = data[:, 2]

    plt.plot(year, ch4, "k.")
    plt.plot(year, ch4, color="red")
    plt.xlabel("Year")
    plt.ylabel("CH$_4$ concentration (ppb)")
    plt.grid(True)
    plt.show()





if __name__ == "__main__":
    main()