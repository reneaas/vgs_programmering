import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from PIL import Image
import io

# Definer funksjonen vi vil finne nullpunktet til
def f(x):
    return x**2 - 4

# Definer intervallet vi starter med
a = -1
b = 4

a0 = a
b0 = b
# Lager en figur og akser
fig, ax = plt.subplots()

# Sett aksene til å være konstante
ax.set_xlim(a - 1, b + 1)
ax.set_ylim(f(a) - 1, f(b) + 1)

# Lager en liste for å lagre bildene for hver iterasjon
images = []

# Lager lister for å lagre tekst og punkter
texts = []
points = []

# Utfør halveringsmetoden
for i in range(5):
    # Beregn midtpunktet
    c = (a + b) / 2

    # Plot funksjonen og linjen y=0
    x = np.linspace(a0, b0, 400)
    ax.plot(x, f(x))
    ax.plot(x, np.zeros_like(x), color='black')

    # Plot det nåværende intervallet
    ax.plot([a, a, b, b], [0, f(a), f(b), 0], color='red')
    ax.set_xlim(a0 - 1, b0 + 1)
    ax.set_ylim(f(a0) - 1, f(b0) + 1)

    # Legg til tekst for å markere midtpunktene og endepunktene
    texts.append(ax.text(a, 0, f'$a_{i+1}$', color='blue'))
    texts.append(ax.text(b, 0, f'$b_{i+1}$', color='blue'))
    texts.append(ax.text(c, 0, f'$m_{i+1}$', color='green'))


    # Lagre figuren som et bilde
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img = Image.open(buf)
    images.append(img)

    # Oppdater intervallet
    if f(c) == 0:
        break
    elif f(a) * f(c) < 0:
        b = c
    else:
        a = c

    # Fjern det gamle plottet før neste iterasjon
    ax.cla()

    # Tegn på nytt tekst og punkter i hver iterasjon
    for text in texts:
        ax.text(*text.get_position(), text.get_text(), color=text.get_color())

# Lag en GIF av bildene
images[0].save('bisection_method.gif', save_all=True, append_images=images[1:], loop=0, duration=2000)
