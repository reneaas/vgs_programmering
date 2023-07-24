import numpy as np
import matplotlib.pyplot as plt
from tqdm import trange
import numba

epsilon0 = 8.8541878128e-12 # F/m
def make_electric_field_fn(boltzmann_const: float = 1/(4 * np.pi * epsilon0)) -> callable:
    def get_electric_field(dr: np.ndarray, q) -> np.ndarray:
        dr_norm = np.linalg.norm(dr)
        return boltzmann_const * q * dr / dr_norm**3
    
    return get_electric_field



def main():
    charges = [1, -1, -1, 1]
    positions = np.array(
        [
            [-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0],
        ]
    )


    electric_field_fn = make_electric_field_fn()

    nx = 500
    ny = 500

    x_vals = np.linspace(-10, 10, nx)
    y_vals = np.linspace(-10, 10, ny)
    R = np.meshgrid(x_vals, y_vals)
    X, Y = R
    X = X.flat[:]
    Y = Y.flat[:]

    electric_field_x = np.zeros(shape=X.shape)
    electric_field_y = np.zeros(shape=Y.shape)

    for i, (x, y) in enumerate(zip(X, Y)):
        for charge, position in zip(charges, positions):
            dr = np.array([x, y, 0]) - position
            electric_field = electric_field_fn(dr=dr, q=charge)
            electric_field_x[i] += electric_field[0]
            electric_field_y[i] += electric_field[1]
        
    
    
    
    # plt.quiver(X.reshape(nx, ny), Y.reshape(nx, ny), electric_field_x.reshape(nx, ny), electric_field_y.reshape(nx, ny))
    plt.streamplot(X.reshape(nx, ny), Y.reshape(nx, ny), electric_field_x.reshape(nx, ny), electric_field_y.reshape(nx, ny))
    plt.show()


if __name__ == "__main__":
    main()