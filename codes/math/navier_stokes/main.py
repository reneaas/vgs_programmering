

def make_derivative_fn(f, h):
    """Create a function that computes the partial derivatives of f 
    
    Args:
        f: function to differentiate. Assumed to be of the form f(x, y, z, ...)
        h: the step size

    Return:
        A function that computes the partial derivatives of f with respect to each of its arguments
    """
    def dfdx(*x):
        return tuple((f(*(x[:i] + (x[i] + h,) + x[i+1:])) - f(*x)) / h for i in range(len(x)))
    
    return dfdx


def make_diverence_fn(f, h):
    dfdx = make_derivative_fn(f, h)
    def df(*x):
        return sum(dfdx(*x))
    
    return df


def f(x):
    return x**2


df = make_derivative_fn(f, h=1e-5)

print(df(1))


def g(x, y):
    return x**2 + y**2

dgdx = make_derivative_fn(g, h=1e-5)

print(dgdx(1, 2))

dg = make_diverence_fn(g, h=1e-5)

print(dg(1, 2))