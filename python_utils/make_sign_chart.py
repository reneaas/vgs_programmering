import numpy as np
import matplotlib.pyplot as plt
import sympy as sp
import pathlib

plt.rc("text", usetex=True)


def savefig(dirname, fname):
    dir = pathlib.Path(dirname)
    dir.mkdir(parents=True, exist_ok=True)
    plt.savefig(f"{dir}/{fname}")

    return None


def get_factors(polynomial: sp.Expr, x: sp.Symbol) -> list[dict]:
    polynomial = sp.expand(polynomial)
    factor_list = sp.factor_list(polynomial)
    leading_coeff = factor_list[0]

    linear_factors = (
        [{"expression": leading_coeff, "exponent": 1, "root": -np.inf}]
        if leading_coeff != 1
        else []
    )

    for linear_factor, exponent in factor_list[1]:
        exponent = int(exponent)
        root = sp.solve(linear_factor, x)
        root_value = root[0] if root else -np.inf
        linear_factors.append(
            {
                "expression": linear_factor,
                "exponent": exponent,
                "root": root_value,
            }
        )

    return linear_factors


def sort_factors(factors: list[dict]) -> list[dict]:
    factors = sorted(factors, key=lambda x: x.get("root"))
    return factors


def draw_factors(factors, roots, ax, color_pos, color_neg, x, dy=-1, dx=0.1) -> None:
    # Draw horisontal sign lines for each factor
    for i, factor in enumerate(factors):
        expression = str(factor.get("expression"))
        exponent = factor.get("exponent")

        # Replace ** with ^ for sympy expressions to work with latex
        if "**" in str(expression):
            expression = expression.replace("**", "^")

        # Remove multiplication signs
        if "*" in str(expression):
            expression = expression.replace("*", "")

        if exponent > 1:
            s = f"$({expression})^{exponent}$"
        else:
            s = f"${expression}$"

        plt.text(
            x=-1,
            y=(i + 1) * dy,
            s=s,
            fontsize=16,
            ha="center",
            va="center",
        )
        if factor.get("root") == -np.inf:
            if sp.sympify(factor.get("expression")).evalf(subs={x: 0}) > 0:
                # plt.axhline(y=(i+1)*dy, xmin=0.05, xmax=1, color="blue", linestyle="-", lw=2)
                ax.plot(
                    [-0.7, len(roots)],
                    [(i + 1) * dy, (i + 1) * dy],
                    color=color_pos,
                    linestyle="-",
                    lw=2,
                )
            else:
                # plt.axhline(y=(i+1)*dy, xmin=0.05, xmax=1, color="red", linestyle="--", lw=2)
                ax.plot(
                    [-0.7, len(roots)],
                    [(i + 1) * dy, (i + 1) * dy],
                    color=color_neg,
                    linestyle="--",
                    lw=2,
                )

        elif factor.get("exponent") % 2 == 0:
            root = factor.get("root")
            root_idx = roots.index(root)

            ax.plot(
                [-0.7, root_idx - dx],
                [(i + 1) * dy, (i + 1) * dy],
                color=color_pos,
                linestyle="-",
                lw=2,
            )
            ax.plot(
                [root_idx + dx, len(roots)],
                [(i + 1) * dy, (i + 1) * dy],
                color=color_pos,
                linestyle="-",
                lw=2,
            )

            plt.text(
                x=root_idx,
                y=(i + 1) * dy,
                s=f"$0$",
                fontsize=20,
                ha="center",
                va="center",
            )

        else:
            root = factor.get("root")
            root_idx = roots.index(root)

            ax.plot(
                [-0.7, root_idx - dx],
                [(i + 1) * dy, (i + 1) * dy],
                color=color_neg,
                linestyle="--",
                lw=2,
            )
            ax.plot(
                [root_idx + dx, len(roots)],
                [(i + 1) * dy, (i + 1) * dy],
                color=color_pos,
                linestyle="-",
                lw=2,
            )

            plt.text(
                x=root_idx,
                y=(i + 1) * dy,
                s=f"$0$",
                fontsize=20,
                ha="center",
                va="center",
            )


def draw_function(
    factors,
    roots,
    ax,
    color_pos,
    color_neg,
    x,
    f,
    fn_name=None,
    include_factors=True,
    dy=-1,
    dx=0.1,
):

    if include_factors:
        y = (len(factors) + 1) * dy
    else:
        y = dy
    dy = -1
    dx = 0.1
    plt.text(
        x=-1,
        y=y,
        s=f"${fn_name}$" if fn_name else f"$f(x)$",
        fontsize=16,
        ha="center",
        va="center",
    )

    for i, root in enumerate(roots):

        plt.text(
            x=i,
            y=y,
            s=f"${0}$",
            fontsize=20,
            ha="center",
            va="center",
        )

        x0 = root - dx
        y0 = sp.sympify(f).evalf(subs={x: x0})

        if y0 > 0:
            plt.axhline(
                y=y,
                xmin=i / (len(roots) + 1) + 0.05,
                xmax=(i + 1) / (len(roots) + 1) - 0.05,
                color=color_pos,
                linestyle="-",
                lw=2,
            )
        else:
            plt.axhline(
                y=y,
                xmin=i / (len(roots) + 1) + 0.05,
                xmax=(i + 1) / (len(roots) + 1) - 0.05,
                color=color_neg,
                linestyle="--",
                lw=2,
            )

    x0 = roots[-1] + dx
    y0 = sp.sympify(f).evalf(subs={x: x0})
    if y0 > 0:
        plt.axhline(
            y=y,
            xmin=(len(roots)) / (len(roots) + 1) + 0.05,
            xmax=1,
            color=color_pos,
            linestyle="-",
            lw=2,
        )
    else:
        plt.axhline(
            y=y,
            xmin=(len(roots)) / (len(roots) + 1) + 0.05,
            xmax=1,
            color=color_neg,
            linestyle="--",
            lw=2,
        )


def draw_vertical_lines(roots, factors, ax, include_factors=True, dy=-1):
    # Draw vertical lines to separate regions
    offset_dy = 0.2

    n_factors_without_roots = len(
        [factor for factor in factors if factor.get("root") == -np.inf]
    )

    if include_factors:
        offset = 1
        for i, root in enumerate(roots):
            ax.plot(
                [i, i],
                [-0.4, (i + n_factors_without_roots + offset) * dy + offset_dy],
                color="black",
                linestyle="-",
                lw=1,
            )
            ax.plot(
                [i, i],
                [
                    (i + n_factors_without_roots + offset) * dy - offset_dy,
                    (len(factors) + 1) * dy + offset_dy,
                ],
                color="black",
                linestyle="-",
                lw=1,
            )
    else:
        for i, root in enumerate(roots):
            ax.plot(
                [i, i],
                [-0.3, 0.8 * dy],
                color="black",
                linestyle="-",
                lw=1,
            )


def make_axis():
    fig, ax = plt.subplots()

    # Create x-axis and remove y-axis
    ax.spines["left"].set_color("none")  # Remove the left y-axis
    ax.spines["right"].set_color("none")  # Remove the right y-axis
    ax.spines["bottom"].set_position("zero")  # Move the bottom x-axis to y=0
    ax.spines["top"].set_color("none")  # Remove the top x-axis

    # Attach arrow to the right end of the x-axis
    ax.plot(1, 0, ">k", transform=ax.get_yaxis_transform(), clip_on=False)

    # Label the x-axis
    ax.set_xlabel(r"$x$", fontsize=16, loc="right")

    # Remove tick labels on y-axis
    plt.yticks([])

    return fig, ax


def make_sign_chart(
    f: sp.Expr,
    x: sp.symbols,
    fn_name: str = None,
    color: bool = True,
    include_factors: bool = True,
    generic_labels: bool = False,
) -> None:
    """Tegner fortegnsskjema for et polynom f.

    Args:
        f (sp.Expr):
            Polynomet f(x)
        x (sp.symbols):
            Symbolet som representerer variabelen i polynomet
        fn_name (str, optional):
            Navn på funksjonen. Defaults `None`.
        color (bool, optional):
            Farge på fortegnslinjene. Default: `True`.
        include_factors (bool, optional):
            Inkluderer alle faktorene til f(x). Default: `True`.
        generic_label (bool, optional):
            Bruker generiske labels for røttene: x_1, x_2, ..., x_N. Default: `False`.

    Returns:
        None
    """

    if color:
        color_pos = "red"
        color_neg = "blue"
    else:
        color_pos = color_neg = "black"

    factors = get_factors(polynomial=f, x=x)  # compute linear factors
    factors = sort_factors(factors=factors)  # Sort linear factors in ascending order.

    print(f"Creating sign chart for f(x) = {f} = {f.factor()}")

    # Create figure
    fig, ax = make_axis()

    # Set tick marks to roots of the polynomial
    roots = [factor.get("root") for factor in factors if factor.get("root") != -np.inf]
    plt.xticks(
        ticks=[i for i in range(len(roots))],
        labels=[
            f"${root}$" if not generic_labels else f"$x_{i + 1}$"
            for i, root in enumerate(roots)
        ],
        fontsize=16,
    )

    # Draw factors
    if include_factors:
        draw_factors(factors, roots, ax, color_pos, color_neg, x)

    # Draw sign lines for function
    draw_function(
        factors, roots, ax, color_pos, color_neg, x, f, fn_name, include_factors
    )

    # Draw vertical lines to separate regions
    draw_vertical_lines(roots, factors, ax, include_factors)

    # Remove tick labels on y-axis
    plt.yticks([])

    # plt.ylim(-4, 4)
    plt.xlim(-1, len(roots))

    if include_factors:
        fig.set_size_inches(8, 2 + int(0.7 * len(factors)))
    else:
        fig.set_size_inches(8, 2)

    plt.tight_layout()

    return fig, ax


if __name__ == "__main__":

    # Eksempel på bruk
    x = sp.symbols("x", real=True)
    f = -2 * (x**2 - 1) ** 4 * (x - 3) * (x - 1)

    # Gir fortegnsskjema med fargede linjer og alle faktorer tegnet inn
    make_sign_chart(f=f, x=x, color=True, include_factors=True)

    # Gir fortegnsskjema for f(x) uten faktorer. Fargede linjer
    make_sign_chart(f=f, x=x, color=True, include_factors=False)

    # Gir fortegnsskjema for f(x) med alle faktorer. Uten farger
    make_sign_chart(f=f, x=x, color=False, include_factors=True)
