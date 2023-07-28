import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Set the constants
r = 1
c = 1

# Define the functions
def x(t): 
    return r * np.cos(t)

def y(t): 
    return r * np.sin(t)

def z(t): 
    return c * t

# Define the derivatives
def dx(t):
    return -r * np.sin(t)

def dy(t):
    return r * np.cos(t)

def dz(t):
    return c

# Generate t values
t = np.linspace(0, 10*np.pi, 1000)

# Generate x, y, and z values
x_values = x(t)
y_values = y(t)
z_values = z(t)

# Generate the helix plot with a color gradient
helix_plot = go.Scatter3d(x=x_values, y=y_values, z=z_values, mode='lines',
                          line=dict(width=6, color=z_values,
                                    colorscale='Viridis',  # choose a colorscale
                                    showscale=False)  # remove color scale bar
                         )

# Generate cones (arrows) at intervals along the helix
arrow_interval = 50
cones = []
for i in range(0, len(t)-arrow_interval, arrow_interval):
    cone = go.Cone(x=[x_values[i]], y=[y_values[i]], z=[z_values[i]], 
                    u=[dx(t[i])], 
                    v=[dy(t[i])], 
                    w=[dz(t[i])],
                    sizemode='scaled',
                    sizeref=0.2,
                    anchor='tail',
                    colorscale='Viridis',  # same colorscale for the cones
                    showscale=False,
                    colorbar=dict(thickness=20, title='z', xanchor='left', titleside='right')
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
pio.write_image(fig, "helix.pdf")

fig.show()
