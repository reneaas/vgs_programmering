import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import matplotlib.patches as patches
import time

# def create_animation(x_positions, X_positions, x_extent, X_extent, collisions):
#     fig, ax = plt.subplots()

#     # Set equal aspect ratio so that squares are displayed as squares.
#     ax.set_aspect('equal')

#     # Adjust the x and y limits of the plot
#     ax.set_xlim((min(x_positions) - X_extent, max(X_positions) + X_extent))
#     ax.set_ylim((0, max(X_extent, x_extent) * 2))

#     # Set background color to black and remove axis for better visuals
#     fig.patch.set_facecolor('black')
#     ax.axis('off')

#     # Draw the wall
#     ax.axvline(x=0, color='white')

#     # Create the squares representing the cubes
#     patch_small = patches.Rectangle((0, 0), x_extent, x_extent, fc='yellow')
#     patch_large = patches.Rectangle((0, 0), X_extent, X_extent, fc='cyan')

#     # Add counter text
#     collision_counter = ax.text(0.5, 1, '', transform=ax.transAxes, color='white')

#     def animate(i):
#         patch_small.set_xy((x_positions[i] - x_extent / 2, 0))  # Set the x-coordinate to be the left edge of the small cube
#         patch_large.set_xy((X_positions[i] - X_extent / 2, 0))  # Set the x-coordinate to be the left edge of the large cube

#         # Update counter text
#         collision_counter.set_text(f'Kollisjoner: {collisions[i]}')

#         return patch_small, patch_large, collision_counter,

#     ax.add_patch(patch_small)
#     ax.add_patch(patch_large)
#     ani = animation.FuncAnimation(fig, animate, frames=len(x_positions), interval=1, blit=False)

#     return ani


def frame_gen(collisions):
    collision_distance = 500_000 # distance (in frames) to the next collision when we start skipping frames
    frames_to_skip = int(250_000) # how many frames to skip when no collision is imminent

    i = 0
    while i < len(collisions):
        yield i
        if not any(collisions[i:i+collision_distance]):
            i += frames_to_skip  # skip frames if no collision is imminent
        else:
            i += int(0.05 * frames_to_skip)  # don't skip frames when a collision is imminent

# def frame_gen(collisions):
#     distance_to_check_for_collision = 2500
#     frames_to_skip_when_no_collision = 25000

#     i = 0
#     while i < len(collisions):
#         yield i

#         if i + distance_to_check_for_collision < len(collisions) and any(collisions[i+1:i+1+distance_to_check_for_collision]):
#             # A collision is about to happen, don't skip frames
#             i += 1
#         else:
#             # No collision in sight, skip some frames
#             i += frames_to_skip_when_no_collision

def create_animation(x_positions, X_positions, collisions, x_extent, X_extent, collision_events):
    fig, ax = plt.subplots()

    # Set equal aspect ratio so that squares are displayed as squares.
    ax.set_aspect('equal')

    # Adjust the x and y limits of the plot
    ax.set_xlim((min(x_positions) - X_extent, max(X_positions) + X_extent))
    ax.set_ylim((0, max(X_extent, x_extent) * 2))

    # Set background color to black and remove axis for better visuals
    fig.patch.set_facecolor('black')
    ax.axis('off')

    # Draw the wall
    ax.axvline(x=0, color='white')
    ax.axhline(y=0, color='white')

    # Create the squares representing the cubes
    patch_small = patches.Rectangle((0, 0), x_extent, x_extent, fc='yellow')
    patch_large = patches.Rectangle((0, 0), X_extent, X_extent, fc='cyan')

    # Add counter text
    collision_counter = ax.text(0.5, 1, '', transform=ax.transAxes, color='white', fontsize=20)

    def animate(i):
        patch_small.set_xy((x_positions[i] - x_extent / 2, 0))  # Set the x-coordinate to be the left edge of the small cube
        patch_large.set_xy((X_positions[i] - X_extent / 2, 0))  # Set the x-coordinate to be the left edge of the large cube

        # Update counter text
        collision_counter.set_text(f'Kollisjoner: {collisions[i]}')

        return patch_small, patch_large, collision_counter,

    ax.add_patch(patch_small)
    ax.add_patch(patch_large)
    ani = animation.FuncAnimation(fig, animate, frames=frame_gen(collision_events), cache_frame_data=False, interval=1)
    
    return ani







