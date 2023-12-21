from bokeh.layouts import column
from bokeh.models import ColumnDataSource, Slider, CustomJS
from bokeh.plotting import figure, show
import numpy as np

# Initial data
x = np.linspace(0, 12 * np.pi, 1001)
y = np.sin(x)
colors = ["#00ff00" for _ in range(len(x) - 1)]  # Start with green color

# Preparing data for multi_line
xs = [x[i:i + 2] for i in range(len(x) - 1)]
ys = [y[i:i + 2] for i in range(len(y) - 1)]

source = ColumnDataSource(data={'xs': xs, 'ys': ys, 'colors': colors})

# Create plot
plot = figure(
    y_range=(-1.5, 1.5), 
    title="Interactive Sinusoidal Wave",
    width=1500,
    height=600,

)
plot.multi_line('xs', 'ys', color='colors', line_width=2, source=source)

# Slider for stretching/compressing the wave
stretch_slider = Slider(start=0.01, end=4, value=1, step=0.001, title="Shrink Factor")


# Slider callback
callback = CustomJS(args=dict(source=source, stretch=stretch_slider), code="""
    const data = source.data;
    const s = stretch.value;
    const xs = data['xs'];
    const ys = data['ys'];
    const colors = data['colors'];
    for (var i = 0; i < xs.length; i++) {
        xs[i] = [i * s * 0.02, (i + 1) * s * 0.02]; // Adjust the stretch
        ys[i] = [Math.sin(xs[i][0]), Math.sin(xs[i][1])];
        const ratio = 1 - s;  // Invert the ratio for opposite color effect
        colors[i] = `rgb(${255 * Math.max(0, ratio)}, ${255 * Math.max(0, 1 - Math.abs(ratio))}, ${255 * Math.max(0, -ratio)})`;
    }
    source.change.emit();
""")

stretch_slider.js_on_change('value', callback)

# Show the plot
layout = column(stretch_slider, plot)
show(layout)
