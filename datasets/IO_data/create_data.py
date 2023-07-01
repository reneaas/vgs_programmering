import numpy as np


def f(x):
    return x**2


with open("x_2.txt", "w") as outfile:
    x = 0
    outfile.write("x f(x) \n")
    for x in [0, 1, 2, 3, 4, 5]:
        outfile.write(f"{x} {f(x)} \n")
