import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Set the constants
R = 6371 # Earth radius in km
r = 400 # Orbit radius in km
d = 50 # fluctuation in km

# Define the functions
# def x(t): 
#     return (R + r * np.cos(3 * t)) * np.cos(2 * t)

# def y(t): 
#     return (R + r * np.cos(3 * t)) * np.sin(2 * t)

# def z(t): 
#     return r * np.sin(3 * t)

def x(t):
    return (R + r * np.cos(3 * t) + d * np.sin(t)) * np.cos(2 * t)

def y(t):
    return (R + r * np.cos(3 * t) + d * np.sin(t)) * np.sin(2 * t)

def z(t):
    return r * np.sin(3 * t) + d * np.cos(t)

# Define the derivatives
# def dx(t):
#     return -2 * (R + r * np.cos(3 * t)) * np.sin(2 * t) - 3 * r * np.cos(2 * t) * np.sin(3 * t)

# def dy(t):
#     return 2 * (R + r * np.cos(3 * t)) * np.cos(2 * t) + 3 * r * np.sin(2 * t) * np.sin(3 * t)

# def dz(t):
#     return 3 * r * np.cos(3 * t)

def dx(t):
    return -2 * (R + r * np.cos(3 * t) + d * np.sin(t)) * np.sin(2 * t) - 3 * r * np.cos(2 * t) * np.sin(3 * t) + d * np.cos(t) * np.cos(2 * t)

def dy(t):
    return 2 * (R + r * np.cos(3 * t) + d * np.sin(t)) * np.cos(2 * t) + 3 * r * np.sin(2 * t) * np.sin(3 * t) + d * np.cos(t) * np.sin(2 * t)

def dz(t):
    return 3 * r * np.cos(3 * t) - d * np.sin(t)

# Generate t values
t = np.linspace(0, 2 * np.pi, 1000)

# Generate x, y, and z values
x_values = x(t)
y_values = y(t)
z_values = z(t)

# Generate the helix plot with a color gradient
helix_plot = go.Scatter3d(x=x_values, y=y_values, z=z_values, mode='lines',
                          line=dict(width=6, color=z_values,
                                    colorscale='plasma',  # choose a colorscale
                                    showscale=False)  # remove color scale bar
                         )

# Generate cones (arrows) at intervals along the helix
arrow_interval = 100
cones = []
for i in range(0, len(t)-arrow_interval, arrow_interval):
    cone = go.Cone(x=[x_values[i]], y=[y_values[i]], z=[z_values[i]], 
                    u=[dx(t[i])], 
                    v=[dy(t[i])], 
                    w=[dz(t[i])],
                    sizemode='scaled',
                    sizeref=0.1,
                    anchor='tail',
                    colorscale='plasma',  # same colorscale for the cones
                    showscale=False,
                    colorbar=dict(thickness=10, title='z', xanchor='left', titleside='right')
                  )
    cones.append(cone)

# Combine the plots and display
fig = go.Figure(data=[helix_plot, *cones])

# Set the background color and grid color
fig.update_layout(scene = dict(
                    xaxis = dict(
                         backgroundcolor="white",
                         gridcolor="lightgray",
                         showbackground=True,
                         zerolinecolor="white",),
                    yaxis = dict(
                        backgroundcolor="white",
                        gridcolor="lightgray",
                        showbackground=True,
                        zerolinecolor="white"),
                    zaxis = dict(
                        backgroundcolor="white",
                        gridcolor="lightgray",
                        showbackground=True,
                        zerolinecolor="white",),),
                  )

fig.update_layout(
    autosize=True,
    margin=dict(l=0, r=0, b=0, t=0),  # This line removes the padding around the plot
)

# Assuming 'fig' is the figure object you want to save
pio.write_image(fig, "trefoil_knot.pdf")

fig.show()
