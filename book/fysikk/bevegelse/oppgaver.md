# Oppgaver: Bevegelse



:::::::::::::::{exercise} Oppgave 1
En stein slipper fra en høyde på $100$ meter og faller fritt ned mot bakken.


:::::::::::::{part} a
Beregn farten og høyden til steinen over bakken etter $1$ sekund med **Eulers** metode. 

Bruk en steglengde på $\Delta t = 0.5 \, \mathrm{s}$.
:::::::::::::


:::::::::::::{part} b
Beregn farten og høyden til steinen over bakken etter $1$ sekund med **Euler-Cromers** metode. 

Bruk en steglengde på $\Delta t = 0.5 \, \mathrm{s}$.
:::::::::::::


:::::::::::::::



---



:::::::::::::::{exercise} Oppgave 2
En stein kastes rett opp fra en starthøyde $2.0 \, \mathrm{m}$ med en startfart $v_0 = 20 \, \mathrm{m/s}$. Steinen er i fritt fall etter at den har blitt kastet.

Nedenfor vises fire programmer som simulerer bevegelsen, men som kan brukes til å regne ut forskjellige størrelser knyttet til steinens bevegelse.


:::::{grid} 1 1 2 2
---
gutter: 3
---
::::{grid-item-card} A
:::{code-block} python
---
linenos:
---
s = 2.0
v = 20
a = -9.81
t = 0
dt = 1e-3

while v > 0:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(s)
:::
::::


::::{grid-item-card} B
:::{code-block} python
---
linenos:
---
s = 2.0
v = 20
a = -9.81
t = 0
dt = 1e-3

while s > 0:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(t)
:::
::::


::::{grid-item-card} C
:::{code-block} python
---
linenos:
---
s = 2.0
v = 20
a = -9.81
t = 0
dt = 1e-3

while v >= -20:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(t)
:::
::::


::::{grid-item-card} D
:::{code-block} python
---
linenos:
---
s = 2.0
v = 20
a = -9.81
t = 0
dt = 1e-3

while s > 0:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(v)
:::
::::


:::::



:::::::::::::{part} a
Hvilket program kan brukes til å finne hvor lang tid det tar før steinen er på sitt høyeste punkt over bakken?


:::::::::::::



:::::::::::::{part} b
Hvilket program kan brukes til å regne ut hvor lang tid det tar før steinen er tilbake til samme høyde som den ble kastet fra? 


:::::::::::::


:::::::::::::{part} c
Hvilket program kan brukes til å finne hvor lang tid det tar før den treffer bakken?


:::::::::::::



:::::::::::::{part} d
Hva kan det gjenværende programmet brukes til å bestemme? 


:::::::::::::


:::::::::::::::



---



:::::::::::::::{exercise} Oppgave 3
En ball kastes rett opp fra en høyde $1.5 \, \mathrm{m}$ med en startfart $v_0 = 10 \, \mathrm{m/s}$. Ballen er i fritt fall etter at den har blitt kastet.


:::{interactive-code}

:::


:::::::::::::::