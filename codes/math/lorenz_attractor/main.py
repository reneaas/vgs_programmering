import numpy as np
from tqdm import trange
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.io as pio

def make_lorenz_derivative(rho, sigma, beta, dt):
    def f(x, y, z, t):
        dxdt = sigma * (y - x)
        dydt = x * (rho - z) - y
        dzdt = x * y - beta * z
        return dxdt, dydt, dzdt, dt
    return f


def make_rk4_solver(f, dt):
    """Creates a universal RK4 solver for any system of ODEs.
    
    Args:
        f (callable):
            A function that returns the derivative of the system of ODEs.
            It should take in the current state of the system. 
            It is assumed to be of the form f(x0, x1, x2, x3, ..., t).

        dt (float):
            The time step.
    """
    def rk4_forward(*x):
        k0 = f(*x)
        k1 = f(*[i + 0.5 * dt * j for i, j in zip(x, k0)])
        k2 = f(*[i + 0.5 * dt * j for i, j in zip(x, k1)])
        k3 = f(*[i + dt * j for i, j in zip(x, k2)])
        return [i + dt * (j + 2 * k + 2 * l + m) / 6 for i, j, k, l, m in zip(x, k0, k1, k2, k3)]
    return rk4_forward




# initial conditions 
x = 1
y = 1
z = 1
t = 0

dt = 0.0001
f = make_lorenz_derivative(rho=28, sigma=10, beta=8/3, dt=dt)


rk4_forward = make_rk4_solver(f=f, dt=dt)

x_values = [x]
y_values = [y]
z_values = [z]
t_values = [t]

num_steps = 1000_000
for _ in trange(num_steps):
    x, y, z, t = rk4_forward(x, y, z, t)
    x_values.append(x)
    y_values.append(y)
    z_values.append(z)
    t_values.append(t)


import numpy as np
import plotly.graph_objects as go

# Assuming x_values, y_values and z_values are your lists
x_values = np.array(x_values[::200])
y_values = np.array(y_values[::200])
z_values = np.array(z_values[::200])

# Define the axis limits
x_range = [np.min(x_values), np.max(x_values)]
y_range = [np.min(y_values), np.max(y_values)]
z_range = [np.min(z_values), np.max(z_values)]

# Create color scale for the line
color_scale = np.linspace(0,1,len(x_values))

# Create a line object
line_trace=go.Scatter3d(
    x=x_values, y=y_values, z=z_values,
    marker=dict(size=0, color=color_scale, colorscale='Plasma'),
    line=dict(width=6, color=color_scale, colorscale='Plasma'),
    mode='lines'
)

# Create a data object
data=[line_trace]

# Create layout object
layout=go.Layout(
    title="Lorenz Attractor",
    scene=dict(xaxis=dict(title='X', range=x_range, gridcolor='white'),
               yaxis=dict(title='Y', range=y_range, gridcolor='white'),
               zaxis=dict(title='Z', range=z_range, gridcolor='white'),
               bgcolor='black',
               camera=dict(
                   eye=dict(x=2.5, y=0., z=0.),
                   up=dict(x=0., y=0., z=1.)
               )
    )
)

# Create rotation frames
rotation_frames = []
for t in np.arange(0, 360, 2): # Adjust the step for speed
    rotation_frames.append(
        go.Frame(layout=dict(scene=dict(camera=dict(eye=dict(x=2.5*np.cos(np.radians(t)), y=2.5*np.sin(np.radians(t)), z=0.)))))
    )

# Create path frames
path_frames = [go.Frame(data=[go.Scatter3d(x=x_values[:i], y=y_values[:i], z=z_values[:i], 
                                    marker=dict(size=0, color=color_scale[:i], colorscale='Plasma'),
                                    line=dict(width=6, color=color_scale[:i], colorscale='Plasma'),
                                    mode='lines')]) for i in range(1, len(x_values))]

# Combine frames
frames = path_frames + rotation_frames

figure=go.Figure(data=data, layout=layout, frames=frames)

# Configure the animation
animation_settings = dict(frame=dict(duration=10, redraw=True), fromcurrent=True)
figure.update_layout(updatemenus=[dict(type='buttons', showactive=False, buttons=[dict(label='Play', method='animate', args=[None, animation_settings])])])

figure.show()
