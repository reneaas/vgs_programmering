# Turtle programmering


## Intro

::::{admonition} Kommandoer
---
class: sidenote, margin
---
* `forward(100)`{l=python} Flytter skilpadden 100 piksler fremover.
* `right(90)`{l=python} Snur skilpadden 90 grader til høyre.
::::

:::::::::::::::{admonition} Utforsk 1
---
class: explore
---
Under vises et program som tegner en geometrisk figur.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Kjør programmet og se på figuren som tegnes. 

Kan du forklare hva som skjer i programmet?

:::::::::::::

:::::::::::::{tab-item} b
Endre på programmet så det tegner en firkant.

> Hint: For å lage en trekant har vi regnet ut $360 / 3$ fordi en sirkel har 360 grader, så vi må snu oss 3 ganger for å lage en trekant.

:::::::::::::


:::::::::::::{tab-item} c
Endre på programmet så det tegner en 6-kant.

:::::::::::::


::::::::::::::

:::{raw} html
---
file: utforsk_1.html
---
:::



:::::::::::::::


---


## Løkker
I Utforsk 1 gjentok vi samme kommando flere ganger. Måten vi gjorde det på da var bare å kopiere samme kodelinje flere ganger. Dette er ikke en spesielt god løsning hvis vi skal gjøre noe manger ganger. Det har vi heldigvis en løsning på i programmering – ved å bruke **løkker**. 


::::{admonition} `for`{l=python}-løkke
---
class: sidenote, margin
---
`for i in range(3)`{l=python} forteller oss at vi gjentar koden med **innrykk** 3 ganger. 
::::

:::::::::::::::{admonition} Utforsk 2
---
class: explore
---
Under vises et program som tegner samme figur som i Utforsk 1, men ved å bruke en `for`{l=python}-løkke.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Kjør programmet og sjekk at det tegner samme figur som i Utforsk 1.

:::::::::::::


:::::::::::::{tab-item} b
Endre på programmet så det tegner en firkant i stedet.

:::::::::::::


:::::::::::::{tab-item} c
Endre på programmet så det tegner en 6-kant.

:::::::::::::


:::::::::::::{tab-item} d
Endre på programmet så det en 18-kant.

> Det kan være lurt å gjøre lengden i `forward`{l=python} litt mindre så du får plass til figuren på skjermen.

:::::::::::::


:::::::::::::{tab-item} e
Endre på programmet så det lager en sirkel.

> Det kan være lurt å gjøre lengden i `forward`{l=python} *enda* litt mindre så du får plass til figuren på skjermen.

:::::::::::::

::::::::::::::


:::{raw} html
---
file: utforsk_2.html
---
:::


:::::::::::::::