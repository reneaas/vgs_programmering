import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
plt.rc('text', usetex=True)

def f(x):
    return x**3 - 2 * x**2 + 2 * x - 4

def df_dx(x):
    return 3 * x**2 - 4 * x + 2


def make_tangent(f, df_dx, a):
    def tangent(x):
        return f(a) + df_dx(a) * (x - a)
    return tangent

def make_secant(f, a, h):
    def df_dx(x):
        return (f(x + h) - f(x)) / h
    def secant(x):
        return f(a) + df_dx(a) * (x - a)
    return secant


def make_animate_fn(f, x, x_vals, h_vals):
    y_vals = f(x_vals)
    y_lim = (min(y_vals) - 1, max(y_vals) + 1)
    fig, ax = plt.subplots()
    line, = ax.plot(x_vals, y_vals, label="$f(x)$", color="purple")
    ax.spines['left'].set_position('zero')
    ax.spines['bottom'].set_position('zero')
    ax.spines['right'].set_visible(False)
    ax.spines['top'].set_visible(False)
    ax.set_xticks([x], labels=["$x$"])
    ax.set_yticks([ ])
    plt.xlabel("$x$", fontsize=16, loc="right")
    plt.ylabel("$f(x)$", fontsize=16, loc="top", rotation="horizontal")

    tangent = make_tangent(f, df_dx, x)
    plt.plot(x_vals, tangent(x_vals), color="teal", label="Tangent i $x=a$")

    def animate(i):
        ax.clear()
        ax.plot(x_vals, y_vals, color="teal", lw=2, alpha=0.7)
        secant = make_secant(f, x, h_vals[i])
        ax.plot(x, f(x), 'ro')
        ax.plot(x_vals, secant(x_vals), color="blue", label="Sekant", alpha=0.7)
        ax.plot(x+h_vals[i], f(x+h_vals[i]), 'ro')
        ax.plot(x_vals, tangent(x_vals), color="blue", linestyle="--", label="Tangent")
        ax.set_ylim(y_lim)
        ax.set_xticks([x, x + h_vals[i]], labels=["", ""], fontsize=16)
        ax.text(x=x, y=2, s="$x$", fontsize=16, ha="center", va="center")
        ax.text(
            x=x + h_vals[i], 
            y=y_lim[0]+0.1,
            s=f"$x + h$" if i == 0 else f"$x + h/{2**i}$", 
            #s=f"$x + {h_vals[i]:.3f}$",
            fontsize=16, 
            ha="center", 
            va="center",
        )

        # plt.title(r"$\frac{f(x + h) - f(x)}{h} \approx $" + f"{(f(x+h_vals[i]) - f(x)) / h_vals[i]:.3f} ; f'(1) = {df_dx(x=2):.3f}", fontsize=16)

        # ax.axvline(x=x + h_vals[i], ymin=y_lim[0], ymax=0, color="black", linestyle="--")
        # ax.axvline(x=x + h_vals[i], color="black", linestyle="--", ymin=0)
        ax.plot([x + h_vals[i], x + h_vals[i]], [y_lim[0]+1.5, -0.5 if -0.5 < f(x + h_vals[i]) else f(x + h_vals[i]) - 0.2], color="black", linestyle="--")
        # ax.xaxis.set_ticks_position('top')
        ax.set_yticks([])
        plt.xlabel("$x$", fontsize=16, loc="right")
        plt.ylabel("$f(x)$", fontsize=16, loc="top", rotation="horizontal")
        ax.spines['left'].set_position('zero')
        ax.spines['bottom'].set_position('zero')
        ax.spines['right'].set_visible(False)
        ax.spines['top'].set_visible(False)
        ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)
        ax.plot(0, 1, "^k", transform=ax.get_xaxis_transform(), clip_on=False)
        plt.legend(loc="upper center", fontsize=16)

        # line.set_ydata(tangent(x_vals))
        return line,
    return animate, fig, ax

x = 1.5
h0 = 2
h_vals = [h0 / 2**i for i in range(8)]

# h_a = 1e-3
# h_b = 1
# n = 100
# dx = (h_b - h_a) / n
# h_vals = [h_b - dx * i for i in range(n)]

x_vals = np.linspace(-1, 4, 100)
y_vals = f(x_vals)
animate, fig, ax = make_animate_fn(f, x, x_vals, h_vals)

progress_callback = lambda i, n: print(f"Writing progress: {(i+1) / n * 100 :.1f} %", end="\r")
ani = animation.FuncAnimation(fig, animate, interval=1000, frames=len(h_vals), blit=True, repeat=False)
ani.save("secants_discrete_labels.gif", writer="imagemagick", fps=1, progress_callback=progress_callback)
# plt.legend()
# plt.axis("equal")
# plt.show()




