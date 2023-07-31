import matplotlib.pyplot as plt

# Constants for a 9mm bullet
m = 0.0075 # mass in kg
v0 = 350.0 # initial velocity in m/s
Cd = 0.3 # drag coefficient
A = 0.0000636 # cross-sectional area in m^2
rho = 1.225 # air density in kg/m^3
g = 9.81 # acceleration due to gravity in m/s^2

# Function to compute air resistance
def air_resistance(v):
    return 0.5 * Cd * A * rho * v**2

# Choose a time and compute the velocity and forces at that time
t = 1.0 # time in seconds
v = v0 - g*t # velocity at time t (ignoring air resistance for simplicity)
Fd = air_resistance(v) # drag force
Fg = m * g # gravitational force

# Create figure and axis
fig, ax = plt.subplots()

# Draw bullet as a circle
bullet = plt.Circle((0, 0), 0.5, color='black')
ax.add_artist(bullet)

# Draw forces
ax.annotate('', xy=(0, -Fg/1000), xytext=(0, 0), arrowprops=dict(arrowstyle='->', lw=2, color='red')) # Gravity
ax.annotate('', xy=(0, 0.5+Fd/1000), xytext=(0, 0.5), arrowprops=dict(arrowstyle='->', lw=2, color='blue')) # Air resistance

# Draw velocity
ax.annotate('', xy=(0, v/1000), xytext=(0, 0), arrowprops=dict(arrowstyle='->', lw=2, color='green')) # Velocity

# Set limits and labels
ax.set_xlim(-1, 1)
ax.set_ylim(-1, 1)
ax.set_aspect('equal')
plt.grid(True)
plt.legend(['Bullet', 'Gravity', 'Air resistance', 'Velocity'])

plt.title("Free Body Diagram of a Bullet")
plt.show()
