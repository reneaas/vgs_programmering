import numpy as np
from tqdm import trange
from utils import create_animation
import numba


def get_bacterium(
    x: int = None,
    y: int = None,
    x_cells: int = None,
    y_cells: int = None,
    resistance: float = 0,
):
    if x is None and y is None:
        properties = {
            "x": np.random.randint(0, x_cells),
            "y": np.random.randint(0, y_cells),
            "resistance": resistance,
        }
    else:
        properties = {
            "x": x,
            "y": y,
            "resistance": resistance,
        }
    return properties


def get_init_colony(n_bacteria: int, x_cells: int, y_cells: int):
    bacteria = []
    for _ in range(n_bacteria):
        bacteria.append(
            get_bacterium(
                x_cells=int(0.2 * x_cells),
                y_cells=y_cells,
                resistance=0,
            )
        )
    return bacteria


def make_antibiotic_concentration_fn(x_cells: int):
    def get_antibiotic_concentration_fn(x: int):
        if 0 <= x < 0.2 * x_cells:
            return 0
        elif 0.2 * x_cells <= x < 0.4 * x_cells:
            return 0.25
        elif 0.4 * x_cells <= x < 0.6 * x_cells:
            return 0.5
        elif 0.6 * x_cells <= x < 0.8 * x_cells:
            return 0.75
        else:
            return 0.99

    return get_antibiotic_concentration_fn


def make_move_bacterium_fn(x_cells: int, y_cells: int):
    def move_bacterium_fn(bacterium: dict):
        x = bacterium.get("x")
        y = bacterium.get("y")
        dx = np.random.randint(-1, 2)
        dy = np.random.randint(-1, 2)

        # Check if the move is valid in x-direction
        if x + dx < 0:
            dx = 0
        elif x + dx >= x_cells:
            dx = 0

        # Check if the move is valid in the y-direction
        if y + dy < 0:
            dy = 0
        elif y + dy >= y_cells:
            dy = 0

        # Move the bacterium
        bacterium["x"] += dx
        bacterium["y"] += dy

        return bacterium

    return move_bacterium_fn


def make_section_fn(x_cells: int):
    def get_section_fn(x: int):
        if 0 <= x < 0.2 * x_cells:
            return 0
        elif 0.2 * x_cells <= x < 0.4 * x_cells:
            return 1
        elif 0.4 * x_cells <= x < 0.6 * x_cells:
            return 2
        elif 0.6 * x_cells <= x < 0.8 * x_cells:
            return 3
        else:
            return 4

    return get_section_fn


def make_probability_of_reproduction_fn(b: float):
    def get_probability_of_reproduction_fn(n: int):
        return 2 * (1 - 1 / (1 + np.exp(-b * n)))

    return get_probability_of_reproduction_fn


def main():
    x_cells = 500
    y_cells = 250
    n_bacteria = 100
    probability_of_mutation = 1e-5

    # Get the necessary functions for the simulaiton.
    get_antibiotic_concentration_fn = make_antibiotic_concentration_fn(x_cells=x_cells)
    move_bacterium_fn = make_move_bacterium_fn(x_cells=x_cells, y_cells=y_cells)
    get_section_fn = make_section_fn(x_cells=x_cells)
    get_probability_of_reproduction_fn = make_probability_of_reproduction_fn(b=0.0003)

    bacteria = get_init_colony(n_bacteria=n_bacteria, x_cells=x_cells, y_cells=y_cells)

    # Positions of bacteria over time.
    x = []
    y = []

    num_iter = 5000  # Number of generations to simulate.
    it = trange(num_iter, leave=True)
    n_dead_bacteria = 0
    for _ in it:
        it.set_description(
            f"Antall bakterier: {len(bacteria)} | Antall antibiotika resistente bakterier: {len([b for b in bacteria if b.get('resistance') > 0.5])} | Døde bakterier: {n_dead_bacteria}"
        )
        # First, store the positions of the bacteria in the current population
        x_tmp = []
        y_tmp = []
        bacteria_per_section = [0, 0, 0, 0, 0]
        for b in bacteria:
            section = get_section_fn(b.get("x"))
            bacteria_per_section[section] += 1

            x_tmp.append(b.get("x"))
            y_tmp.append(b.get("y"))

        x.append(x_tmp)
        y.append(y_tmp)

        # Move all bacteria in the populations.
        for b in bacteria:
            b = move_bacterium_fn(bacterium=b)

        # Count number of bacteria in each section
        # bacteria_per_section = [0, 0, 0, 0, 0]
        # for b in bacteria:
        #     section = get_section_fn(b.get("x"))
        #     bacteria_per_section[section] += 1

        # Each bacteria tries to reproduce in their respective sections.

        new_bacteria = []
        for b in bacteria:
            if np.random.uniform() < get_probability_of_reproduction_fn(
                bacteria_per_section[get_section_fn(b.get("x"))]
            ):
                if np.random.uniform() > probability_of_mutation:
                    new_bacteria.append(
                        get_bacterium(
                            x=b.get("x"),
                            y=b.get("y"),
                            resistance=b.get("resistance") + np.random.uniform(0, 0.01),
                        )
                    )
                else:
                    new_bacteria.append(
                        get_bacterium(
                            x=b.get("x"), y=b.get("y"), resistance=b.get("resistance")
                        )
                    )
            
            # Kill all bacteria that cannot survive the antibiotic concentration.
            if (
                get_antibiotic_concentration_fn(b.get("x")) - b.get("resistance")
                > np.random.uniform()
            ):
                n_dead_bacteria += 1
                bacteria.remove(b)

        # Then, kill all bacteria that are in the antibiotic concentration.
        # for b in bacteria:
        #     if (
        #         get_antibiotic_concentration_fn(b.get("x")) - b.get("resistance")
        #         > np.random.uniform()
        #     ):
        #         n_dead_bacteria += 1
        #         bacteria.remove(b)

        # Finally, add the new bacteria to the population.
        bacteria.extend(new_bacteria)

        # Update the resistance of all bacteria

    create_animation(
        f"animations/animation_grid_{x_cells}X{y_cells}_iterations_{num_iter}.gif",
        x=x,
        y=y,
        x_cells=x_cells,
        y_cells=y_cells,
    )


if __name__ == "__main__":
    main()
