import numpy as np
import matplotlib.pyplot as plt
plt.rc('text', usetex=True)

def f(x):
    return x

def ellipse(a, b):
    t = np.linspace(0, 2*np.pi, 1024)
    x = a * np.cos(t)
    y = b * np.sin(t)
    return x, y

a = 0
b = 1

x = np.linspace(a, b, 1024)

fig, ax = plt.subplots()
ax.plot(x, f(x), color="teal", lw=2, alpha=0.7)

x_start = 0
y0 = f(x_start)
x, y = ellipse(0.03, y0)

ax.plot(x_start + x, y, color='teal', linestyle='-', lw=1.5, alpha=0.7)

x_slutt = 1
n_sirkler = 1024
dx = (x_slutt - x_start) / n_sirkler 

for i in range(n_sirkler - 1):
    x0 = x_start + i * dx
    # x0 = x_start
    y0 = f(x0)
    x, y = ellipse(0.05, y0)
    ax.plot(x_start + i*dx + x, y, color='teal', linestyle='-', lw=1.5, alpha=0.03)

x, y = ellipse(0.05, f(x_slutt))
ax.plot(x_slutt + x, y, color="teal", linestyle="-", lw=1.5, alpha=0.7)

# x, y = ellipse(0.05, f(x_start))
# ax.plot(x_slutt + x, y, color="teal", linestyle="-", lw=1.5, alpha=0.7)

# y_min = -0.7
# plt.text(
#     x=x_start,
#     y=y_min, 
#     s="$x_0$",
#     fontsize=16,
#     ha="center",
# )

# plt.text(
#     x=x_slutt,
#     y=y_min,
#     s="$x_0 + h$",
#     fontsize=16,
#     ha="center",
# )


# dy = 0.05
# plt.plot([x_start, x_start], [0, y_min+dy], linestyle="--", color="black", alpha=0.6)
# plt.plot([x_slutt, x_slutt], [0, y_min+dy], linestyle="--", color="black", alpha=0.6)


ax.spines['left'].set_position('zero')
ax.spines['bottom'].set_position('zero')
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')

ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)


plt.xlabel("$x$", fontsize=16, color='black', loc="right")
plt.ylabel("$y$", fontsize=16, color='black', loc="top", rotation="horizontal")

# plt.xticks([x_start, x_slutt], ["", ""])
plt.xticks([])
plt.yticks([])

plt.xlim(0, 1.2)

ax.tick_params(length=10)
plt.tight_layout()
plt.savefig("solid_of_revolution_kjegle_hele.png")
plt.show()