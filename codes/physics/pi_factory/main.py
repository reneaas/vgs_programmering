import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from tqdm import trange
import numba
import time

from animate import create_animation

# @numba.njit
def kollisjon(v, V, m, M):
    v_neste = (m - M) / (m + M) * v + 2*M / (m + M) * V
    V_neste = 2*m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste


# @numba.njit
def simuler_kollisjoner(v, V, m, M, dt=0.001, x_init=10, X_init=50, x_extent=0.5, X_extent=1.5, skip_frames=50_000):
    """Simulerer kollisjoner mellom en kloss med masse m og en kloss med masse M,
    der klossene har hastighetene v og V ved start. 

    Argumenter:
        v: Hastighet til liten kloss ved start.
        V: Hastighet til stor kloss ved start.
        m: Masse til liten kloss.
        M: Masse til stor kloss.
        dt: Tidssteg for simuleringen. Default: 0.001
    
    Returnerer:
        antall_kollisjoner: Antall kollisjoner som har skjedd i løpet av simuleringen.
    """
    x = x_init # startposisjon til liten kloss
    X = X_init # startposisjon til stor kloss.
    antall_kollisjoner = 0
    cum_kollisjoner = []
    x_pos = [x]
    X_pos = [X]
    collision_events = []

    while True: # Kjører helt til vi manuelt bryter ut av løkken med `break`.
        # Sjekk om liten kloss treffer veggen og oppdater hastighet hvis den gjør det.
        if x - 0.5 * x_extent <= 0: # når x + x_extent < 0, har den lille klossen gått inn i veggen, så vi må snu den rundt! 
            v = -v # Klossen reflekterer av veggen!
            antall_kollisjoner += 1
            collision_events.append(True)


        # Sjekk om liten kloss og stor kloss kolliderer og oppdater hastighetene hvis de gjør det.
        if X - 0.5 * X_extent <= x + 0.5 * x_extent: # Dersom X < x, har stor kloss passert gjennom liten kloss. Dette er en kollisjon!
            v, V = kollisjon(v, V, m, M)
            antall_kollisjoner += 1
            collision_events.append(True)
        else:
            collision_events.append(False)

        cum_kollisjoner.append(antall_kollisjoner)

        if v >= 0 and V >= 0 and V >= v: # Klossene kan aldri lenger treffe hverandre. Vi avslutter simuleringen.
            for _ in range(skip_frames):
                x_pos.append(x)
                X_pos.append(X)
                x = x + v * dt # Oppdater posisjon til liten kloss.
                X = X + V * dt # Oppdater posisjonen til stor kloss.
                cum_kollisjoner.append(antall_kollisjoner)
                collision_events.append(False)
            break
        
        x = x + v * dt # Oppdater posisjon til liten kloss.
        X = X + V * dt # Oppdater posisjonen til stor kloss.

        x_pos.append(x)
        X_pos.append(X)

    return antall_kollisjoner, x_pos, X_pos, cum_kollisjoner, collision_events


def main(p):
    m = 1
    M = 100**p * m
    v = 0
    V = -10
    x_extent = 5
    X_extent = 10
    skip = 100
    extra_frames = 50_000 * skip
    x_init = 10
    X_init = 30
    start = time.perf_counter()
    antall_kollisjoner, x_positions, X_positions, cum_kollisjoner, collisions_events = simuler_kollisjoner(
        v=v, 
        V=V, 
        m=m, 
        M=M, 
        dt=1e-7,
        x_extent=x_extent, 
        X_extent=X_extent,
        skip_frames=extra_frames,
        x_init=x_init,
        X_init=X_init,
    )
    end = time.perf_counter()
    timeused = end - start
    print(f"Simuleringen tok {timeused:.2f} sekunder.")

    print(f"{antall_kollisjoner = }")

    skip = 1
    ani = create_animation(
        x_positions[::skip], 
        X_positions[::skip], 
        x_extent=x_extent, 
        X_extent=X_extent, 
        collisions=cum_kollisjoner[::skip],
        collision_events=collisions_events[::skip],
    )
    plt.show()

    callback_function = lambda current_frame, total_frames: print(f"Lager animasjon: {current_frame}", end="\r")

    ani.save(f"./animations/pi_factory_{p}.gif", fps=60, progress_callback=callback_function)


if __name__ == "__main__":
    main(p=2)