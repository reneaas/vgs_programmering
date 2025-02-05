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
| `speed(heltall)`{l=python} | Setter farten til skilpadden. `speed(1)`{l=python} er sakte. `speed(9)`{l=python} er nest-raskest og `speed(0)` er raskest. Heltallene mellom 1 og 9 gir gradvis større fart. |


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


## `for`{l=python}-løkker
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

---


:::::::::::::::{admonition} Underveisoppgave 2
---
class: check
---

::::::::::::::{tab-set}
---
class: tabs-parts 
---
:::::::::::::{tab-item} a
Nedenfor tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_2/a/animasjon.gif
---
width: 50%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_2/a/python.html
---
:::

:::::::::::::

:::::::::::::{tab-item} b
Nedenfor tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_2/b/animasjon.gif
---
width: 50%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_2/b/python.html
---
:::

:::::::::::::

:::::::::::::{tab-item} c
Nedenfor tegnes en figur.

:::{figure} ./underveisoppgaver/oppgave_2/c/animasjon.gif
---
width: 40%
class: no-click
---
:::


Fyll ut programmet under slik at det tegner figuren på samme måte.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_2/c/python.html
---
:::

:::::::::::::


::::::::::::::


:::::::::::::::




## Variabler

I Utforsk 2, brukte vi en `for`{l=python}-løkke til å tegne forskjellige figurer. Men for å tegne en ny figur, måtte likevel koden endres på flere steder ved at vi byttet ut tallene på flere steder.
Vi kan komme rundt denne svakheten kan vi bruke bruke **variabler**, som du skal se nærmere på i Utforsk 3.

:::::::::::::::{admonition} Utforsk 3
---
class: explore
---

::::::::::::::{tab-set}
---
class: tabs-parts
---

:::::::::::::{tab-item} a
Under vises et program som tegner en figur ved å bruke variabler til å lagre tallene som skal brukes flere steder i koden.

Kjør programmet og se på figuren som tegnes. Kan du forklare hvordan programmet fungerer?

:::::::::::::

:::::::::::::{tab-item} b
Endre på programmet så det tegner et kvadrat.

:::::::::::::

:::::::::::::{tab-item} c
Endre på programmet så det tegner en **6-kant**. 

:::::::::::::


:::::::::::::{tab-item} d
Endre på programmet så det tegner en **12-kant**. 

:::::::::::::


:::::::::::::{tab-item} e
Endre på programmet så det tegner en sirkel. 

:::::::::::::

::::::::::::::

:::{raw} html
---
file: ./utforsk/utforsk_3/utforsk_3.html
---
:::

:::::::::::::::

---
<!-- 
:::::::::::::::{admonition} Underveisoppgave 3
---
class: check
---

::::::::::::::{tab-set} 
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Fyll ut programmet så det tegner et rektangel som har sidelengder $l = 100$ og $b = 50$. 

:::{raw} html
---
file: ./underveisoppgaver/oppgave_3/a/python.html
---
:::


:::::::::::::


:::::::::::::{tab-item} b

:::{raw} html
---
file: ./underveisoppgaver/oppgave_3/b/python.html
---
:::


:::::::::::::


:::::::::::::{tab-item} c

:::::::::::::

::::::::::::::


::::::::::::::: -->


## `while`{l=python}-løkker

Vi har sett hvordan vi kan bruke `for`{l=python}-løkker til å gjenta en handling et bestemt antall ganger. `for`{l=python}-løkker er nyttige så lenge vi på forhånd vet hvor mange ganger vi skal gjenta én eller flere handlinger. I mange tilfeller ønsker vi å gjenta noe så lenge en betingelse er oppfylt. Da kan vi bruke en `while`{l=python}-løkke.

:::::::::::::::{admonition} Utforsk 4
---
class: explore
---

Nedenfor vises et program som tegner en figur ved å bruke en `while`{l=python}-løkke til å tegne en figur.


::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Les programmet og kjør det.

Kan du forklare hvordan programmet fungerer? 
:::::::::::::

:::::::::::::{tab-item} b
Kan du endre på programmet slik at det tegner en figur tilsvarende denne: 

:::{figure} ./utforsk/utforsk_4/b/animasjon.gif
---
width: 25%
class: no-click
---
:::

:::::::::::::


:::::::::::::{tab-item} c
I figuren nedenfor er vinkelen i hvert hjørne 120 grader (hvor mange grader må du snu deg da?). Lengden på sidene blir 5 mindre for hver gang.

Endre på programmet slik at det tegner denne figuren. 

:::{figure} ./utforsk/utforsk_4/c/animasjon.gif
---
width: 25%
class: no-click
---
:::

:::::::::::::

::::::::::::::

:::{raw} html
---
file: ./utforsk/utforsk_4/utforsk_4.html
---
:::

:::::::::::::::

---


:::::::::::::::{admonition} Underveisoppgave 4
---
class: check, full-width
---
::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Nedenfor tegnes en geometrisk figur der 
* Hvert linjestykke blir $5$ lenger for hver gang. 
* Vinkelen mellom hvert linjestykke er $90$ grader. 
* Det tegnes til sammen $20$ linjestykker. 
* Det første linjestykke har lengde $1$.

:::{figure} ./underveisoppgaver/oppgave_4/a/animasjon.gif
---
width: 40%
class: no-click
---
:::

Fyll ut programmet slik at det tegnes figuren over.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_4/a/python.html
---
:::



:::::::::::::

:::::::::::::{tab-item} b
Nedenfor tegnes en spiral der 

* Hvert linjestykke blir $1$ lenger for hver gang. 
* Vinkelen mellom hvert linjestykke er $150$ grader (så man snur seg $180-150=30$ grader mot venstre).
* Til sammen tegnes det $30$ linjestykker. 
* Det første linjestykke har lengde $1$.

:::{figure} ./underveisoppgaver/oppgave_4/b/animasjon.gif
---
width: 40%
class: no-click
---
:::

Fyll ut programmet slik at det tegner figuren over.

:::{raw} html
---
file: ./underveisoppgaver/oppgave_4/b/python.html
---
:::


:::::::::::::

:::::::::::::{tab-item} c
Nedenfor tegnes det en spiral der
* Lengden til hvert linjestykke er $10 \%$ lenger enn det forrige.
* Vinkelen mellom hvert linjestykke er $140$ grader (hvor mange grader må du snu deg da?)
* Den totale lengden av linjestykkene overgår ikke $1000$. 
* Det første linjestykke har lengde $1$.

:::{figure} ./underveisoppgaver/oppgave_4/c/animasjon.gif
---
width: 40%
class: no-click
---
:::


:::{raw} html
---
file: ./underveisoppgaver/oppgave_4/c/python.html
---
:::

:::::::::::::
::::::::::::::

:::::::::::::::