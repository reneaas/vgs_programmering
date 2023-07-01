import os

url = "https://raw.githubusercontent.com/reneaas/vgs_programmering/main/datasets/IO_data/x_2.txt"
os.system(" ".join(["curl", url, "-o", "x_2.txt"]))