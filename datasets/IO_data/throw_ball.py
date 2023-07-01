import numpy as np


x = 0
y = 1 # 1 meter over bakken ved start

v_x = 5 # m/s
v_y = 15 # m/s

a_x = 0 # m/s^2
a_y = -9.81 # m/s^2

dt = 0.01 # s

t = 0 # s

with open("ball.txt", "w") as outfile:
    outfile.write("t x y \n")
    while y >= 0:
        outfile.write(f"{t :.2f} {x :.2f} {y :.2f} \n")
        x += v_x*dt
        y += v_y*dt
        
        v_x += a_x*dt
        v_y += a_y*dt
        
        t += dt



print(f"Ballen lander etter {t:.2f} sekunder.")