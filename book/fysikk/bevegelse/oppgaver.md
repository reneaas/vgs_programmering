# Oppgaver: Bevegelse



:::::::::::::::{exercise} Oppgave 1
En stein slipper fra en høyde på $100$ meter og faller fritt ned mot bakken.


:::::::::::::{part} a
Bruk bevegelseslikningen til å finne farten og høyden til steinen etter $1$ sekund. 


:::::::::::::


:::::::::::::{part} b
Beregn farten og høyden til steinen over bakken etter $1$ sekund med **Eulers** metode. 

Bruk steglengden $\Delta t = 0.5 \, \mathrm{s}$.
:::::::::::::


:::::::::::::{part} c
Beregn farten og høyden til steinen over bakken etter $1$ sekund med **Euler-Cromers** metode. 

Bruk steglengden $\Delta t = 0.5 \, \mathrm{s}$.
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
Hvilket program kan brukes til å finne hvor høyt over bakken steinen er på sitt høyeste punkt?


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
:::::::::::::{part} a
Nedenfor vises et program som regner på bevegelsen til en kule som er i fritt fall.


Bruk bevegelseslikningene til å finne omtrent hvilken verdi programmet skriver ut når det kjøres. Sjekk svaret ditt! 


:::{interactive-code}
---
predict:
---
v = 10
s = 0
a = -9.81
t = 0
dt = 1e-3

while v > 0:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(s)
:::




:::::::::::::



:::::::::::::{part} b
Programmet nedenfor regner på bevegelsen til en bil som bremser ned.

Bruk bevegelseslikningene til å finne verdien som programmet skriver ut når det kjøres. Sjekk svaret nedenfor.


:::{interactive-code}
---
predict:
---
v = 20 
s = 0
a = -5.0
t = 0
dt = 1e-3

while v > 0:
    t = t + dt
    v = v + a * dt
    s = s + v * dt

print(s)
:::


:::::::::::::


:::::::::::::::



---



:::::::::::::::{exercise} Oppgave 4
En bil kjører med farten $25$ m/s. Føreren bremser med en konstant akselerasjon $-4.0 \, \mathrm{m/s^2}$ fram til bilen stopper helt.


:::{popup-code}
t = 0   # starttid
v = 25  # startfart
s = 0   # startposisjon

dt = 1e-3

while ????:
    a = ????
    v = ????
    s = ????
    t = ????


print(s)
:::



:::::::::::::{part} a
Bruk bevegelseslikningene til å finne bremselengden til bilen.


:::::::::::::


:::::::::::::{part} b
Fyll inn alle linjer i kodevindu som er markert med `????`{l=python}. 

Kjør programmet og tolk resultatet. 
:::::::::::::


:::::::::::::{part} c
Bruk programmet til å sammenligne bremselengden dersom man kjører i $80$ km/h, sammenlignet med $90$ km/h.



:::::::::::::


:::::::::::::::



---


:::::::::::::::{exercise} Oppgave 5
En stein slippes fra ro fra en høyde på 100 meter over bakken.

:::{popup-code}
# Konstanter for simuleringen
g = 9.81 # m/s^2

# Startverdier for simuleringen
s = 100    # m
v = 0      # m/s
t = 0      # s

dt = 1e-3   # s

while ????:
    a = ????
    v = ????
    s = ????
    t = ????

print(t) # skriv ut tiden det tar for steinen å treffe bakken

:::


:::::::::::::{part} a
Bruk bevegelseslikningene til å finne hvor lang tid det før steinen treffer bakken.


:::::::::::::


:::::::::::::{part} b
Fyll ut alle kodelinjer markert med `????`{l=python} i kodevinduet.


:::::::::::::


:::::::::::::{part} c
Undersøk forskjellige verdier av steglengden `dt`{l=python} i programmet. 

Prøv ulike potenser av $10$ og finn hvilken potens som gir deg et svar som er nærmest det du regnet ut med bevegelseslikningene.


:::::::::::::



:::::::::::::::


---



:::::::::::::::{exercise} Oppgave 6
En stein blir sluppet fra et fly og opplever en akselerasjon både på grunn av tyngdekraften, men også luftmotsatnden. Når steinen har en fart $v$, så opplever den en akselerasjon gitt ved 

$$
a = -g + b\cdot v^2
$$

der $b$ er en fysisk konstant som angir hvor sterk luftmotstanden er. For steinen er $b = 0.01 \, \mathrm{kg/m}$ 


:::{popup-code}
# Konstanter for simuleringen

g = 9.81    # m/s^2
b = 0.01     # kg/m
dt = 1e-3   # s

# Startverdier
t = 0       # s
v = 0       # m/s
s = 3000    # m

while ????: 
    a = ????
    v = ????
    s = ????
    t = ????


print(v)
:::


Programmet skal først beregne hvor stor fart steinen har rett før treffer bakken.

:::::::::::::{part} a
Fyll inn alle linjer i kodevindu som er markert med `????`{l=python}.

Bruk programmet til å bestemme farten steinen har rett før den treffer bakken.

:::::::::::::



:::::::::::::{part} b
Hvor lang tid tar det før steinen treffer bakken? (Bruk programmet ditt til å finne det ut).



:::::::::::::





Etter hvert om steinen faller, så vil den til slutt oppnå det som kalles for **terminalfart**. Det vil si at farten blir konstant og akselerasjon blir lik 0.

:::::::::::::{part} c
Finn terminalfarten til steinen. 

Bruk så programmet ditt til å se om du får samme terminalfart.
:::::::::::::




:::::::::::::::



---



:::::::::::::::{exercise} Oppgave 7
En fallskjermhopper er utsatt for tyngdekraft og luftmotstand gjennom hele fallet. Når fallskjermhopperen har en fart $v$, vil akselerasjonen $a$ da være gitt ved:

$$
a = -g + bv^2 
$$

der $b$ er en konstant som forteller hvor kraftig luftmotstanden er og $g$ er tyngdeakselerasjonen. Nederst finner du et interaktivt kodevindu du kan bruke til å simulere fallskjermhopperens bevegelse.

Vi kan dele opp bevegelsen i to faser:
* **Fase 1**: Fallskjermhopperen falleren fritt under påvirkning av tyngdekraft og luftmotstand. Konstant $b$ er et lite tall i denne perioden.
* **Fase 2**: Fallskjermhopperen har åpnet fallskjermen og luftmotstanden blir mye større. Konstanten $b$ er nå endret til en større verdi.


Vi tenker oss at fallskjermhopperen skal dra ut fallskjermen når han er 1000 meter over bakken.

:::{popup-code}
# Konstanter for simuleringen

g = 9.81    # m/s^2
dt = 1e-3   # s

# Startverdier
t = 0       # s
v = 0       # m/s
s = 3000    # m

while ????: 

    if ????:
        b = ????
    else:
        b = ????

    a = ????
    v = ????
    s = ????
    t = ????


print(v) # skriv ut farten til fallskjermhopperen ved bakken
:::

:::::::::::::{part} a
Fyll inn i programmet i kodevinuet hvor det er markert med `????`{l=python} for å simulere fallskjermhopperen fram til fallskjermhopperen treffer bakken.

Bruk programmet til å finne farten fallskjermhopperen har i det han treffer bakken.

:::::::::::::



:::::::::::::{part} b
Bruk programmet til å finne hvor lang tid det tar før han treffer bakken.


:::::::::::::


:::::::::::::{part} c
Bruk programmet til å finne hvilken verdi for $b$ som gjør at fallskjermhopperen treffer bakken i $1.0 \, \mathrm{m/s}$. 


:::::::::::::




:::::::::::::::