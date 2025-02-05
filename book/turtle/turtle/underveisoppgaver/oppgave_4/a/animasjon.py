import turtle
import imageio
import os
import shutil
import natsort

# --- Animation Control ---
running = True
FRAMES_PER_SECOND = 30
filenames = []


def stop():
    global running
    running = False


def save(counter=[1]):
    fname = f"frame_{counter[0]}.eps"
    filenames.append(fname)
    turtle.getcanvas().postscript(
        file=os.path.join("temp_frames", fname),
        x=-200,
        y=-150,
        width=400,
        height=300,
    )
    counter[0] += 1
    if running:
        print("Saving frame", counter[0])
        turtle.ontimer(save, int(1000 / FRAMES_PER_SECOND))


# --- Drawing Function ---
def draw():
    antall_linjestykker = 20
    lengde = 1
    while antall_linjestykker > 0:
        turtle.forward(lengde)
        turtle.left(90)
        lengde = lengde + 5
        antall_linjestykker = antall_linjestykker - 1

    turtle.ontimer(stop, 1000)  # Stop recording after 1 second


# --- GIF Creation ---
def make_anim(fname, filenames):
    with imageio.get_writer(
        fname,
        mode="I",
        duration=int(1000 / FRAMES_PER_SECOND),
        loop=0,
    ) as writer:
        for filename in filenames:
            image = imageio.imread(filename)
            writer.append_data(image)


# --- Main Execution ---
# Create a temporary directory
temp_dir = "temp_frames"
os.makedirs(temp_dir, exist_ok=True)

# Start recording
save()

# Start drawing
turtle.ontimer(draw, 500)  # Start drawing after 0.5 second delay

turtle.done()

# Get the list of filenames
filenames = [
    os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.endswith(".eps")
]

filenames = natsort.natsorted(filenames)
print(*filenames, sep="\n")

# Create the GIF
fname = __file__.split("/")[-1].replace(".py", ".gif")
make_anim(fname, filenames)

# Remove the temporary directory
shutil.rmtree(temp_dir)
