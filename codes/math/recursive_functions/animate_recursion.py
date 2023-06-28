import matplotlib.pyplot as plt

def recursive_arithmetic(n):
    if n == 1:
        return 2
    else:
        return recursive_arithmetic(n - 1) + 3

def draw_tree(n, x, y, dx, dy):
    if n == 1:
        plt.text(x, y, "a(1)", ha='center', va='center', bbox=dict(facecolor='lightblue', edgecolor='black', boxstyle='circle'))
        return x, y
    else:
        plt.text(x, y, "a({})".format(n), ha='center', va='center', bbox=dict(facecolor='lightblue', edgecolor='black', boxstyle='circle'))
        left_x, left_y = draw_tree(n - 1, x - dx, y - dy, dx / 2, dy)
        plt.arrow(x, y, x - left_x, y - left_y, length_includes_head=True, head_width=0.2, head_length=0.3, color='black')
        plt.text((x + left_x) / 2, (y + left_y) / 2, "+ 3", ha='center', va='center')
        return x, y

# Set up the figure
fig, ax = plt.subplots(figsize=(6, 6))
ax.set_xlim(-3, 3)
ax.set_ylim(0, 5)
ax.axis('off')

# Draw the tree
draw_tree(3, 0, 4, 3, 1)

# Compute and display the result
result = recursive_arithmetic(3)
plt.text(0, 0, "Result: {}".format(result), ha='center', va='center')

plt.show()
