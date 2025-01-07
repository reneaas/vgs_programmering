import numpy as np
from tqdm import trange

doors = ["A", "B", "C"]

n_trials = 1_000_000

switch_door = True


for _ in trange(n_trials):
    truth = np.random.choice(doors)

    choice = np.random.choice(doors)

    truth_idx = doors.index(truth)
    choice_idx = doors.index(choice)

    tmp = doors[:]
    tmp.remove(truth_idx)
    tmp.remove(choice_idx)
    empty_door = tmp[]
        