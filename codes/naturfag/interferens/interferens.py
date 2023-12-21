from bokeh.layouts import column
from bokeh.models import ColumnDataSource, Slider, CustomJS
from bokeh.plotting import figure, show, output_notebook, output_file
import numpy as np

# Prepare the data
x = np.linspace(0, 8*np.pi, 1024)
y1 = np.sin(x)
y2 = np.sin(x)
y_sum = y1 + y2

source = ColumnDataSource(data=dict(x=x, y1=y1, y2=y2, y_sum=y_sum))

# Create the plot
plot = figure(y_range=(-2, 2), width=1500, height=800, title="Interferens")
plot.line('x', 'y1', source=source, legend_label="Sin(x)", line_width=2, line_color="blue")
plot.line('x', 'y2', source=source, legend_label="Sin(x + fase)", line_width=2, line_color="green")
plot.line('x', 'y_sum', source=source, legend_label="Sum", line_width=2, line_color="red")

# Create the slider
slider = Slider(start=0, end=4*np.pi, value=0, step=0.001, title="Phase Shift")

# Update function
update_curve = CustomJS(args=dict(source=source, slider=slider), code="""
    const data = source.data;
    const phase = slider.value;
    const x = data['x'];
    const y1 = data['y1'];
    const y2 = data['y2'];
    const y_sum = data['y_sum'];
    for (let i = 0; i < x.length; i++) {
        y2[i] = Math.sin(x[i] + phase);
        y_sum[i] = y1[i] + y2[i];
    }
    source.change.emit();
""")

slider.js_on_change('value', update_curve)

# Layout and show
layout = column(slider, plot)
# output_notebook()
output_file("interferens.html")
show(layout)
