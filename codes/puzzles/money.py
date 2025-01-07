import numpy as np

money = [100] * 1001

money = np.array(money)

money[::2] = 50
money[::3] = 10
money[::4] = 5

print(money)
print(sum(money))
