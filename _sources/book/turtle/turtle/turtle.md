# Kræsjkurs 💥 i programmering med `turtle`{l=python}


::::{admonition} Kommandoer
---
class: sidenote, margin
---
* `forward(100)`{l=python} Flytter skilpadden 100 piksler fremover.
* `left(90)`{l=python} Snur skilpadden 90 grader mot venstre.
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
Endre på programmet så det tegner et kvadrat.


::::{admonition} Fasit 
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
from turtle import *

forward(100)
left(90)

forward(100)
left(90)

forward(100)
left(90)

forward(100)
left(90)
:::
::::

:::::::::::::


:::::::::::::{tab-item} c
Endre på programmet så det tegner en 6-kant med like lange sider og like store vinkler.

::::{admonition} Fasit 
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
from turtle import *

forward(100)
left(60)

forward(100)
left(60)

forward(100)
left(60)

forward(100)
left(60)

forward(100)
left(60)

forward(100)
left(60)
:::
::::
:::::::::::::


::::::::::::::

:::{raw} html
---
file: ./utforsk/utforsk_1/utforsk_1.html
---
:::
:::::::::::::::


Det finnes flere kommandoer vi kan bruke med `turtle`{l=python} for å tegne figurer.
Under vises en oversikt over de viktigste så i prinsippet kan tegne alle typer figurer. 

> Du trenger **ikke** å huske disse utenat. Du kan bla opp hit hvis du trenger en kommando eller glemmer hva en kommando gjør!

:::::{admonition} `turtle`{l=python}-kommandoer
---
class: summary
---
| Kommando | Forklaring |
|----------|------------|
| `forward(100)`{l=python} | Flytter skilpadden 100 piksler fremover. |
| `backward(100)`{l=python} | Flytter skilpadden 100 piksler bakover. |
| `right(90)`{l=python} | Snur skilpadden 90 grader mot høyre. |
| `left(120)`{l=python} | Snur skilpadden 120 grader mot venstre. |
| `penup()`{l=python} | Løfter pennen slik at skilpadden ikke tegner. |
| `pendown()`{l=python} | Senker pennen slik at skilpadden tegner. |


:::::


---

:::::::::::::::{admonition} Underveisoppgave 1
---
class: check
---

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Under tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_1/a/animasjon.gif
---
width: 40%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren over på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_1/a/python.html
---
:::



:::::::::::::

:::::::::::::{tab-item} b
Under tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_1/b/animasjon.gif
---
width: 40%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren over på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_1/b/python.html
---
:::



:::::::::::::


:::::::::::::{tab-item} c
Under tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_1/c/animasjon.gif
---
width: 40%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren over på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_1/c/python.html
---
:::



:::::::::::::

::::::::::::::


:::::::::::::::



---


## Løkker
I Utforsk 1 og Underveisoppgave 1 måtte vi gjenta samme kommando flere ganger. Måten vi gjorde det på da var bare å kopiere samme kodelinje flere ganger. Det ingen tvil om at dette er en ganske tungvinn måte å skrive kode på. Det har vi heldigvis en løsning på i programmering – ved å bruke **løkker**.


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
Under vises et program som tegner et figur ved å bruke en `for`{l=python}-løkke til å gjenta noen handlinger.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Kjør programmet og se på figuren som tegnes.

Kan du forklare hvordan programmet fungerer?

:::::::::::::


:::::::::::::{tab-item} b
Endre på programmet så det tegner et **kvadrat** i stedet.

:::::::::::::


:::::::::::::{tab-item} c
Endre på programmet så det tegner en **6-kant**.

:::::::::::::


:::::::::::::{tab-item} d
Endre på programmet så det en **12-kant**.

> Det kan være lurt å gjøre lengden i `forward`{l=python} litt mindre så du får plass til figuren på skjermen.

:::::::::::::


::::::::::::::


:::{raw} html
---
file: ./utforsk/utforsk_2/utforsk_2.html
---
:::


:::::::::::::::


## Variabler

I Utforsk 2, brukte vi en `for`{l=python}-løkke til å tegne forskjellige figurer. Men for å tegne en ny figur, måtte likevel koden endres på flere steder.
Vi kan komme rundt dette ved å bruke **variabler**, som du skal se nærmere på i Utforsk 3.

:::::::::::::::{admonition} Utforsk 3
---
class: explore
---


:::{raw} html
---
file: ./utforsk/utforsk_3/utforsk_3.html
---
:::

:::::::::::::::


---


:::::::::::::::{admonition} Underveisoppgave 2
---
class: check
---



:::::::::::::::
